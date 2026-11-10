import { readCollection } from './collection';
import { projectFrontmatter } from './schema';

export type Project = ReturnType<typeof readCollection<typeof projectFrontmatter>>[number];

let cache: Project[] | undefined;

export function getProjects(): Project[] {
  cache ??= readCollection('work', projectFrontmatter).sort(
    (a, b) => a.frontmatter.order - b.frontmatter.order,
  );

  return cache;
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}
