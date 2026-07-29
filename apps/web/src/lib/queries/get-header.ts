import qs from 'qs';
import { strapiFetch } from '@/lib/strapi/client';
import type { HeaderData, StrapiSingleResponse } from '@/lib/strapi/types';

const HEADER_POPULATE = {
  logo: true,
  navItems: { populate: ['children'] },
} as const;

export async function getHeader(): Promise<HeaderData | null> {
  const query = qs.stringify({ populate: HEADER_POPULATE }, { encodeValuesOnly: true });
  const res = await strapiFetch<StrapiSingleResponse<HeaderData>>(`/header?${query}`, {
    tags: ['header'],
  });
  return res.data;
}
