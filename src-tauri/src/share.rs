//! Temporary online sharing: a local HTTP server exposed through a Cloudflare Quick Tunnel.
//! Each guest runs their own virtual sort (in the browser, nothing moves) over a snapshot of
//! the folder and submits their picks. The host reviews the combined votes in the app and
//! applies a final selection; folder, settings and every file move stay with the desktop app.

use super::{cache_dir, move_photo, raw_preview, scan, sort_photos, Photo, Session, Store, View};
use image::ImageDecoder;
use serde::Serialize;
use serde_json::{json, Value};
use std::{
    collections::{hash_map::DefaultHasher, BTreeMap, HashMap, HashSet},
    fs,
    hash::{Hash, Hasher},
    io::{BufRead, BufReader, Cursor, Read},
    path::{Path, PathBuf},
    process::{Child, Command, Stdio},
    sync::{
        atomic::{AtomicU32, Ordering},
        mpsc, Arc, Mutex,
    },
    thread,
    time::Duration,
};
use tauri::{AppHandle, Manager, State};

const GUEST_HTML: &str = include_str!("guest.html");
const MAX_PIN_FAILS: u32 = 10;
const MAX_WEB_BYTES: usize = 800 * 1024; // guest previews stay light on mobile data
const THUMB_SIZE: u32 = 480;
const PSWP_JS: &str = include_str!("../../node_modules/photoswipe/dist/photoswipe.esm.min.js");
const PSWP_CSS: &str = include_str!("../../node_modules/photoswipe/dist/photoswipe.css");

/// The folder as it was when sharing started. Photos are addressed by index; files are looked up
/// by name in selected/ and the root, since the host may keep sorting (moving files) meanwhile.
struct Snap {
    root: PathBuf,
    sel: PathBuf,
    target: usize,
    sort: String,
    photos: Vec<(String, Vec<String>)>, // (display name, file names)
}

impl Snap {
    // ponytail: a file renamed by a name clash (`_1`) after the snapshot is no longer found; restart sharing if that bites.
    fn locate(&self, i: usize) -> Option<Photo> {
        let files = self
            .photos
            .get(i)?
            .1
            .iter()
            .map(|n| {
                [self.sel.join(n), self.root.join(n)]
                    .into_iter()
                    .find(|p| p.is_file())
            })
            .collect::<Option<Vec<_>>>()?;
        Some(Photo { files })
    }
}

struct Ctx {
    token: String,
    pin: String,
    fails: AtomicU32,
    snap: Arc<Snap>,
}

struct Share {
    server: Arc<tiny_http::Server>,
    tunnel: Child,
    info: ShareInfo,
    port: u16,
    ctx: Arc<Ctx>,
}

#[derive(Serialize, Clone)]
pub struct ShareInfo {
    url: String,
    pin: String,
}

#[derive(Default)]
pub struct Sharing {
    share: Mutex<Option<Share>>,
    submissions: Mutex<BTreeMap<String, (String, Vec<usize>)>>, // guest id -> (name, picked photo ids)
}

fn random_hex(bytes: usize) -> String {
    let mut b = vec![0u8; bytes];
    getrandom::fill(&mut b).expect("OS random source");
    b.iter().map(|x| format!("{x:02x}")).collect()
}

fn find_cloudflared() -> Option<PathBuf> {
    // bundled by the installer next to the app exe (tauri.conf.json > bundle > externalBin)
    let bundled = std::env::current_exe()
        .ok()
        .and_then(|e| Some(e.parent()?.join("cloudflared.exe")));
    let on_path = std::env::var_os("PATH")
        .map(|p| {
            std::env::split_paths(&p)
                .map(|d| d.join("cloudflared.exe"))
                .collect::<Vec<_>>()
        })
        .unwrap_or_default();
    // winget updates PATH, but an app started before the install still has the old one.
    let known = [
        PathBuf::from(r"C:\Program Files (x86)\cloudflared\cloudflared.exe"),
        PathBuf::from(r"C:\Program Files\cloudflared\cloudflared.exe"),
        std::env::var_os("LOCALAPPDATA")
            .map(|l| PathBuf::from(l).join(r"Microsoft\WinGet\Links\cloudflared.exe"))
            .unwrap_or_default(),
    ];
    bundled
        .into_iter()
        .chain(on_path)
        .chain(known)
        .find(|p| p.is_file())
}

