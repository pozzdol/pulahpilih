import { docs, sections, type Doc, type Section } from './content.ts';
import { langs, type Lang } from './i18n.ts';

/**
 * Every URL on the site. Indonesian lives at the root (primary market), English under /en,
 * each with its own slugs. One catch-all route renders all of them and the sitemap lists them.
 */
export const statics = {
	home: { id: '/', en: '/en' },
	releases: { id: '/rilis', en: '/en/releases' },
	help: { id: '/bantuan', en: '/en/help' },
	privacy: { id: '/privasi', en: '/en/privacy' },
	usecase: { id: '/kegunaan', en: '/en/use-cases' },
	guide: { id: '/artikel', en: '/en/articles' },
	compare: { id: '/bandingkan', en: '/en/compare' }
} satisfies Record<string, Record<Lang, string>>;

export type StaticKey = keyof typeof statics;

export type Page =
	| { kind: 'static'; key: StaticKey; lang: Lang; path: string }
	| { kind: 'doc'; doc: Doc; lang: Lang; path: string };

export const pages: Page[] = [
	...(Object.keys(statics) as StaticKey[]).flatMap((key) =>
		langs.map((lang) => ({ kind: 'static' as const, key, lang, path: statics[key][lang] }))
	),
	...docs.map((doc) => ({ kind: 'doc' as const, doc, lang: doc.lang, path: doc.path }))
];

export const findPage = (path: string) => pages.find((p) => p.path === path);

/** The same page in each language that has it. */
export function alternates(page: Page): Partial<Record<Lang, string>> {
	if (page.kind === 'static') return statics[page.key];
	const { key, section } = page.doc;
	return Object.fromEntries(docs.filter((d) => d.key === key && d.section === section).map((d) => [d.lang, d.path]));
}

export const docsIn = (section: Section, lang: Lang) => docs.filter((d) => d.section === section && d.lang === lang);

export const isHub = (key: StaticKey): key is Section => key in sections;
