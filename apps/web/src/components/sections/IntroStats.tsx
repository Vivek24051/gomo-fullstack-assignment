import Image from 'next/image';
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
  return (
    <section className="py-20 sm:py-28">
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
        <Container className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
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

      {brands.length > 0 ? (
        <div className="mt-16">
          {brandsHeading ? (
            <Container className="text-center">
              <Kicker>{brandsHeading}</Kicker>
            </Container>
          ) : null}
          <div className="mt-8 flex gap-4 overflow-x-auto px-6 pb-2 sm:px-8 lg:px-12">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex h-20 w-40 shrink-0 items-center justify-center rounded-md border border-ink/10 p-4"
              >
                <Image
                  src={getStrapiMediaURL(brand.logo.url, brand.logo.updatedAt)}
                  alt={brand.logo.alternativeText ?? brand.name}
                  width={120}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
