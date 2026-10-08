use serde::Serialize;
use std::{
    collections::{hash_map::DefaultHasher, BTreeMap},
    fs::{self, File},
    hash::{BuildHasher, Hash, Hasher},
    io::{Cursor, Read},
    path::{Path, PathBuf},
    sync::Mutex,
};
use tauri::{AppHandle, Manager, State};

mod share;

const VIEWABLE: &[&str] = &["jpg", "jpeg", "png", "webp"];
const RAW: &[&str] = &[
    "cr2", "cr3", "nef", "arw", "dng", "raf", "orf", "rw2", "pef", "srw",
];
const SELECTED: &str = "selected";
const SHOWN: usize = 5; // 3 visible + 2 preloaded

fn ext(p: &Path) -> String {
    p.extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase()
}

/// One photo = every file sharing a stem (e.g. IMG_01.CR2 + IMG_01.JPG). They always move together.
#[derive(Clone)]
struct Photo {
    files: Vec<PathBuf>, // viewable file first, if any
}

impl Photo {
    fn name(&self) -> String {
        self.files[0]
            .file_stem()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned()
    }
    fn viewable(&self) -> Option<&PathBuf> {
        self.files
            .iter()
            .find(|f| VIEWABLE.contains(&ext(f).as_str()))
    }
    fn size(&self) -> u64 {
        self.files
            .iter()
            .filter_map(|f| fs::metadata(f).ok())
            .map(|m| m.len())
            .sum()
    }
    fn mtime(&self) -> std::time::SystemTime {
        fs::metadata(&self.files[0])
            .and_then(|m| m.modified())
            .unwrap_or(std::time::UNIX_EPOCH)
    }
    // ponytail: photos without EXIF date sort first (by mtime); fine unless mixing scans and camera shots.
    fn taken(&self) -> String {
        let read = || -> Option<String> {
            let mut buf = Vec::new();
            // EXIF lives in the first few MB of JPEG/TIFF-based RAW; avoids reading 50MB files whole.
            File::open(&self.files[0])
                .ok()?
                .take(4 << 20)
                .read_to_end(&mut buf)
                .ok()?;
            let mut r = exif::Reader::new();
            r.continue_on_error(true);
            let ex = match r.read_from_container(&mut Cursor::new(&buf)) {
                Ok(e) => e,
                Err(exif::Error::PartialResult(p)) => p.into_inner().0,
                Err(_) => return None,
            };
            let f = ex.get_field(exif::Tag::DateTimeOriginal, exif::In::PRIMARY)?;
            Some(f.display_value().to_string())
        };
        read().unwrap_or_default()
    }
}

fn scan(dir: &Path) -> Result<Vec<Photo>, String> {
    let mut groups: BTreeMap<String, Vec<PathBuf>> = BTreeMap::new();
    if !dir.exists() {
        return Ok(vec![]);
    }
    for entry in fs::read_dir(dir).map_err(|e| e.to_string())? {
        let p = entry.map_err(|e| e.to_string())?.path();
        let e = ext(&p);
        if p.is_file() && (VIEWABLE.contains(&e.as_str()) || RAW.contains(&e.as_str())) {
            let stem = p
                .file_stem()
                .unwrap_or_default()
                .to_string_lossy()
                .to_lowercase();
            groups.entry(stem).or_default().push(p);
        }
    }
    Ok(groups
        .into_values()
        .map(|mut files| {
            files.sort_by_key(|f| !VIEWABLE.contains(&ext(f).as_str()));
            Photo { files }
        })
        .collect())
}

#[derive(PartialEq, Eq, PartialOrd, Ord)]
enum Chunk {
    Num(usize, String), // (digit count, digits) so "10" > "9" without overflow
    Text(String),
}

