import type { MDXContent } from 'mdx/types';

type MdxModule = { default: MDXContent };

/*
 * One loader per folder, each with a fixed prefix, so the bundler knows exactly which files each
 * import can reach. Every page is generated at build time, so these run once per slug.
 */

export async function loadProjectContent(slug: string): Promise<MDXContent> {
  const loaded = (await import(`@content/work/${slug}.mdx`)) as MdxModule;
  return loaded.default;
}

export async function loadPostContent(slug: string): Promise<MDXContent> {
  const loaded = (await import(`@content/writing/${slug}.mdx`)) as MdxModule;
  return loaded.default;
}
