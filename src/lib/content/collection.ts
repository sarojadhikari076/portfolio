import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import type { z } from 'zod';

import { extractHeadings, type Heading, readingMinutes } from './markdown';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export type Entry<T> = {
  slug: string;
  frontmatter: T;
  readingMinutes: number;
  headings: Heading[];
};

/**
 * Reads every `.mdx` file in a content folder and validates its frontmatter. A file that doesn't
 * match the schema fails the build with the file name and the field, rather than rendering a page
 * with a missing date.
 */
export function readCollection<S extends z.ZodType>(
  folder: string,
  schema: S,
): Entry<z.output<S>>[] {
  const directory = path.join(CONTENT_ROOT, folder);

  return readdirSync(directory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const source = readFileSync(path.join(directory, file), 'utf8');
      const { data, content } = matter(source);
      const parsed = schema.safeParse(data);

      if (!parsed.success) {
        throw new Error(`content/${folder}/${file}: ${parsed.error.message}`);
      }

      return {
        slug: file.replace(/\.mdx$/, ''),
        frontmatter: parsed.data,
        readingMinutes: readingMinutes(content),
        headings: extractHeadings(content),
      };
    });
}