fn natural_key(s: &str) -> Vec<Chunk> {
    let mut out = Vec::new();
    let mut cur = String::new();
    let mut digit = false;
    let push = |out: &mut Vec<Chunk>, cur: &str, digit: bool| {
        out.push(if digit {
            let t = cur.trim_start_matches('0');
            Chunk::Num(t.len(), t.to_string())
        } else {
            Chunk::Text(cur.to_string())
        })
    };
    for c in s.to_lowercase().chars() {
        let d = c.is_ascii_digit();
        if !cur.is_empty() && d != digit {
            push(&mut out, &cur, digit);
            cur.clear();
        }
        digit = d;
        cur.push(c);
    }
    if !cur.is_empty() {
        push(&mut out, &cur, digit);
    }
    out
}

fn sort_photos(v: &mut [Photo], by: &str) {
    match by {
        "taken" => v.sort_by_cached_key(|p| (p.taken(), p.mtime())),
        "mtime" => v.sort_by_cached_key(|p| p.mtime()),
        "size" => v.sort_by_cached_key(|p| std::cmp::Reverse(p.size())),
        "random" => {
            let seed = std::collections::hash_map::RandomState::new();
            v.sort_by_cached_key(|p| seed.hash_one(&p.files[0]))
        }
        _ => v.sort_by_cached_key(|p| natural_key(&p.name())),
    }
}

/// Move all files of a photo into `dest`, adding `_N` to the stem if any name is taken.
fn move_photo(p: &mut Photo, dest: &Path) -> Result<Vec<(PathBuf, PathBuf)>, String> {
    let target = |f: &Path, n: u32| {
        if n == 0 {
            dest.join(f.file_name().unwrap())
        } else {
            let stem = f.file_stem().unwrap().to_string_lossy();
            dest.join(format!(
                "{stem}_{n}.{}",
                f.extension().unwrap().to_string_lossy()
            ))
        }
    };
    let mut n = 0;
    while p.files.iter().any(|f| target(f, n).exists()) {
        n += 1;
    }
    let mut moves = Vec::new();
    for f in &p.files {
        let to = target(f, n);
        if let Err(e) = fs::rename(f, &to) {
            undo_moves(&moves);
            return Err(format!("move_failed:{}: {e}", f.display()));
        }
        moves.push((f.clone(), to));
    }
    p.files = moves.iter().map(|m| m.1.clone()).collect();
    Ok(moves)
}

fn undo_moves(moves: &[(PathBuf, PathBuf)]) {
    for (from, to) in moves.iter().rev() {
        let _ = fs::rename(to, from);
    }
}

fn cache_dir() -> PathBuf {
    std::env::temp_dir().join("pulahpilih-previews")
}

/// RAW files carry a full-size JPEG preview; extract the largest baseline/progressive one.
fn raw_preview(path: &Path) -> Option<PathBuf> {
    let meta = fs::metadata(path).ok()?;
    let mut h = DefaultHasher::new();
    (path.file_name(), meta.len(), meta.modified().ok()).hash(&mut h);
    let out = cache_dir().join(format!("{:x}.jpg", h.finish()));
    if !out.exists() {
        let data = fs::read(path).ok()?;
        let (s, e) = largest_jpeg(&data)?;
        fs::create_dir_all(cache_dir()).ok()?;
        fs::write(&out, &data[s..e]).ok()?;
    }
    Some(out)
}

// ponytail: preview ignores RAW orientation tag; portrait shots may show sideways.
fn largest_jpeg(d: &[u8]) -> Option<(usize, usize)> {
    let mut best: Option<(usize, usize)> = None;
    let mut i = 0;
    while i + 3 < d.len() {
        if d[i] == 0xFF && d[i + 1] == 0xD8 && d[i + 2] == 0xFF {
            if let Some((end, displayable)) = jpeg_end(d, i) {
                if displayable && best.map_or(true, |(s, e)| end - i > e - s) {
                    best = Some((i, end));
                }
                i = end;
                continue;
            }
        }
        i += 1;
    }
    best
}

