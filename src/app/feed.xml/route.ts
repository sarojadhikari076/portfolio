import { getPosts } from '@/lib/content/posts';
import { renderFeed } from '@/lib/feed';
import { SITE_NAME, siteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const xml = renderFeed({
    siteUrl: siteUrl(),
    title: `${SITE_NAME} · writing`,
    description: 'How I built it: notes from building real systems.',
    posts: getPosts(),
  });

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
