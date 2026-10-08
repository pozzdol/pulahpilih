import { REPO } from './site.ts';
import type { Release } from './releases.ts';

/**
 * Browser fallback for the download button: the site is prerendered, so a page built before
 * a release went out has no installer link until the next deploy. Ask GitHub directly then.
 */
export async function fetchLatest(): Promise<Release | null> {
	try {
		const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
			headers: { Accept: 'application/vnd.github+json' }
		});
		if (!res.ok) return null;
		const r = await res.json();
		const exe = (r.assets as { name: string; browser_download_url: string; size: number }[]).find((a) =>
			a.name.endsWith('-setup.exe')
		);
		if (!exe) return null;
		return {
			version: String(r.tag_name).replace(/^v/, ''),
			name: r.name || r.tag_name,
			date: r.published_at ?? '',
			notes: '',
			url: r.html_url,
			prerelease: false,
			installer: { name: exe.name, url: exe.browser_download_url, size: exe.size }
		};
	} catch {
		return null;
	}
}