/// Walk JPEG segments from SOI. Returns (end offset, browser-decodable).
/// Lossless JPEG (SOF3, used for CR2/DNG sensor data) is reported as not decodable.
fn jpeg_end(d: &[u8], start: usize) -> Option<(usize, bool)> {
    let mut i = start + 2;
    let mut displayable = false;
    loop {
        if i + 4 > d.len() || d[i] != 0xFF {
            return None;
        }
        let m = d[i + 1];
        match m {
            0xFF => i += 1,
            0xD9 => return Some((i + 2, displayable)),
            0x01 | 0xD0..=0xD7 => i += 2,
            _ => {
                if matches!(m, 0xC0 | 0xC1 | 0xC2) {
                    displayable = true;
                }
                i += 2 + u16::from_be_bytes([d[i + 2], d[i + 3]]) as usize;
                if m == 0xDA {
                    // entropy-coded data: FF is followed by 00 or RSTn, anything else is a marker
                    while i + 1 < d.len()
                        && !(d[i] == 0xFF && d[i + 1] != 0 && !(0xD0..=0xD7).contains(&d[i + 1]))
                    {
                        i += 1;
                    }
                }
            }
        }
    }
}

impl Mode {
    fn as_str(self) -> &'static str {
        match self {
            Mode::Fill => "fill",
            Mode::Reduce => "reduce",
            Mode::Rescue => "rescue",
        }
    }
}

#[derive(Clone, Copy, PartialEq)]
enum Mode {
    Fill,   // round 1: YES moves to selected, whole folder is shown
    Reduce, // selected > target: NO moves back out, round always runs to the end
    Rescue, // selected < target: last round's rejects shown again, YES moves back in, stops at target
}

struct Session {
    root: PathBuf,
    sel: PathBuf,
    target: usize,
    sort: String,
    round: u32,
    mode: Mode,
    pool: Vec<Photo>,
    idx: usize,
    count: usize,
    round_start_count: usize,
    history: Vec<(bool, Vec<(PathBuf, PathBuf)>)>, // (yes, file moves) per decision this round
    done: bool,
    note: String,
}

impl Session {
    fn new(root: PathBuf, target: usize, sort: String) -> Self {
        Session {
            sel: root.join(SELECTED),
            root,
            target,
            sort,
            round: 0,
            mode: Mode::Fill,
            pool: vec![],
            idx: 0,
            count: 0,
            round_start_count: 0,
            history: vec![],
            done: false,
            note: String::new(),
        }
    }

    // ponytail: resuming a half-finished round 1 is treated as Rescue (stops at target); persist mode if that bites.
    fn next_round(&mut self) -> Result<(), String> {
        let prev = (self.mode, self.round_start_count);
        let rejected: Vec<Photo> = self
            .pool
            .iter()
            .zip(&self.history)
            .filter(|(_, (yes, _))| !yes)
            .map(|(p, _)| p.clone())
            .collect();
        self.count = scan(&self.sel)?.len();
        self.history.clear();
        self.idx = 0;
        self.note.clear();
        self.done = self.count == self.target;
        if self.done {
            return Ok(());
        }
        self.mode = if self.count == 0 {
            Mode::Fill
        } else if self.count > self.target {
            Mode::Reduce
        } else {
            Mode::Rescue
        };
        if self.round > 0 && prev == (self.mode, self.count) {
            self.note = "unchanged".into();
        } else if self.mode == Mode::Rescue && self.round > 0 {
            self.note = format!("short:{}", self.target - self.count);
        }
        self.pool = match self.mode {
            Mode::Reduce => scan(&self.sel)?,
            // resumed session has no reject list yet: fall back to everything outside selected
            Mode::Rescue if !rejected.is_empty() => rejected,
            _ => scan(&self.root)?,
        };
        if self.pool.is_empty() {
            return Err("no_photos".into());
        }
        sort_photos(&mut self.pool, &self.sort);
        self.round += 1;
        self.round_start_count = self.count;
        Ok(())
    }

    fn decide(&mut self, yes: bool) -> Result<(), String> {
        if self.done || self.idx >= self.pool.len() {
            return Ok(());
        }
        let reduce = self.mode == Mode::Reduce;
        let moves = if yes != reduce {
            let dest = if reduce {
                self.root.clone()
            } else {
                self.sel.clone()
            };
            let m = move_photo(&mut self.pool[self.idx], &dest)?;
            if reduce {
                self.count -= 1
            } else {
                self.count += 1
            }
            m
        } else {
            vec![]
        };
        self.history.push((yes, moves));
        self.idx += 1;
        let round_over = self.idx >= self.pool.len();
        // done keeps history so the last decision can still be undone
        if self.count == self.target && (round_over || self.mode == Mode::Rescue) {
            self.done = true;
        } else if round_over {
            self.next_round()?;
        }
        Ok(())
    }

