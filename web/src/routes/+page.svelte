<script lang="ts">
	import { onMount } from 'svelte';

	// Root sends visitors to their language; the links are for no-JS visitors and the prerender crawler.
	onMount(() => {
		location.replace(navigator.language.toLowerCase().startsWith('id') ? '/id' : '/en');
	});
</script>

<svelte:head>
	<title>Photo Sorter</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="pick">
	<a href="/id">Bahasa Indonesia</a>
	<a href="/en">English</a>
</main>

<style>
	.pick {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 24px;
	}
</style>
