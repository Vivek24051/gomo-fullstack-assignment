import Image from 'next/image';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { HeroSection } from '@/lib/strapi/types';

export function Hero({ kicker, heading, subheading, backgroundImage, showScrollCue }: HeroSection) {
  const isVideo = backgroundImage.mime.startsWith('video/');
  const src = getStrapiMediaURL(backgroundImage.url, backgroundImage.updatedAt);
  const hasBottomContent = Boolean(subheading) || showScrollCue;

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      {/* Inset from the section's edges — Figma has the page's cream background showing
          as a gutter on both sides rather than a full-bleed edge-to-edge photo/video. */}
      <div className="absolute inset-x-6 inset-y-0 overflow-hidden rounded-[11px] sm:inset-x-8 lg:inset-x-12">
        {isVideo ? (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={src}
            alt={backgroundImage.alternativeText ?? ''}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-ink/40" aria-hidden="true" />
      </div>

      {/* Spread top-to-bottom rather than clustered in the middle — kicker near the top,
          heading in the middle, subtext + scroll cue near the bottom (matches Figma). */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-between px-6 py-16 text-center text-cream">
        {kicker ? <p className="text-sm sm:text-base">{kicker}</p> : null}
        <h1 className="text-balance font-display text-[clamp(2.5rem,9vw,8rem)] leading-[0.95] font-medium">
          {heading}
        </h1>
        {hasBottomContent ? (
          <div className="flex flex-col items-center gap-6">
            {subheading ? <p className="max-w-md text-sm text-balance sm:text-base">{subheading}</p> : null}
            {showScrollCue ? (
              <span aria-hidden="true" className="text-2xl">
                ↓
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
