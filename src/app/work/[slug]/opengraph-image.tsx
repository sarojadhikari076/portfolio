import { getProject, getProjects } from '@/lib/content/projects';
import { OG_SIZE, renderShareCard } from '@/lib/og';

export const alt = 'Case study title and summary';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return getProjects().map(({ slug }) => ({ slug }));
}

type ImageProps = { params: Promise<{ slug: string }> };

export default async function Image({ params }: ImageProps) {
  const project = getProject((await params).slug);

  return renderShareCard({
    eyebrow: project ? `case study · ${project.frontmatter.status}` : 'case study',
    title: project?.frontmatter.title ?? 'Work',
    detail: project?.frontmatter.summary,
  });
}
