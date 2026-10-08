import { docsIn, statics } from '#lib/pages.ts';
import { dict } from '#lib/i18n.ts';
import { abs, AUTHOR, BRAND, FORMATS, REPO } from '#lib/site.ts';

export const prerender = true;

// llms.txt (llmstxt.org): a plain summary and link map for AI assistants and AI search.
export function GET() {
	const en = dict.en;
	const list = (section: 'usecase' | 'guide' | 'compare', lang: 'id' | 'en') =>
		docsIn(section, lang)
			.map((d) => `- [${d.title}](${abs(d.path)}): ${d.description}`)
			.join('\n');

	const body = `# ${BRAND}

> ${BRAND} is a free, open-source (GPL-3.0) Windows app for photo culling: it shows three photos at a time, you pick or reject with the arrow keys, and it repeats rounds until a folder holds exactly your target number of photos. Made by ${AUTHOR.name}. Interface in Indonesian and English.

Key facts:
- Price: free. No account, no ads, no tracking.
- Platform: Windows 10 and 11, 64-bit.
- Formats: ${FORMATS.join(', ')}. RAW+JPG pairs with the same name move together. HEIC is not supported.
- Workflow: round 1 picks candidates into a "selected" subfolder; narrowing rounds run while there are more than the target; if there are fewer, the last round's rejects come back until the count is exact. Nothing is deleted; Backspace undoes.
- Sharing: a temporary link with a 4-digit PIN lets others sort the photos in their browser and send picks; the owner approves the final set. Guests only see copies of 800 KB at most.
- Source code: https://github.com/${REPO}

## Main pages
- [Home and download (Indonesian)](${abs(statics.home.id)})
- [Home and download (English)](${abs(statics.home.en)})
- [${en.docs.title}](${abs(statics.help.en)}): ${en.docs.lead}
- [${en.releases.title}](${abs(statics.releases.en)}): ${en.releases.lead}
- [${en.privacy.title}](${abs(statics.privacy.en)}): ${en.privacy.lead}

## Use cases
${list('usecase', 'en')}
${list('usecase', 'id')}

## Guides
${list('guide', 'en')}
${list('guide', 'id')}

## Comparisons
${list('compare', 'en')}
${list('compare', 'id')}
`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
