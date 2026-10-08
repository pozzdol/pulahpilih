<script lang="ts">
	import { page } from '$app/state';
	import { dict, langs } from '#lib/i18n.ts';
	import { REPO } from '#lib/releases.ts';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
	const t = $derived(dict[data.lang]);
	const base = $derived(`/${data.lang}`);
	// same page in the other language
	const switchTo = (l: string) => page.url.pathname.replace(/^\/(id|en)/, `/${l}`);
	const links = $derived([
		{ href: `${base}#download`, label: t.nav.download },
		{ href: `${base}/releases`, label: t.nav.releases },
		{ href: `${base}/docs`, label: t.nav.docs },
		{ href: `${base}/privacy`, label: t.nav.privacy }
	]);
</script>

<svelte:head>
	{#each langs as l (l)}
		<link rel="alternate" hreflang={l} href={switchTo(l)} />
	{/each}
</svelte:head>

<header class="nav">
	<div class="nav-inner">
		<a class="brand" href={base}>
			<img src="/icon.svg" alt="" width="22" height="22" />
			Photo Sorter
		</a>
		<nav aria-label="Photo Sorter">
			{#each links as l (l.href)}
				<a href={l.href} aria-current={page.url.pathname === l.href ? 'page' : undefined}>{l.label}</a>
			{/each}
		</nav>
		<div class="langs" role="group" aria-label="Language">
			{#each langs as l (l)}
				<a href={switchTo(l)} class:on={l === data.lang} hreflang={l} lang={l}>{l.toUpperCase()}</a>
			{/each}
		</div>
	</div>
</header>

<main>
	{@render children()}
</main>

<footer class="foot">
	<div class="foot-inner">
		<p>© {new Date().getFullYear()} Photo Sorter</p>
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
	}
	nav {
		flex: 1;
		display: flex;
		gap: 20px;
	}
	nav a {
		color: var(--secondary);
	}
	nav a:hover,
	nav a[aria-current='page'] {
		color: var(--label);
		text-decoration: none;
	}
	.langs {
		display: flex;
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
	@media (max-width: 640px) {
		.nav-inner {
			gap: 12px;
		}
		nav {
			gap: 12px;
			overflow-x: auto;
		}
		.brand {
			font-size: 0;
			gap: 0;
		}
	}
</style>
