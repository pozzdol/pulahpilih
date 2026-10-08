<script lang="ts">
	import Demo from '#lib/Demo.svelte';
	import { dict } from '#lib/i18n.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const t = $derived(dict[data.lang]);
	const latest = $derived(data.latest);
	const date = (iso: string) =>
		new Date(iso).toLocaleDateString(data.lang === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'long' });
	const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
</script>

<svelte:head>
	<title>{t.meta.title}</title>
	<meta name="description" content={t.meta.description} />
	<meta property="og:title" content={t.meta.title} />
	<meta property="og:description" content={t.meta.description} />
</svelte:head>

<section class="hero">
	<h1>{t.hero.title}</h1>
	<p class="lede">{t.hero.body}</p>
	<div class="cta">
		{#if latest?.installer}
			<a class="btn primary" href={latest.installer.url}>
				{t.hero.download}
				<span>{latest.version}, {mb(latest.installer.size)}</span>
			</a>
			<a href="/{data.lang}/releases">{t.hero.notes}</a>
		{:else}
			<span class="btn disabled" aria-disabled="true">{t.hero.soon}</span>
			<a href="/{data.lang}/releases">{t.hero.notes}</a>
		{/if}
	</div>
	<div class="demo">
		<Demo t={t.demo} />
	</div>
</section>

<section class="how">
	<h2>{t.how.title}</h2>
	<ol>
		{#each t.how.steps as s, i (s.title)}
			<li>
				<span class="num" aria-hidden="true">{i + 1}</span>
				<h3>{s.title}</h3>
				<p>{s.body}</p>
			</li>
		{/each}
	</ol>
</section>

<section class="features">
	<h2>{t.features.title}</h2>
	<dl>
		{#each t.features.list as f (f.title)}
			<div>
				<dt>{f.title}</dt>
				<dd>{f.body}</dd>
			</div>
		{/each}
	</dl>
</section>

<section class="download" id="download">
	<div class="panel">
		<img src="/icon.svg" alt="" width="72" height="72" />
		<div class="panel-body">
			<h2>{t.downloadSection.title}</h2>
			{#if latest?.installer}
				<p class="meta">
					{t.downloadSection.version(latest.version)}<br />
					{t.downloadSection.released} {date(latest.date)}<br />
					{t.downloadSection.size} {mb(latest.installer.size)}<br />
					{t.downloadSection.requires}
				</p>
				<a class="btn primary" href={latest.installer.url}>{t.downloadSection.button}</a>
			{:else}
				<p class="meta">{t.downloadSection.none}</p>
			{/if}
			<p class="small">{t.downloadSection.updates}</p>
		</div>
	</div>
	<details class="smartscreen">
		<summary>{t.downloadSection.smartTitle}</summary>
		<p>{t.downloadSection.smartBody}</p>
	</details>
</section>

<style>
	section {
		max-width: 1080px;
		margin: 0 auto;
		padding: 0 16px;
	}
	.hero {
		padding-top: 88px;
		text-align: center;
	}
	h1 {
		font-size: clamp(36px, 6vw, 64px);
		line-height: 1.05;
		font-weight: 700;
		letter-spacing: -0.025em;
		max-width: 16ch;
		margin: 0 auto;
		text-wrap: balance;
	}
	.lede {
		margin: 20px auto 0;
		max-width: 46ch;
		font-size: clamp(18px, 2.2vw, 21px);
		color: var(--secondary);
		text-wrap: pretty;
	}
	.cta {
		margin-top: 32px;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 12px 24px;
	}
	.btn {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		padding: 11px 22px;
		border-radius: 980px;
		font-size: 17px;
		font-weight: 500;
		text-decoration: none;
	}
	.btn span {
		font-size: 12px;
		font-weight: 400;
		opacity: 0.8;
	}
	.btn.primary {
		background: var(--accent);
		color: #fff;
	}
	.btn.primary:hover {
		background: var(--accent-hover);
		text-decoration: none;
	}
	.btn.disabled {
		background: var(--fill);
		color: var(--secondary);
	}
	.demo {
		margin: 56px auto 0;
		max-width: 920px;
	}

	h2 {
		font-size: clamp(28px, 4vw, 40px);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}
	.how {
		margin-top: 120px;
	}
	ol {
		list-style: none;
		padding: 0;
		margin: 32px 0 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 32px;
		/* the steps are a real sequence; a hairline ties them into one path */
		border-top: 0.5px solid var(--separator);
		padding-top: 28px;
	}
	.num {
		display: inline-grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--accent);
		color: #fff;
		font-size: 14px;
		font-weight: 600;
	}
	ol h3 {
		margin-top: 12px;
		font-size: 19px;
		font-weight: 600;
	}
	ol p {
		margin-top: 6px;
		color: var(--secondary);
		max-width: 34ch;
	}
	.features {
		margin-top: 120px;
	}
	dl {
		margin: 32px 0 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 28px 48px;
	}
	dt {
		font-weight: 600;
	}
	dd {
		margin: 4px 0 0;
		color: var(--secondary);
		max-width: 44ch;
	}
	.download {
		margin-top: 120px;
		scroll-margin-top: 72px;
	}
	.panel {
		display: flex;
		gap: 24px;
		align-items: flex-start;
		background: var(--content);
		border-radius: 18px;
		padding: 32px;
		box-shadow: var(--shadow-photo);
	}
	.panel-body {
		display: grid;
		gap: 16px;
		justify-items: start;
	}
	.meta {
		color: var(--secondary);
		font-size: 15px;
		line-height: 1.7;
	}
	.small {
		color: var(--secondary);
		font-size: 13px;
	}
	.smartscreen {
		margin-top: 16px;
		padding: 0 32px;
		color: var(--secondary);
		font-size: 15px;
		max-width: var(--measure);
	}
	summary {
		cursor: pointer;
		color: var(--label);
	}
	.smartscreen p {
		margin-top: 8px;
	}
	@media (max-width: 640px) {
		.hero {
			padding-top: 48px;
		}
		.panel {
			flex-direction: column;
			padding: 24px;
		}
		.smartscreen {
			padding: 0 8px;
		}
	}
</style>