/// Async + blocking thread: waiting for the tunnel takes seconds and must not freeze the window.
#[tauri::command]
pub async fn share_start(app: AppHandle) -> Result<ShareInfo, String> {
    tauri::async_runtime::spawn_blocking(move || start_blocking(app))
        .await
        .map_err(|e| format!("tunnel_failed:{e}"))?
}

fn snapshot(app: &AppHandle) -> Result<Snap, String> {
    let store = app.state::<Store>();
    let guard = store.lock().unwrap();
    let s = guard.as_ref().ok_or("no_session")?;
    let mut photos = scan(&s.root)?;
    photos.extend(scan(&s.sel)?);
    sort_photos(&mut photos, &s.sort);
    let names = |p: &Photo| {
        p.files
            .iter()
            .map(|f| f.file_name().unwrap().to_string_lossy().into_owned())
            .collect()
    };
    Ok(Snap {
        root: s.root.clone(),
        sel: s.sel.clone(),
        target: s.target,
        sort: s.sort.clone(),
        photos: photos.iter().map(|p| (p.name(), names(p))).collect(),
    })
}

fn start_blocking(app: AppHandle) -> Result<ShareInfo, String> {
    let sharing = app.state::<Sharing>();
    let mut slot = sharing.share.lock().unwrap();
    if let Some(s) = slot.as_ref() {
        return Ok(s.info.clone());
    }
    let snap = Arc::new(snapshot(&app)?);
    let exe = find_cloudflared().ok_or("cloudflared_missing")?;
    let server = Arc::new(tiny_http::Server::http("127.0.0.1:0").map_err(|e| e.to_string())?);
    let port = server
        .server_addr()
        .to_ip()
        .ok_or("tunnel_failed:no port")?
        .port();

    let mut cmd = Command::new(exe);
    // http2 over TCP 443: QUIC (UDP 7844) is often blocked and then delays registration by 10+ s
    let url_arg = format!("http://127.0.0.1:{port}");
    cmd.args([
        "tunnel",
        "--no-autoupdate",
        "--protocol",
        "http2",
        "--url",
        &url_arg,
    ])
    .stdin(Stdio::null())
    .stdout(Stdio::null())
    .stderr(Stdio::piped());
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x0800_0000); // CREATE_NO_WINDOW
    }
    let mut tunnel = cmd.spawn().map_err(|e| format!("tunnel_failed:{e}"))?;
    let stderr = tunnel.stderr.take().unwrap();
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        let mut tx = Some(tx);
        let mut url = None;
        // keep draining after ready so cloudflared never blocks on a full pipe
        for line in BufReader::new(stderr).lines().map_while(Result::ok) {
            if let Some(i) = line.find("https://") {
                let u: String = line[i..]
                    .chars()
                    .take_while(|c| !c.is_whitespace() && *c != '|')
                    .collect();
                if u.contains(".trycloudflare.com") {
                    url = Some(u);
                }
            }
            // The URL is printed before the edge knows the tunnel. Opening it then gets NXDOMAIN,
            // which Windows caches for minutes, so only hand it out once a connection registered.
            if line.contains("Registered tunnel connection") {
                if let (Some(u), Some(t)) = (url.clone(), tx.take()) {
                    let _ = t.send(u);
                }
            }
        }
    });
    let base = match rx.recv_timeout(Duration::from_secs(60)) {
        Ok(u) => u,
        Err(_) => {
            let _ = tunnel.kill();
            return Err("tunnel_failed:timeout".into());
        }
    };

    let mut pin_bytes = [0u8; 2];
    getrandom::fill(&mut pin_bytes).expect("OS random source");
    let ctx = Arc::new(Ctx {
        token: random_hex(16),
        pin: format!("{:04}", u16::from_le_bytes(pin_bytes) % 10_000),
        fails: AtomicU32::new(0),
        snap,
    });

    let (srv, c, a) = (server.clone(), ctx.clone(), app.clone());
    thread::spawn(move || {
        // recv() errors once the server is unblocked by share_stop
        while let Ok(req) = srv.recv() {
            let (app, ctx) = (a.clone(), c.clone());
            thread::spawn(move || handle(&app, req, &ctx));
        }
    });

    let info = ShareInfo {
        url: format!("{base}/?t={}", ctx.token),
        pin: ctx.pin.clone(),
    };
    *slot = Some(Share {
        server,
        tunnel,
        info: info.clone(),
        port,
        ctx,
    });
    sharing.submissions.lock().unwrap().clear();
    Ok(info)
}

