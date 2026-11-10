import { ArrowUpRight } from '@gravity-ui/icons';
import { cardVariants, cn } from '@heroui/styles';
import Link from 'next/link';

import { Readout } from '@/components/ui/readout';
import { MeshDiagram } from '@/features/hero/mesh-diagram';
import type { Project } from '@/lib/content/projects';

const card = cardVariants();

type ProjectGridProps = { projects: readonly Project[] };

/** The flagship across the full width, the rest in a row beneath it. */
export function ProjectGrid({ projects }: ProjectGridProps) {
  const [flagship, ...rest] = projects;

  return (
    <div className="grid gap-4 pt-8 md:grid-cols-3">
      {flagship ? <FlagshipCard project={flagship} /> : null}
      {rest.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}

type ProjectCardProps = { project: Project };

function FlagshipCard({ project }: ProjectCardProps) {
  const { title, summary, stack, metrics, status, role } = project.frontmatter;

  return (
    <Link
      className={card.base({
        className:
          'group grid gap-8 p-6 transition-colors hover:bg-surface-secondary md:col-span-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:p-8',
      })}
      href={`/work/${project.slug}`}
    >
      <div className="flex flex-col">
        <p className="label-mono">
          case study · {status} · {role.toLowerCase()}
        </p>
        <h3 className="mt-3 flex items-center gap-2 text-3xl font-semibold tracking-tight">
          {title}
          <ArrowUpRight
            aria-hidden
            className="size-5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          />
        </h3>
        <p className="mt-3 max-w-lg leading-relaxed text-pretty text-muted">{summary}</p>
        <dl className="mt-auto grid grid-cols-2 gap-x-6 gap-y-5 pt-8 sm:grid-cols-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Readout key={metric.label} {...metric} />
          ))}
        </dl>
        <p className="mt-6 label-mono">{stack.join(' · ').toLowerCase()}</p>
      </div>
      <div className="hidden min-h-64 border border-border grid-backdrop md:block">
        <MeshDiagram className="p-4" />
      </div>
    </Link>
  );
}

function ProjectCard({ project }: ProjectCardProps) {
  const { title, summary, stack, period, role } = project.frontmatter;

  return (
    <Link
      className={card.base({
        className: 'group flex flex-col p-6 transition-colors hover:bg-surface-secondary',
      })}
      href={`/work/${project.slug}`}
    >
      <p className="label-mono">
        {period} · {role.toLowerCase()}
      </p>
      <h3 className="mt-3 flex items-center gap-1.5 text-xl font-semibold tracking-tight">
        {title}
        <ArrowUpRight
          aria-hidden
          className={cn(
            'size-4 text-muted transition-transform',
            'group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent',
          )}
        />
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">{summary}</p>
      <p className="mt-auto pt-6 label-mono">{stack.slice(0, 4).join(' · ').toLowerCase()}</p>
    </Link>
  );
}
