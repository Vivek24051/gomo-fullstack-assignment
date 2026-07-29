import Image from 'next/image';
import Link from 'next/link';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { Kicker } from '@/components/ui/Kicker';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { CaseStudiesCarouselSection } from '@/lib/strapi/types';

/**
 * Responsive grid rather than a full scroll-snap/dot-pagination carousel — per the
 * agreed time-budget simplification for this section. Still fully CMS-driven and
 * responsive (1 col mobile, 2 tablet, 3 desktop).
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
        <Container className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((caseStudy) => (
            <Link
              key={caseStudy.id}
              href={caseStudy.href ?? '#'}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl"
            >
              <Image
                src={getStrapiMediaURL(caseStudy.image.url, caseStudy.image.updatedAt)}
                alt={caseStudy.image.alternativeText ?? ''}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
                <span className="shrink-0 text-sm underline underline-offset-4">
                  Read case <span aria-hidden="true">↗</span>
                </span>
              </div>
            </Link>
          ))}
        </Container>
      ) : null}
    </section>
  );
}
