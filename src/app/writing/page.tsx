import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';
import { PostFilter, type PostSummary } from '@/features/writing/post-filter';
import { getPosts, getTags } from '@/lib/content/posts';
import { formatDate } from '@/lib/dates';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'How I built things and why: concurrency, event-driven systems, payments, offline apps and the craft around them.',
  alternates: { canonical: '/writing' },
};

export default function WritingPage() {
  const posts: PostSummary[] = getPosts().map(({ slug, frontmatter, readingMinutes }) => ({
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.publishedAt.toISOString().slice(0, 10),
    dateLabel: formatDate(frontmatter.publishedAt).toLowerCase(),
    readingMinutes,
    tags: frontmatter.tags,
    draft: frontmatter.draft,
  }));

  return (
    <main>
      <PageHeader
        eyebrow="writing"
        lede="Notes from building real systems: what I chose, what it cost, and the code that carries it. Most of it comes out of Mela."
        title="How I built it"
      >
        <p className="mt-6 label-mono">
          <a className="hover:text-foreground" href="/feed.xml">
            rss feed
          </a>
        </p>
      </PageHeader>
      <div className="mx-auto max-w-site px-4 pt-10 sm:px-6">
        <PostFilter posts={posts} tags={getTags()} />
      </div>
    </main>
  );
}
