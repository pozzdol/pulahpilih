import { marked } from 'marked';

export const REPO = 'pozzdol/photo-sorter';

export type Release = {
	version: string;
	name: string;
	date: string; // ISO
	notes: string; // HTML from the release's markdown body
	url: string;
	prerelease: boolean;
	installer: { name: string; url: string; size: number } | null;
};

type GhAsset = { name: string; browser_download_url: string; size: number };
type GhRelease = {
	tag_name: string;
	name: string | null;
	published_at: string | null;
	body: string | null;
	html_url: string;
	draft: boolean;
	prerelease: boolean;
	assets: GhAsset[];
};

/**
 * GitHub Releases is the single source for installers and notes. Fetched at build time;
 * the release workflow redeploys the site after each release. No releases yet → empty list.
 */
export async function loadReleases(fetch: typeof globalThis.fetch): Promise<Release[]> {
	const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
	// CI passes a token so builds don't hit the 60 requests/hour anonymous limit
	const token = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.GITHUB_TOKEN;
	if (token) headers.Authorization = `Bearer ${token}`;
	try {
		const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=50`, { headers });
		if (!res.ok) return [];
		const list = (await res.json()) as GhRelease[];
		return list
			.filter((r) => !r.draft)
			.map((r) => {
				const exe = r.assets.find((a) => a.name.endsWith('-setup.exe'));
				return {
					version: r.tag_name.replace(/^v/, ''),
					name: r.name || r.tag_name,
					date: r.published_at ?? '',
					notes: marked.parse(r.body ?? '', { async: false }),
					url: r.html_url,
					prerelease: r.prerelease,
					installer: exe ? { name: exe.name, url: exe.browser_download_url, size: exe.size } : null
				};
			});
	} catch {
		return [];
	}
}
