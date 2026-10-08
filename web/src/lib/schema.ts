import { abs, AUTHOR, BRAND, FORMATS, LICENSE_URL, REPO, SITE } from './site.ts';
import type { Doc } from './content.ts';
import type { Lang } from './i18n.ts';
import type { Release } from './releases.ts';

// schema.org JSON-LD builders. Google uses them for rich results; AI search uses them as facts.

const person = { '@type': 'Person', '@id': `${SITE}/#author`, name: AUTHOR.name, url: AUTHOR.url };

export function website(lang: Lang) {
	return {
		'@type': 'WebSite',
		'@id': `${SITE}/#website`,
		url: SITE,
		name: BRAND,
		inLanguage: lang,
		publisher: { '@id': person['@id'] }
	};
}

export function software(lang: Lang, description: string, latest: Release | null) {
	return {
		'@type': 'SoftwareApplication',
		'@id': `${SITE}/#app`,
		name: BRAND,
		description,
		url: abs(lang === 'id' ? '/' : '/en'),
		applicationCategory: 'MultimediaApplication',
		applicationSubCategory: lang === 'id' ? 'Aplikasi sortir foto' : 'Photo culling',
		operatingSystem: 'Windows 10, Windows 11',
		processorRequirements: 'x64',
		inLanguage: ['id', 'en'],
		isAccessibleForFree: true,
		license: LICENSE_URL,
		author: person,
		publisher: person,
		codeRepository: `https://github.com/${REPO}`,
		fileFormat: FORMATS,
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' },
		...(latest && {
			softwareVersion: latest.version,
			datePublished: latest.date.slice(0, 10),
			...(latest.installer && { downloadUrl: latest.installer.url, fileSize: `${Math.round(latest.installer.size / 1048576)} MB` })
		})
	};
}

export function breadcrumbs(items: { name: string; path: string }[]) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) }))
	};
}

export function faqPage(faq: { q: string; a: string }[]) {
	return {
		'@type': 'FAQPage',
		mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
	};
}

export function article(doc: Doc, image: string) {
	return {
		'@type': doc.section === 'guide' ? 'TechArticle' : 'Article',
		headline: doc.title,
		description: doc.description,
		inLanguage: doc.lang,
		url: abs(doc.path),
		mainEntityOfPage: abs(doc.path),
		datePublished: doc.date,
		dateModified: doc.updated,
		image,
		author: person,
		publisher: person,
		about: { '@id': `${SITE}/#app` }
	};
}

/** One <script type="application/ld+json"> with a @graph; `<` escaped so content can't close the tag. */
export function jsonLd(nodes: object[]) {
	const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}
