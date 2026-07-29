import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBuilder } from '@/components/PageBuilder';
import { getGlobal } from '@/lib/queries/get-global';
import { getPageBySlug } from '@/lib/queries/get-page';
import { buildMetadata } from '@/lib/seo';

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const [page, global] = await Promise.all([getPageBySlug(slug), getGlobal()]);
  return buildMetadata(page?.seo ?? null, global);
}

export default async function CmsPage({ params }: PageParams) {
  const { slug } = await params;

  // "home" is served at `/` (see app/page.tsx) — avoid duplicate content at `/home`.
  if (slug === 'home') {
    notFound();
  }

  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <PageBuilder sections={page.sections} />;
}
