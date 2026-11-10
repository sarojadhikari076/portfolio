import type { Route } from 'next';

import { profile } from '@/data/profile';

export const SITE_NAME = profile.name;

export const SITE_DESCRIPTION =
  'Senior full-stack engineer in Birmingham, UK. Case studies and writing on distributed systems, TypeScript and the work of shipping them.';

export const REPOSITORY_URL = 'https://github.com/sarojadhikari076/portfolio';

export type NavItem = { href: Route; label: string };

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/work', label: 'work' },
  { href: '/writing', label: 'writing' },
  { href: '/about', label: 'about' },
  { href: '/resume', label: 'résumé' },
];

/**
 * The canonical origin. Vercel sets the production domain at build time on every deployment,
 * previews included, so canonical links and share cards always point at production.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;

  return 'http://localhost:3000';
}
