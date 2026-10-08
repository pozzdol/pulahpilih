<script lang="ts">
  import { invoke, convertFileSrc } from "@tauri-apps/api/core";
  import { flip } from "svelte/animate";
  import { open, ask } from "@tauri-apps/plugin-dialog";
  import PopUp from "$lib/PopUp.svelte";
  import PhotoSwipe from "photoswipe";
  import "photoswipe/style.css";
  import { strings, translate, type Lang } from "$lib/strings";
  import { check, type Update } from "@tauri-apps/plugin-updater";
  import { relaunch } from "@tauri-apps/plugin-process";

  type Card = { key: string; name: string; src: string | null };
  type View = {
    root: string; sel: string; target: number; count: number; round: number;
    mode: "fill" | "reduce" | "rescue"; idx: number; total: number;
    done: boolean; note: string; can_undo: boolean; photos: Card[];
  };

  const stored = (k: string, d: string) => { try { return localStorage.getItem(k) ?? d } catch { return d } };
  const store = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch {} };

  let path = $state(stored("path", ""));
  let target = $state(Number(stored("target", "50")));
  let sort = $state(stored("sort", "name"));
  let vertical = $state(stored("layout", "row") === "col");
  let lang = $state<Lang>((stored("lang", "") || (navigator.language.startsWith("id") ? "id" : "en")) as Lang);
  let view = $state<View | null>(null);
  type ShareInfo = { url: string; pin: string };
  type ResultPhoto = { id: number; name: string; votes: number; voters: string[] };
  type Results = { thumbs: string; target: number; submissions: number; photos: ResultPhoto[] };
  let share = $state<ShareInfo | null>(null);
  let shareOpen = $state(false);
  let shareBusy = $state(false);
  let copied = $state(false);
  let results = $state<Results | null>(null);
  let review = $state(false);
  let picked = $state<number[]>([]);
  let error = $state("");
  let busy = false;

  const t = $derived(strings[lang] ?? strings.en);
  const sortOptions = $derived(Object.entries(t.sorts).map(([value, label]) => ({ value, label })));
  const langOptions = [
    { value: "id", label: "Bahasa Indonesia" },
    { value: "en", label: "English" },
  ];

  // Installer choice is the default until the user picks a language in the app.
  if (!stored("lang", "")) {
    invoke<string | null>("installed_lang").then((l) => { if (l === "id" || l === "en") lang = l; });
  }
  $effect(() => { document.documentElement.lang = lang; });

  let update = $state<Update | null>(null);
  let updateProgress = $state<number | null>(null);
  // offline, dev build or no release yet: stay quiet
  check().then((u) => (update = u)).catch(() => {});

  async function installUpdate() {
    if (!update) return;
    let total = 0;
    let done = 0;
    updateProgress = 0;
    try {
      await update.downloadAndInstall((e) => {
        if (e.event === "Started") total = e.data.contentLength ?? 0;
        else if (e.event === "Progress") {
          done += e.data.chunkLength;
          updateProgress = total ? Math.round((done / total) * 100) : 0;
        }
      });
      await relaunch();
    } catch (e) {
      error = String(e);
      updateProgress = null;
    }
  }

  const folderName = (p: string) => p.split(/[\\/]/).filter(Boolean).pop() ?? p;

  async function call(cmd: string, args: Record<string, unknown> = {}) {
    if (busy) return;
    busy = true;
    error = "";
    try {
      view = await invoke<View>(cmd, args);
    } catch (e) {
      error = String(e);
    } finally {
      busy = false;
    }
  }

  function start(e: Event) {
    e.preventDefault();
    store("path", path); store("target", String(target)); store("sort", sort);
    call("start", { path, target: Number(target), sort });
  }

  function setLang(l: string) {
    lang = l as Lang;
    store("lang", l);
  }

  async function browse() {
    const dir = await open({ directory: true, defaultPath: path || undefined, title: t.browseTitle });
    if (typeof dir === "string") path = dir;
  }

  const step = (d: number) => (target = Math.max(1, (Number(target) || 0) + d));

  function setLayout(v: boolean) {
    vertical = v;
    store("layout", v ? "col" : "row");
  }

  const decide = (yes: boolean) => call("decide", { yes });

  async function startShare() {
    shareOpen = true;
    if (share || shareBusy) return;
    shareBusy = true;
    error = "";
    try {
      share = await invoke<ShareInfo>("share_start");
    } catch (e) {
      error = String(e);
      shareOpen = false;
    } finally {
      shareBusy = false;
    }
  }

  async function stopShare() {
    await invoke("share_stop");
    share = null;
    shareOpen = false;
    results = null;
    review = false;
  }

  async function copyLink() {
    if (!share) return;
    await navigator.clipboard.writeText(share.url);
    copied = true;
    setTimeout(() => (copied = false), 1500);
  }

  // guests submit in the background; keep the count on the toolbar button fresh
  $effect(() => {
    if (!share) return;
    const load = async () => { try { results = await invoke<Results | null>("share_results"); } catch {} };
    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  });

  const names = (list: string[]) => list.map((n) => n || t.guest).join(", ");
  const thumbUrl = (id: number) => results!.thumbs.replace("{id}", String(id));

  /** Suggestion: the most-voted photos (list is already sorted by votes), up to the target. */
  function suggest() {
    if (!results) return;
    picked = results.photos.filter((p) => p.votes > 0).slice(0, results.target).map((p) => p.id);
  }

  function openReview() {
    shareOpen = false;
    review = true;
    suggest();
  }

  const toggle = (id: number) =>
    (picked = picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]);

  async function approve() {
    if (!(await ask(t.approveConfirm(picked.length), { kind: "warning", title: t.approve }))) return;
    try {
      view = await invoke<View>("apply_selection", { ids: picked });
      review = false;
    } catch (e) {
      error = String(e);
    }
  }

  async function rejectResults() {
    await invoke("share_clear");
    review = false;
    results = await invoke<Results | null>("share_results");
  }

  // Zoom a photo from the review grid via the local preview server (size known once loaded).
  function zoomResult(id: number) {
    const img = new Image();
    img.onload = () => openViewer([{ src: img.src, width: img.naturalWidth, height: img.naturalHeight }], 0);
    img.src = thumbUrl(id).replace("/thumb/", "/img/");
  }

  let pswp: PhotoSwipe | null = null;

  /** Opens the on-screen photos in a zoomable viewer, starting at `start` (default: the one being reviewed). */
  function zoom(start?: HTMLImageElement) {
    const imgs = [...document.querySelectorAll<HTMLImageElement>(".photos .frame img")];
    if (!imgs.length) return;
    openViewer(
      imgs.map((img) => ({
        src: img.currentSrc || img.src,
        width: img.naturalWidth || 1600,
        height: img.naturalHeight || 1200,
        alt: img.alt,
      })),
      Math.max(0, start ? imgs.indexOf(start) : 0),
    );
  }

  function openViewer(dataSource: { src: string; width: number; height: number; alt?: string }[], index: number) {
    if (pswp) return;
    pswp = new PhotoSwipe({
      dataSource,
      index,
      wheelToZoom: true,
      loop: false,
      bgOpacity: 0.94,
      showHideAnimationType: "fade",
    });
    pswp.on("destroy", () => (pswp = null));
    pswp.init();
  }

  function onkey(e: KeyboardEvent) {
    if (!view || pswp) return; // the viewer owns arrows and Esc while open
    if (review) { if (e.key === "Escape") review = false; return; }
    if (e.key === " " || e.key === "z") { zoom(); e.preventDefault(); return; }
    if (e.key === "Escape" && shareOpen) { shareOpen = false; return; }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") decide(true);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") decide(false);
    else if (e.key === "Backspace") call("undo");
    else return;
    e.preventDefault();
  }
