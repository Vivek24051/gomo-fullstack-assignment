'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export interface IndustryPreview {
  id: number;
  name: string;
  tags: string[] | null;
  description: string | null;
  href: string | null;
  imageUrl: string;
  imageAlt: string;
}

/**
 * Click-to-swap sidebar + preview panel. Takes pre-resolved image URLs rather than raw
 * Strapi media objects — getStrapiMediaURL() is server-only and can't run inside this
 * Client Component, so IndustryShowcase.tsx resolves them before passing industries down.
 */
export function IndustrySwitcher({ industries }: { industries: IndustryPreview[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = industries[activeIndex];

  return (
    <>
      <ul className="flex flex-col justify-center gap-1 overflow-hidden rounded-3xl bg-ink px-8 py-10">
        {industries.map((industry, index) => (
          <li key={industry.id}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-current={index === activeIndex}
              className={`flex w-full items-center justify-between gap-2 py-3 text-left text-lg transition-colors ${
                index === activeIndex ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <span>{industry.name}</span>
              {index === activeIndex ? <span aria-hidden="true">→</span> : null}
            </button>
          </li>
        ))}
      </ul>

      <div className="relative min-h-[360px] overflow-hidden rounded-3xl">
        <Image
          key={active.id}
          src={active.imageUrl}
          alt={active.imageAlt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-ink/50 p-8 text-white backdrop-blur-md">
          <h3 className="text-xl font-medium">{active.name}</h3>
          {active.tags && active.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {active.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-cream/40 px-3 py-1 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          {active.description ? <p className="max-w-md text-sm text-white/80">{active.description}</p> : null}
          {active.href ? (
            <Link
              href={active.href}
              className="mt-2 inline-flex items-center gap-1.5 self-end text-sm underline underline-offset-4"
            >
              Explore solutions <span aria-hidden="true">↗</span>
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}
