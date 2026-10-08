import type { Handle } from '@sveltejs/kit/hooks';

// Indonesian lives at the root, English under /en: set <html lang> to match
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('<html lang="en">', `<html lang="${/^\/en(\/|$)/.test(event.url.pathname) ? 'en' : 'id'}">`)
	});
