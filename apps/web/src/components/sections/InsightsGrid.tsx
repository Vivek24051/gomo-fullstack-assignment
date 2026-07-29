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
    <section className="py-20 sm:py-28">
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
            const cardClassName = 'group relative flex aspect-[4/3] flex-col overflow-hidden rounded-xl';
            const cardContent = (
              <>
                <Image
                  src={getStrapiMediaURL(insight.image.url, insight.image.updatedAt)}
                  alt={insight.image.alternativeText ?? ''}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="relative z-10 flex h-full flex-col justify-between p-4">
                  {insight.tag ? (
                    <span className="w-fit rounded-full bg-cream px-3 py-1 text-xs font-medium text-ink">
                      {insight.tag}
                    </span>
                  ) : (
                    <span />
                  )}
                  <h3 className="text-lg font-medium text-cream">{insight.title}</h3>
                </div>
              </>
            );

            return (
              <article key={insight.id} className="flex flex-col">
                {/* No dead `#` link: without an href this renders as a plain
                    container instead of an anchor that goes nowhere. */}
                {insight.href ? (
                  <Link href={insight.href} className={cardClassName}>
                    {cardContent}
                  </Link>
                ) : (
                  <div className={cardClassName}>{cardContent}</div>
                )}

                <div className="mt-3 flex items-center justify-between text-sm text-ink/60">
                  <span>{displayDate ?? ''}</span>
                  {insight.href ? (
                    <Link
                      href={insight.href}
                      className="inline-flex items-center gap-1.5 underline underline-offset-4"
                    >
                      Read more <span aria-hidden="true">↗</span>
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </Container>
      ) : null}
    </section>
  );
}
