<script lang="ts">
	/* Hallmark · genre: modern-minimal · macrostructure: Split Studio · design-system: design.md · designed-as-app */
	import { onMount } from 'svelte';
	import Demo from '../Demo.svelte';
	import DownloadButton from '../DownloadButton.svelte';
	import Scene from '../Scene.svelte';
	import { dict, type Lang } from '../i18n.ts';
	import { fetchLatest } from '../latest.ts';
	import type { Release } from '../releases.ts';
	import type { Doc } from '../content.ts';
	import { statics } from '../pages.ts';
	import { AUTHOR, FORMATS } from '../site.ts';

	let { lang, latest = null, usecases = [] }: { lang: Lang; latest?: Release | null; usecases?: Doc[] } = $props();
	const t = $derived(dict[lang]);

	// prerendered data first; ask GitHub only when the build predates the release
	let fetched = $state<Release | null>(null);
	const release = $derived(latest ?? fetched);
	onMount(async () => {
		if (!latest) fetched = await fetchLatest();
	});

	const date = (iso: string) =>
		new Date(iso).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'long' });
	const raws = FORMATS.filter((f) => !['JPG', 'PNG', 'WebP'].includes(f));
	const shareVotes = [
		{ seed: 3, votes: 3 },
		{ seed: 6, votes: 2 },
		{ seed: 2, votes: 0 }
	];
</script>

<!-- Split hero: claim + download on the left, the working sorter on the right -->
<section class="hero">
	<div class="hero-text">
		<h1>{t.hero.title}</h1>
		<p class="lede">{t.hero.body}</p>
		<DownloadButton {lang} {release} soonLabel={t.hero.soon} />
		<p class="hero-links">
			<a href={statics.releases[lang]}>{t.hero.notes}</a>
			<a href={statics.help[lang]}>{t.nav.help}</a>
		</p>
	</div>
	<div class="hero-proof">
		<Demo t={t.demo} />
	</div>
</section>

