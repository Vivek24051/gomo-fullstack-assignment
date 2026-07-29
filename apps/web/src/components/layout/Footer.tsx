import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { FooterData, SocialPlatform } from '@/lib/strapi/types';

const socialIcons: Record<SocialPlatform, ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 4h-2a4 4 0 0 0-4 4v2H7v3h2v7h3v-7h2.5l.5-3H12V8a1 1 0 0 1 1-1h2z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="7" y1="10" x2="7" y2="17" />
      <circle cx="7" cy="6.5" r="1" fill="currentColor" stroke="none" />
      <path d="M11 17v-4a2 2 0 0 1 4 0v4" />
      <line x1="11" y1="10" x2="11" y2="17" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M10 9.5v5l5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 4c0 2.5 2 4.5 4.5 4.5" />
    </svg>
  ),
};

export function Footer({ data }: { data: FooterData | null }) {
  if (!data) return null;

  const {
    wordmark,
    columns,
    newsletterHeading,
    newsletterSubtext,
    contactHeading,
    contactPhone,
    contactEmail,
    visitingAddress,
    postalAddress,
    socialLinks,
    isoBadges,
    legalLinks,
    copyrightText,
  } = data;

  const hasContact = contactPhone || contactEmail || visitingAddress || postalAddress;
  const badges = isoBadges ?? [];

  return (
    <footer className="mt-auto overflow-hidden bg-ink text-cream">
      {wordmark ? (
        <p
          aria-hidden="true"
          className="-mb-6 truncate px-4 pt-8 text-center font-display text-[18vw] leading-none font-medium text-cream/10 select-none sm:text-[14vw]"
        >
          {wordmark}
        </p>
      ) : null}

      <Container className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-[2fr_1fr]">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.id}>
              <h3 className="text-sm font-medium text-cream">{column.title}</h3>
              <ul className="mt-4 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noreferrer' : undefined}
                      className="text-sm text-cream/70 hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {hasContact ? (
            <div>
              {contactHeading ? <h3 className="text-sm font-medium text-cream">{contactHeading}</h3> : null}
              <ul className="mt-4 flex flex-col gap-2 text-sm text-cream/70">
                {contactPhone ? <li>{contactPhone}</li> : null}
                {contactEmail ? <li>{contactEmail}</li> : null}
                {visitingAddress ? <li className="whitespace-pre-line">{visitingAddress}</li> : null}
                {postalAddress ? <li className="whitespace-pre-line">{postalAddress}</li> : null}
              </ul>
            </div>
          ) : null}
        </div>

        <div>
          {newsletterHeading ? <h3 className="font-display text-xl text-cream">{newsletterHeading}</h3> : null}
          {newsletterSubtext ? <p className="mt-2 text-sm text-cream/70">{newsletterSubtext}</p> : null}

          <NewsletterForm />

          {socialLinks.length > 0 ? (
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.platform}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 text-cream"
                >
                  <span className="h-4 w-4">{socialIcons[social.platform]}</span>
                </Link>
              ))}
            </div>
          ) : null}

          {badges.length > 0 ? (
            <div className="mt-6 flex gap-4">
              {badges.map((badge) => (
                <div key={badge.id} className="relative h-12 w-12">
                  <Image
                    src={getStrapiMediaURL(badge.url, badge.updatedAt)}
                    alt={badge.alternativeText ?? ''}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Container>

      <div className="border-t border-cream/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-cream/60 sm:flex-row">
          {copyrightText ? <span>{copyrightText}</span> : <span />}
          {legalLinks.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  target={link.openInNewTab ? '_blank' : undefined}
                  rel={link.openInNewTab ? 'noreferrer' : undefined}
                  className="hover:text-cream"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </Container>
      </div>
    </footer>
  );
}
