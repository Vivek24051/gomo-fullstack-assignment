import { CaseStudiesCarousel } from '@/components/sections/CaseStudiesCarousel';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { Kicker } from '@/components/ui/Kicker';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { CaseStudiesCarouselSection } from '@/lib/strapi/types';

export function CaseStudies({ kicker, heading, ctaLabel, ctaHref, caseStudies }: CaseStudiesCarouselSection) {
  // image is schema-required, but that only validates admin saves — an entry can
  // still end up with it null mid-edit. The card is built around that photo, so an
  // entry without one is skipped rather than shown broken.
  const withImage = caseStudies.filter((caseStudy) => caseStudy.image !== null);

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

      {withImage.length > 0 ? (
        <div className="mt-14">
          <CaseStudiesCarousel
            caseStudies={withImage.map((caseStudy) => ({
              id: caseStudy.id,
              title: caseStudy.title,
              subtitle: caseStudy.subtitle,
              href: caseStudy.href,
              // Non-null assertion is safe here — filtered above.
              imageUrl: getStrapiMediaURL(caseStudy.image!.url, caseStudy.image!.updatedAt),
              imageAlt: caseStudy.image!.alternativeText ?? '',
            }))}
          />
        </div>
      ) : null}
    </section>
  );
}
