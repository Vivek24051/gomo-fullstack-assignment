import { Fraunces, Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { getHeader } from '@/lib/queries/get-header';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Display/heading serif — matches the design's oversized wordmark and section
// headings; body copy stays on Geist Sans (applied via `font-sans` below).
const fraunces = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
});

// No static `metadata` export here — title/description are CMS-driven and owned by
// each route's own `generateMetadata` (see lib/seo.ts), not hardcoded at the layout.

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Guarded: this fetch runs for every route via the shared root layout, so a
  // transient CMS failure here shouldn't take down every page — error.tsx can't
  // catch errors thrown by its own parent layout, only by what's inside it.
  const header = await getHeader().catch(() => null);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header data={header} />
        {children}
      </body>
    </html>
  );
}
