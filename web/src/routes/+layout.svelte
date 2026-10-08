<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	/* Same tokens as the desktop app, so the site and the app read as one product. */
	:global(:root) {
		--window: #f5f5f7;
		--content: #ffffff;
		--control: #ffffff;
		--label: #1d1d1f;
		--secondary: #6e6e73;
		--tertiary: #aeaeb2;
		--separator: rgba(0, 0, 0, 0.1);
		--fill: rgba(0, 0, 0, 0.05);
		--accent: #007aff;
		--accent-hover: #0066d6;
		--green: #34c759;
		--red: #ff3b30;
		--toolbar: rgba(246, 246, 246, 0.82);
		--shadow-control: 0 0.5px 1px rgba(0, 0, 0, 0.18), 0 0 0 0.5px rgba(0, 0, 0, 0.08);
		--shadow-window: 0 0 0 0.5px rgba(0, 0, 0, 0.12), 0 22px 70px rgba(0, 0, 0, 0.18);
		--shadow-photo: 0 1px 3px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06);
		--measure: 68ch;
		color-scheme: light dark;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif;
	}
	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--window: #161617;
			--content: #232325;
			--control: #3a3a3c;
			--label: #f5f5f7;
			--secondary: #a1a1a6;
			--tertiary: #636366;
			--separator: rgba(255, 255, 255, 0.12);
			--fill: rgba(255, 255, 255, 0.07);
			--accent: #0a84ff;
			--accent-hover: #3d9bff;
			--green: #30d158;
			--red: #ff453a;
			--toolbar: rgba(36, 36, 38, 0.82);
			--shadow-control: 0 0.5px 1px rgba(0, 0, 0, 0.5), 0 0 0 0.5px rgba(255, 255, 255, 0.08);
			--shadow-window: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 22px 70px rgba(0, 0, 0, 0.55);
			--shadow-photo: 0 1px 3px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.3);
		}
	}
	:global(body) {
		margin: 0;
		background: var(--window);
		color: var(--label);
		font-size: 17px;
		line-height: 1.47;
		-webkit-font-smoothing: antialiased;
	}
	:global(a) {
		color: var(--accent);
		text-decoration: none;
	}
	:global(a:hover) {
		text-decoration: underline;
	}
	:global(*:focus-visible) {
		outline: 3px solid color-mix(in srgb, var(--accent) 50%, transparent);
		outline-offset: 2px;
		border-radius: 4px;
	}
	:global(h1, h2, h3, p) {
		margin: 0;
	}
	@media (prefers-reduced-motion: reduce) {
		:global(*) {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
