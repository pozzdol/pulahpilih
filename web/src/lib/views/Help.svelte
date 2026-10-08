<script lang="ts">
	import { dict, type Lang } from '../i18n.ts';
	import type { Release } from '../releases.ts';

	let { lang, latest = null, releases = [] }: { lang: Lang; latest?: Release | null; releases?: Release[] } = $props();
	const t = $derived(dict[lang]);
</script>

<article class="doc">
	<h1>{t.docs.title}</h1>
	<p class="lede">{t.docs.lead}</p>
	<div class="faq">
		{#each t.docs.faq as item, i (item.q)}
			<details open={i === 0}>
				<summary>{item.q}</summary>
				<p>{item.a}</p>
			</details>
		{/each}
	</div>
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
		color: var(--color-ink-2);
		font-size: 19px;
	}
	.faq {
		margin-top: 40px;
		background: var(--color-surface);
		border-radius: 12px;
		box-shadow: 0 0 0 0.5px var(--color-rule);
	}
	details + details {
		border-top: 0.5px solid var(--color-rule);
	}
	summary {
		padding: 16px 20px;
		font-weight: 600;
		cursor: pointer;
		list-style: none;
		display: flex;
		justify-content: space-between;
		gap: 16px;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary::after {
		content: '';
		width: 8px;
		height: 8px;
		margin-top: 6px;
		flex: none;
		border-right: 2px solid var(--color-ink-3);
		border-bottom: 2px solid var(--color-ink-3);
		transform: rotate(45deg);
		transition: transform 0.15s;
	}
	details[open] summary::after {
		transform: rotate(-135deg);
	}
	details p {
		padding: 0 20px 18px;
		color: var(--color-ink-2);
		max-width: var(--measure);
	}
</style>
