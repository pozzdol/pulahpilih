import { defineParams } from '@sveltejs/kit/params';
import { langs, type Lang } from '#lib/i18n.ts';

/** `[lang=lang]` routes: only /id and /en exist. */
export const params = defineParams({
	lang: (p) => ((langs as readonly string[]).includes(p) ? (p as Lang) : undefined)
});
