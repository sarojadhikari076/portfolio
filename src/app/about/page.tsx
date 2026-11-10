import { linkVariants } from '@heroui/styles';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/ui/page-header';
import { Readout } from '@/components/ui/readout';
import { Section } from '@/components/ui/section';
import { education, experience } from '@/data/experience';
import { principles } from '@/data/principles';
import { profile } from '@/data/profile';
import { formatRange } from '@/lib/dates';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Six years building TypeScript systems, from Kathmandu to Birmingham: what I have worked on and how I work.',
  alternates: { canonical: '/about' },
};

const link = linkVariants();

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="about"
        lede={`${profile.role} in ${profile.location}. I like the parts of a system that only show up under pressure: concurrency, money, failure, and the tests that keep them honest.`}
        title="From Kathmandu to Birmingham"
      />

      <div className="mx-auto max-w-site px-4 pt-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="max-w-[68ch] space-y-5 text-[1.0625rem] leading-relaxed">
            <p>
              I started in Kathmandu in 2018, building fintech and e-commerce products at Swivt
              Technologies: schemas, APIs, the deploy pipeline and whatever else needed doing. Three
              years in, I moved to frontend at Naamche and spent two years on performance and a
              component library that several teams shared.
            </p>
            <p>
              In 2023 I came to the UK. I joined Sliceup as its first engineer and built the
              platform from scratch, while finishing an MSc in Computer Science at Birmingham City
              University. Since 2025 I&rsquo;ve been at IPG Automotive in Birmingham, decomposing a
              monolith into services and moving a large JavaScript codebase to TypeScript.
            </p>
            <p>
              Outside work I build my own products. The biggest is{' '}
              <Link className={link.base()} href="/work/mela">
                Mela
              </Link>
              , a ticketing platform for festivals, which is where most of my{' '}
              <Link className={link.base()} href="/writing">
                writing
              </Link>{' '}
              comes from.
            </p>
          </div>
          <dl className="grid h-fit grid-cols-2 gap-6 border-t border-separator pt-6 lg:border-s lg:border-t-0 lg:ps-8 lg:pt-0">
            <Readout label="shipping since" value="2018" />
            <Readout label="companies" value="4" />
            <Readout label="countries" value="2" />
            <Readout label="engineers mentored" value="3" />
          </dl>
        </div>
      </div>

      <Section id="principles" index="01" title="How I work">
        <ol className="grid gap-px overflow-hidden border border-separator bg-separator pt-0 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, index) => (
            <li key={principle.title} className="bg-background p-6">
              <p className="label-mono">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{principle.title}</h3>
              <p className="mt-2 leading-relaxed text-pretty text-muted">{principle.body}</p>
              <p className="mt-4 label-mono text-accent-ink">{principle.evidence}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="experience" index="02" title="Experience">
        <ol className="divide-y divide-separator">
          {experience.map((role) => (
            <li
              key={role.company}
              className="grid gap-4 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10"
            >
              <div>
                <p className="label-mono">{formatRange(role.start, role.end).toLowerCase()}</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight">{role.company}</h3>
                <p className="text-muted">{role.title}</p>
                <p className="mt-1 label-mono">{role.location.toLowerCase()}</p>
              </div>
              <ul className="space-y-2 leading-relaxed">
                {role.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li className="grid gap-4 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10">
            <div>
              <p className="label-mono">completed {education.completed}</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">{education.institution}</h3>
              <p className="text-muted">{education.degree}</p>
            </div>
          </li>
        </ol>
      </Section>
    </main>
  );
}