pub fn stop(sharing: &Sharing) {
    if let Some(mut s) = sharing.share.lock().unwrap().take() {
        s.server.unblock();
        let _ = s.tunnel.kill();
        let _ = s.tunnel.wait();
    }
    sharing.submissions.lock().unwrap().clear();
}

#[tauri::command]
pub fn share_stop(sharing: State<Sharing>) {
    stop(&sharing);
}

#[derive(Serialize)]
pub struct ResultPhoto {
    id: usize,
    name: String,
    votes: usize,
    voters: Vec<String>,
}

#[derive(Serialize)]
pub struct Results {
    /// Local server address so the app can load thumbnails without going through the tunnel.
    thumbs: String,
    target: usize,
    submissions: usize,
    photos: Vec<ResultPhoto>, // most votes first, then folder order
}

#[tauri::command]
pub fn share_results(sharing: State<Sharing>) -> Option<Results> {
    let share = sharing.share.lock().unwrap();
    let s = share.as_ref()?;
    let subs = sharing.submissions.lock().unwrap();
    let mut photos: Vec<ResultPhoto> = s
        .ctx
        .snap
        .photos
        .iter()
        .enumerate()
        .map(|(id, (name, _))| ResultPhoto {
            id,
            name: name.clone(),
            votes: 0,
            voters: vec![],
        })
        .collect();
    for (name, picks) in subs.values() {
        for &id in picks {
            photos[id].votes += 1;
            photos[id].voters.push(name.clone());
        }
    }
    photos.sort_by_key(|p| (std::cmp::Reverse(p.votes), p.id));
    Some(Results {
        thumbs: format!(
            "http://127.0.0.1:{}/thumb/{{id}}?t={}&p={}",
            s.port, s.ctx.token, s.ctx.pin
        ),
        target: s.ctx.snap.target,
        submissions: subs.len(),
        photos,
    })
}

#[tauri::command]
pub fn share_clear(sharing: State<Sharing>) {
    sharing.submissions.lock().unwrap().clear();
}

/// Make selected/ hold exactly `ids` from the snapshot, then restart the host session on it.
#[tauri::command]
pub fn apply_selection(app: AppHandle, ids: Vec<usize>) -> Result<View, String> {
    let sharing = app.state::<Sharing>();
    let snap = sharing
        .share
        .lock()
        .unwrap()
        .as_ref()
        .map(|s| s.ctx.snap.clone())
        .ok_or("no_session")?;
    let chosen: HashSet<usize> = ids.into_iter().collect();
    if chosen.len() != snap.target {
        return Err(format!("target_mismatch:{}", snap.target));
    }
    for i in 0..snap.photos.len() {
        let Some(mut p) = snap.locate(i) else {
            continue;
        };
        let in_sel = p.files[0].parent() == Some(snap.sel.as_path());
        match (chosen.contains(&i), in_sel) {
            (true, false) => drop(move_photo(&mut p, &snap.sel)?),
            (false, true) => drop(move_photo(&mut p, &snap.root)?),
            _ => {}
        }
    }
    let mut s = Session::new(snap.root.clone(), snap.target, snap.sort.clone());
    s.next_round()?;
    let v = s.view();
    *app.state::<Store>().lock().unwrap() = Some(s);
    sharing.submissions.lock().unwrap().clear();
    Ok(v)
}

type Reply = tiny_http::Response<Cursor<Vec<u8>>>;

fn reply(code: u16, content_type: &str, body: Vec<u8>) -> Reply {
    let header = |k: &str, v: &str| tiny_http::Header::from_bytes(k, v).unwrap();
    tiny_http::Response::from_data(body)
        .with_status_code(code)
        .with_header(header("Content-Type", content_type))
        .with_header(header("Referrer-Policy", "no-referrer"))
        .with_header(header("X-Robots-Tag", "noindex"))
        // the app's own window loads thumbnails from this server
        .with_header(header("Access-Control-Allow-Origin", "*"))
}

