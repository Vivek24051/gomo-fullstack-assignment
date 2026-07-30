import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { CtaBannerSection } from '@/lib/strapi/types';

export function CtaBanner({ heading, backgroundImage, logoMark, ctaLabel, ctaHref }: CtaBannerSection) {
  return (
    <section className="py-14">
      {/* Same Container every other section uses, so this card's left/right edges
          align with the grids above/below it, rather than a separate custom inset. */}
      <Container>
        <div className="relative flex aspect-[1280/656] items-center justify-center overflow-hidden rounded-[10px] bg-ink">
          {backgroundImage ? (
            <Image
              src={getStrapiMediaURL(backgroundImage.url, backgroundImage.updatedAt)}
              alt={backgroundImage.alternativeText ?? ''}
              fill
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-ink/40" aria-hidden="true" />

          <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center text-white">
            {logoMark ? (
              <div className="relative h-10 w-10">
                <Image
                  src={getStrapiMediaURL(logoMark.url, logoMark.updatedAt)}
                  alt={logoMark.alternativeText ?? ''}
                  fill
                  className="object-contain"
                />
              </div>
            ) : null}
            <h2 className="max-w-xl text-balance font-display text-3xl font-medium sm:text-4xl">{heading}</h2>
            {ctaLabel && ctaHref ? (
              <Button href={ctaHref} variant="light" className="mt-2">
                {ctaLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