    fn undo(&mut self) {
        let Some((_, moves)) = self.history.pop() else {
            return;
        };
        undo_moves(&moves);
        self.idx -= 1;
        if !moves.is_empty() {
            self.pool[self.idx].files = moves.iter().map(|m| m.0.clone()).collect();
            if self.mode == Mode::Reduce {
                self.count += 1
            } else {
                self.count -= 1
            }
        }
        self.done = false;
    }

    fn view(&self) -> View {
        let end = (self.idx + SHOWN).min(self.pool.len());
        let photos = if self.done {
            vec![]
        } else {
            self.pool[self.idx..end].iter().map(card).collect()
        };
        View {
            root: self.root.display().to_string(),
            sel: self.sel.display().to_string(),
            target: self.target,
            count: self.count,
            round: self.round,
            mode: self.mode.as_str(),
            idx: self.idx,
            total: self.pool.len(),
            done: self.done,
            note: self.note.clone(),
            can_undo: !self.history.is_empty(),
            photos,
        }
    }
}

fn card(p: &Photo) -> Card {
    let src = p.viewable().cloned().or_else(|| raw_preview(&p.files[0]));
    Card {
        key: p.files[0].display().to_string(),
        name: p
            .files
            .iter()
            .map(|f| f.file_name().unwrap().to_string_lossy().into_owned())
            .collect::<Vec<_>>()
            .join(" + "),
        src: src.map(|s| s.display().to_string()),
    }
}

#[derive(Serialize)]
struct Card {
    key: String,
    name: String,
    src: Option<String>,
}

#[derive(Serialize)]
struct View {
    root: String,
    sel: String,
    target: usize,
    count: usize,
    round: u32,
    mode: &'static str,
    idx: usize,
    total: usize,
    done: bool,
    note: String,
    can_undo: bool,
    photos: Vec<Card>,
}

type Store = Mutex<Option<Session>>;

fn with(
    store: State<Store>,
    f: impl FnOnce(&mut Session) -> Result<(), String>,
) -> Result<View, String> {
    let mut guard = store.lock().unwrap();
    let s = guard.as_mut().ok_or("no_session")?;
    f(s)?;
    Ok(s.view())
}

#[tauri::command]
fn start(
    app: AppHandle,
    store: State<Store>,
    path: String,
    target: usize,
    sort: String,
) -> Result<View, String> {
    let root = PathBuf::from(path.trim().trim_matches('"'));
    if !root.is_dir() {
        return Err(format!("folder_not_found:{}", root.display()));
    }
    let mut s = Session::new(root, target, sort);
    let total = scan(&s.root)?.len() + scan(&s.sel)?.len();
    if target == 0 || target >= total {
        return Err(format!("target_range:{}:{total}", total.saturating_sub(1)));
    }
    fs::create_dir_all(&s.sel).map_err(|e| e.to_string())?;
    let scope = app.asset_protocol_scope();
    scope
        .allow_directory(&s.root, true)
        .map_err(|e| e.to_string())?;
    scope
        .allow_directory(cache_dir(), true)
        .map_err(|e| e.to_string())?;
    s.next_round()?;
    let v = s.view();
    *store.lock().unwrap() = Some(s);
    Ok(v)
}

#[tauri::command]
fn decide(store: State<Store>, yes: bool) -> Result<View, String> {
    with(store, |s| s.decide(yes))
}

#[tauri::command]
fn undo(store: State<Store>) -> Result<View, String> {
    with(store, |s| Ok(s.undo()))
}

