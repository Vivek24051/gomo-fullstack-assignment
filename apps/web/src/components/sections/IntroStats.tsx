import Image from 'next/image';
import { BrandsScroller } from '@/components/sections/BrandsScroller';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { Kicker } from '@/components/ui/Kicker';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { IntroStatsSection } from '@/lib/strapi/types';

export function IntroStats({
  kicker,
  heading,
  ctaLabel,
  ctaHref,
  image,
  body,
  stats,
  brandsHeading,
  brands,
}: IntroStatsSection) {
  // logo is schema-required, but that only validates admin saves — an entry can
  // still end up with it null mid-edit. A brand card is just its logo, so an entry
  // without one is skipped rather than shown broken.
  const brandsWithLogo = brands.filter((brand) => brand.logo !== null);

  return (
    <section className="py-10 sm:py-14">
      <Container className="flex flex-col items-center text-center">
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <SectionHeading className="mt-4 max-w-3xl">{heading}</SectionHeading>
        {ctaLabel && ctaHref ? (
          <ArrowLink href={ctaHref} className="mt-6">
            {ctaLabel}
          </ArrowLink>
        ) : null}
      </Container>

      {image || body ? (
        <Container
          className={`mt-16 grid grid-cols-1 items-center gap-10 ${image && body ? 'lg:grid-cols-2' : ''}`}
        >
          {image ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src={getStrapiMediaURL(image.url, image.updatedAt)}
                alt={image.alternativeText ?? ''}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
          {body ? (
            <div className="text-sm leading-relaxed whitespace-pre-line text-ink/80 sm:text-base">{body}</div>
          ) : null}
        </Container>
      ) : null}

      {stats.length > 0 ? (
        <Container className="mt-16 grid grid-cols-2 gap-8 border-t border-ink/10 pt-10 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <p className="font-display text-4xl text-ink sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-ink/70">{stat.label}</p>
            </div>
          ))}
        </Container>
      ) : null}

      {brandsWithLogo.length > 0 ? (
        <div className="mt-16">
          {brandsHeading ? (
            <Container className="text-center">
              <Kicker>{brandsHeading}</Kicker>
            </Container>
          ) : null}
          <BrandsScroller
            brands={brandsWithLogo.map((brand) => ({
              id: brand.id,
              name: brand.name,
              // Non-null assertion is safe here — filtered above.
              logoUrl: getStrapiMediaURL(brand.logo!.url, brand.logo!.updatedAt),
              logoAlt: brand.logo!.alternativeText ?? brand.name,
            }))}
          />
        </div>
      ) : null}
    </section>
  );
}
