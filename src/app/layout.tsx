import '@/styles/globals.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Schibsted_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';

import { Providers } from '@/components/layout/providers';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SkipLink } from '@/components/layout/skip-link';
import { profile } from '@/data/profile';
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from '@/lib/site';

const sans = Schibsted_Grotesk({ subsets: ['latin'], variable: '--font-schibsted' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} · ${profile.role}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: siteUrl() }],
  creator: SITE_NAME,
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': [{ url: '/feed.xml', title: `${SITE_NAME} · writing` }] },
  },
  openGraph: { siteName: SITE_NAME, type: 'website', locale: 'en_GB', url: '/' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#0b0c0e',
  colorScheme: 'dark light',
};

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en-GB"
      data-theme="dark"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <Providers>
          <SiteHeader />
          <div className="flex flex-1 flex-col" id="main">
            {children}
          </div>
          <SiteFooter />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
