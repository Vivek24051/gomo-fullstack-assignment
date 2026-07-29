import qs from 'qs';
import { strapiFetch } from '@/lib/strapi/client';
import type { Page, StrapiCollectionResponse } from '@/lib/strapi/types';

/**
 * Bounded populate for the page Dynamic Zone: each section component gets exactly
 * the relations/media it needs via the `on` discriminator, rather than a naive
 * `populate=deep` that would over-fetch. See Milestone 3 plan, decision #2 — this is
 * done entirely from the frontend so apps/cms (Milestone 2) doesn't need to change.
 */
const PAGE_POPULATE = {
  seo: { populate: ['ogImage'] },
  sections: {
    on: {
      'sections.hero': { populate: ['backgroundImage'] },
      'sections.intro-stats': {
        populate: {
          image: true,
          stats: true,
          brands: { populate: ['logo'] },
        },
      },
      'sections.industry-showcase': {
        populate: { industries: { populate: ['image', 'icon'] } },
      },
      'sections.why-choose-us': {
        populate: { features: { populate: ['icon'] } },
      },
      'sections.case-studies-carousel': {
        populate: { caseStudies: { populate: ['image'] } },
      },
      'sections.insights-grid': {
        populate: { insights: { populate: ['image'] } },
      },
      'sections.cta-banner': {
        populate: ['backgroundImage', 'logoMark'],
      },
    },
  },
} as const;

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const query = qs.stringify(
    { filters: { slug: { $eq: slug } }, populate: PAGE_POPULATE },
    { encodeValuesOnly: true },
  );

  const res = await strapiFetch<StrapiCollectionResponse<Page>>(`/pages?${query}`, {
    tags: ['pages', `page:${slug}`],
  });

  return res.data[0] ?? null;
}

/** Slug + updatedAt only — used by app/sitemap.ts, not the full page payload. */
export async function getAllPageSlugs(): Promise<Pick<Page, 'slug' | 'updatedAt'>[]> {
  const query = qs.stringify(
    { fields: ['slug', 'updatedAt'], pagination: { pageSize: 100 } },
    { encodeValuesOnly: true },
  );

  const res = await strapiFetch<StrapiCollectionResponse<Pick<Page, 'slug' | 'updatedAt'>>>(
    `/pages?${query}`,
    { tags: ['pages'] },
  );

  return res.data;
}
