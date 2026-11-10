import type { MetadataRoute } from 'next';

import { profile } from '@/data/profile';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} · ${profile.role}`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'browser',
    background_color: '#0b0c0e',
    theme_color: '#0b0c0e',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
