import Link from 'next/link';

import type { Post } from '@/lib/content/posts';
import { formatDate } from '@/lib/dates';

type PostListProps = { posts: readonly Post[] };

export function PostList({ posts }: PostListProps) {
  return (
    <ol className="divide-y divide-separator">
      {posts.map(({ slug, frontmatter, readingMinutes }) => (
        <li key={slug}>
          <Link
            className="group grid gap-2 py-6 md:grid-cols-[10rem_minmax(0,1fr)_8rem] md:gap-8"
            href={`/writing/${slug}`}
          >
            <time
              className="pt-1 label-mono"
              dateTime={frontmatter.publishedAt.toISOString().slice(0, 10)}
            >
              {formatDate(frontmatter.publishedAt).toLowerCase()}
            </time>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-balance transition-colors group-hover:text-accent-ink">
                {frontmatter.title}
                {frontmatter.draft ? <span className="ms-2 label-mono">draft</span> : null}
              </h3>
              <p className="mt-1 leading-relaxed text-pretty text-muted">
                {frontmatter.description}
              </p>
            </div>
            <p className="pt-1 label-mono md:text-end">
              {readingMinutes} min · {frontmatter.tags[0]}
            </p>
          </Link>
        </li>
      ))}
    </ol>
  );
}
