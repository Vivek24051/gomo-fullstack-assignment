import { IndustrySwitcher } from '@/components/sections/IndustrySwitcher';
import { Container } from '@/components/ui/Container';
import { Kicker } from '@/components/ui/Kicker';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { IndustryShowcaseSection } from '@/lib/strapi/types';

export function IndustryShowcase({ kicker, heading, industries }: IndustryShowcaseSection) {
  // image is schema-required, but that only validates admin saves — an entry can
  // still end up with it null mid-edit. The showcase panel is built around that
  // photo, so an entry without one is skipped rather than shown broken.
  const withImage = industries.filter((industry) => industry.image !== null);

  return (
    <section className="py-10 sm:py-14">
      <Container className="flex flex-col items-center text-center">
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <SectionHeading className="mt-4 max-w-3xl">{heading}</SectionHeading>
      </Container>

      {withImage.length > 0 ? (
        <Container className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <IndustrySwitcher
            industries={withImage.map((industry) => ({
              id: industry.id,
              name: industry.name,
              tags: industry.tags,
              description: industry.description,
              href: industry.href,
              // Non-null assertion is safe here — filtered above.
              imageUrl: getStrapiMediaURL(industry.image!.url, industry.image!.updatedAt),
              imageAlt: industry.image!.alternativeText ?? industry.name,
            }))}
          />
        </Container>
      ) : null}
    </section>
  );
}