fn json_reply(code: u16, v: Value) -> Reply {
    reply(code, "application/json", v.to_string().into_bytes())
        .with_header(tiny_http::Header::from_bytes("Cache-Control", "no-store").unwrap())
}

fn not_found() -> Reply {
    reply(404, "text/plain", b"Not found".to_vec())
}

fn handle(app: &AppHandle, mut req: tiny_http::Request, ctx: &Ctx) {
    let url = req.url().to_string();
    let (path, query) = url.split_once('?').unwrap_or((&url, ""));
    let q: HashMap<&str, &str> = query
        .split('&')
        .filter_map(|kv| kv.split_once('='))
        .collect();
    let get = matches!(req.method(), tiny_http::Method::Get);

    // public library code, no secret in it: served without token
    let resp = if path == "/lib/photoswipe.js" && get {
        reply(
            200,
            "text/javascript; charset=utf-8",
            PSWP_JS.as_bytes().to_vec(),
        )
    } else if path == "/lib/photoswipe.css" && get {
        reply(200, "text/css; charset=utf-8", PSWP_CSS.as_bytes().to_vec())
    } else if q.get("t") != Some(&ctx.token.as_str()) {
        not_found()
    } else if path == "/" && get {
        reply(
            200,
            "text/html; charset=utf-8",
            GUEST_HTML.as_bytes().to_vec(),
        )
    } else if ctx.fails.load(Ordering::Relaxed) >= MAX_PIN_FAILS {
        json_reply(423, json!({ "error": "locked" }))
    } else if q.get("p") != Some(&ctx.pin.as_str()) {
        ctx.fails.fetch_add(1, Ordering::Relaxed);
        json_reply(401, json!({ "error": "pin" }))
    } else if path == "/api/photos" && get {
        let photos: Vec<Value> = ctx
            .snap
            .photos
            .iter()
            .map(|(name, _)| json!(name))
            .collect();
        json_reply(200, json!({ "target": ctx.snap.target, "photos": photos }))
    } else if path == "/api/submit" && !get {
        let mut body = String::new();
        let _ = req.as_reader().take(64 * 1024).read_to_string(&mut body);
        submit(app, ctx, &body)
    } else if let (true, Some(id)) = (get, path.strip_prefix("/img/")) {
        image_reply(ctx, id, false)
    } else if let (true, Some(id)) = (get, path.strip_prefix("/thumb/")) {
        image_reply(ctx, id, true)
    } else {
        not_found()
    };
    let _ = req.respond(resp);
}

fn submit(app: &AppHandle, ctx: &Ctx, body: &str) -> Reply {
    let bad = || json_reply(400, json!({ "error": "bad_request" }));
    let Ok(b) = serde_json::from_str::<Value>(body) else {
        return bad();
    };
    let guest = b["g"].as_str().unwrap_or("");
    let Some(picks) = b["picks"].as_array() else {
        return bad();
    };
    let picks: HashSet<usize> = picks
        .iter()
        .filter_map(|v| v.as_u64())
        .map(|v| v as usize)
        .collect();
    if guest.is_empty() || guest.len() > 64 || picks.iter().any(|&i| i >= ctx.snap.photos.len()) {
        return bad();
    }
    let name: String = b["name"]
        .as_str()
        .unwrap_or("")
        .trim()
        .chars()
        .take(30)
        .collect();
    let mut picks: Vec<usize> = picks.into_iter().collect();
    picks.sort_unstable();
    // a new submission from the same guest replaces the old one
    app.state::<Sharing>()
        .submissions
        .lock()
        .unwrap()
        .insert(guest.to_string(), (name, picks));
    json_reply(200, json!({ "ok": true }))
}

fn image_reply(ctx: &Ctx, id: &str, thumb: bool) -> Reply {
    let Some(photo) = id.parse::<usize>().ok().and_then(|i| ctx.snap.locate(i)) else {
        return not_found();
    };
    let src = photo
        .viewable()
        .cloned()
        .or_else(|| raw_preview(&photo.files[0]));
    let encode = if thumb { encode_thumb } else { encode_capped };
    match src
        .and_then(|s| cached_jpeg(&s, if thumb { "thumb" } else { "web800k" }, encode))
        .and_then(|p| fs::read(p).ok())
    {
        Some(bytes) => reply(200, "image/jpeg", bytes).with_header(
            tiny_http::Header::from_bytes("Cache-Control", "private, max-age=3600").unwrap(),
        ),
        None => not_found(),
    }
}

