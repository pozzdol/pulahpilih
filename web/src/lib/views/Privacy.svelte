<script lang="ts">
	import { dict, type Lang } from '../i18n.ts';
	import type { Release } from '../releases.ts';

	let { lang, latest = null, releases = [] }: { lang: Lang; latest?: Release | null; releases?: Release[] } = $props();
	const t = $derived(dict[lang]);
</script>

<article class="doc">
	<h1>{t.privacy.title}</h1>
	<p class="lede">{t.privacy.lead}</p>
	{#each t.privacy.points as p (p.title)}
		<section>
			<h2>{p.title}</h2>
			<p>{p.body}</p>
		</section>
	{/each}
</article>

<style>
	.doc {
		max-width: 760px;
		margin: 0 auto;
		padding: 72px 16px 0;
	}
	h1 {
		font-size: clamp(32px, 5vw, 48px);
		font-weight: 700;
		letter-spacing: -0.02em;
	}
	.lede {
		margin-top: 12px;
		font-size: 21px;
		max-width: 40ch;
	}
	section {
		margin-top: 36px;
		max-width: var(--measure);
	}
	h2 {
		font-size: 19px;
		font-weight: 600;
	}
	section p {
		margin-top: 6px;
		color: var(--color-ink-2);
	}
</style>
