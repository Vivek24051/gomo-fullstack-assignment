'use client';

import Image from 'next/image';
import { useRef, type PointerEvent as ReactPointerEvent } from 'react';

export interface BrandLogo {
  id: number;
  name: string;
  logoUrl: string;
  logoAlt: string;
}

/**
 * Native overflow-x scroll (so touch/trackpad swipe keeps working for free) plus manual
 * pointer-drag support so a mouse can drag the strip like a carousel — a plain mouse has
 * no native way to drag-scroll an overflow container. The scrollbar itself is hidden via
 * the vendor-specific rules below; there is no core Tailwind utility for this.
 *
 * Takes pre-resolved logo URLs rather than raw Strapi media objects — getStrapiMediaURL()
 * is server-only and can't run inside this Client Component, so IntroStats.tsx resolves
 * them before passing brands down.
 */
export function BrandsScroller({ brands }: { brands: BrandLogo[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startScrollLeft: number } | null>(null);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    drag.current = { startX: event.clientX, startScrollLeft: scroller.scrollLeft };
    scroller.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    if (!scroller || !drag.current) return;
    scroller.scrollLeft = drag.current.startScrollLeft - (event.clientX - drag.current.startX);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    drag.current = null;
    scrollerRef.current?.releasePointerCapture(event.pointerId);
  }

  return (
    <div
      ref={scrollerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="mt-8 flex cursor-grab touch-pan-y gap-4 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] select-none active:cursor-grabbing sm:px-8 lg:px-12 [&::-webkit-scrollbar]:hidden"
    >
      {brands.map((brand) => (
        <div
          key={brand.id}
          className="flex h-20 w-40 shrink-0 items-center justify-center rounded-md border border-ink/10 p-4"
        >
          <Image
            src={brand.logoUrl}
            alt={brand.logoAlt}
            width={120}
            height={48}
            draggable={false}
            className="h-full w-full object-contain grayscale"
          />
        </div>
      ))}
    </div>
  );
}
