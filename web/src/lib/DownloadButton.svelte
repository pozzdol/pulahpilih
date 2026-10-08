<script lang="ts">
	/* Hallmark · component: download-button · genre: modern-minimal · theme: custom (Pulahpilih app tokens)
	 * states: default · hover · focus · active · disabled (no release yet) · loading (detecting OS) · error (unsupported OS warning) · success (supported OS)
	 */
	import { onMount } from 'svelte';
	import { dict, type Lang } from './i18n.ts';
	import { detectPlatform, type Platform } from './platform.ts';
	import type { Release } from './releases.ts';

	let { lang, release, soonLabel }: { lang: Lang; release: Release | null; soonLabel: string } = $props();

	const t = $derived(dict[lang]);
	let platform = $state<Platform | null>(null); // null while detecting (and in the prerendered HTML)
	onMount(async () => {
		platform = await detectPlatform();
	});

	const mb = (bytes: number) =>
		`${(bytes / 1048576).toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', { maximumFractionDigits: 1 })} MB`;
	const warning = $derived.by(() => {
		if (!platform) return '';
		switch (platform.kind) {
			case 'other':
				return t.os.other(platform.label);
			case 'mobile':
				return t.os.mobile(platform.label);
			case 'windows-old':
				return t.os.old;
			case 'windows-32':
				return t.os.bit32;
			default:
				return '';
		}
	});
	const ready = $derived(platform?.kind === 'windows');
</script>

<div class="dl">
	{#if release?.installer}
		{#if warning}
			<p class="warn" role="status">
				<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.8 15 14H1z" /><path class="mark" d="M8 6v3.6M8 11.6v.1" /></svg>
				<span>{warning}</span>
			</p>
		{/if}
		<a class="btn" class:muted={!!warning} href={release.installer.url} aria-busy={platform === null}>
			<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8.5M4.5 7.2 8 10.7l3.5-3.5M3 13.5h10" /></svg>
			{warning ? t.os.anyway : t.hero.download}
		</a>
		<p class="meta">
			{t.os.meta(release.version, mb(release.installer.size))}.
			{#if ready && platform}<span class="ok">{t.os.ready(platform.label)}</span>{:else if !warning}{t.os.requires}{/if}
		</p>
	{:else}
		<span class="btn disabled" aria-disabled="true">{soonLabel}</span>
		<p class="meta">{t.os.requires}</p>
	{/if}
</div>

<style>
	.dl {
		display: grid;
		gap: var(--space-xs);
		justify-items: start;
		min-width: 0;
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
		padding: var(--space-xs) var(--space-md);
		border-radius: var(--radius-pill);
		background: var(--color-accent-fill);
		color: var(--color-accent-ink);
		font-size: var(--text-base);
		font-weight: 600;
		white-space: nowrap;
		transition: background-color var(--dur-short) var(--ease-out);
	}
	.btn svg {
		width: 16px;
		height: 16px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.btn:hover {
		background: var(--color-accent-fill-hover);
		text-decoration: none;
	}
	.btn:active {
		transform: scale(0.97);
	}
	/* unsupported device: still a working link, but no longer the loud primary */
	.btn.muted {
		background: var(--color-control);
		color: var(--color-ink);
		box-shadow: var(--shadow-control);
	}
	.btn.muted:hover {
		background: var(--color-fill);
	}
	.btn[aria-busy='true'] {
		cursor: progress;
	}
	.btn.disabled {
		background: var(--color-fill);
		color: var(--color-ink-2);
		cursor: default;
	}
	.meta {
		font-size: var(--text-sm);
		color: var(--color-ink-2);
	}
	.ok {
		color: var(--color-ink);
	}
	.warn {
		display: flex;
		gap: var(--space-2xs);
		align-items: flex-start;
		max-width: 46ch;
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-card);
		background: var(--color-warn-bg);
		color: var(--color-warn-ink);
		font-size: var(--text-sm);
	}
	.warn svg {
		flex: none;
		width: 16px;
		height: 16px;
		margin-top: 2px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.warn .mark {
		stroke-linecap: round;
		stroke-width: 1.8;
	}
</style>
