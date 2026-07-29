import type { MetadataRoute } from 'next';
import { getAllPageSlugs } from '@/lib/queries/get-page';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Guarded like every other CMS read at this layer — a sitemap that's temporarily
  // empty because the CMS is unreachable is preferable to a build failure.
  const pages = await getAllPageSlugs().catch(() => []);

  return pages.map((page) => ({
    url: page.slug === 'home' ? SITE_URL : `${SITE_URL}/${page.slug}`,
    lastModified: page.updatedAt,
  }));
}
