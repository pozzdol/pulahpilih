<script lang="ts">
	import { dict, type Lang } from '../i18n.ts';
	import type { Release } from '../releases.ts';

	let { lang, latest = null, releases = [] }: { lang: Lang; latest?: Release | null; releases?: Release[] } = $props();
	const t = $derived(dict[lang]);
	const date = (iso: string) =>
		new Date(iso).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'long' });
</script>

<article class="doc">
	<h1>{t.releases.title}</h1>
	<p class="lede">{t.releases.lead}</p>

	{#if releases.length}
		<ol class="timeline">
			{#each releases as r (r.version)}
				<li id="v{r.version}">
					<div class="when">
						<h2>{r.version}</h2>
						<time datetime={r.date}>{date(r.date)}</time>
						{#if r.version === latest?.version}<span class="tag latest">{t.releases.latest}</span>{/if}
						{#if r.prerelease}<span class="tag">{t.releases.pre}</span>{/if}
					</div>
					<div class="what">
						{#if r.name && r.name !== `v${r.version}`}<h3>{r.name}</h3>{/if}
						<!-- notes come from our own GitHub release bodies, rendered at build time -->
						<div class="notes">{@html r.notes}</div>
						<p class="links">
							{#if r.installer}<a href={r.installer.url}>{t.releases.download}</a>{/if}
							<a href={r.url}>{t.releases.github}</a>
						</p>
					</div>
				</li>
			{/each}
		</ol>
	{:else}
		<p class="empty">{t.releases.empty}</p>
	{/if}
</article>

<style>
	.doc {
		max-width: 860px;
		margin: 0 auto;
		padding: 72px 16px 0;
	}
	h1 {
		font-size: clamp(32px, 5vw, 48px);
		font-weight: 700;
		letter-spacing: -0.02em;
	}
	.lede {
		margin-top: 12px;
		color: var(--secondary);
		font-size: 19px;
	}
	.timeline {
		list-style: none;
		margin: 48px 0 0;
		padding: 0;
	}
	.timeline li {
		display: grid;
		grid-template-columns: 180px 1fr;
		gap: 24px;
		padding: 32px 0;
		border-top: 0.5px solid var(--separator);
		scroll-margin-top: 64px;
	}
	.when {
		display: grid;
		gap: 4px;
		align-content: start;
		justify-items: start;
	}
	.when h2 {
		font-size: 24px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	time {
		color: var(--secondary);
		font-size: 14px;
	}
	.tag {
		font-size: 12px;
		font-weight: 600;
		padding: 1px 8px;
		border-radius: 9px;
		background: var(--fill);
		color: var(--secondary);
	}
	.tag.latest {
		background: var(--accent);
		color: #fff;
	}
	.what h3 {
		font-size: 19px;
		font-weight: 600;
		margin-bottom: 8px;
	}
	.notes {
		max-width: var(--measure);
	}
	.notes :global(h2),
	.notes :global(h3) {
		font-size: 17px;
		font-weight: 600;
		margin: 16px 0 6px;
	}
	.notes :global(ul) {
		padding-left: 20px;
		margin: 6px 0;
	}
	.notes :global(li) {
		margin: 4px 0;
	}
	.notes :global(p) {
		margin: 8px 0;
	}
	.notes :global(code) {
		font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Consolas, monospace;
		font-size: 0.9em;
		background: var(--fill);
		padding: 1px 5px;
		border-radius: 4px;
	}
	.links {
		margin-top: 16px;
		display: flex;
		gap: 20px;
		font-size: 15px;
	}
	.empty {
		margin-top: 48px;
		color: var(--secondary);
	}
	@media (max-width: 640px) {
		.timeline li {
			grid-template-columns: 1fr;
			gap: 12px;
		}
	}
</style>
