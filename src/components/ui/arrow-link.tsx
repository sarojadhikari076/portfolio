import { ArrowRight } from '@gravity-ui/icons';
import { cn } from '@heroui/styles';
import type { Route } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

type ArrowLinkProps = { href: Route; children: ReactNode; className?: string };

export function ArrowLink({ href, children, className }: ArrowLinkProps) {
  return (
    <Link
      className={cn(
        'group inline-flex items-center gap-1.5 font-mono text-[0.8125rem] text-muted transition-colors hover:text-foreground',
        className,
      )}
      href={href}
    >
      {children}
      <ArrowRight
        aria-hidden
        className="size-3.5 transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}
