import 'server-only';

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';

/**
 * Strapi media URLs are absolute when served from a CDN provider (e.g. Cloudinary in
 * production) but relative (`/uploads/...`) when served from local disk (dev default,
 * see apps/cms/config/plugins.ts) — this normalizes both to a usable absolute URL.
 *
 * `updatedAt`, when passed, is appended as a cache-busting query param. Strapi's
 * "replace" media action can overwrite a file in place while keeping the exact same
 * filename/hash — the URL string never changes, but Next's image optimizer caches
 * transformed output on disk keyed by that URL, so it keeps serving the old bytes
 * indefinitely unless something in the URL actually changes.
 */
export function getStrapiMediaURL(url: string, updatedAt?: string): string {
  const absolute = /^https?:\/\//.test(url) ? url : `${STRAPI_URL}${url}`;
  if (!updatedAt) {
    return absolute;
  }
  const separator = absolute.includes('?') ? '&' : '?';
  return `${absolute}${separator}v=${encodeURIComponent(updatedAt)}`;
}
