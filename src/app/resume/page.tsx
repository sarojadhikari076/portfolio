import { ArrowDownToLine } from '@gravity-ui/icons';
import { buttonVariants, linkVariants } from '@heroui/styles';
import type { Metadata } from 'next';

import { education, experience } from '@/data/experience';
import { profile } from '@/data/profile';
import { skills } from '@/data/skills';
import { formatRange } from '@/lib/dates';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Résumé',
  description: `${profile.name}, ${profile.role.toLowerCase()} in ${profile.location}. Experience, skills and education.`,
  alternates: { canonical: '/resume' },
};

const link = linkVariants();

const SUMMARY =
  'Full-stack engineer with six years building TypeScript systems for start-ups and production teams. I have led backend and frontend architecture across distributed services, scaled platforms end to end, handled production incidents and mentored engineers, and I use AI-assisted workflows to ship faster without giving up ownership of the result.';

/**
 * The same facts as the PDF, as a page: searchable, linkable and readable on a phone. The print
 * stylesheet turns it back into paper. The phone number is in the PDF only.
 */
export default function ResumePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pt-16 pb-8 sm:px-6 print:max-w-none print:p-0 print:text-[10.5pt]">
      <header className="border-b border-separator pb-8 print:pb-3">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.03em] print:text-2xl">
              {profile.name}
            </h1>
            <p className="mt-1 text-lg text-muted print:text-base">
              Senior Full Stack Engineer · TypeScript, distributed systems, AWS
            </p>
          </div>
          <a
            className={buttonVariants({ variant: 'primary', className: 'print:hidden' })}
            download
            href={profile.resumePdf}
          >
            <ArrowDownToLine aria-hidden />
            Download PDF
          </a>
        </div>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 label-mono print:text-foreground">
          <span>{profile.location.toLowerCase()}</span>
          <a className="hover:text-foreground" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className="hover:text-foreground" href={profile.links.linkedin}>
            linkedin.com/in/sarojadhikari076
          </a>
          <a className="hover:text-foreground" href={profile.links.github}>
            github.com/sarojadhikari076
          </a>
          <span className="hidden print:inline">{new URL(siteUrl()).host}</span>
        </p>
      </header>

      <section aria-labelledby="summary" className="py-8 print:py-3">
        <h2 className="label-mono" id="summary">
          summary
        </h2>
        <p className="mt-3 leading-relaxed text-pretty">{SUMMARY}</p>
      </section>

      <section aria-labelledby="experience" className="border-t border-separator py-8 print:py-3">
        <h2 className="label-mono" id="experience">
          experience
        </h2>
        <ol className="mt-4 space-y-8 print:space-y-3">
          {experience.map((role) => (
            <li key={role.company} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6">
                <h3 className="text-lg font-semibold tracking-tight print:text-base">
                  {role.company} <span className="font-normal text-muted">· {role.title}</span>
                </h3>
                <p className="label-mono">
                  {formatRange(role.start, role.end).toLowerCase()} · {role.location.toLowerCase()}
                </p>
              </div>
              <ul className="mt-2 list-disc space-y-1 ps-5 leading-relaxed marker:text-muted">
                {role.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="skills" className="border-t border-separator py-8 print:py-3">
        <h2 className="label-mono" id="skills">
          skills
        </h2>
        <dl className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-[10rem_1fr]">
          {skills.map((group) => (
            <div key={group.name} className="contents">
              <dt className="font-medium">{group.name}</dt>
              <dd className="text-muted print:text-foreground">{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="education" className="border-t border-separator py-8 print:py-3">
        <h2 className="label-mono" id="education">
          education
        </h2>
        <p className="mt-3">
          <span className="font-semibold">{education.institution}</span> · {education.degree} ·
          completed {education.completed}
        </p>
      </section>

      <p className="border-t border-separator pt-6 label-mono print:hidden">
        Prefer paper?{' '}
        <a className={link.base()} href={profile.resumePdf}>
          The PDF
        </a>{' '}
        has the same experience in its original layout, or print this page.
      </p>
    </main>
  );
}
