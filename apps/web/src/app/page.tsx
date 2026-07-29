import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBuilder } from '@/components/PageBuilder';
import { getGlobal } from '@/lib/queries/get-global';
import { getPageBySlug } from '@/lib/queries/get-page';
import { buildMetadata } from '@/lib/seo';

const HOME_SLUG = 'home';

export async function generateMetadata(): Promise<Metadata> {
  const [page, global] = await Promise.all([getPageBySlug(HOME_SLUG), getGlobal()]);
  return buildMetadata(page?.seo ?? null, global);
}

export default async function HomePage() {
  const page = await getPageBySlug(HOME_SLUG);

  if (!page) {
    notFound();
  }

  return <PageBuilder sections={page.sections} />;
}
