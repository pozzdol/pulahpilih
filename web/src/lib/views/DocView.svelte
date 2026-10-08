<script lang="ts">
	import type { Doc } from '../content.ts';
	import { dict } from '../i18n.ts';

	let {
		doc,
		crumbs,
		related
	}: { doc: Doc; crumbs: { name: string; path: string }[]; related: Doc[] } = $props();
	const t = $derived(dict[doc.lang]);
	const date = (iso: string) =>
		new Date(iso).toLocaleDateString(doc.lang === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'long' });
</script>

<article class="doc">
	<nav class="crumbs" aria-label="Breadcrumb">
		{#each crumbs.slice(0, -1) as c (c.path)}
			<a href={c.path}>{c.name}</a><span aria-hidden="true">/</span>
		{/each}
	</nav>
	<h1>{doc.title}</h1>
	<p class="meta">
		{t.doc.updated} <time datetime={doc.updated}>{date(doc.updated)}</time>
	</p>
	<!-- our own markdown from src/content, rendered at build time -->
	<div class="prose">{@html doc.html}</div>

	<aside class="cta">
		<img src="/icon.svg" alt="" width="48" height="48" />
		<div>
			<strong>{t.doc.ctaTitle}</strong>
			<p>{t.doc.ctaBody}</p>
		</div>
		<a class="btn" href={doc.lang === 'id' ? '/#unduh' : '/en#download'}>{t.doc.ctaButton}</a>
	</aside>

	{#if related.length}
		<section class="related">
			<h2>{t.doc.related}</h2>
			<ul>
				{#each related as r (r.path)}
					<li><a href={r.path}>{r.title}</a></li>
				{/each}
			</ul>
		</section>
	{/if}
</article>

<style>
	.doc {
		max-width: 720px;
		margin: 0 auto;
		padding: 48px 16px 0;
	}
	.crumbs {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		font-size: 14px;
		color: var(--tertiary);
	}
	h1 {
		margin-top: 16px;
		font-size: clamp(32px, 5vw, 44px);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.12;
		text-wrap: balance;
	}
	.meta {
		margin-top: 12px;
		color: var(--secondary);
		font-size: 14px;
	}
	.prose {
		margin-top: 32px;
		font-size: 18px;
		line-height: 1.6;
	}
	.prose :global(p),
	.prose :global(ul),
	.prose :global(ol) {
		margin: 0 0 1em;
	}
	.prose :global(ul),
	.prose :global(ol) {
		padding-left: 1.3em;
	}
	.prose :global(li) {
		margin: 0.3em 0;
	}
	.prose :global(h2) {
		margin: 1.8em 0 0.5em;
		font-size: 26px;
		font-weight: 700;
		letter-spacing: -0.015em;
		line-height: 1.2;
	}
	.prose :global(h3) {
		margin: 1.4em 0 0.4em;
		font-size: 20px;
		font-weight: 600;
	}
	.prose :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.2em 0 1.6em;
		font-size: 15px;
		display: block;
		overflow-x: auto;
	}
	.prose :global(th),
	.prose :global(td) {
		text-align: left;
		vertical-align: top;
		padding: 10px 12px;
		border-bottom: 0.5px solid var(--separator);
	}
	.prose :global(th) {
		font-weight: 600;
		background: var(--fill);
	}
	.prose :global(code) {
		font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Consolas, monospace;
		font-size: 0.88em;
		background: var(--fill);
		padding: 1px 5px;
		border-radius: 4px;
	}
	.prose :global(blockquote) {
		margin: 1.2em 0;
		padding: 0 0 0 16px;
		border-left: 3px solid var(--accent);
		color: var(--secondary);
	}
	.cta {
		margin-top: 48px;
		display: flex;
		align-items: center;
		gap: 16px;
		background: var(--content);
		border-radius: 14px;
		padding: 20px 24px;
		box-shadow: var(--shadow-photo);
	}
	.cta div {
		flex: 1;
	}
	.cta p {
		color: var(--secondary);
		font-size: 15px;
	}
	.btn {
		background: var(--accent);
		color: #fff;
		padding: 9px 18px;
		border-radius: 980px;
		font-weight: 500;
		white-space: nowrap;
	}
	.btn:hover {
		background: var(--accent-hover);
		text-decoration: none;
	}
	.related {
		margin-top: 48px;
	}
	.related h2 {
		font-size: 19px;
		font-weight: 600;
	}
	.related ul {
		padding-left: 1.2em;
		margin-top: 10px;
	}
	.related li {
		margin: 6px 0;
	}
	@media (max-width: 560px) {
		.cta {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
