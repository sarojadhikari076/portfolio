import { profile } from '@/data/profile';

import type { Post } from './content/posts';
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from './site';

/** JSON-LD for `<script type="application/ld+json">`, with `<` escaped so it can't close the tag. */
export function toJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function personAndSite() {
  const url = siteUrl();

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${url}/#person`,
        name: profile.name,
        jobTitle: 'Senior Full Stack Engineer',
        url,
        email: `mailto:${profile.email}`,
        address: { '@type': 'PostalAddress', addressLocality: 'Birmingham', addressCountry: 'GB' },
        sameAs: [profile.links.github, profile.links.linkedin],
        knowsAbout: [
          'TypeScript',
          'Node.js',
          'NestJS',
          'React',
          'Next.js',
          'PostgreSQL',
          'AWS',
          'Distributed systems',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        author: { '@id': `${url}/#person` },
        inLanguage: 'en-GB',
      },
    ],
  };
}

export function blogPosting({ slug, frontmatter }: Post) {
  const url = `${siteUrl()}/writing/${slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.publishedAt.toISOString(),
    dateModified: (frontmatter.updatedAt ?? frontmatter.publishedAt).toISOString(),
    url,
    mainEntityOfPage: url,
    keywords: frontmatter.tags.join(', '),
    author: { '@id': `${siteUrl()}/#person` },
    image: `${url}/opengraph-image`,
  };
}
