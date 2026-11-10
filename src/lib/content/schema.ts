import { z } from 'zod';

const isoDate = z.iso.date().transform((value) => new Date(`${value}T00:00:00Z`));

/**
 * A fixed set, so the topic filter stays one short row. Free-form tags sprawled to 22 for seven
 * posts within a day of writing them.
 */
const tag = z.enum([
  'architecture',
  'backend',
  'databases',
  'devops',
  'frontend',
  'performance',
  'security',
  'tooling',
]);

export const postFrontmatter = z.strictObject({
  title: z.string().min(10).max(90),
  description: z.string().min(50).max(200),
  publishedAt: isoDate,
  updatedAt: isoDate.optional(),
  tags: z.array(tag).min(1).max(5),
  /** The project the post was written from, if any. Links the two both ways. */
  project: z.string().optional(),
  /** Drafts render in development only. */
  draft: z.boolean().default(false),
});

const metric = z.strictObject({ value: z.string(), label: z.string() });

export const projectFrontmatter = z.strictObject({
  title: z.string(),
  summary: z.string().min(40).max(220),
  role: z.string(),
  period: z.string(),
  status: z.enum(['live', 'shipped', 'archived']),
  stack: z.array(z.string()).min(1),
  metrics: z.array(metric).max(4).default([]),
  links: z.strictObject({ live: z.url().optional(), repository: z.url().optional() }).default({}),
  /** Lower comes first. The flagship is 1. */
  order: z.number().int().positive(),
});
