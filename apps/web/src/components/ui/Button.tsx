import Link from 'next/link';
import type { ReactNode } from 'react';

const variants = {
  dark: 'bg-ink text-cream hover:bg-ink/90',
  light: 'bg-cream text-ink hover:bg-cream/90',
} as const;

export function Button({
  href,
  children,
  variant = 'dark',
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
