'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type WheelEvent as ReactWheelEvent } from 'react';

export interface CaseStudyCard {
  id: number;
  title: string;
  subtitle: string | null;
  href: string | null;
  imageUrl: string;
  imageAlt: string;
}

/**
 * Native overflow-x scroll-snap (touch/trackpad swipe works for free) with the browser
 * scrollbar hidden and real dot pagination in its place, matching Figma — rather than
 * the plain visible scrollbar the CSS-only version left behind. Active dot tracks scroll
 * position via each card's offset; clicking a dot scrolls that card into view.
 */
export function CaseStudiesCarousel({ caseStudies }: { caseStudies: CaseStudyCard[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function handleScroll() {
      if (!scroller) return;
      // Compare each card's snap-start offset directly to scrollLeft — not to the
      // viewport's center point. On wide screens (2+ cards visible at once), the
      // viewport center can never geometrically reach the first/last card's center,
      // so only the middle dots would ever activate.
      let closestIndex = 0;
      let closestDistance = Infinity;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const distance = Math.abs(card.offsetLeft - scroller.scrollLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      setActiveIndex(closestIndex);
    }

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollToIndex(index: number) {
    cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }

  // A plain mouse wheel only ever produces vertical deltaY, which does nothing on an
  // overflow-x-only container by default (no scrollbar to grab now that it's hidden).
  // Redirect vertical wheel motion into horizontal scroll, same as most carousel UIs.
  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    if (!scroller || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    scroller.scrollLeft += event.deltaY;
    event.preventDefault();
  }

  return (
    <>
      <div
        ref={scrollerRef}
        onWheel={handleWheel}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 lg:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {caseStudies.map((caseStudy, index) => {
          const cardClassName =
            'group relative flex aspect-[4/5] w-[280px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl sm:w-[360px]';
          const hasBottomRow = Boolean(caseStudy.subtitle) || Boolean(caseStudy.href);
          const cardContent = (
            <>
              <Image
                src={caseStudy.imageUrl}
                alt={caseStudy.imageAlt}
                fill
                sizes="(min-width: 640px) 360px, 280px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col bg-ink/50 text-white backdrop-blur-md">
                <div className={`px-6 py-4 ${hasBottomRow ? 'border-b border-cream/20' : ''}`}>
                  <h3 className="font-title text-[24px] leading-[33px] font-normal tracking-[0]">
                    {caseStudy.title}
                  </h3>
                </div>
                {hasBottomRow ? (
                  <div className="flex items-center">
                    {caseStudy.subtitle ? (
                      <div className={`flex-1 px-6 py-4 ${caseStudy.href ? 'border-r border-cream/20' : ''}`}>
                        <p className="font-title text-[14px] leading-[14px] font-normal tracking-[0] text-white/80">
                          {caseStudy.subtitle}
                        </p>
                      </div>
                    ) : null}
                    {caseStudy.href ? (
                      <div className="px-6 py-4">
                        <span className="font-title shrink-0 text-[16px] leading-[18px] font-normal tracking-[0] underline underline-offset-4">
                          Read case <span aria-hidden="true">↗</span>
                        </span>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </>
          );

          // No dead `#` links: a card with no href renders as a plain container
          // (still shows the content) instead of an anchor that goes nowhere.
          return caseStudy.href ? (
            <Link
              key={caseStudy.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              href={caseStudy.href}
              className={cardClassName}
            >
              {cardContent}
            </Link>
          ) : (
            <div
              key={caseStudy.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={cardClassName}
            >
              {cardContent}
            </div>
          );
        })}
      </div>

      {caseStudies.length > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          {caseStudies.map((caseStudy, index) => (
            <button
              key={caseStudy.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => scrollToIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${index === activeIndex ? 'bg-ink' : 'bg-ink/25'}`}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
