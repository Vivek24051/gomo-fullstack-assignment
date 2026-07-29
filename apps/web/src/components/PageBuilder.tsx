import { CaseStudies } from '@/components/sections/CaseStudies';
import { Hero } from '@/components/sections/Hero';
import { IndustryShowcase } from '@/components/sections/IndustryShowcase';
import { IntroStats } from '@/components/sections/IntroStats';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import type { PageSection } from '@/lib/strapi/types';

/**
 * Temporary stand-in for every section renderer not yet built. Deliberately
 * unstyled/minimal: proves the CMS → typed fetch → dispatch → render pipeline for
 * sections still pending, without pre-building throwaway UI. The heading/kicker
 * shown are the real fetched CMS values, not fixtures.
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
        {component} — UI not implemented yet
      </p>
      {kicker ? <p className="mt-2 text-sm text-gray-500">{kicker}</p> : null}
      <h2 className="mt-1 text-xl font-semibold text-gray-800">{heading}</h2>
    </section>
  );
}

/**
 * `__component` → renderer dispatch. A `switch` (rather than an object registry) so
 * each case narrows `section` to its exact Strapi type — `<Hero {...section} />` gets
 * fully-typed props, not a loosely-typed common subset. An unrecognized `__component`
 * (a new section type added in the CMS later) is skipped with a dev-only warning
 * instead of crashing — forward-compatible without a frontend deploy.
 */
export function PageBuilder({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section) => {
        const key = `${section.__component}-${section.id}`;

        switch (section.__component) {
          case 'sections.hero':
            return <Hero key={key} {...section} />;

          case 'sections.intro-stats':
            return <IntroStats key={key} {...section} />;

          case 'sections.why-choose-us':
            return <WhyChooseUs key={key} {...section} />;

          case 'sections.industry-showcase':
            return <IndustryShowcase key={key} {...section} />;

          case 'sections.case-studies-carousel':
            return <CaseStudies key={key} {...section} />;

          case 'sections.insights-grid':
          case 'sections.cta-banner':
            return (
              <UnimplementedSection
                key={key}
                component={section.__component}
                heading={section.heading}
                kicker={'kicker' in section ? section.kicker : null}
              />
            );

          default:
            // `section` is typed `never` here since the switch is exhaustive over the
            // current PageSection union — but a real, unrecognized __component can
            // still arrive at runtime if the CMS adds a section type before the
            // frontend's types catch up, so this branch stays as a graceful skip.
            if (process.env.NODE_ENV !== 'production') {
              console.warn('PageBuilder: no renderer registered for section', section);
            }
            return null;
        }
      })}
    </>
  );
}
