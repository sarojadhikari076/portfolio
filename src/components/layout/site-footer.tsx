import { linkVariants } from '@heroui/styles';
import Link from 'next/link';

import { profile } from '@/data/profile';
import { buildInfo } from '@/lib/build-info';
import { REPOSITORY_URL } from '@/lib/site';

import { CopyEmailButton } from './copy-email-button';

const BUILT_AT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
});

const link = linkVariants();

export function SiteFooter() {
  const build = buildInfo();
  const year = build.builtAt.getUTCFullYear();

  return (
    <footer className="mt-24 border-t border-separator print:hidden">
      <div className="mx-auto grid max-w-site gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="label-mono">contact</p>
          <p className="mt-3 max-w-sm text-lg leading-snug tracking-tight">
            Hiring for a senior role, or want to compare notes on a system you&rsquo;re building?
          </p>
          <div className="mt-4 flex items-center gap-1">
            <a
              className={link.base({ className: 'font-mono text-sm' })}
              href={`mailto:${profile.email}`}
            >
              {profile.email}
            </a>
            <CopyEmailButton />
          </div>
        </div>

        <div>
          <p className="label-mono">elsewhere</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a className={link.base()} href={profile.links.github} rel="me">
                GitHub
              </a>
            </li>
            <li>
              <a className={link.base()} href={profile.links.linkedin} rel="me">
                LinkedIn
              </a>
            </li>
            <li>
              <a className={link.base()} href="/feed.xml">
                RSS
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="label-mono">this site</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className={link.base()} href="/colophon">
                Colophon
              </Link>
            </li>
            <li>
              <a className={link.base()} href={REPOSITORY_URL}>
                Source
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-separator">
        <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 font-mono text-xs text-muted sm:px-6">
          <span>
            © {year} {profile.name}
          </span>
          <span>
            build{' '}
            {build.commitUrl ? (
              <a className="hover:text-foreground" href={build.commitUrl}>
                {build.commit}
              </a>
            ) : (
              build.commit
            )}{' '}
            · {BUILT_AT.format(build.builtAt).toLowerCase()} utc
          </span>
        </div>
      </div>
    </footer>
  );
}
