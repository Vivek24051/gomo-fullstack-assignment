import Link from 'next/link';
import type { ReactNode } from 'react';

export function ArrowLink({
  href,
  children,
  arrow = '→',
  className = '',
}: {
  href: string;
  children: ReactNode;
  arrow?: '→' | '↗';
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-ink underline underline-offset-4 hover:no-underline ${className}`}
    >
      {children}
      <span aria-hidden="true">{arrow}</span>
    </Link>
  );
}
