import type { Handle } from '@sveltejs/kit/hooks';

// prerendered pages get the right <html lang> for their /id or /en path
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('<html lang="en">', `<html lang="${event.params.lang ?? 'en'}">`)
	});
