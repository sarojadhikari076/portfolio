'use client';

import { usePathname } from 'next/navigation';

/** The current route, written the way a shell prompt would show it. */
export function RoutePath() {
  const pathname = usePathname();

  return (
    <span aria-hidden className="truncate font-mono text-[0.8125rem] text-muted">
      ~{pathname === '/' ? '' : pathname}
    </span>
  );
}
