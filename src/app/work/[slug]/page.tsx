import { ArrowUpRight } from '@gravity-ui/icons';
import { linkVariants, typographyVariants } from '@heroui/styles';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Readout } from '@/components/ui/readout';
import { PostList } from '@/features/writing/post-list';
import { TableOfContents } from '@/features/writing/table-of-contents';
import { loadProjectContent } from '@/lib/content/mdx';
import { getPostsForProject } from '@/lib/content/posts';
import { getProject, getProjects } from '@/lib/content/projects';

type WorkPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};

  return {
    title: project.frontmatter.title,
    description: project.frontmatter.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { type: 'article', url: `/work/${project.slug}` },
  };
}

const prose = typographyVariants().prose();
const link = linkVariants();

export default async function ProjectPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { title, summary, role, period, status, stack, metrics, links } = project.frontmatter;
  const Content = await loadProjectContent(slug);
  const related = getPostsForProject(slug);

  return (
    <main>
      <header className="border-b border-separator grid-backdrop">
        <div className="mx-auto max-w-site px-4 pt-16 pb-12 sm:px-6 sm:pt-24">
          <p className="label-mono">case study · {status}</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.035em] sm:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted">{summary}</p>

          <dl className="mt-10 grid gap-x-8 gap-y-4 border-t border-separator pt-6 text-sm sm:grid-cols-4">
            <div>
              <dt className="label-mono">role</dt>
              <dd className="mt-1">{role}</dd>
            </div>
            <div>
              <dt className="label-mono">when</dt>
              <dd className="mt-1">{period}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="label-mono">stack</dt>
              <dd className="mt-1">{stack.join(', ')}</dd>
            </div>
          </dl>

          {(links.live ?? links.repository) ? (
            <p className="mt-6 flex flex-wrap gap-6 text-sm">
              {links.live ? (
                <a className={link.base({ className: 'gap-1' })} href={links.live}>
                  {new URL(links.live).host}
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              ) : null}
              {links.repository ? (
                <a className={link.base({ className: 'gap-1' })} href={links.repository}>
                  source
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              ) : null}
            </p>
          ) : null}
        </div>
      </header>

      {metrics.length > 0 ? (
        <div className="border-b border-separator">
          <dl className="mx-auto grid max-w-site grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
            {metrics.map((metric) => (
              <Readout key={metric.label} {...metric} />
            ))}
          </dl>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-site gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <article className={prose}>
          <Content />
        </article>
        <aside className="hidden lg:block">
          <TableOfContents className="sticky top-24" headings={project.headings} />
        </aside>
      </div>

      {related.length > 0 ? (
        <section aria-labelledby="related" className="mx-auto max-w-site px-4 sm:px-6">
          <h2 className="border-b border-separator pb-3 label-mono" id="related">
            written from this project
          </h2>
          <PostList posts={related} />
        </section>
      ) : null}
    </main>
  );
}
