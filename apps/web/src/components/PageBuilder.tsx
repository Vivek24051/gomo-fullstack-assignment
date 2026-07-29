import type { PageSection } from '@/lib/strapi/types';

/**
 * Temporary stand-in for every section renderer (Hero, IntroStats, etc. — Milestone 4
 * scope). Deliberately unstyled/minimal: this exists to prove the CMS → typed fetch →
 * registry dispatch → render pipeline end-to-end without pre-building throwaway UI.
 * The heading/kicker shown are the real fetched CMS values, not fixtures.
 */
function UnimplementedSection({
  component,
  heading,
  kicker,
}: {
  component: string;
  heading: string;
  kicker?: string | null;
}) {
  return (
    <section data-section={component} className="border-y border-dashed border-gray-300 p-6">
      <p className="text-xs tracking-wide text-gray-400 uppercase">
        {component} — UI not implemented yet (Milestone 4)
      </p>
      {kicker ? <p className="mt-2 text-sm text-gray-500">{kicker}</p> : null}
      <h2 className="mt-1 text-xl font-semibold text-gray-800">{heading}</h2>
    </section>
  );
}

/**
 * `__component` → renderer registry. All seven known section types currently point at
 * the same placeholder (Milestone 3 scope); an entry whose `__component` isn't in this
 * map is skipped with a dev-only warning instead of crashing — forward-compatible with
 * new section types added in the CMS later without a frontend deploy.
 */
const sectionRegistry: Record<PageSection['__component'], true> = {
  'sections.hero': true,
  'sections.intro-stats': true,
  'sections.industry-showcase': true,
  'sections.why-choose-us': true,
  'sections.case-studies-carousel': true,
  'sections.insights-grid': true,
  'sections.cta-banner': true,
};

export function PageBuilder({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section) => {
        if (!(section.__component in sectionRegistry)) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`PageBuilder: no renderer registered for "${section.__component}"`);
          }
          return null;
        }

        const kicker = 'kicker' in section ? section.kicker : null;

        return (
          <UnimplementedSection
            key={`${section.__component}-${section.id}`}
            component={section.__component}
            heading={section.heading}
            kicker={kicker}
          />
        );
      })}
    </>
  );
}
