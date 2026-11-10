import { describe, expect, it } from 'vitest';

import type { Post } from './content/posts';
import { escapeXml, renderFeed } from './feed';

const post = (slug: string, title: string, date: string): Post => ({
  slug,
  readingMinutes: 3,
  headings: [],
  frontmatter: {
    title,
    description: 'A description long enough to pass the schema, about <tags> & "quotes".',
    publishedAt: new Date(`${date}T00:00:00Z`),
    tags: ['databases'],
    draft: false,
  },
});

describe('renderFeed', () => {
  const xml = renderFeed({
    siteUrl: 'https://example.dev',
    title: 'Writing',
    description: 'Notes',
    posts: [post('newer', 'Newer & better', '2026-11-10'), post('older', 'Older', '2026-10-01')],
  });

  it('escapes text so the XML stays well-formed', () => {
    expect(xml).toContain('<title>Newer &amp; better</title>');
    expect(xml).toContain('&lt;tags&gt; &amp; &quot;quotes&quot;');
    expect(escapeXml(`'`)).toBe('&apos;');
  });

  it('links each item to its canonical URL', () => {
    expect(xml).toContain('<guid isPermaLink="true">https://example.dev/writing/older</guid>');
  });

  it('dates the feed by its newest post', () => {
    expect(xml).toContain('<lastBuildDate>Tue, 10 Nov 2026 00:00:00 GMT</lastBuildDate>');
  });
});
