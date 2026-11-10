import type { MetadataRoute } from 'next';

import { getPosts } from '@/lib/content/posts';
import { getProjects } from '@/lib/content/projects';
import { siteUrl } from '@/lib/site';

const STATIC_ROUTES = ['', '/work', '/writing', '/about', '/resume', '/colophon'];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl();

  return [
    ...STATIC_ROUTES.map((route) => ({ url: `${origin}${route}` })),
    ...getProjects().map(({ slug }) => ({ url: `${origin}/work/${slug}` })),
    ...getPosts().map(({ slug, frontmatter }) => ({
      url: `${origin}/writing/${slug}`,
      lastModified: frontmatter.updatedAt ?? frontmatter.publishedAt,
    })),
  ];
}
