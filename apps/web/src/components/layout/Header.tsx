import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { getStrapiMediaURL } from '@/lib/strapi/media';
import type { HeaderData } from '@/lib/strapi/types';
import { MobileNav } from './MobileNav';

function CartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className="text-ink"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function ChevronDownIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
      className={`inline-block align-middle ${className}`}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header({ data }: { data: HeaderData | null }) {
  if (!data) return null;

  const { logo, navItems, ctaLabel, ctaHref } = data;

  return (
    <header className="relative border-b border-ink/10 bg-cream">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          {logo ? (
            <Image
              src={getStrapiMediaURL(logo.url, logo.updatedAt)}
              alt={logo.alternativeText ?? ''}
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          ) : null}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <div key={item.id} className="group relative">
              {item.href ? (
                <Link href={item.href} className="text-sm text-ink hover:text-ink/70">
                  {item.label}
                  {item.children.length > 0 ? <ChevronDownIcon className="ml-1" /> : null}
                </Link>
              ) : (
                <span className="cursor-default text-sm text-ink">
                  {item.label}
                  {item.children.length > 0 ? <ChevronDownIcon className="ml-1" /> : null}
                </span>
              )}
              {item.children.length > 0 ? (
                <div className="invisible absolute top-full left-0 z-10 min-w-40 rounded-md border border-ink/10 bg-cream py-2 opacity-0 shadow-md transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.href}
                      target={child.openInNewTab ? '_blank' : undefined}
                      rel={child.openInNewTab ? 'noreferrer' : undefined}
                      className="block px-4 py-2 text-sm text-ink hover:bg-ink/5"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1 text-sm text-ink lg:inline-flex">
            En <ChevronDownIcon />
          </span>
          {ctaLabel && ctaHref ? <Button href={ctaHref}>{ctaLabel}</Button> : null}
          <CartIcon />
          <MobileNav navItems={navItems} />
        </div>
      </Container>
    </header>
  );
}
