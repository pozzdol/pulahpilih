<script lang="ts">
	import Seo from '#lib/Seo.svelte';
	import Shell from '#lib/Shell.svelte';
	import DocView from '#lib/views/DocView.svelte';
	import Help from '#lib/views/Help.svelte';
	import Home from '#lib/views/Home.svelte';
	import Hub from '#lib/views/Hub.svelte';
	import Privacy from '#lib/views/Privacy.svelte';
	import Releases from '#lib/views/Releases.svelte';
	import { dict } from '#lib/i18n.ts';

	let { data } = $props();
	const page = $derived(data.page);
	const t = $derived(dict[data.lang]);
</script>

<Seo
	lang={data.lang}
	title={data.title}
	description={data.description}
	path={data.path}
	alternates={data.alternates}
	type={page.kind === 'doc' ? 'article' : 'website'}
	graph={data.graph}
/>

<Shell lang={data.lang} path={data.path} alternates={data.alternates}>
	{#if page.kind === 'doc'}
		<DocView doc={page.doc} crumbs={data.crumbs} related={data.related} />
	{:else if page.key === 'home'}
		<Home lang={data.lang} latest={data.latest} usecases={data.hubDocs} />
	{:else if page.key === 'releases'}
		<Releases lang={data.lang} latest={data.latest} releases={data.releases} />
	{:else if page.key === 'help'}
		<Help lang={data.lang} />
	{:else if page.key === 'privacy'}
		<Privacy lang={data.lang} />
	{:else}
		<Hub title={t.hubs[page.key].title} lead={t.hubs[page.key].lead} docs={data.hubDocs} />
	{/if}
</Shell>
