/** Facts used in meta tags, structured data and llms.txt. Keep them true: AI answers quote these. */
export const SITE = 'https://pulahpilih.fikriachmad.dev';
export const BRAND = 'Pulahpilih';
export const REPO = 'pozzdol/pulahpilih';
export const AUTHOR = { name: 'Fikri Achmad', url: 'https://fikriachmad.dev' };
export const LICENSE_URL = 'https://www.gnu.org/licenses/gpl-3.0.html';
export const FORMATS = ['JPG', 'PNG', 'WebP', 'CR2', 'CR3', 'NEF', 'ARW', 'DNG', 'RAF', 'ORF', 'RW2', 'PEF', 'SRW'];

export const abs = (path: string) => SITE + (path === '/' ? '' : path);
