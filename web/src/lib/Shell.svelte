<script lang="ts">
	import type { Snippet } from 'svelte';
	import { dict, langs, type Lang } from './i18n.ts';
	import { statics } from './pages.ts';
	import { REPO } from './site.ts';

	let {
		lang,
		path,
		alternates,
		children
	}: { lang: Lang; path: string; alternates: Partial<Record<Lang, string>>; children: Snippet } = $props();

	const t = $derived(dict[lang]);
	const home = $derived(statics.home[lang]);
	const download = $derived(lang === 'id' ? '/#unduh' : '/en#download');
	const links = $derived([
		{ href: statics.usecase[lang], label: t.nav.usecases },
		{ href: statics.guide[lang], label: t.nav.guides },
		{ href: statics.compare[lang], label: t.nav.compare },
		{ href: statics.releases[lang], label: t.nav.releases },
		{ href: statics.help[lang], label: t.nav.help }
	]);
	// the other language's version of this page, or its home page
	const target = (l: Lang) => alternates[l] ?? statics.home[l];
	const current = (href: string) => path === href || path.startsWith(href + '/');
</script>

<header class="nav-wrap">
	<nav class="nav" aria-label="Pulahpilih">
		<a class="brand" href={home} aria-label="Pulahpilih">
			<img src="/icon.svg" alt="" width="24" height="24" />
			<span>Pulahpilih</span>
		</a>
		<div class="links">
			{#each links as l (l.href)}
				<a href={l.href} aria-current={current(l.href) ? 'page' : undefined}>{l.label}</a>
			{/each}
		</div>
		<div class="langs" role="group" aria-label="Language">
			{#each langs as l (l)}
				<a href={target(l)} class:on={l === lang} hreflang={l} lang={l}>{l.toUpperCase()}</a>
			{/each}
		</div>
		<a class="get" href={download}>{t.nav.download}</a>
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer class="foot">
	<p class="sign"><strong>Pulahpilih</strong> {t.footer.tagline}</p>
	<p class="foot-links">
		<a href={statics.privacy[lang]}>{t.nav.privacy}</a>
		<a href="https://github.com/{REPO}">GitHub</a>
		<a href="https://github.com/{REPO}/blob/main/LICENSE">GPL-3.0</a>
		{#each langs.filter((l) => l !== lang) as l (l)}
			<a href={target(l)} hreflang={l} lang={l}>{dict[l].langName}</a>
		{/each}
		<span>{t.footer.licenseBody}</span>
	</p>
</footer>

<style>
	.nav-wrap {
		position: sticky;
		top: var(--space-xs);
		z-index: 10;
		display: flex;
		justify-content: center;
		padding: 0 var(--space-sm);
		margin-top: var(--space-xs);
	}
	/* N5 floating pill: content-sized, solid surface (no glass), like an app toolbar control */
	.nav {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		max-width: 100%;
		min-width: 0;
		padding: var(--space-3xs) var(--space-3xs) var(--space-3xs) var(--space-sm);
		background: var(--color-surface);
		border-radius: var(--radius-pill);
		box-shadow: var(--shadow-control), var(--shadow-card);
		font-size: var(--text-sm);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		color: var(--color-ink);
		font-weight: 600;
		white-space: nowrap;
		flex: none;
	}
	.brand:hover {
		text-decoration: none;
	}
	.links {
		display: flex;
		gap: var(--space-sm);
		min-width: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}
	.links a {
		color: var(--color-ink-2);
		white-space: nowrap;
	}
	.links a:hover,
	.links a[aria-current='page'] {
		color: var(--color-ink);
		text-decoration: none;
	}
	.langs {
		display: flex;
		flex: none;
		background: var(--color-fill);
		border-radius: var(--radius-pill);
		padding: 2px;
	}
	.langs a {
		padding: 2px var(--space-2xs);
		border-radius: var(--radius-pill);
		color: var(--color-ink-2);
		font-size: var(--text-xs);
		font-weight: 600;
		white-space: nowrap;
	}
	.langs a:hover {
		text-decoration: none;
		color: var(--color-ink);
	}
	.langs a.on {
		background: var(--color-control);
		color: var(--color-ink);
		box-shadow: var(--shadow-control);
	}
	.get {
		flex: none;
		background: var(--color-accent-fill);
		color: var(--color-accent-ink);
		font-weight: 600;
		padding: var(--space-2xs) var(--space-sm);
		border-radius: var(--radius-pill);
		white-space: nowrap;
		transition: background-color var(--dur-short) var(--ease-out);
	}
	.get:hover {
		background: var(--color-accent-fill-hover);
		text-decoration: none;
	}
	.get:active {
		transform: scale(0.97);
	}

	/* Ft2: one line, hairline above */
	.foot {
		max-width: var(--page);
		margin: var(--space-3xl) auto 0;
		padding: var(--space-md) var(--space-sm) var(--space-xl);
		border-top: 1px solid var(--color-rule);
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--space-2xs) var(--space-lg);
		font-size: var(--text-xs);
		color: var(--color-ink-2);
	}
	.sign strong {
		color: var(--color-ink);
	}
	.foot-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) var(--space-md);
	}
	.foot-links a {
		white-space: nowrap;
	}

	@media (max-width: 760px) {
		.brand span {
			display: none;
		}
		.nav {
			gap: var(--space-xs);
			padding-left: var(--space-xs);
		}
	}
	@media (max-width: 420px) {
		.langs {
			display: none;
		}
	}
</style>
