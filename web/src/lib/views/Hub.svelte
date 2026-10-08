<script lang="ts">
	import type { Doc } from '../content.ts';

	let { title, lead, docs }: { title: string; lead: string; docs: Doc[] } = $props();
</script>

<article class="doc">
	<h1>{title}</h1>
	<p class="lede">{lead}</p>
	<ul>
		{#each docs as d (d.path)}
			<li>
				<a href={d.path}>{d.title}</a>
				<p>{d.description}</p>
			</li>
		{/each}
	</ul>
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
		line-height: 1.1;
	}
	.lede {
		margin-top: 12px;
		color: var(--secondary);
		font-size: 19px;
	}
	ul {
		list-style: none;
		margin: 40px 0 0;
		padding: 0;
	}
	li {
		padding: 20px 0;
		border-top: 0.5px solid var(--separator);
	}
	li a {
		font-size: 21px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}
	li p {
		margin-top: 6px;
		color: var(--secondary);
	}
</style>
