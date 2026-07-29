import type { Metadata } from 'next';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { GlobalData, SeoComponent } from '@/lib/strapi/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * Merges a page's own `seo` component over the `global` single-type's defaults,
 * applying the title template (e.g. "%s | Brand"). Either argument may be null —
 * e.g. before any content has been seeded in Strapi — in which case Next.js just
 * gets an empty-but-valid Metadata object rather than throwing.
 */
export function buildMetadata(seo: SeoComponent | null, global: GlobalData | null): Metadata {
  const title = seo?.metaTitle ?? global?.siteName ?? undefined;
  const titleTemplate = global?.titleTemplate ?? undefined;
  const description = seo?.metaDescription ?? undefined;
  const ogImage = seo?.ogImage ?? global?.defaultSeo?.ogImage ?? null;

  return {
    metadataBase: new URL(SITE_URL),
    title: titleTemplate ? { template: titleTemplate, default: title ?? '' } : title,
    description,
    openGraph: {
      title: title ?? undefined,
      description,
      images: ogImage ? [{ url: getStrapiMediaURL(ogImage.url) }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? undefined,
      description,
      images: ogImage ? [getStrapiMediaURL(ogImage.url)] : undefined,
    },
  };
}
