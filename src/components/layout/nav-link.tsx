'use client';

import { cn } from '@heroui/styles';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { NavItem } from '@/lib/site';

type NavLinkProps = NavItem & { className?: string; onNavigate?: () => void };

export function NavLink({ href, label, className, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const isCurrent = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      aria-current={isCurrent ? 'page' : undefined}
      className={cn(
        'group inline-flex min-h-11 items-center gap-1.5 font-mono text-[0.8125rem] text-muted transition-colors hover:text-foreground aria-[current=page]:text-foreground',
        className,
      )}
      href={href}
      onClick={onNavigate}
    >
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-transparent transition-colors group-aria-[current=page]:bg-accent"
      />
      {label}
    </Link>
  );
}
