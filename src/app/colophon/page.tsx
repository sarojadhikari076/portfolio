import { linkVariants } from '@heroui/styles';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/ui/page-header';
import { Section } from '@/components/ui/section';
import { REPOSITORY_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Colophon',
  description:
    'How this site is built: the stack, the design decisions, and what it costs to load.',
  alternates: { canonical: '/colophon' },
};

const link = linkVariants();

const STACK = [
  ['Framework', 'Next.js 16 on the App Router. Every page is generated at build time.'],
  [
    'Language',
    'TypeScript 6 in strict mode, with noUncheckedIndexedAccess and erasable syntax only.',
  ],
  ['UI', 'HeroUI 3 on Tailwind CSS 4, themed entirely through its CSS variables.'],
  ['3D', 'three.js and React Three Fiber, for the hero only, loaded once the page is idle.'],
  ['Content', 'MDX in the repository, validated with Zod at build time, highlighted by Shiki.'],
  ['Type', 'Schibsted Grotesk and JetBrains Mono, self-hosted through next/font.'],
  [
    'Quality',
    'ESLint, Prettier, Vitest, Playwright with axe, Lighthouse CI and knip, in CI on every push.',
  ],
  ['Hosting', 'Vercel, with cookieless analytics and Speed Insights.'],
] as const;

export default function ColophonPage() {
  return (
    <main>
      <PageHeader
        eyebrow="colophon"
        lede="How this site is built, for anyone who reads the footer of a site first. The source is public."
        title="How this site is made"
      >
        <p className="mt-6">
          <a className={link.base({ className: 'font-mono text-sm' })} href={REPOSITORY_URL}>
            {REPOSITORY_URL.replace('https://', '')}
          </a>
        </p>
      </PageHeader>

      <Section id="stack" index="01" title="Stack">
        <dl className="divide-y divide-separator">
          {STACK.map(([term, description]) => (
            <div key={term} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-8">
              <dt className="pt-0.5 label-mono">{term.toLowerCase()}</dt>
              <dd className="leading-relaxed">{description}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="decisions" index="02" title="Decisions">
        <div className="max-w-[68ch] space-y-5 pt-8 leading-relaxed">
          <p>
            <strong className="font-semibold">Static first.</strong> Nothing on this site changes
            per request, so nothing is rendered per request. Pages are HTML on a CDN, and the only
            JavaScript is for the parts that are interactive: the theme toggle, the menu, the
            command palette, the topic filter and the hero.
          </p>
          <p>
            <strong className="font-semibold">HeroUI, used the way it&rsquo;s built.</strong> Its
            components read colour from CSS variables, so the whole theme is one block per mode in
            one stylesheet. Server components style links, buttons and cards with HeroUI&rsquo;s
            variant functions and ship no JavaScript for them. Interactive components are small
            client islands, and the heavy ones, the drawer and the command palette, load on first
            use.
          </p>
          <p>
            <strong className="font-semibold">A hero that earns its bytes.</strong> The 3D scene is
            a real diagram of Mela, and it loads after everything else.{' '}
            <Link className={link.base()} href="/writing/building-the-event-mesh-hero">
              How it&rsquo;s built
            </Link>{' '}
            covers the details.
          </p>
          <p>
            <strong className="font-semibold">Claims you can check.</strong> Every number on the
            site comes from my résumé or from the code it describes, and CI fails on a page that
            uses filler words.
          </p>
        </div>
      </Section>

      <Section id="budget" index="03" title="What it costs">
        <dl className="divide-y divide-separator">
          {[
            ['JavaScript, any page', 'about 229 KB gzipped, most of it React and Next.js'],
            ['JavaScript, home page', 'about 236 KB up front, plus 245 KB of three.js once idle'],
            ['Render loop', 'stopped whenever the hero is off screen or the tab is hidden'],
            ['Cookies', 'none'],
          ].map(([term, description]) => (
            <div key={term} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-8">
              <dt className="pt-0.5 label-mono">{term?.toLowerCase()}</dt>
              <dd className="leading-relaxed">{description}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </main>
  );
}
