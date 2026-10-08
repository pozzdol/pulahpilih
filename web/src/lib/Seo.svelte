<script lang="ts">
	import { abs, BRAND } from './site.ts';
	import { jsonLd } from './schema.ts';
	import type { Lang } from './i18n.ts';

	let {
		lang,
		title,
		description,
		path,
		alternates,
		type = 'website',
		graph = []
	}: {
		lang: Lang;
		title: string;
		description: string;
		path: string;
		alternates: Partial<Record<Lang, string>>;
		type?: 'website' | 'article';
		graph?: object[];
	} = $props();

	const image = $derived(abs(`/og-${lang}.png`));
	const locale = { id: 'id_ID', en: 'en_US' };
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={abs(path)} />
	{#each Object.entries(alternates) as [l, p] (l)}
		<link rel="alternate" hreflang={l} href={abs(p)} />
	{/each}
	{#if alternates.id}<link rel="alternate" hreflang="x-default" href={abs(alternates.id)} />{/if}

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={BRAND} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={abs(path)} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content={locale[lang]} />
	{#each Object.keys(alternates).filter((l) => l !== lang) as l (l)}
		<meta property="og:locale:alternate" content={locale[l as Lang]} />
	{/each}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	{#if graph.length}
		<!-- built from our own data and escaped in jsonLd() -->
		{@html jsonLd(graph)}
	{/if}
</svelte:head>
