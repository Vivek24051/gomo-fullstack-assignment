import Image from 'next/image';
import Link from 'next/link';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { Kicker } from '@/components/ui/Kicker';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { InsightsGridSection } from '@/lib/strapi/types';

function formatDate(date: string | null): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function InsightsGrid({ kicker, heading, ctaLabel, ctaHref, insights }: InsightsGridSection) {
  return (
    <section className="py-10 sm:py-14">
      <Container className="flex flex-col items-center text-center">
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <SectionHeading className="mt-4 max-w-2xl">{heading}</SectionHeading>
        {ctaLabel && ctaHref ? (
          <ArrowLink href={ctaHref} className="mt-6">
            {ctaLabel}
          </ArrowLink>
        ) : null}
      </Container>

      {insights.length > 0 ? (
        <Container className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight) => {
            const displayDate = formatDate(insight.date);
            const hasMetaRow = Boolean(displayDate) || Boolean(insight.href);
            const cardClassName = 'group relative flex aspect-square flex-col overflow-hidden rounded-xl';
            const cardContent = (
              <>
                <Image
                  src={getStrapiMediaURL(insight.image.url, insight.image.updatedAt)}
                  alt={insight.image.alternativeText ?? ''}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {insight.tag ? (
                  <span className="absolute top-4 left-4 w-fit rounded-full bg-ink/50 px-3 py-1 text-xs font-medium text-cream backdrop-blur-md">
                    {insight.tag}
                  </span>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 flex flex-col bg-ink/50 text-cream backdrop-blur-md">
                  <div className={`p-4 ${hasMetaRow ? 'border-b border-cream/20' : ''}`}>
                    <h3 className="text-lg font-medium">{insight.title}</h3>
                  </div>
                  {hasMetaRow ? (
                    <div className="flex items-center">
                      {displayDate ? (
                        <div className={`flex-1 p-4 ${insight.href ? 'border-r border-cream/20' : ''}`}>
                          <span className="text-sm text-cream/70">{displayDate}</span>
                        </div>
                      ) : null}
                      {/* Only "Read more" is clickable, not the whole card. */}
                      {insight.href ? (
                        <div className="p-4">
                          <Link
                            href={insight.href}
                            className="inline-flex items-center gap-1.5 text-sm underline underline-offset-4"
                          >
                            Read more <span aria-hidden="true">↗</span>
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </>
            );

            return (
              <div key={insight.id} className={cardClassName}>
                {cardContent}
              </div>
            );
          })}
        </Container>
      ) : null}
    </section>
  );
}