/// Language picked in the installer, written next to the exe by windows/hooks.nsh.
#[tauri::command]
fn installed_lang() -> Option<String> {
    let exe = std::env::current_exe().ok()?;
    let lang = fs::read_to_string(exe.parent()?.join("lang.txt")).ok()?;
    Some(lang.trim().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .manage(Store::default())
        .manage(share::Sharing::default())
        .invoke_handler(tauri::generate_handler![
            start,
            decide,
            undo,
            installed_lang,
            share::share_start,
            share::share_stop,
            share::share_results,
            share::share_clear,
            share::apply_selection
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app, event| {
            // never leave a tunnel open after the window closes
            if let tauri::RunEvent::Exit = event {
                share::stop(&app.state::<share::Sharing>());
            }
        });
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn natural_order() {
        let mut v = vec!["img10", "IMG2", "img1", "a"];
        v.sort_by_key(|s| natural_key(s));
        assert_eq!(v, ["a", "img1", "IMG2", "img10"]);
    }

    #[test]
    fn picks_baseline_jpeg_not_lossless() {
        let jpeg = |sof: u8, body: usize| {
            let mut j = vec![0xFF, 0xD8, 0xFF, sof, 0, 2, 0xFF, 0xDA, 0, 2];
            j.extend(std::iter::repeat(0x11).take(body));
            j.extend([0xFF, 0x00, 0x22, 0xFF, 0xD9]);
            j
        };
        let small = jpeg(0xC0, 10);
        let mut file = vec![0u8; 7];
        file.extend(jpeg(0xC3, 500)); // bigger, but lossless sensor data
        let at = file.len();
        file.extend(&small);
        file.extend([1, 2, 3]);
        assert_eq!(largest_jpeg(&file), Some((at, at + small.len())));
    }

    #[test]
    fn rounds_hit_target_exactly() {
        let root = std::env::temp_dir().join(format!("ps-test-{}", std::process::id()));
        let _ = fs::remove_dir_all(&root);
        fs::create_dir_all(root.join(SELECTED)).unwrap();
        for i in 0..6 {
            fs::write(root.join(format!("p{i}.jpg")), b"x").unwrap();
        }
        fs::write(root.join("p0.cr2"), b"raw").unwrap(); // pair moves with p0.jpg
        let mut s = Session::new(root.clone(), 3, "name".into());
        s.next_round().unwrap();

        // round 1: 2 YES only -> under target -> rescue
        for yes in [true, true, false, false, false, false] {
            s.decide(yes).unwrap();
        }
        assert!(root.join(SELECTED).join("p0.cr2").exists());
        assert!(s.mode == Mode::Rescue && s.count == 2 && s.pool.len() == 4);
        // rescue: first YES hits target exactly
        s.decide(true).unwrap();
        assert!(s.done && s.count == 3);
        // undo, then a reduce scenario: put everything into selected
        s.undo();
        assert!(!s.done && s.count == 2);
        for p in scan(&root).unwrap().iter_mut() {
            move_photo(p, &root.join(SELECTED)).unwrap();
        }
        // older rejects sitting in the root must not come back in the rescue round
        fs::write(root.join("q0.jpg"), b"x").unwrap();
        fs::write(root.join("q1.jpg"), b"x").unwrap();
        let mut s = Session::new(root.clone(), 3, "name".into());
        s.next_round().unwrap();
        assert!(s.mode == Mode::Reduce && s.count == 6);
        // reduce runs to the end even after count hits target
        for yes in [false, false, false] {
            s.decide(yes).unwrap();
        }
        assert!(!s.done && s.count == 3 && s.mode == Mode::Reduce);
        for yes in [false, true, true] {
            s.decide(yes).unwrap();
        }
        assert!(root.join("p0.cr2").exists() && root.join("p0.jpg").exists());
        // under target: rescue shows only this round's 4 rejects
        assert!(s.mode == Mode::Rescue && s.count == 2 && s.pool.len() == 4);
        assert!(s.pool.iter().all(|p| !p.name().starts_with('q')));
        s.decide(true).unwrap();
        assert!(s.done && scan(&root.join(SELECTED)).unwrap().len() == 3);
        fs::remove_dir_all(&root).unwrap();
    }
}
