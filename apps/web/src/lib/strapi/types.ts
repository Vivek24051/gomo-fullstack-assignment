/**
 * Typed shapes for every Strapi content-type and component modeled in Milestone 2
 * (apps/cms/src/api/**, apps/cms/src/components/**). Field names and nullability
 * mirror the schema.json files exactly — this is the contract between the two apps.
 */

export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number | null;
  height: number | null;
  mime: string;
}

export interface StrapiEntity {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// ---- Shared components ----

export interface SeoComponent {
  id: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: StrapiMedia | null;
}

// ---- Layout components (header/footer building blocks) ----

export interface LinkItem {
  id: number;
  label: string;
  href: string;
  openInNewTab: boolean;
}

export interface NavItem {
  id: number;
  label: string;
  href: string | null;
  children: LinkItem[];
}

export interface FooterColumn {
  id: number;
  title: string;
  links: LinkItem[];
}

export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'youtube' | 'tiktok';

export interface SocialLink {
  id: number;
  platform: SocialPlatform;
  href: string;
}

// ---- Section sub-components ----

export interface StatItem {
  id: number;
  value: string;
  label: string;
}

export interface FeatureItem {
  id: number;
  icon: StrapiMedia;
  title: string;
  description: string;
}

// ---- Collections referenced by section components ----

export interface Industry extends StrapiEntity {
  name: string;
  icon: StrapiMedia | null;
  tags: string[] | null;
  description: string | null;
  image: StrapiMedia;
  href: string | null;
}

export interface CaseStudy extends StrapiEntity {
  title: string;
  subtitle: string | null;
  image: StrapiMedia;
  href: string | null;
}

export interface Insight extends StrapiEntity {
  title: string;
  tag: string | null;
  date: string | null;
  image: StrapiMedia;
  href: string | null;
}

export interface Brand extends StrapiEntity {
  name: string;
  logo: StrapiMedia;
}

// ---- Dynamic Zone section components ----
// `__component` is Strapi's discriminant field — PageBuilder switches on it.

export interface HeroSection {
  __component: 'sections.hero';
  id: number;
  kicker: string | null;
  heading: string;
  subheading: string | null;
  backgroundImage: StrapiMedia;
  showScrollCue: boolean;
}

export interface IntroStatsSection {
  __component: 'sections.intro-stats';
  id: number;
  kicker: string | null;
  heading: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  image: StrapiMedia | null;
  body: string | null;
  stats: StatItem[];
  brandsHeading: string | null;
  brands: Brand[];
}

export interface IndustryShowcaseSection {
  __component: 'sections.industry-showcase';
  id: number;
  kicker: string | null;
  heading: string;
  industries: Industry[];
}

export interface WhyChooseUsSection {
  __component: 'sections.why-choose-us';
  id: number;
  kicker: string | null;
  heading: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  features: FeatureItem[];
}

export interface CaseStudiesCarouselSection {
  __component: 'sections.case-studies-carousel';
  id: number;
  kicker: string | null;
  heading: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  caseStudies: CaseStudy[];
}

export interface InsightsGridSection {
  __component: 'sections.insights-grid';
  id: number;
  kicker: string | null;
  heading: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  insights: Insight[];
}

export interface CtaBannerSection {
  __component: 'sections.cta-banner';
  id: number;
  heading: string;
  backgroundImage: StrapiMedia;
  logoMark: StrapiMedia | null;
  ctaLabel: string | null;
  ctaHref: string | null;
}

export type PageSection =
  | HeroSection
  | IntroStatsSection
  | IndustryShowcaseSection
  | WhyChooseUsSection
  | CaseStudiesCarouselSection
  | InsightsGridSection
  | CtaBannerSection;

// ---- Top-level content-types ----

export interface Page extends StrapiEntity {
  title: string;
  slug: string;
  sections: PageSection[];
  seo: SeoComponent | null;
}

export interface HeaderData extends StrapiEntity {
  logo: StrapiMedia;
  navItems: NavItem[];
  ctaLabel: string | null;
  ctaHref: string | null;
}

export interface FooterData extends StrapiEntity {
  wordmark: string | null;
  columns: FooterColumn[];
  newsletterHeading: string | null;
  newsletterSubtext: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  visitingAddress: string | null;
  postalAddress: string | null;
  socialLinks: SocialLink[];
  isoBadges: StrapiMedia[];
  legalLinks: LinkItem[];
  copyrightText: string | null;
}

export interface GlobalData extends StrapiEntity {
  siteName: string;
  titleTemplate: string | null;
  defaultSeo: SeoComponent | null;
}

// ---- REST envelope shapes (Strapi v5 — flat attributes, no v4-style `attributes` wrapper) ----

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: { pagination?: StrapiPagination };
}

export interface StrapiSingleResponse<T> {
  data: T | null;
  meta: Record<string, unknown>;
}
