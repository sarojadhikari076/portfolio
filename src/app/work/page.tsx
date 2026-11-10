import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';
import { ProjectGrid } from '@/features/work/project-grid';
import { getProjects } from '@/lib/content/projects';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Case studies: what I built, the decisions behind it, and what I would change.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <main>
      <PageHeader
        eyebrow="work"
        lede="Case studies, written the way I’d walk you through them: the problem, the decisions and their trade-offs, the numbers, and what isn’t finished."
        title="Things I’ve built and run"
      />
      <div className="mx-auto max-w-site px-4 pb-8 sm:px-6">
        <ProjectGrid projects={getProjects()} />
      </div>
    </main>
  );
}
