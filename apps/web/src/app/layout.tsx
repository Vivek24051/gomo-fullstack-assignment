import { Fraunces, Geist, Geist_Mono } from 'next/font/google';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
