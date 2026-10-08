<script lang="ts">
	import { flip } from 'svelte/animate';
	import Scene from './Scene.svelte';
	import type { dict } from './i18n';

	let { t }: { t: (typeof dict)['id']['demo'] } = $props();

	const PHOTOS = Array.from({ length: 8 }, (_, i) => i + 1);
	const TARGET = 3;

	// Same round rules as the app (fill → reduce → rescue), trimmed to what the demo needs.
	// ponytail: third copy of the rules (Rust, guest page, here); this one only drives a demo.
	type Mode = 'fill' | 'reduce' | 'rescue';
	let mode = $state<Mode>('fill');
	let round = $state(1);
	let pool = $state<number[]>([...PHOTOS]);
	let idx = $state(0);
	let sel = $state<number[]>([]);
	let rejected: number[] = [];

	const done = $derived(sel.length === TARGET && (idx >= pool.length || mode === 'rescue'));
	const shown = $derived(done ? [] : pool.slice(idx, idx + 3));

	function nextRound() {
		const count = sel.length;
		mode = count > TARGET ? 'reduce' : count < TARGET ? 'rescue' : mode;
		pool = mode === 'reduce' ? [...sel].sort((a, b) => a - b) : rejected.length ? rejected : PHOTOS.filter((p) => !sel.includes(p));
		rejected = [];
		idx = 0;
		round++;
	}

	function decide(yes: boolean) {
		if (done) return;
		const id = pool[idx];
		if (mode === 'reduce') {
			if (!yes) sel = sel.filter((x) => x !== id);
		} else if (yes) sel = [...sel, id];
		if (!yes) rejected.push(id);
		idx++;
		const over = idx >= pool.length;
		if (sel.length === TARGET && (over || mode === 'rescue')) return;
		if (over) nextRound();
	}

	function reset() {
		mode = 'fill';
		round = 1;
		pool = [...PHOTOS];
		idx = 0;
		sel = [];
		rejected = [];
	}

	function onkey(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' || e.key === 'ArrowUp') decide(true);
		else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') decide(false);
		else return;
		e.preventDefault();
	}
</script>

<!-- the window takes arrow keys only while focused, so page scrolling keeps working elsewhere;
     role=application tells screen readers the arrows are handled here -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
<div class="window" role="application" tabindex="0" aria-label={t.label} onkeydown={onkey}>
	<div class="bar">
		<div class="title">
			<strong>{t.folder}</strong>
			<span>{done ? t.done(sel.length) : `${t.modes[mode]}, ${t.round(round)}`}</span>
		</div>
		<div class="tally"><b>{sel.length}</b> {t.ofTarget(TARGET)}</div>
	</div>

	{#if done}
		<div class="done">
			<svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="26" /><path d="M17 29l7.5 7.5L40 21" /></svg>
			<p>{t.done(sel.length)}</p>
			<button class="btn" onclick={reset}>{t.again}</button>
		</div>
	{:else}
		<div class="photos">
			{#each shown as id, i (id)}
				<figure class:current={i === 0} animate:flip={{ duration: 220 }}>
					<div class="frame"><Scene seed={id} /></div>
					<figcaption>
						{#if i === 0}<span class="badge">{t.reviewing}</span>{:else}<span>{t.next}</span>{/if}
						<span class="fname">IMG_{String(id).padStart(4, '0')}.JPG</span>
					</figcaption>
				</figure>
			{/each}
		</div>
		<div class="foot">
			<span class="hint">{t.hint}</span>
			<div class="actions">
				<button class="btn decide no" onclick={() => decide(false)}><kbd>←</kbd> {t.reject}</button>
				<button class="btn decide yes" onclick={() => decide(true)}>{t.pick} <kbd>→</kbd></button>
			</div>
		</div>
	{/if}
</div>

<style>
	.window {
		background: var(--window);
		border-radius: 12px;
		box-shadow: var(--shadow-window);
		overflow: hidden;
		font-size: 13px;
		text-align: left;
		outline: none;
	}
	.window:focus-visible {
		box-shadow: var(--shadow-window), 0 0 0 4px color-mix(in srgb, var(--accent) 45%, transparent);
	}
	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 10px 16px;
		background: var(--toolbar);
		border-bottom: 0.5px solid var(--separator);
	}
	.title {
		display: grid;
		min-width: 0;
	}
	.title span {
		color: var(--secondary);
		font-size: 12px;
	}
	.tally {
		color: var(--secondary);
		white-space: nowrap;
	}
	.tally b {
		color: var(--label);
		font-size: 22px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.photos {
		display: flex;
		gap: 12px;
		padding: 16px;
		height: clamp(180px, 34vw, 340px);
	}
	figure {
		flex: 1;
		min-width: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.frame {
		flex: 1;
		min-height: 0;
		background: var(--content);
		border-radius: 10px;
		padding: 6px;
		box-shadow: var(--shadow-photo);
		outline: 3px solid transparent;
		outline-offset: 2px;
	}
	figure.current .frame {
		outline-color: var(--accent);
	}
	figcaption {
		display: flex;
		gap: 8px;
		align-items: center;
		min-width: 0;
		font-size: 11px;
		color: var(--secondary);
	}
	.fname {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.badge {
		background: var(--accent);
		color: #fff;
		font-weight: 600;
		padding: 1px 7px;
		border-radius: 9px;
		white-space: nowrap;
	}
	.foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 10px 16px;
		border-top: 0.5px solid var(--separator);
		background: var(--toolbar);
	}
	.hint {
		color: var(--secondary);
		font-size: 12px;
	}
	.actions {
		display: flex;
		gap: 8px;
	}
	.btn {
		font: inherit;
		border: none;
		border-radius: 6px;
		padding: 6px 14px;
		background: var(--control);
		color: var(--label);
		box-shadow: var(--shadow-control);
		cursor: pointer;
	}
	.decide {
		color: #fff;
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.decide.no {
		background: var(--red);
	}
	.decide.yes {
		background: var(--green);
	}
	.decide:active {
		transform: scale(0.97);
	}
	kbd {
		font: inherit;
		font-size: 11px;
		min-width: 18px;
		height: 18px;
		display: inline-grid;
		place-items: center;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.25);
	}
	.done {
		height: clamp(232px, calc(34vw + 52px), 392px);
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 12px;
	}
	.done svg {
		width: 52px;
		height: 52px;
	}
	.done circle {
		fill: var(--green);
	}
	.done path {
		fill: none;
		stroke: #fff;
		stroke-width: 4.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	@media (max-width: 640px) {
		.hint,
		kbd {
			display: none;
		}
		.foot {
			justify-content: stretch;
		}
		.actions {
			flex: 1;
		}
		.actions .btn {
			flex: 1;
			justify-content: center;
		}
		figure:not(.current) figcaption {
			display: none;
		}
	}
</style>
