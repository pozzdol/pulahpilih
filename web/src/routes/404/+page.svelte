<script lang="ts">
	import { dict } from '#lib/i18n.ts';

	// Prerendered to build/404.html, which Cloudflare serves for unknown URLs.
	// Indonesian first (primary audience), English underneath, since the URL tells us nothing.
	const id = dict.id.notFound;
	const en = dict.en.notFound;
</script>

<svelte:head>
	<title>{id.title} | Pulahpilih</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main>
	<img src="/icon.svg" alt="" width="56" height="56" />
	<h1>{id.title}</h1>
	<p>{id.body}</p>
	<a href="/">{id.home}</a>
	<p class="en" lang="en">{en.body} <a href="/en">{en.home}</a></p>
</main>

<style>
	main {
		min-height: 80vh;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 12px;
		text-align: center;
		padding: 16px;
	}
	h1 {
		font-size: 32px;
		font-weight: 700;
	}
	p {
		color: var(--color-ink-2);
	}
	.en {
		margin-top: 24px;
		font-size: 14px;
	}
</style>
