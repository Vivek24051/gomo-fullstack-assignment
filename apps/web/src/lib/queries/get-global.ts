import qs from 'qs';
import { strapiFetch } from '@/lib/strapi/client';
import type { GlobalData, StrapiSingleResponse } from '@/lib/strapi/types';

const GLOBAL_POPULATE = {
  defaultSeo: { populate: ['ogImage'] },
} as const;

export async function getGlobal(): Promise<GlobalData | null> {
  const query = qs.stringify({ populate: GLOBAL_POPULATE }, { encodeValuesOnly: true });
  const res = await strapiFetch<StrapiSingleResponse<GlobalData>>(`/global?${query}`, {
    tags: ['global'],
  });
  return res.data;
}
