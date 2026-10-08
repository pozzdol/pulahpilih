import { alternates, pages } from '#lib/pages.ts';
import { abs } from '#lib/site.ts';

export const prerender = true;

// Every page with its language alternates, so search engines pair /x with /en/x.
export function GET() {
	const urls = pages.map((p) => {
		const alts = Object.entries(alternates(p))
			.map(([l, path]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${abs(path)}"/>`)
			.join('');
		const lastmod = p.kind === 'doc' ? `<lastmod>${p.doc.updated}</lastmod>` : '';
		return `<url><loc>${abs(p.path)}</loc>${lastmod}${alts}</url>`;
	});
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
