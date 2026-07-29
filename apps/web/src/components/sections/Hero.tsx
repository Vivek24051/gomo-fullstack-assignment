import Image from 'next/image';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { HeroSection } from '@/lib/strapi/types';

export function Hero({ kicker, heading, subheading, backgroundImage, showScrollCue }: HeroSection) {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
      <Image
        src={getStrapiMediaURL(backgroundImage.url)}
        alt={backgroundImage.alternativeText ?? ''}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/40" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-24 text-center text-cream">
        {kicker ? <p className="text-sm sm:text-base">{kicker}</p> : null}
        <h1 className="text-balance font-display text-[clamp(2.5rem,9vw,8rem)] leading-[0.95] font-medium">
          {heading}
        </h1>
        {subheading ? <p className="max-w-md text-sm text-balance sm:text-base">{subheading}</p> : null}
        {showScrollCue ? (
          <span aria-hidden="true" className="mt-4 text-2xl">
            ↓
          </span>
        ) : null}
      </div>
    </section>
  );
}
