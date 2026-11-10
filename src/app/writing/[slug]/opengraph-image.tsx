import { getPost, getPosts } from '@/lib/content/posts';
import { formatDate } from '@/lib/dates';
import { OG_SIZE, renderShareCard } from '@/lib/og';

export const alt = 'Post title and summary';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

type ImageProps = { params: Promise<{ slug: string }> };

export default async function Image({ params }: ImageProps) {
  const post = getPost((await params).slug);

  return renderShareCard({
    eyebrow: post
      ? `writing · ${formatDate(post.frontmatter.publishedAt).toLowerCase()} · ${String(post.readingMinutes)} min read`
      : 'writing',
    title: post?.frontmatter.title ?? 'Writing',
  });
}
