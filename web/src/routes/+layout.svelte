<script lang="ts">
	import '#lib/tokens.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(html),
	:global(body) {
		overflow-x: clip;
	}
	:global(body) {
		margin: 0;
		background: var(--color-paper);
		color: var(--color-ink);
		font-family: var(--font-body);
		font-size: var(--text-base);
		line-height: 1.47;
		-webkit-font-smoothing: antialiased;
	}
	:global(h1, h2, h3) {
		font-family: var(--font-display);
		font-style: normal;
		margin: 0;
		overflow-wrap: anywhere;
		min-width: 0;
	}
	:global(p) {
		margin: 0;
	}
	:global(a) {
		color: var(--color-link);
		text-decoration: none;
	}
	:global(a:hover) {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	:global(*:focus-visible) {
		outline: 3px solid var(--color-focus);
		outline-offset: 2px;
	}
	:global(kbd) {
		font-family: var(--font-body);
	}
	@media (prefers-reduced-motion: reduce) {
		:global(*) {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
