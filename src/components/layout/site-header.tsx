import Link from 'next/link';

import { profile } from '@/data/profile';
import { getCommands } from '@/lib/commands';
import { NAV_ITEMS } from '@/lib/site';

import { CommandMenu } from './command-menu';
import { LocalClock } from './local-clock';
import { MobileNav } from './mobile-nav';
import { NavLink } from './nav-link';
import { RoutePath } from './route-path';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-separator bg-background/90 backdrop-blur-sm print:hidden">
      <div className="mx-auto flex h-14 max-w-site items-center gap-6 px-4 sm:px-6">
        <div className="flex min-w-0 items-baseline gap-3">
          <Link className="shrink-0 text-[0.9375rem] font-semibold tracking-tight" href="/">
            {profile.name}
          </Link>
          <span className="hidden min-w-0 sm:inline-flex">
            <RoutePath />
          </span>
        </div>

        <nav aria-label="Main" className="ms-auto hidden md:block">
          <ul className="flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NavLink {...item} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-3 md:ms-0">
          <LocalClock className="hidden xl:inline" />
          <span className="hidden items-center gap-2 font-mono text-xs text-muted lg:inline-flex">
            <span aria-hidden className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-success/60 motion-reduce:hidden" />
              <span className="relative size-1.5 rounded-full bg-success" />
            </span>
            {profile.availability.toLowerCase()}
          </span>
          <span className="hidden sm:inline-flex">
            <CommandMenu commands={getCommands()} />
          </span>
          <ThemeToggle />
          <span className="md:hidden">
            <MobileNav />
          </span>
        </div>
      </div>
    </header>
  );
}