<!-- Diptychs: each claim gets its proof on the opposite half, alternating sides -->
<section class="row">
	<div class="text">
		<h2>{t.split.keys.title}</h2>
		<p>{t.split.keys.body}</p>
	</div>
	<ul class="proof keys" aria-label={t.split.keys.title}>
		{#each t.split.keys.keys as k (k.key)}
			<li><kbd>{k.key}</kbd><span>{k.label}</span></li>
		{/each}
	</ul>
</section>

<section class="row flip">
	<div class="text">
		<h2>{t.split.rounds.title}</h2>
		<p>{t.split.rounds.body}</p>
		<ol class="steps">
			{#each t.how.steps as s (s.title)}
				<li><strong>{s.title}.</strong> {s.body}</li>
			{/each}
		</ol>
	</div>
	<figure class="proof counts">
		<figcaption>{t.split.rounds.example}</figcaption>
		<ol>
			{#each t.split.rounds.counts as c, i (c.label)}
				<li class:final={i === t.split.rounds.counts.length - 1}>
					<b>{c.n}</b><span>{c.label}</span>
				</li>
			{/each}
		</ol>
	</figure>
</section>

<section class="row">
	<div class="text">
		<h2>{t.split.share.title}</h2>
		<p>{t.split.share.body}</p>
		<p><a href={lang === 'id' ? '/artikel/minta-bantuan-memilih-foto' : '/en/articles/get-help-picking-photos'}>{t.doc.related}: {t.split.share.title}</a></p>
	</div>
	<figure class="proof share">
		<div class="share-fields">
			<div>
				<span class="label">{t.split.share.link}</span>
				<code>https://…trycloudflare.com/?t=…</code>
			</div>
			<div>
				<span class="label">{t.split.share.pin}</span>
				<span class="pin">4821</span>
			</div>
		</div>
		<ul class="votes">
			{#each shareVotes as v (v.seed)}
				<li class:on={v.votes > 0}>
					<div class="thumb"><Scene seed={v.seed} /></div>
					<span>{v.votes} {t.split.share.votes}</span>
				</li>
			{/each}
		</ul>
		<figcaption>{t.split.share.note}</figcaption>
	</figure>
</section>

<section class="row flip">
	<div class="text">
		<h2>{t.split.raw.title}</h2>
		<p>{t.split.raw.body}</p>
		<p><a href={lang === 'id' ? '/artikel/sortir-foto-raw-di-windows' : '/en/articles/sort-raw-photos-on-windows'}>{t.doc.related}: {t.split.raw.title}</a></p>
	</div>
	<figure class="proof raw">
		<div class="pair">
			<span>DSC_0412.ARW</span>
			<span aria-hidden="true">+</span>
			<span>DSC_0412.JPG</span>
		</div>
		<ul class="chips">
			{#each raws as f (f)}<li>{f}</li>{/each}
		</ul>
	</figure>
</section>

<section class="also">
	<h2>{t.alsoTitle}</h2>
	<dl>
		{#each t.features.list.filter((_, i) => i >= 4) as f (f.title)}
			<div>
				<dt>{f.title}</dt>
				<dd>{f.body}</dd>
			</div>
		{/each}
	</dl>
</section>

<section class="facts">
	<h2>{t.facts.title}</h2>
	<dl>
		<div><dt>{t.facts.price}</dt><dd>{t.facts.priceValue}</dd></div>
		<div><dt>{t.facts.license}</dt><dd>{t.facts.licenseValue}</dd></div>
		<div><dt>{t.facts.system}</dt><dd>{t.facts.systemValue}</dd></div>
		<div><dt>{t.facts.formats}</dt><dd>{FORMATS.join(', ')}</dd></div>
		<div><dt>{t.facts.language}</dt><dd>{t.facts.languageValue}</dd></div>
		{#if release}<div><dt>{t.facts.version}</dt><dd>{release.version}</dd></div>{/if}
		<div><dt>{t.facts.maker}</dt><dd><a href={AUTHOR.url}>{AUTHOR.name}</a></dd></div>
	</dl>
</section>

{#if usecases.length}
	<section class="usecases">
		<h2>{t.usecaseSection.title}</h2>
		<ul>
			{#each usecases as d (d.path)}
				<li><a href={d.path}><strong>{d.title}</strong><span>{d.description}</span></a></li>
			{/each}
		</ul>
		<p><a href={statics.usecase[lang]}>{t.usecaseSection.more}</a></p>
	</section>
{/if}

<section class="row download" id={lang === 'id' ? 'unduh' : 'download'}>
	<div class="text">
		<h2>{t.downloadSection.title}</h2>
		<p>{t.downloadSection.updates}</p>
		<details>
			<summary>{t.downloadSection.smartTitle}</summary>
			<p>{t.downloadSection.smartBody}</p>
		</details>
	</div>
	<div class="proof panel">
		<img src="/icon.svg" alt="" width="64" height="64" />
		{#if release}
			<p class="panel-meta">
				{t.downloadSection.version(release.version)}<br />
				{t.downloadSection.released} {date(release.date)}<br />
				{t.downloadSection.requires}
			</p>
		{:else}
			<p class="panel-meta">{t.downloadSection.none}</p>
		{/if}
		<DownloadButton {lang} {release} soonLabel={t.hero.soon} />
	</div>
</section>

<style>
	section {
		max-width: var(--page);
		margin: 0 auto;
		padding: 0 var(--space-sm);
	}
	h1 {
		font-size: var(--text-display);
		line-height: 1.04;
		font-weight: 700;
		letter-spacing: -0.03em;
		text-wrap: balance;
	}
	h2 {
		font-size: var(--text-2xl);
		line-height: 1.12;
		font-weight: 700;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	/* hero: two halves, text slightly narrower than the proof */
	.hero {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: var(--space-xl);
		align-items: center;
		padding-top: var(--space-2xl);
	}
	.hero-text {
		display: grid;
		gap: var(--space-md);
		justify-items: start;
		min-width: 0;
	}
	.lede {
		font-size: var(--text-md);
		color: var(--color-ink-2);
		max-width: 40ch;
		text-wrap: pretty;
	}
	.hero-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) var(--space-md);
		font-size: var(--text-sm);
	}
	.hero-links a {
		white-space: nowrap;
	}
	.hero-proof {
		min-width: 0;
	}

	/* diptych rows */
	.row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: var(--space-xl);
		align-items: center;
		margin-top: var(--space-3xl);
	}
	.row.flip .text {
		order: 2;
	}
	.text {
		display: grid;
		gap: var(--space-sm);
		align-content: start;
		min-width: 0;
	}
	.text > p {
		color: var(--color-ink-2);
		max-width: 46ch;
	}
	.proof {
		margin: 0;
		min-width: 0;
		background: var(--color-surface);
		border-radius: var(--radius-card);
		box-shadow: var(--shadow-card);
		padding: var(--space-lg);
	}
	figcaption {
		font-size: var(--text-xs);
		color: var(--color-ink-2);
	}

	.keys {
		list-style: none;
		display: grid;
		gap: var(--space-sm);
	}
	.keys li {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}
	kbd {
		display: inline-grid;
		place-items: center;
		min-width: 44px;
		height: 32px;
		padding: 0 var(--space-2xs);
		border-radius: var(--radius-control);
		background: var(--color-control);
		box-shadow: var(--shadow-control);
		font-size: var(--text-sm);
		font-weight: 600;
	}
	.keys li:nth-child(1) kbd {
		background: var(--color-pick);
		color: var(--color-on-signal);
	}
	.keys li:nth-child(2) kbd {
		background: var(--color-reject);
		color: var(--color-on-signal);
	}

	.steps {
		margin: var(--space-2xs) 0 0;
		padding-left: 1.2em;
		display: grid;
		gap: var(--space-2xs);
		color: var(--color-ink-2);
		font-size: var(--text-sm);
		max-width: 50ch;
	}
	.steps strong {
		color: var(--color-ink);
	}
	.counts ol {
		list-style: none;
		margin: var(--space-sm) 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-sm);
	}
	.counts li {
		display: grid;
		gap: var(--space-3xs);
		padding: var(--space-sm);
		border-radius: var(--radius-control);
		background: var(--color-fill);
	}
	.counts li.final {
		background: var(--color-accent-fill);
		color: var(--color-accent-ink);
	}
	.counts b {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.02em;
	}
	.counts span {
		font-size: var(--text-xs);
		opacity: 0.8;
	}

	.share {
		display: grid;
		gap: var(--space-md);
	}
	.share-fields {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: var(--space-md);
		align-items: end;
	}
	.share-fields > div {
		display: grid;
		gap: var(--space-3xs);
		min-width: 0;
	}
	.label {
		font-size: var(--text-xs);
		color: var(--color-ink-2);
		font-weight: 500;
	}
	.share code {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		padding: var(--space-2xs) var(--space-xs);
		border-radius: var(--radius-control);
		background: var(--color-fill);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.pin {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		font-weight: 600;
		letter-spacing: 0.25em;
		font-variant-numeric: tabular-nums;
	}
	.votes {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-xs);
	}
	.votes li {
		display: grid;
		gap: var(--space-3xs);
		font-size: var(--text-xs);
		color: var(--color-ink-3);
	}
	.votes li.on {
		color: var(--color-link);
		font-weight: 600;
	}
	.thumb {
		aspect-ratio: 4 / 3;
		border-radius: var(--radius-control);
		overflow: hidden;
		outline: 3px solid transparent;
		outline-offset: 1px;
	}
	.votes li.on .thumb {
		outline-color: var(--color-accent);
	}

	.raw {
		display: grid;
		gap: var(--space-md);
	}
	.pair {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2xs);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
	}
	.pair span:not([aria-hidden]) {
		padding: var(--space-2xs) var(--space-xs);
		border-radius: var(--radius-control);
		background: var(--color-fill);
	}
	.pair span[aria-hidden] {
		color: var(--color-ink-3);
	}
	.chips {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs);
	}
	.chips li {
		padding: var(--space-3xs) var(--space-xs);
		border-radius: var(--radius-pill);
		box-shadow: inset 0 0 0 1px var(--color-rule);
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.also,
	.facts,
	.usecases {
		margin-top: var(--space-3xl);
	}
	.also dl {
		margin: var(--space-md) 0 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
		gap: var(--space-md) var(--space-xl);
	}
	.also dt {
		font-weight: 600;
	}
	.also dd {
		margin: var(--space-3xs) 0 0;
		color: var(--color-ink-2);
		max-width: 46ch;
	}
	.facts dl {
		margin: var(--space-md) 0 0;
		background: var(--color-surface);
		border-radius: var(--radius-card);
		box-shadow: 0 0 0 1px var(--color-rule);
	}
	.facts dl div {
		display: grid;
		grid-template-columns: minmax(0, 200px) minmax(0, 1fr);
		gap: var(--space-sm);
		padding: var(--space-xs) var(--space-md);
	}
	.facts dl div + div {
		border-top: 1px solid var(--color-rule);
	}
	.facts dt {
		color: var(--color-ink-2);
	}
	.facts dd {
		margin: 0;
	}
	.usecases ul {
		list-style: none;
		margin: var(--space-md) 0 var(--space-sm);
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
		gap: var(--space-md) var(--space-lg);
	}
	.usecases a strong {
		display: block;
		color: var(--color-ink);
	}
	.usecases a span {
		display: block;
		margin-top: var(--space-3xs);
		color: var(--color-ink-2);
		font-size: var(--text-sm);
	}
	.usecases li a:hover {
		text-decoration: none;
	}
	.usecases li a:hover strong {
		color: var(--color-link);
	}

	.download {
		scroll-margin-top: var(--space-3xl);
		align-items: start;
	}
	.panel {
		display: grid;
		gap: var(--space-md);
		justify-items: start;
	}
	.panel-meta {
		color: var(--color-ink-2);
		font-size: var(--text-sm);
		line-height: 1.7;
	}
	details {
		color: var(--color-ink-2);
		font-size: var(--text-sm);
		max-width: 46ch;
	}
	summary {
		cursor: pointer;
		color: var(--color-ink);
		font-weight: 500;
	}
	details p {
		margin-top: var(--space-2xs);
	}

	@media (max-width: 860px) {
		.hero,
		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: var(--space-lg);
		}
		/* text always leads on one column, whichever side it sat on */
		.row.flip .text {
			order: 0;
		}
		.hero {
			padding-top: var(--space-xl);
		}
	}
	@media (max-width: 480px) {
		.proof {
			padding: var(--space-md);
		}
		.counts ol {
			grid-template-columns: minmax(0, 1fr);
		}
		.share-fields,
		.facts dl div {
			grid-template-columns: minmax(0, 1fr);
			gap: var(--space-3xs);
		}
	}
</style>
