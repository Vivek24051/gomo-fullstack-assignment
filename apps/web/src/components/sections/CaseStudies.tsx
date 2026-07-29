import Image from 'next/image';
import Link from 'next/link';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { Kicker } from '@/components/ui/Kicker';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { CaseStudiesCarouselSection } from '@/lib/strapi/types';

/**
 * Horizontal scroll-snap row rather than a JS carousel with dot pagination — CSS-only,
 * no state, but still reads and behaves like a carousel (unlike a wrapping grid, which
 * looks broken whenever the card count isn't a multiple of the column count).
 */
export function CaseStudies({ kicker, heading, ctaLabel, ctaHref, caseStudies }: CaseStudiesCarouselSection) {
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

      {caseStudies.length > 0 ? (
        <div className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 sm:px-8 lg:px-12">
          {caseStudies.map((caseStudy) => {
            const cardClassName =
              'group relative flex aspect-[4/5] w-[280px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-xl sm:w-[360px]';
            const cardContent = (
              <>
                <Image
                  src={getStrapiMediaURL(caseStudy.image.url, caseStudy.image.updatedAt)}
                  alt={caseStudy.image.alternativeText ?? ''}
                  fill
                  sizes="(min-width: 640px) 360px, 280px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <div className="relative flex items-end justify-between gap-2 p-6 text-cream">
                  <div>
                    <h3 className="text-lg font-medium">{caseStudy.title}</h3>
                    {caseStudy.subtitle ? (
                      <p className="mt-1 text-sm text-cream/80">{caseStudy.subtitle}</p>
                    ) : null}
                  </div>
                  {caseStudy.href ? (
                    <span className="shrink-0 text-sm underline underline-offset-4">
                      Read case <span aria-hidden="true">↗</span>
                    </span>
                  ) : null}
                </div>
              </>
            );

            // No dead `#` links: a card with no href renders as a plain container
            // (still shows the content) instead of an anchor that goes nowhere.
            return caseStudy.href ? (
              <Link key={caseStudy.id} href={caseStudy.href} className={cardClassName}>
                {cardContent}
              </Link>
            ) : (
              <div key={caseStudy.id} className={cardClassName}>
                {cardContent}
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
