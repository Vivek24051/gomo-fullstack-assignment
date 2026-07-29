import qs from 'qs';
import { strapiFetch } from '@/lib/strapi/client';
import type { FooterData, StrapiSingleResponse } from '@/lib/strapi/types';

const FOOTER_POPULATE = {
  columns: { populate: ['links'] },
  socialLinks: true,
  isoBadges: true,
  legalLinks: true,
} as const;

export async function getFooter(): Promise<FooterData | null> {
  const query = qs.stringify({ populate: FOOTER_POPULATE }, { encodeValuesOnly: true });
  const res = await strapiFetch<StrapiSingleResponse<FooterData>>(`/footer?${query}`, {
    tags: ['footer'],
  });
  return res.data;
}
