import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Kicker } from '@/components/ui/Kicker';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { IndustryShowcaseSection } from '@/lib/strapi/types';

/**
 * Static preview (first industry only, no click-to-swap) rather than the fully
 * interactive sidebar from the design — per the agreed time-budget simplification for
 * this section. The sidebar itself is still fully CMS-driven (every industry listed).
 */
export function IndustryShowcase({ kicker, heading, industries }: IndustryShowcaseSection) {
  const active = industries[0];

  return (
    <section className="py-20 sm:py-28">
      <Container className="flex flex-col items-center text-center">
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <SectionHeading className="mt-4 max-w-3xl">{heading}</SectionHeading>
      </Container>

      {active ? (
        <Container className="mt-14 grid grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-[320px_1fr]">
          <div className="flex flex-col justify-center gap-1 bg-ink px-8 py-10">
            {industries.map((industry, index) => (
              <div
                key={industry.id}
                className={`flex items-center justify-between gap-2 py-3 text-lg ${
                  index === 0 ? 'text-cream' : 'text-cream/40'
                }`}
              >
                <span>{industry.name}</span>
                {index === 0 ? <span aria-hidden="true">→</span> : null}
              </div>
            ))}
          </div>

          <div className="relative min-h-[360px]">
            <Image
              src={getStrapiMediaURL(active.image.url, active.image.updatedAt)}
              alt={active.image.alternativeText ?? ''}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
            <div className="relative flex h-full flex-col justify-end gap-3 p-8 text-cream">
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
              {active.description ? (
                <p className="max-w-md text-sm text-cream/80">{active.description}</p>
              ) : null}
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
        </Container>
      ) : null}
    </section>
  );
}
