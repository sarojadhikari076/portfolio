import { readCollection } from './collection';
import { postFrontmatter } from './schema';

export type Post = ReturnType<typeof readCollection<typeof postFrontmatter>>[number];

const showDrafts = process.env.NODE_ENV === 'development';

let cache: Post[] | undefined;

/** Newest first. Drafts appear only in development. */
export function getPosts(): Post[] {
  cache ??= readCollection('writing', postFrontmatter)
    .filter((post) => showDrafts || !post.frontmatter.draft)
    .sort((a, b) => b.frontmatter.publishedAt.getTime() - a.frontmatter.publishedAt.getTime());

  return cache;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

/** The posts either side of this one, by date. */
export function getNeighbours(slug: string): { newer?: Post; older?: Post } {
  const posts = getPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  return { newer: posts[index - 1], older: posts[index + 1] };
}

export function getPostsForProject(project: string): Post[] {
  return getPosts().filter((post) => post.frontmatter.project === project);
}

export function getTags(): string[] {
  return [...new Set(getPosts().flatMap((post) => post.frontmatter.tags))].sort();
}
