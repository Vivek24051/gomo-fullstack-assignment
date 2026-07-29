import type { ReactNode } from 'react';

export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`font-display text-sm text-ink/70 italic ${className}`}>{children}</p>;
}
