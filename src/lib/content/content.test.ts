import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { readCollection } from './collection';
import { postFrontmatter, projectFrontmatter } from './schema';

const posts = readCollection('writing', postFrontmatter);
const projects = readCollection('work', projectFrontmatter);

/**
 * Words that say nothing, or say it the way a template does. The site is meant to read like a
 * person who builds things wrote it, so these fail the build rather than a review.
 */
const FILLER = [
  'leverage',
  'leveraging',
  'seamless',
  'seamlessly',
  'robust',
  'delve',
  'passionate',
  'cutting-edge',
  'game-changer',
  'synergy',
  'utilize',
  'world-class',
  'best-in-class',
  'unlock',
  'empower',
  'in today’s',
  "in today's",
  'fast-paced',
  'elevate',
  'spearheaded',
];

const SOURCES = ['content/work', 'content/writing', 'src/data'].flatMap((folder) =>
  readdirSync(path.join(process.cwd(), folder)).map((file) => path.join(folder, file)),
);

describe('content', () => {
  it('has unique slugs', () => {
    for (const collection of [posts, projects]) {
      const slugs = collection.map(({ slug }) => slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it('only links posts to projects that exist', () => {
    const known = new Set(projects.map(({ slug }) => slug));
    const dangling = posts.filter(
      ({ frontmatter }) => frontmatter.project && !known.has(frontmatter.project),
    );

    expect(dangling.map(({ slug }) => slug)).toEqual([]);
  });

  it('has exactly one flagship project', () => {
    expect(projects.filter(({ frontmatter }) => frontmatter.order === 1)).toHaveLength(1);
  });

  it('links only to internal pages that exist', () => {
    const routes = new Set([
      ...posts.map(({ slug }) => `/writing/${slug}`),
      ...projects.map(({ slug }) => `/work/${slug}`),
      '/',
      '/work',
      '/writing',
      '/about',
      '/resume',
      '/colophon',
    ]);

    for (const file of SOURCES.filter((source) => source.endsWith('.mdx'))) {
      const links = [...readFileSync(file, 'utf8').matchAll(/\]\((\/[^)#\s]*)/g)].map(
        ([, href]) => href,
      );
      for (const href of links) expect(routes, `${file} → ${String(href)}`).toContain(href);
    }
  });

  it.each(SOURCES)('%s avoids filler words', (file) => {
    const text = readFileSync(file, 'utf8').toLowerCase();
    const found = FILLER.filter((word) => new RegExp(`(^|[^a-z])${word}([^a-z]|$)`).test(text));

    expect(found).toEqual([]);
  });
});
