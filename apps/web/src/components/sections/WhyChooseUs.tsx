import Image from 'next/image';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { Kicker } from '@/components/ui/Kicker';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { WhyChooseUsSection } from '@/lib/strapi/types';

export function WhyChooseUs({ kicker, heading, ctaLabel, ctaHref, features }: WhyChooseUsSection) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="rounded-2xl bg-sage px-6 py-16 sm:px-10 lg:px-16">
          <div className="flex flex-col items-center text-center">
            {kicker ? <Kicker>{kicker}</Kicker> : null}
            <SectionHeading className="mt-4 max-w-2xl">{heading}</SectionHeading>
            {ctaLabel && ctaHref ? (
              <ArrowLink href={ctaHref} className="mt-6">
                {ctaLabel}
              </ArrowLink>
            ) : null}
          </div>

          {features.length > 0 ? (
            <div className="mt-14 grid grid-cols-1 gap-10 border-t border-ink/15 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:divide-x lg:divide-ink/15">
              {features.map((feature) => (
                <div key={feature.id} className="lg:px-6 lg:first:pl-0">
                  <div className="relative h-8 w-8">
                    <Image
                      src={getStrapiMediaURL(feature.icon.url, feature.icon.updatedAt)}
                      alt={feature.icon.alternativeText ?? ''}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="mt-4 font-medium text-ink">{feature.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{feature.description}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
