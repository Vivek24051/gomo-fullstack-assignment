import { IndustrySwitcher } from '@/components/sections/IndustrySwitcher';
import { Container } from '@/components/ui/Container';
import { Kicker } from '@/components/ui/Kicker';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { IndustryShowcaseSection } from '@/lib/strapi/types';

export function IndustryShowcase({ kicker, heading, industries }: IndustryShowcaseSection) {
  return (
    <section className="py-10 sm:py-14">
      <Container className="flex flex-col items-center text-center">
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <SectionHeading className="mt-4 max-w-3xl">{heading}</SectionHeading>
      </Container>

      {industries.length > 0 ? (
        <Container className="mt-14 grid grid-cols-1 overflow-hidden rounded-3xl lg:grid-cols-[320px_1fr]">
          <IndustrySwitcher
            industries={industries.map((industry) => ({
              id: industry.id,
              name: industry.name,
              tags: industry.tags,
              description: industry.description,
              href: industry.href,
              imageUrl: getStrapiMediaURL(industry.image.url, industry.image.updatedAt),
              imageAlt: industry.image.alternativeText ?? industry.name,
            }))}
          />
        </Container>
      ) : null}
    </section>
  );
}
