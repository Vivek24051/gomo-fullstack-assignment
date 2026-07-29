import { Fraunces, Geist, Geist_Mono, Inter } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { getFooter } from '@/lib/queries/get-footer';
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

// Display/heading serif — matches the design's oversized Hero wordmark; body copy
// stays on Geist Sans (applied via `font-sans` below).
const fraunces = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
});

// Section titles (SectionHeading) use Inter per Figma's typography spec — a distinct
// treatment from the Hero's oversized serif wordmark.
const inter = Inter({
  variable: '--font-title',
  subsets: ['latin'],
});

// No static `metadata` export here — title/description are CMS-driven and owned by
// each route's own `generateMetadata` (see lib/seo.ts), not hardcoded at the layout.

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Guarded: these fetches run for every route via the shared root layout, so a
  // transient CMS failure here shouldn't take down every page — error.tsx can't
  // catch errors thrown by its own parent layout, only by what's inside it.
  const [header, footer] = await Promise.all([
    getHeader().catch(() => null),
    getFooter().catch(() => null),
  ]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header data={header} />
        {children}
        <Footer data={footer} />
      </body>
    </html>
  );
}
