'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { NavItem } from '@/lib/strapi/types';

export function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Toggle menu"
        className="flex h-8 w-8 items-center justify-center text-ink"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
        </svg>
      </button>

      {open ? (
        <nav className="absolute inset-x-0 top-20 z-20 border-b border-ink/10 bg-cream px-6 py-4">
          <ul className="flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.id}>
                {item.href ? (
                  <Link href={item.href} className="text-sm text-ink" onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-sm text-ink">{item.label}</span>
                )}
                {item.children.length > 0 ? (
                  <ul className="mt-2 flex flex-col gap-2 pl-4">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={child.href}
                          target={child.openInNewTab ? '_blank' : undefined}
                          rel={child.openInNewTab ? 'noreferrer' : undefined}
                          className="text-sm text-ink/70"
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
