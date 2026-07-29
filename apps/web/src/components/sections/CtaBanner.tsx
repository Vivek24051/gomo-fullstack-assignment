import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { CtaBannerSection } from '@/lib/strapi/types';

export function CtaBanner({ heading, backgroundImage, logoMark, ctaLabel, ctaHref }: CtaBannerSection) {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden py-24">
      <Image
        src={getStrapiMediaURL(backgroundImage.url, backgroundImage.updatedAt)}
        alt={backgroundImage.alternativeText ?? ''}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/40" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center text-cream">
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
        <h2 className="text-balance font-display text-3xl font-medium sm:text-4xl lg:text-5xl">{heading}</h2>
        {ctaLabel && ctaHref ? (
          <Button href={ctaHref} variant="light" className="mt-2">
            {ctaLabel}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
