<script lang="ts">
  // macOS-style pop-up button: shows the current choice, opens a menu with a checkmark on it.
  type Option = { value: string; label: string };
  let { value = $bindable(), options, label }: { value: string; options: Option[]; label: string } = $props();

  let open = $state(false);
  let active = $state(0);
  let root: HTMLDivElement;
  let button: HTMLButtonElement;
  const current = $derived(options.find((o) => o.value === value) ?? options[0]);

  function show() {
    active = Math.max(0, options.findIndex((o) => o.value === value));
    open = true;
  }
  function choose(i: number) {
    value = options[i].value;
    open = false;
    button.focus();
  }
  function onkey(e: KeyboardEvent) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { show(); e.preventDefault(); }
      return;
    }
    if (e.key === "ArrowDown") active = (active + 1) % options.length;
    else if (e.key === "ArrowUp") active = (active - 1 + options.length) % options.length;
    else if (e.key === "Enter" || e.key === " ") choose(active);
    else if (e.key === "Escape" || e.key === "Tab") { open = false; if (e.key === "Tab") return; }
    else return;
    e.preventDefault();
  }
</script>

<svelte:window onpointerdown={(e) => open && !root.contains(e.target as Node) && (open = false)} />

<div class="popup" bind:this={root}>
  <button
    type="button"
    bind:this={button}
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-label={label}
    onclick={() => (open ? (open = false) : show())}
    onkeydown={onkey}
  >
    <span>{current.label}</span>
    <span class="chevrons" aria-hidden="true">
      <svg viewBox="0 0 8 12"><path d="M1.5 4.5L4 2l2.5 2.5M1.5 7.5L4 10l2.5-2.5" /></svg>
    </span>
  </button>
  {#if open}
    <ul role="listbox" aria-label={label}>
      {#each options as o, i}
        <!-- keyboard is handled on the pop-up button -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <li
          role="option"
          aria-selected={o.value === value}
          class:active={i === active}
          onpointerenter={() => (active = i)}
          onclick={() => choose(i)}
        >
          <span class="tick" aria-hidden="true">{o.value === value ? "✓" : ""}</span>{o.label}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .popup { position: relative; }
  button {
    font: inherit; font-size: 13px; color: var(--label);
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--control); border: none; border-radius: 6px;
    padding: 0 3px 0 10px; height: 24px; min-width: 150px; justify-content: space-between;
    box-shadow: var(--shadow-control); cursor: default;
  }
  .chevrons {
    width: 16px; height: 18px; border-radius: 4px; background: var(--accent);
    display: grid; place-items: center;
  }
  .chevrons svg { width: 8px; height: 12px; fill: none; stroke: #fff; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
  ul {
    position: absolute; right: 0; top: calc(100% + 4px); z-index: 10;
    min-width: 100%; margin: 0; padding: 5px; list-style: none; box-sizing: border-box;
    background: var(--menu); backdrop-filter: saturate(180%) blur(24px);
    border-radius: 8px; box-shadow: 0 0 0 0.5px var(--separator), 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: pop 0.12s ease-out;
  }
  li { display: flex; align-items: center; padding: 3px 10px 3px 4px; border-radius: 4px; white-space: nowrap; cursor: default; }
  li.active { background: var(--accent); color: #fff; }
  .tick { width: 18px; text-align: center; font-size: 12px; }
  @keyframes pop { from { opacity: 0; transform: scale(0.97); } }
  @media (prefers-reduced-motion: reduce) { ul { animation: none; } }
</style>
