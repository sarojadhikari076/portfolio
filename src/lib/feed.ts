import type { Post } from './content/posts';

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

export function escapeXml(text: string): string {
  return text.replace(/[&<>"']/g, (character) => ESCAPES[character] ?? character);
}

type FeedArgs = { siteUrl: string; title: string; description: string; posts: readonly Post[] };

/** RSS 2.0, written by hand: it's a dozen lines of XML and doesn't need a dependency. */
export function renderFeed({ siteUrl, title, description, posts }: FeedArgs): string {
  const items = posts
    .map(({ slug, frontmatter }) => {
      const url = `${siteUrl}/writing/${slug}`;
      return [
        '    <item>',
        `      <title>${escapeXml(frontmatter.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(frontmatter.description)}</description>`,
        `      <pubDate>${frontmatter.publishedAt.toUTCString()}</pubDate>`,
        ...frontmatter.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const lastBuild = posts[0]?.frontmatter.publishedAt ?? new Date(0);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}/writing</link>
    <description>${escapeXml(description)}</description>
    <language>en-gb</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
