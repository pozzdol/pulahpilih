import { loadReleases } from '#lib/releases.ts';
import type { Lang } from '#lib/i18n.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, fetch }) => {
	const releases = await loadReleases(fetch);
	const latest = releases.find((r) => !r.prerelease && r.installer) ?? null;
	return { lang: params.lang as Lang, releases, latest };
};
