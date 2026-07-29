import type { ReactNode } from 'react';

export function SectionHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`font-title text-center text-[36px] leading-[48px] font-normal tracking-[0] text-ink ${className}`}
    >
      {children}
    </h2>
  );
}
