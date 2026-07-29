import 'server-only';

/**
 * Server-only fetch wrapper for Strapi's REST API. Callers pass a path that already
 * includes its own query string (built with `qs` in lib/queries/*) — this module owns
 * the base URL, auth header, and Next.js fetch-cache config (see the ISR strategy in
 * the Milestone 3 plan: time-based `revalidate` default + tag-based on-demand via
 * `revalidateTag` in app/api/revalidate/route.ts).
 */

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const DEFAULT_REVALIDATE_SECONDS = 60;

export class StrapiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly path: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'StrapiError';
  }
}

interface StrapiFetchOptions {
  /** Next.js fetch cache tags — enables `revalidateTag()` for on-demand ISR. */
  tags?: string[];
  /** Seconds until this fetch is considered stale. Defaults to 60. */
  revalidate?: number;
}

/**
 * Fetches `${STRAPI_URL}/api${path}`. Throws `StrapiError` on any non-2xx response —
 * callers decide what that means (e.g. a page query treats 404 as "not found" and
 * returns null instead of throwing; a genuine network/permission failure propagates
 * up to Next's error.tsx boundary).
 */
export async function strapiFetch<T>(path: string, options: StrapiFetchOptions = {}): Promise<T> {
  const url = `${STRAPI_URL}/api${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {},
      next: {
        revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
        tags: options.tags,
      },
    });
  } catch (cause) {
    throw new StrapiError(`Could not reach Strapi at ${STRAPI_URL} — is it running?`, 0, path, {
      cause,
    });
  }

  if (!res.ok) {
    throw new StrapiError(`Strapi request failed: ${res.status} ${res.statusText}`, res.status, path);
  }

  return (await res.json()) as T;
}
