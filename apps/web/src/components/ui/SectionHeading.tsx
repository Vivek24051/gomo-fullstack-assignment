import type { ReactNode } from 'react';

export function SectionHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`font-display text-3xl leading-tight font-medium text-ink sm:text-4xl lg:text-5xl ${className}`}
    >
      {children}
    </h2>
  );
}
