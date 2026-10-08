<script lang="ts">
	import { page } from '$app/state';
	import { dict } from '#lib/i18n.ts';

	const lang = $derived(/^\/en(\/|$)/.test(page.url.pathname) ? 'en' : 'id');
	const t = $derived(dict[lang].notFound);
</script>

<svelte:head>
	<title>{t.title} | Pulahpilih</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main>
	<h1>{t.title}</h1>
	<p>{t.body}</p>
	<a href={lang === 'en' ? '/en' : '/'}>{t.home}</a>
</main>

<style>
	main {
		min-height: 70vh;
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
		color: var(--secondary);
	}
</style>
