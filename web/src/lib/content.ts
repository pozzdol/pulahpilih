import { marked } from 'marked';
import type { Lang } from './i18n.ts';

/**
 * Markdown pages under src/content/<lang>/<section>/<slug>.md.
 * Frontmatter is plain `key: value` lines (key, title, description, date, updated).
 * `key` pairs the Indonesian and English versions of the same page.
 * A `## FAQ` section with `### question` headings becomes FAQPage structured data.
 */
export type Section = 'usecase' | 'guide' | 'compare';

export const sections: Record<Section, Record<Lang, string>> = {
	usecase: { id: 'kegunaan', en: 'use-cases' },
	guide: { id: 'artikel', en: 'articles' },
	compare: { id: 'bandingkan', en: 'compare' }
};

export type Doc = {
	lang: Lang;
	section: Section;
	slug: string;
	key: string;
	path: string;
	title: string;
	description: string;
	date: string;
	updated: string;
	html: string;
	faq: { q: string; a: string }[];
};

const files = import.meta.glob('/src/content/*/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
	string,
	string
>;

function parse(file: string, raw: string): Doc {
	const [, lang, folder, name] = file.match(/\/content\/(\w+)\/([\w-]+)\/([\w-]+)\.md$/)!;
	const section = (Object.keys(sections) as Section[]).find((s) => sections[s][lang as Lang] === folder);
	if (!section) throw new Error(`Unknown section folder ${folder} in ${file}`);
	const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
	if (!fm) throw new Error(`Missing frontmatter in ${file}`);
	const meta = Object.fromEntries(
		fm[1].split(/\r?\n/).map((l) => {
			const i = l.indexOf(':');
			return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
		})
	);
	for (const k of ['key', 'title', 'description', 'date']) {
		if (!meta[k]) throw new Error(`Missing ${k} in ${file}`);
	}
	const body = raw.slice(fm[0].length);
	const faqPart = body.split(/^## FAQ\s*$/m)[1]?.split(/^## /m)[0] ?? '';
	const faq = faqPart
		.split(/^### /m)
		.slice(1)
		.map((block) => {
			const [q, ...rest] = block.split(/\r?\n/);
			return { q: q.trim(), a: rest.join(' ').replace(/\s+/g, ' ').trim() };
		});
	const prefix = lang === 'id' ? '' : `/${lang}`;
	return {
		lang: lang as Lang,
		section,
		slug: name,
		key: meta.key,
		path: `${prefix}/${folder}/${name}`,
		title: meta.title,
		description: meta.description,
		date: meta.date,
		updated: meta.updated || meta.date,
		html: marked.parse(body, { async: false }),
		faq
	};
}

export const docs: Doc[] = Object.entries(files)
	.map(([file, raw]) => parse(file, raw))
	.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
