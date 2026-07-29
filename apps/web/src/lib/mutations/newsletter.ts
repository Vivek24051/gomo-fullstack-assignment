import { strapiFetch } from '@/lib/strapi/client';
import type { NewsletterSignup, StrapiSingleResponse } from '@/lib/strapi/types';

export async function createNewsletterSignup(email: string, source = 'footer'): Promise<void> {
  await strapiFetch<StrapiSingleResponse<NewsletterSignup>>('/newsletter-signups', {
    method: 'POST',
    body: { data: { email, source } },
  });
}
