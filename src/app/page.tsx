import { buttonVariants } from '@heroui/styles';
import Link from 'next/link';

import { ArrowLink } from '@/components/ui/arrow-link';
import { Readout } from '@/components/ui/readout';
import { Section } from '@/components/ui/section';
import { experience } from '@/data/experience';
import { profile } from '@/data/profile';
import { skills } from '@/data/skills';
import { HeroMesh } from '@/features/hero/hero-mesh';
import { ProjectGrid } from '@/features/work/project-grid';
import { PostList } from '@/features/writing/post-list';
import { getPosts } from '@/lib/content/posts';
import { getProjects } from '@/lib/content/projects';
import { formatRange } from '@/lib/dates';

const HERO_READOUTS = [
  { value: '6 yrs', label: 'typescript in production' },
  { value: '9', label: 'services from one monolith' },
  { value: '110+', label: 'vendors on a platform I built' },
];

export default function HomePage() {
  const projects = getProjects();
  const posts = getPosts().slice(0, 3);

  return (
    <main>
      <section className="border-b border-separator grid-backdrop">
        <div className="mx-auto grid max-w-site items-center gap-12 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:pt-20 lg:pb-24">
          <div>
            <p className="label-mono">
              {profile.role.toLowerCase()} · {profile.location.toLowerCase()}
            </p>
            <h1 className="mt-5 text-display font-semibold text-balance">{profile.headline}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted">
              {profile.summary}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={buttonVariants({ variant: 'primary' })} href="/work/mela">
                Read the Mela case study
              </Link>
              <a className={buttonVariants({ variant: 'tertiary' })} href={profile.resumePdf}>
                Résumé · PDF
              </a>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-separator pt-6">
              {HERO_READOUTS.map((readout) => (
                <Readout key={readout.label} {...readout} />
              ))}
            </dl>
          </div>

          <div>
            <HeroMesh />
            <p className="mt-3 px-1 label-mono">
              Mela&rsquo;s real event paths. Hover a node; click one to send its flow.
            </p>
          </div>
        </div>
      </section>

      {projects.length > 0 ? (
        <Section
          action={<ArrowLink href="/work">all work</ArrowLink>}
          id="work"
          index="01"
          title="Selected work"
        >
          <ProjectGrid projects={projects} />
        </Section>
      ) : null}

      <Section
        action={<ArrowLink href="/about">full history</ArrowLink>}
        id="experience"
        index="02"
        title="Experience"
      >
        <ol className="divide-y divide-separator">
          {experience.map((role) => (
            <li
              key={role.company}
              className="grid gap-4 py-7 md:grid-cols-[minmax(0,3fr)_minmax(0,5fr)_minmax(0,4fr)] md:gap-8"
            >
              <div>
                <p className="label-mono">{formatRange(role.start, role.end).toLowerCase()}</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">{role.company}</h3>
                <p className="text-sm text-muted">{role.title}</p>
              </div>
              <p className="leading-relaxed text-pretty">{role.headline}</p>
              <dl className="grid grid-cols-2 gap-4">
                {role.metrics.map((metric) => (
                  <Readout key={metric.label} {...metric} />
                ))}
              </dl>
            </li>
          ))}
        </ol>
      </Section>

      {posts.length > 0 ? (
        <Section
          action={<ArrowLink href="/writing">all writing</ArrowLink>}
          id="writing"
          index="03"
          title="Writing"
        >
          <PostList posts={posts} />
        </Section>
      ) : null}

      <Section id="stack" index="04" title="What I reach for">
        <dl className="grid gap-x-8 gap-y-6 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group) => (
            <div key={group.name}>
              <dt className="label-mono">{group.name.toLowerCase()}</dt>
              <dd className="mt-2 leading-relaxed">{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </main>
  );
}
