import { error } from '@sveltejs/kit';
import { docs, type Doc } from '#lib/content.ts';
import { dict } from '#lib/i18n.ts';
import { alternates, docsIn, findPage, isHub, pages, statics } from '#lib/pages.ts';
import { loadReleases } from '#lib/releases.ts';
import { article, breadcrumbs, faqPage, software, website } from '#lib/schema.ts';
import { abs, BRAND } from '#lib/site.ts';

export const entries = () => pages.map((p) => ({ path: p.path.slice(1) }));

export const load = async ({ params, fetch }) => {
	const path = '/' + params.path;
	const page = findPage(path);
	if (!page) error(404);

	const { lang } = page;
	const t = dict[lang];
	const home = { name: t.home, path: statics.home[lang] };
	const releases = page.kind === 'static' && (page.key === 'home' || page.key === 'releases') ? await loadReleases(fetch) : [];
	const latest = releases.find((r) => !r.prerelease && r.installer) ?? null;

	let title: string;
	let description: string;
	let crumbs = [home];
	const graph: object[] = [website(lang)];
	let hubDocs: Doc[] = [];
	let related: Doc[] = [];

	if (page.kind === 'doc') {
		const doc = page.doc;
		const hub = { name: t.nav[doc.section === 'usecase' ? 'usecases' : doc.section === 'guide' ? 'guides' : 'compare'], path: statics[doc.section][lang] };
		title = doc.title.includes(BRAND) ? doc.title : `${doc.title} | ${BRAND}`;
		description = doc.description;
		crumbs = [home, hub, { name: doc.title, path }];
		graph.push(article(doc, abs(`/og-${lang}.png`)));
		if (doc.faq.length) graph.push(faqPage(doc.faq));
		// same section first, then the rest, for internal linking
		const others = docs.filter((d) => d.lang === lang && d.path !== path);
		related = [...others.filter((d) => d.section === doc.section), ...others.filter((d) => d.section !== doc.section)].slice(0, 4);
	} else if (page.key === 'home') {
		title = t.meta.title;
		description = t.meta.description;
		crumbs = [];
		graph.push(software(lang, t.meta.description, latest));
		hubDocs = docsIn('usecase', lang);
	} else if (isHub(page.key)) {
		title = `${t.hubs[page.key].title} | ${BRAND}`;
		description = t.hubs[page.key].lead;
		crumbs = [home, { name: t.nav[page.key === 'usecase' ? 'usecases' : page.key === 'guide' ? 'guides' : 'compare'], path }];
		hubDocs = docsIn(page.key, lang);
	} else {
		const section = { releases: t.releases, help: t.docs, privacy: t.privacy }[page.key];
		title = `${section.title} | ${BRAND}`;
		description = section.lead;
		crumbs = [home, { name: section.title, path }];
		if (page.key === 'help') graph.push(faqPage(t.docs.faq.map(({ q, a }) => ({ q, a }))));
	}
	if (crumbs.length > 1) graph.push(breadcrumbs(crumbs));

	return { page, path, lang, alternates: alternates(page), title, description, crumbs, graph, releases, latest, hubDocs, related };
};
