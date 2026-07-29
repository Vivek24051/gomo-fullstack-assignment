import 'server-only';

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';

/**
 * Strapi media URLs are absolute when served from a CDN provider (e.g. Cloudinary in
 * production) but relative (`/uploads/...`) when served from local disk (dev default,
 * see apps/cms/config/plugins.ts) — this normalizes both to a usable absolute URL.
 */
export function getStrapiMediaURL(url: string): string {
  if (/^https?:\/\//.test(url)) {
    return url;
  }
  return `${STRAPI_URL}${url}`;
}
