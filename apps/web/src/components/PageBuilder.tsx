import { CaseStudies } from '@/components/sections/CaseStudies';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { Hero } from '@/components/sections/Hero';
import { IndustryShowcase } from '@/components/sections/IndustryShowcase';
import { InsightsGrid } from '@/components/sections/InsightsGrid';
import { IntroStats } from '@/components/sections/IntroStats';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import type { PageSection } from '@/lib/strapi/types';

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
            return <InsightsGrid key={key} {...section} />;

          case 'sections.cta-banner':
            return <CtaBanner key={key} {...section} />;

          default:
            // `section` is typed `never` here since the switch is exhaustive over the
            // full PageSection union (all 7 CMS section types now render real
            // components) — but a real, unrecognized __component can still arrive at
            // runtime if the CMS adds a new section type before the frontend's types
            // catch up, so this branch stays as a graceful skip rather than a crash.
            if (process.env.NODE_ENV !== 'production') {
              console.warn('PageBuilder: no renderer registered for section', section);
            }
            return null;
        }
      })}
    </>
  );
}
