'use client';

import { ToggleButton, ToggleButtonGroup } from '@heroui/react';
import Link from 'next/link';
import { useState } from 'react';

export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateLabel: string;
  readingMinutes: number;
  tags: readonly string[];
  draft: boolean;
};

const ALL = 'all';

type PostFilterProps = { posts: readonly PostSummary[]; tags: readonly string[] };

/** The list is server-rendered in full; the filter only hides rows, so it works without it. */
export function PostFilter({ posts, tags }: PostFilterProps) {
  const [selected, setSelected] = useState<string>(ALL);
  const visible = selected === ALL ? posts : posts.filter((post) => post.tags.includes(selected));

  return (
    <>
      <ToggleButtonGroup
        aria-label="Filter by topic"
        className="flex-wrap"
        disallowEmptySelection
        selectedKeys={new Set([selected])}
        selectionMode="single"
        size="sm"
        onSelectionChange={(keys) => {
          const [key] = [...keys];
          setSelected(typeof key === 'string' ? key : ALL);
        }}
      >
        {[ALL, ...tags].map((tag) => (
          <ToggleButton key={tag} className="font-mono text-xs" id={tag}>
            {tag}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <ol aria-live="polite" className="mt-6 divide-y divide-separator border-t border-separator">
        {visible.map((post) => (
          <li key={post.slug}>
            <Link
              className="group grid gap-2 py-6 md:grid-cols-[10rem_minmax(0,1fr)_8rem] md:gap-8"
              href={`/writing/${post.slug}`}
            >
              <time className="pt-1 label-mono" dateTime={post.date}>
                {post.dateLabel}
              </time>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-balance transition-colors group-hover:text-accent-ink">
                  {post.title}
                  {post.draft ? <span className="ms-2 label-mono">draft</span> : null}
                </h2>
                <p className="mt-1 leading-relaxed text-pretty text-muted">{post.description}</p>
              </div>
              <p className="pt-1 label-mono md:text-end">
                {post.readingMinutes} min · {post.tags.join(', ')}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
