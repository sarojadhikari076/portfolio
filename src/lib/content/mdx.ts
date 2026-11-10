import type { MDXContent } from 'mdx/types';

type MdxModule = { default: MDXContent };

/*
 * A fixed prefix, so the bundler knows exactly which files the import can reach. Every page is
 * generated at build time, so this runs once per slug.
 */

export async function loadPostContent(slug: string): Promise<MDXContent> {
  const loaded = (await import(`@content/writing/${slug}.mdx`)) as MdxModule;
  return loaded.default;
}