</script>

<svelte:window onkeydown={onkey} />

{#if update}
  <div class="update" role="status">
    <p><strong>{t.updateTitle(update.version)}</strong><br />{t.updateBody}</p>
    {#if updateProgress === null}
      <div class="update-actions">
        <button class="btn" onclick={() => (update = null)}>{t.later}</button>
        <button class="btn primary" onclick={installUpdate}>{t.updateNow}</button>
      </div>
    {:else}
      <div class="bar"><div style="width: {updateProgress}%"></div></div>
    {/if}
  </div>
{/if}

{#if !view}
  <div class="setup-wrap">
    <form class="setup" onsubmit={start}>
      <div class="app-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64"><rect x="6" y="14" width="40" height="34" rx="6" /><rect x="18" y="20" width="40" height="34" rx="6" /><circle cx="30" cy="31" r="4" /><path d="M22 50l10-11 7 7 6-5 9 9z" /></svg>
      </div>
      <h1>Photo Sorter</h1>
      <p class="lede">{t.lede}</p>

      <div class="group">
        <div class="row stacked">
          <label for="path">{t.folder}</label>
          <div class="path-field">
            <input id="path" bind:value={path} placeholder={t.placeholder} required spellcheck="false" />
            <button type="button" class="btn" onclick={browse}>{t.browse}</button>
          </div>
        </div>
        <div class="row">
          <label for="target">{t.target}</label>
          <span class="field-suffix">
            <input id="target" type="number" min="1" bind:value={target} required />
            <span class="stepper" aria-hidden="true">
              <button type="button" tabindex="-1" aria-label={t.more} onclick={() => step(1)}>
                <svg viewBox="0 0 8 5"><path d="M1 4l3-3 3 3" /></svg>
              </button>
              <button type="button" tabindex="-1" aria-label={t.less} onclick={() => step(-1)}>
                <svg viewBox="0 0 8 5"><path d="M1 1l3 3 3-3" /></svg>
              </button>
            </span>
            {t.photos}
          </span>
        </div>
        <div class="row">
          <span>{t.sortBy}</span>
          <PopUp bind:value={sort} options={sortOptions} label={t.sortBy} />
        </div>
      </div>
      <p class="footnote">{t.footnote}</p>

      <div class="group">
        <div class="row">
          <span>{t.language}</span>
          <PopUp bind:value={() => lang, setLang} options={langOptions} label={t.language} />
        </div>
      </div>

      {#if error}<p class="error" role="alert">{translate(t.error, error)}</p>{/if}
      <button class="btn primary large">{t.start}</button>
    </form>
  </div>
{:else}
  <div class="window">
    <header class="toolbar">
      <div class="title">
        <h1>{folderName(view.root)}</h1>
        <p title={view.root}>{view.root}</p>
      </div>
      <div class="segmented" role="radiogroup" aria-label={t.layout}>
        <button role="radio" aria-checked={!vertical} class:on={!vertical} onclick={() => setLayout(false)} title={t.horizontal}>
          <svg viewBox="0 0 20 14"><rect x="1" y="2" width="5" height="10" rx="1.5" /><rect x="7.5" y="2" width="5" height="10" rx="1.5" /><rect x="14" y="2" width="5" height="10" rx="1.5" /></svg>
        </button>
        <button role="radio" aria-checked={vertical} class:on={vertical} onclick={() => setLayout(true)} title={t.vertical}>
          <svg viewBox="0 0 20 14"><rect x="4" y="0.5" width="12" height="3.6" rx="1.2" /><rect x="4" y="5.2" width="12" height="3.6" rx="1.2" /><rect x="4" y="9.9" width="12" height="3.6" rx="1.2" /></svg>
        </button>
      </div>
      <div class="share-wrap">
        <button class="btn" aria-expanded={shareOpen} onclick={() => (shareOpen ? (shareOpen = false) : startShare())}>
          {#if share}<span class="live-dot" title={t.shareOn}></span>{/if}{t.share}
        </button>
        {#if shareOpen}
          <div class="popover" role="dialog" aria-label={t.shareTitle}>
            <h3>{t.shareTitle}</h3>
            {#if shareBusy || !share}
              <p class="muted"><span class="spinner" aria-hidden="true"></span>{t.sharing}</p>
            {:else}
              <p class="muted">{t.shareBody}</p>
              <div class="field">
                <span>{t.link}</span>
                <div class="link-row">
                  <input readonly value={share.url} onfocus={(e) => e.currentTarget.select()} />
                  <button class="btn" onclick={copyLink}>{copied ? t.copied : t.copy}</button>
                </div>
              </div>
              <div class="field">
                <span>{t.pin}</span>
                <div class="pin">{share.pin}</div>
              </div>
              <div class="pop-actions">
                <button class="btn" onclick={() => (shareOpen = false)}>{t.close}</button>
                <button class="btn danger" onclick={stopShare}>{t.stopShare}</button>
              </div>
            {/if}
          </div>
        {/if}
      </div>
      {#if share && results}
        <button class="btn" class:primary={results.submissions > 0} onclick={openReview}>{t.guestResults(results.submissions)}</button>
      {/if}
      <button class="btn" onclick={() => call("undo")} disabled={!view.can_undo || review}>{t.undo}</button>
      <button class="btn" onclick={() => { view = null; error = ""; }}>{t.changeFolder}</button>
    </header>

    {#if review && results}
      <div class="review">
        <div class="stage-head">
          <div>
            <h2>{t.reviewTitle}</h2>
            <p>{results.submissions ? t.reviewBody(results.submissions) : t.noSubmissions}</p>
          </div>
          <div class="tally">
            <span class="tally-num">{picked.length}</span>
            <span class="tally-label">{t.ofTarget(results.target)}</span>
          </div>
        </div>
        <div class="review-grid">
          {#each results.photos as p (p.id)}
            <figure class="tile" class:on={picked.includes(p.id)}>
              <button class="tile-pick" aria-pressed={picked.includes(p.id)} onclick={() => toggle(p.id)}>
                <img src={thumbUrl(p.id)} alt={p.name} loading="lazy" draggable="false" />
                <span class="tick" aria-hidden="true">✓</span>
              </button>
              <button class="tile-zoom" title={t.zoom} aria-label={t.zoom} onclick={() => zoomResult(p.id)}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14M5 7h4M7 5v4" /></svg>
              </button>
              <figcaption>
                <span class="fname">{p.name}</span>
                <span class="votes" class:zero={!p.votes} title={names(p.voters)}>{t.voteCount(p.votes)}</span>
              </figcaption>
            </figure>
          {/each}
        </div>
      </div>
      <footer class="statusbar">
        <p class="progress">{picked.length === results.target ? "" : t.needExactly(results.target)}</p>
        <div class="actions">
          <button class="btn" onclick={() => (review = false)}>{t.back}</button>
          <button class="btn" onclick={suggest}>{t.useSuggestion}</button>
          <button class="btn danger" onclick={rejectResults} disabled={!results.submissions}>{t.rejectResults}</button>
          <button class="btn primary" onclick={approve} disabled={picked.length !== results.target}>{t.approve}</button>
        </div>
      </footer>
    {:else if view.done}
      <div class="done">
        <svg class="check" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="26" /><path d="M17 29l7.5 7.5L40 21" /></svg>
        <h2>{t.doneTitle(view.count)}</h2>
        <p>{t.doneBody}<br /><code>{view.sel}</code></p>
        <div class="done-actions">
          {#if view.can_undo}<button class="btn" onclick={() => call("undo")}>{t.undoLast}</button>{/if}
          <button class="btn primary" onclick={() => { view = null; }}>{t.sortAnother}</button>
        </div>
      </div>
    {:else}
      <div class="stage">
        <div class="stage-head">
          <div>
            <h2>{t.modeTitle[view.mode]}</h2>
            <p>{t.modeHelp[view.mode]}</p>
          </div>
          <div class="tally">
            <span class="tally-num">{view.count}</span>
            <span class="tally-label">{t.ofTarget(view.target)}</span>
          </div>
        </div>

        {#if view.note}<div class="notice" role="status">{translate(t.note, view.note)}</div>{/if}

        <section class="photos" class:vertical>
          {#each view.photos.slice(0, 3) as p, i (p.key)}
            <figure class:current={i === 0} animate:flip={{ duration: 180 }}>
              <div class="frame">
                {#if p.src}
                  <!-- keyboard: Space/Z and the zoom button open the same viewer -->
                  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
                  <img src={convertFileSrc(p.src)} alt={p.name} draggable="false" onclick={(e) => zoom(e.currentTarget)} />
                {:else}
                  <div class="nopreview">{t.noPreview}</div>
                {/if}
              </div>
              <figcaption>
                {#if i === 0}<span class="badge">{t.current}</span>{:else}<span class="next">{t.next}</span>{/if}
                <span class="fname">{p.name}</span>
              </figcaption>
            </figure>
          {/each}
        </section>
        <div class="preload" aria-hidden="true">
          {#each view.photos.slice(3) as p (p.key)}
            {#if p.src}<img src={convertFileSrc(p.src)} alt="" />{/if}
          {/each}
        </div>
      </div>

      <footer class="statusbar">
        <div class="progress" aria-label={t.roundProgress}>
          <span>{t.round(view.round)}</span>
          <div class="bar"><div style="width: {(view.idx / view.total) * 100}%"></div></div>
          <span>{t.position(view.idx + 1, view.total)}</span>
        </div>
        <div class="actions">
          <button class="btn zoom" onclick={() => zoom()}>
            <kbd>{t.spaceKey}</kbd> {t.zoom}
          </button>
          <button class="btn decide no" onclick={() => decide(false)}>
            <kbd>{vertical ? "↓" : "←"}</kbd> {t.reject}
          </button>
          <button class="btn decide yes" onclick={() => decide(true)}>
            {t.pick} <kbd>{vertical ? "↑" : "→"}</kbd>
          </button>
        </div>
      </footer>
    {/if}
    {#if error}<p class="error toast" role="alert">{translate(t.error, error)}</p>{/if}
  </div>
{/if}

<style>
  :global(:root) {
    --window: #ececec;
    --content: #ffffff;
    --control: #ffffff;
    --label: #1d1d1f;
    --secondary: #6e6e73;
    --tertiary: #aeaeb2;
    --separator: rgba(0, 0, 0, 0.1);
    --fill: rgba(0, 0, 0, 0.05);
    --accent: #007aff;
    --green: #34c759;
    --red: #ff3b30;
    --yellow-bg: #fff4d6;
    --yellow-fg: #7a5200;
    --toolbar: rgba(246, 246, 246, 0.8);
    --menu: rgba(246, 246, 246, 0.92);
    --shadow-control: 0 0.5px 1px rgba(0, 0, 0, 0.18), 0 0 0 0.5px rgba(0, 0, 0, 0.08);
    --shadow-photo: 0 1px 3px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06);
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif;
    color-scheme: light dark;
  }
  @media (prefers-color-scheme: dark) {
    :global(:root) {
      --window: #1e1e1e;
      --content: #282828;
      --control: #3a3a3c;
      --label: #f5f5f7;
      --secondary: #98989d;
      --tertiary: #636366;
      --separator: rgba(255, 255, 255, 0.1);
      --fill: rgba(255, 255, 255, 0.06);
      --accent: #0a84ff;
      --green: #30d158;
      --red: #ff453a;
      --yellow-bg: #3a3020;
      --yellow-fg: #ffd36b;
      --toolbar: rgba(40, 40, 40, 0.8);
      --menu: rgba(44, 44, 46, 0.92);
      --shadow-control: 0 0.5px 1px rgba(0, 0, 0, 0.5), 0 0 0 0.5px rgba(255, 255, 255, 0.08);
      --shadow-photo: 0 1px 3px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.3);
    }
  }
  :global(body) {
    margin: 0;
    background: var(--window);
    color: var(--label);
    font-size: 13px;
    line-height: 1.38;
    -webkit-font-smoothing: antialiased;
    user-select: none;
  }
  :global(*:focus-visible) { outline: 3px solid color-mix(in srgb, var(--accent) 50%, transparent); outline-offset: 1px; }
  h1, h2, p { margin: 0; }
  code { font-family: ui-monospace, "SF Mono", "Cascadia Mono", Consolas, monospace; font-size: 12px; user-select: text; }

  /* Controls */
  .btn {
    font: inherit; font-size: 13px; color: var(--label);
    background: var(--control); border: none; border-radius: 6px;
    padding: 4px 12px; min-height: 24px; box-shadow: var(--shadow-control);
    cursor: default; white-space: nowrap;
  }
  .btn:active:not(:disabled) { filter: brightness(0.92); }
  .btn:disabled { color: var(--tertiary); }
  .btn.primary { background: var(--accent); color: #fff; box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.25); }
  .btn.large { font-size: 15px; padding: 8px 16px; border-radius: 8px; width: 100%; }
  input {
    font: inherit; color: var(--label); background: var(--control);
    border: none; border-radius: 6px; padding: 5px 8px; box-shadow: var(--shadow-control);
  }
  input::placeholder { color: var(--tertiary); }
  kbd {
    font: inherit; font-size: 11px; display: inline-grid; place-items: center;
    min-width: 18px; height: 18px; border-radius: 4px;
    background: rgba(255, 255, 255, 0.25); color: inherit;
  }

  /* Setup — System Settings inset grouped list */
  .setup-wrap { min-height: 100vh; display: grid; place-items: center; padding: 32px 16px; box-sizing: border-box; }
  .setup { width: min(440px, 100%); display: grid; gap: 14px; text-align: center; }
  .app-icon { justify-self: center; width: 72px; height: 72px; border-radius: 16px;
    background: linear-gradient(180deg, #4ea8ff, #0062e0); box-shadow: 0 4px 12px rgba(0, 98, 224, 0.3);
    display: grid; place-items: center; }
  .app-icon svg { width: 46px; height: 46px; }
  .app-icon rect:first-child { fill: rgba(255, 255, 255, 0.45); }
  .app-icon rect:nth-child(2) { fill: #fff; }
  .app-icon circle { fill: #ffcc00; }
  .app-icon path { fill: #34c759; }
  .setup h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }
  .lede { color: var(--secondary); font-size: 13px; margin-top: -6px; }
  .group { background: var(--content); border-radius: 10px; text-align: left; margin-top: 6px;
    box-shadow: 0 0 0 0.5px var(--separator); }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 9px 12px; min-height: 26px; }
  .row + .row { border-top: 0.5px solid var(--separator); }
  .row.stacked { flex-direction: column; align-items: stretch; gap: 6px; }
  .row > :first-child { font-weight: 500; }
  .path-field { display: flex; gap: 8px; }
  .path-field input { flex: 1; min-width: 0; }
  .field-suffix { color: var(--secondary); display: flex; align-items: center; gap: 6px; }
  .field-suffix input { width: 64px; text-align: right; font-variant-numeric: tabular-nums; }
  input[type="number"] { appearance: textfield; }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button { appearance: none; margin: 0; }
  /* macOS stepper: two stacked halves in one pill */
  .stepper { display: flex; flex-direction: column; width: 15px; height: 22px; border-radius: 5px;
    background: var(--control); box-shadow: var(--shadow-control); overflow: hidden; margin-right: 2px; }
  .stepper button { flex: 1; border: none; background: none; padding: 0; color: var(--label);
    display: grid; place-items: center; cursor: default; }
  .stepper button + button { border-top: 0.5px solid var(--separator); }
  .stepper button:active { background: var(--fill); }
  .stepper svg { width: 7px; height: 5px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
  .footnote { color: var(--secondary); font-size: 11px; text-align: left; padding: 0 12px; margin-top: -6px; }

  /* Session window */
  .window { height: 100vh; display: flex; flex-direction: column; }
  .toolbar {
    /* backdrop-filter creates a stacking context; lift it so the share popover paints above the photos */
    position: relative; z-index: 10;
    display: flex; align-items: center; gap: 8px; padding: 8px 14px;
    background: var(--toolbar); backdrop-filter: saturate(180%) blur(20px);
    border-bottom: 0.5px solid var(--separator);
  }
  .title { flex: 1; min-width: 0; }
  .title h1 { font-size: 13px; font-weight: 700; }
  .title p { font-size: 11px; color: var(--secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .segmented { display: flex; background: var(--fill); border-radius: 7px; padding: 2px; margin-right: 6px; }
  .segmented button { border: none; background: none; border-radius: 5px; padding: 2px 10px; height: 20px; color: var(--secondary); }
  .segmented button.on { background: var(--control); color: var(--label); box-shadow: var(--shadow-control); }
  .segmented svg { width: 20px; height: 14px; fill: currentColor; display: block; }

  .stage { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 12px; padding: 16px 20px 12px; }
  .stage-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
  .stage-head h2 { font-size: 17px; font-weight: 600; letter-spacing: -0.01em; }
  .stage-head p { color: var(--secondary); }
  .tally { display: flex; align-items: baseline; gap: 6px; }
  .tally-num { font-size: 28px; font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
  .tally-label { color: var(--secondary); }
  .notice { background: var(--yellow-bg); color: var(--yellow-fg); border-radius: 8px; padding: 8px 12px; }

  .photos { flex: 1; min-height: 0; display: flex; gap: 14px; }
  .photos.vertical { flex-direction: column; }
  figure { flex: 1; min-width: 0; min-height: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
  .vertical figure { flex-direction: row; align-items: center; }
  .frame {
    position: relative; flex: 1; min-height: 0; min-width: 0; display: grid; place-items: center;
    background: var(--content); border-radius: 10px; box-shadow: var(--shadow-photo);
    outline: 3px solid transparent; outline-offset: 2px;
  }
  .vertical .frame { align-self: stretch; }
  figure.current .frame { outline-color: var(--accent); }
  /* Absolute so the image's intrinsic size never stretches the frame; the frame size comes from the layout only. */
  .frame img { position: absolute; inset: 8px; width: calc(100% - 16px); height: calc(100% - 16px); object-fit: contain; cursor: zoom-in; }
  .btn.zoom { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; }
  .btn.zoom kbd { background: var(--fill); min-width: 34px; }
  .nopreview { color: var(--secondary); }
  figcaption { display: flex; align-items: center; gap: 8px; min-width: 0; padding: 0 2px; }
  .vertical figcaption { flex-direction: column; align-items: flex-start; width: 160px; flex: none; }
  .badge { background: var(--accent); color: #fff; font-size: 11px; font-weight: 600; padding: 1px 7px; border-radius: 9px; white-space: nowrap; }
  .next { color: var(--secondary); font-size: 11px; white-space: nowrap; }
  .fname { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--secondary); max-width: 100%; }
  figure.current .fname { color: var(--label); font-weight: 500; }
  .preload { display: none; }

  .statusbar {
    display: flex; align-items: center; gap: 16px; padding: 10px 20px;
    border-top: 0.5px solid var(--separator); background: var(--toolbar);
  }
  .progress { flex: 1; display: flex; align-items: center; gap: 10px; color: var(--secondary); font-variant-numeric: tabular-nums; }
  .bar { flex: 1; max-width: 280px; height: 4px; border-radius: 2px; background: var(--fill); overflow: hidden; }
  .bar div { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.18s; }
  .actions { display: flex; gap: 10px; }
  .decide { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; font-size: 13px; font-weight: 500; color: #fff; }
  .decide.no { background: var(--red); }
  .decide.yes { background: var(--green); }

  .done { flex: 1; display: grid; place-content: center; justify-items: center; gap: 10px; text-align: center; padding: 16px; }
  .check { width: 64px; height: 64px; }
  .check circle { fill: var(--green); }
  .check path { fill: none; stroke: #fff; stroke-width: 4.5; stroke-linecap: round; stroke-linejoin: round; }
  .done h2 { font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }
  .done p { color: var(--secondary); line-height: 1.6; }
  .done-actions { display: flex; gap: 10px; margin-top: 8px; }

  .error { color: var(--red); }

  .update {
    position: fixed; right: 16px; bottom: 16px; z-index: 30; width: min(320px, calc(100vw - 32px));
    background: var(--content); border-radius: 10px; padding: 12px 14px; display: grid; gap: 10px;
    box-shadow: 0 0 0 0.5px var(--separator), 0 12px 36px rgba(0, 0, 0, 0.22);
  }
  .update p { color: var(--secondary); font-size: 12px; }
  .update strong { color: var(--label); font-size: 13px; }
  .update-actions { display: flex; justify-content: flex-end; gap: 8px; }
  .update .bar { max-width: none; }

  /* Share popover */
  .share-wrap { position: relative; }
  .live-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--green); margin-right: 6px; vertical-align: 1px; }
  .popover {
    position: absolute; right: 0; top: calc(100% + 8px); z-index: 20; width: 340px;
    /* solid: a backdrop blur nested inside the toolbar's can't see the photos behind it */
    background: var(--content);
    border-radius: 10px; padding: 14px; display: grid; gap: 12px;
    box-shadow: 0 0 0 0.5px var(--separator), 0 12px 36px rgba(0, 0, 0, 0.22);
  }
  .popover h3 { margin: 0; font-size: 13px; font-weight: 600; }
  .muted { color: var(--secondary); font-size: 12px; display: flex; align-items: center; gap: 8px; }
  .field { display: grid; gap: 4px; }
  .field > span { font-size: 11px; color: var(--secondary); font-weight: 500; }
  .link-row { display: flex; gap: 6px; }
  .link-row input { flex: 1; min-width: 0; font-size: 12px; user-select: text; }
  .pin { font-size: 28px; font-weight: 600; letter-spacing: 0.3em; font-variant-numeric: tabular-nums; }
  .pop-actions { display: flex; justify-content: flex-end; gap: 8px; }
  .btn.danger { color: var(--red); }
  .spinner { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--fill); border-top-color: var(--secondary);
    animation: spin 0.8s linear infinite; flex: none; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Guest results review */
  .review { flex: 1; min-height: 0; overflow: auto; display: flex; flex-direction: column; gap: 14px; padding: 16px 20px; }
  .review-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 14px; }
  .tile { position: relative; margin: 0; display: grid; gap: 6px; }
  .tile-pick {
    position: relative; padding: 0; border: none; aspect-ratio: 4 / 3; border-radius: 8px; overflow: hidden;
    background: var(--content); box-shadow: var(--shadow-photo); outline: 3px solid transparent; outline-offset: 2px; cursor: default;
  }
  .tile.on .tile-pick { outline-color: var(--accent); }
  .tile-pick img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .tick {
    position: absolute; top: 6px; left: 6px; width: 20px; height: 20px; border-radius: 50%;
    display: grid; place-items: center; font-size: 12px; font-weight: 700; color: #fff;
    background: rgba(0, 0, 0, 0.35); box-shadow: 0 0 0 1.5px #fff;
  }
  .tile.on .tick { background: var(--accent); }
  .tile:not(.on) .tick { color: transparent; }
  .tile-zoom {
    position: absolute; top: 6px; right: 6px; width: 26px; height: 26px; border: none; border-radius: 6px;
    background: rgba(0, 0, 0, 0.45); color: #fff; display: grid; place-items: center; padding: 0;
  }
  .tile-zoom svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }
  .tile figcaption { display: flex; justify-content: space-between; gap: 8px; min-width: 0; font-size: 12px; }
  .votes { font-weight: 600; color: var(--accent); white-space: nowrap; }
  .votes.zero { color: var(--tertiary); font-weight: 400; }
  .toast { position: fixed; left: 50%; bottom: 64px; transform: translateX(-50%);
    background: var(--content); padding: 8px 14px; border-radius: 8px; box-shadow: var(--shadow-photo); }

  @media (max-width: 640px) {
    .toolbar { flex-wrap: wrap; }
    .stage { padding: 12px 16px; }
    .statusbar { flex-direction: column; align-items: stretch; padding: 10px 16px; }
    .vertical figcaption { width: 100px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .bar div { transition: none; }
    .spinner { animation-duration: 2s; }
  }
</style>
