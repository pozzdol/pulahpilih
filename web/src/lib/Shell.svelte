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
	const links = $derived([
		{ href: lang === 'id' ? '/#unduh' : '/en#download', label: t.nav.download },
		{ href: statics.usecase[lang], label: t.nav.usecases },
		{ href: statics.guide[lang], label: t.nav.guides },
		{ href: statics.compare[lang], label: t.nav.compare },
		{ href: statics.releases[lang], label: t.nav.releases },
		{ href: statics.help[lang], label: t.nav.help }
	]);
	// the other language's version of this page, or its home page
	const target = (l: Lang) => alternates[l] ?? statics.home[l];
</script>

<header class="nav">
	<div class="nav-inner">
		<a class="brand" href={home}>
			<img src="/icon.svg" alt="" width="22" height="22" />
			<span>Pulahpilih</span>
		</a>
		<nav aria-label="Pulahpilih">
			{#each links as l (l.href)}
				<a href={l.href} aria-current={path === l.href || path.startsWith(l.href + '/') ? 'page' : undefined}>{l.label}</a>
			{/each}
		</nav>
		<div class="langs" role="group" aria-label="Language">
			{#each langs as l (l)}
				<a href={target(l)} class:on={l === lang} hreflang={l} lang={l}>{l.toUpperCase()}</a>
			{/each}
		</div>
	</div>
</header>

<main>
	{@render children()}
</main>

<footer class="foot">
	<div class="foot-inner">
		<p>© {new Date().getFullYear()} Pulahpilih. <a href={statics.privacy[lang]}>{t.nav.privacy}</a></p>
		<p>
			{t.footer.licenseBody}
			<a href="https://github.com/cloudflare/cloudflared/blob/master/LICENSE">cloudflared</a>,
			<a href="https://github.com/dimsemenov/PhotoSwipe/blob/master/LICENSE">PhotoSwipe</a>
		</p>
		<p><a href="https://github.com/{REPO}">{t.footer.source}</a></p>
	</div>
</footer>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--toolbar);
		backdrop-filter: saturate(180%) blur(20px);
		-webkit-backdrop-filter: saturate(180%) blur(20px);
		border-bottom: 0.5px solid var(--separator);
	}
	.nav-inner {
		max-width: 1080px;
		margin: 0 auto;
		height: 48px;
		padding: 0 16px;
		display: flex;
		align-items: center;
		gap: 24px;
		font-size: 13px;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--label);
		font-weight: 600;
		font-size: 15px;
		text-decoration: none;
		flex: none;
	}
	nav {
		flex: 1;
		display: flex;
		gap: 20px;
		overflow-x: auto;
		scrollbar-width: none;
	}
	nav a {
		color: var(--secondary);
		white-space: nowrap;
	}
	nav a:hover,
	nav a[aria-current='page'] {
		color: var(--label);
		text-decoration: none;
	}
	.langs {
		display: flex;
		flex: none;
		background: var(--fill);
		border-radius: 7px;
		padding: 2px;
	}
	.langs a {
		padding: 1px 8px;
		border-radius: 5px;
		color: var(--secondary);
		font-size: 12px;
		font-weight: 500;
		text-decoration: none;
	}
	.langs a.on {
		background: var(--control);
		color: var(--label);
		box-shadow: var(--shadow-control);
	}
	.foot {
		border-top: 0.5px solid var(--separator);
		margin-top: 96px;
	}
	.foot-inner {
		max-width: 1080px;
		margin: 0 auto;
		padding: 24px 16px 40px;
		display: flex;
		flex-wrap: wrap;
		gap: 8px 32px;
		font-size: 12px;
		color: var(--secondary);
	}
	.foot-inner p:first-child {
		flex: 1;
	}
	@media (max-width: 720px) {
		.nav-inner {
			gap: 12px;
		}
		nav {
			gap: 14px;
		}
		.brand span {
			display: none;
		}
	}
</style>