/// Orientation-corrected JPEG copy, cached per source file; originals never leave the PC.
fn cached_jpeg(
    src: &Path,
    tag: &str,
    encode: fn(&image::DynamicImage) -> Option<Vec<u8>>,
) -> Option<PathBuf> {
    let meta = fs::metadata(src).ok()?;
    let mut h = DefaultHasher::new();
    (src.file_name(), meta.len(), meta.modified().ok()).hash(&mut h);
    let out = cache_dir().join(format!("{:x}-{tag}.jpg", h.finish()));
    if out.exists() {
        return Some(out);
    }
    let mut dec = image::ImageReader::open(src)
        .ok()?
        .with_guessed_format()
        .ok()?
        .into_decoder()
        .ok()?;
    let orientation = dec.orientation().ok()?;
    let mut img = image::DynamicImage::from_decoder(dec).ok()?;
    img.apply_orientation(orientation);
    let buf = encode(&img)?;
    fs::create_dir_all(cache_dir()).ok()?;
    // two requests can hit the same photo at once: write aside, then rename into place
    let tmp = out.with_extension(format!("{}.tmp", random_hex(4)));
    fs::write(&tmp, buf).ok()?;
    fs::rename(&tmp, &out).ok()?;
    Some(out)
}

fn encode_thumb(img: &image::DynamicImage) -> Option<Vec<u8>> {
    let small = img.thumbnail(THUMB_SIZE, THUMB_SIZE).to_rgb8();
    let mut buf = Vec::new();
    image::codecs::jpeg::JpegEncoder::new_with_quality(&mut buf, 80)
        .encode_image(&small)
        .ok()?;
    Some(buf)
}

/// Largest size and quality that fits MAX_WEB_BYTES: quality drops first, then resolution.
fn encode_capped(img: &image::DynamicImage) -> Option<Vec<u8>> {
    let mut buf = Vec::new();
    for size in [2048u32, 1600, 1280, 1024, 800] {
        let rgb = if img.width() > size || img.height() > size {
            img.resize(size, size, image::imageops::FilterType::Triangle)
                .to_rgb8()
        } else {
            img.to_rgb8()
        };
        for quality in [85u8, 75, 65] {
            buf.clear();
            image::codecs::jpeg::JpegEncoder::new_with_quality(&mut buf, quality)
                .encode_image(&rgb)
                .ok()?;
            if buf.len() <= MAX_WEB_BYTES {
                return Some(buf);
            }
        }
    }
    Some(buf) // ponytail: pathological noise may still exceed the cap at 800px/q65; never seen on real photos
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn preview_fits_800kb() {
        // random noise is the worst case for JPEG size
        let mut seed = 0x2545_f491_u32;
        let img = image::RgbImage::from_fn(3000, 2000, |_, _| {
            seed ^= seed << 13;
            seed ^= seed >> 17;
            seed ^= seed << 5;
            image::Rgb([seed as u8, (seed >> 8) as u8, (seed >> 16) as u8])
        });
        let out = encode_capped(&image::DynamicImage::ImageRgb8(img)).unwrap();
        assert!(out.len() <= MAX_WEB_BYTES, "{} bytes", out.len());
    }

    #[test]
    fn locate_follows_moves_between_root_and_selected() {
        let root = std::env::temp_dir().join(format!("ps-snap-{}", std::process::id()));
        let _ = fs::remove_dir_all(&root);
        let sel = root.join("selected");
        fs::create_dir_all(&sel).unwrap();
        fs::write(root.join("a.jpg"), b"x").unwrap();
        fs::write(root.join("a.cr2"), b"x").unwrap();
        let snap = Snap {
            root: root.clone(),
            sel: sel.clone(),
            target: 1,
            sort: "name".into(),
            photos: vec![("a".into(), vec!["a.jpg".into(), "a.cr2".into()])],
        };
        let mut p = snap.locate(0).unwrap();
        move_photo(&mut p, &sel).unwrap();
        let p = snap.locate(0).unwrap();
        assert!(p.files.iter().all(|f| f.parent() == Some(sel.as_path())));
        assert!(snap.locate(1).is_none());
        fs::remove_dir_all(&root).unwrap();
    }
}
