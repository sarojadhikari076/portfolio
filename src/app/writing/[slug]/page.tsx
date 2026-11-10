import { typographyVariants } from '@heroui/styles';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLink } from '@/components/ui/arrow-link';
import { TableOfContents } from '@/features/writing/table-of-contents';
import { loadPostContent } from '@/lib/content/mdx';
import { getNeighbours, getPost, getPosts } from '@/lib/content/posts';
import { getProject } from '@/lib/content/projects';
import { formatDate } from '@/lib/dates';
import { blogPosting, toJsonLd } from '@/lib/structured-data';

type PostPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};

  const { title, description, publishedAt, updatedAt, tags } = post.frontmatter;

  return {
    title,
    description,
    alternates: { canonical: `/writing/${post.slug}` },
    keywords: tags,
    openGraph: {
      type: 'article',
      url: `/writing/${post.slug}`,
      publishedTime: publishedAt.toISOString(),
      modifiedTime: (updatedAt ?? publishedAt).toISOString(),
      tags,
    },
    robots: post.frontmatter.draft ? { index: false } : undefined,
  };
}

const prose = typographyVariants().prose();

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { title, description, publishedAt, updatedAt, tags, project } = post.frontmatter;
  const Content = await loadPostContent(slug);
  const { newer, older } = getNeighbours(slug);
  const fromProject = project ? getProject(project) : undefined;

  return (
    <main>
      <script
        dangerouslySetInnerHTML={{ __html: toJsonLd(blogPosting(post)) }}
        type="application/ld+json"
      />
      <header className="border-b border-separator grid-backdrop">
        <div className="mx-auto max-w-site px-4 pt-16 pb-12 sm:px-6 sm:pt-24">
          <p className="label-mono">
            <time dateTime={publishedAt.toISOString().slice(0, 10)}>
              {formatDate(publishedAt).toLowerCase()}
            </time>
            {updatedAt ? ` · updated ${formatDate(updatedAt).toLowerCase()}` : null} ·{' '}
            {post.readingMinutes} min read · {tags.join(', ')}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted">
            {description}
          </p>
          {fromProject ? (
            <p className="mt-6 label-mono">
              from the{' '}
              <Link
                className="text-foreground hover:text-accent-ink"
                href={`/work/${fromProject.slug}`}
              >
                {fromProject.frontmatter.title.toLowerCase()} case study
              </Link>
            </p>
          ) : null}
        </div>
      </header>

      <div className="mx-auto grid max-w-site gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <article className={prose}>
          <Content />
        </article>
        <aside className="hidden lg:block">
          <TableOfContents className="sticky top-24" headings={post.headings} />
        </aside>
      </div>

      <nav
        aria-label="More writing"
        className="mx-auto grid max-w-site gap-6 border-t border-separator px-4 pt-10 sm:grid-cols-2 sm:px-6"
      >
        {older ? (
          <Link className="group" href={`/writing/${older.slug}`}>
            <p className="label-mono">previous</p>
            <p className="mt-1 font-semibold tracking-tight group-hover:text-accent-ink">
              {older.frontmatter.title}
            </p>
          </Link>
        ) : (
          <span />
        )}
        {newer ? (
          <Link className="group sm:text-end" href={`/writing/${newer.slug}`}>
            <p className="label-mono">next</p>
            <p className="mt-1 font-semibold tracking-tight group-hover:text-accent-ink">
              {newer.frontmatter.title}
            </p>
          </Link>
        ) : (
          <ArrowLink className="sm:justify-self-end" href="/writing">
            all writing
          </ArrowLink>
        )}
      </nav>
    </main>
  );
}
