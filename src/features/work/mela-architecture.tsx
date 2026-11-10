import { cn } from '@heroui/styles';
import type { ReactNode } from 'react';

const MODULES = [
  'catalog',
  'checkout',
  'inventory',
  'payments',
  'orders',
  'ticketing',
  'refunds',
  'promotions',
  'checkin',
  'events',
  'guests',
  'issues',
  'media',
  'identity',
  'organizations',
  'privacy',
  'audit',
  'platform-admin',
];

type TierProps = { label: string; children: ReactNode; className?: string };

function Tier({ label, children, className }: TierProps) {
  return (
    <div className="grid gap-2">
      <p className="label-mono">{label}</p>
      <div className={cn('grid gap-2', className)}>{children}</div>
    </div>
  );
}

type BoxProps = { title: string; note: string; children?: ReactNode; className?: string };

function Box({ title, note, children, className }: BoxProps) {
  return (
    <div className={cn('border border-border bg-background px-3 py-2.5', className)}>
      <p className="text-[0.8125rem] font-medium text-foreground">{title}</p>
      <p className="mt-0.5 text-muted">{note}</p>
      {children}
    </div>
  );
}

function Hop({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 ps-1 text-muted">
      <span aria-hidden className="text-accent">
        ↓
      </span>
      {children}
    </p>
  );
}

/** Mela's deployment, top to bottom. Plain HTML rather than an SVG, so it reflows on a phone. */
export function MelaArchitecture() {
  return (
    <div className="grid gap-4 font-mono text-[0.75rem] leading-relaxed">
      <Tier className="sm:grid-cols-3" label="clients · vercel">
        <Box note="next.js 16 · buyers" title="storefront" />
        <Box note="next.js 16 · organisers, platform admin" title="dashboard" />
        <Box note="installable pwa · works offline" title="door" />
      </Tier>

      <Hop>each app proxies /v1, so the session cookie stays first-party</Hop>

      <Tier className="sm:grid-cols-[2fr_1fr]" label="api · railway · one image, two processes">
        <Box note="nestjs 11 · rfc 9457 errors · openapi · sse · rate limits" title="http">
          <ul className="mt-2 flex flex-wrap gap-1">
            {MODULES.map((module) => (
              <li
                key={module}
                className="border border-separator px-1.5 text-[0.6875rem] text-muted"
              >
                {module}
              </li>
            ))}
          </ul>
        </Box>
        <Box
          note="outbox relay every 5 s · domain events · hold sweep every 30 s · payment reconciliation every 10 min · reminders · retention"
          title="worker"
        />
      </Tier>

      <Hop>business change and its event commit in one transaction</Hop>

      <Tier className="sm:grid-cols-3" label="data">
        <Box note="neon · 45 models · 42 migrations" title="postgresql 18" />
        <Box note="bullmq · pub/sub for sse · rate limits" title="redis 8" />
        <Box note="cloudflare r2 · images re-encoded to webp" title="object storage" />
      </Tier>

      <Tier className="sm:grid-cols-3" label="external">
        <Box note="connect, direct charges with an application fee" title="stripe" />
        <Box note="tickets and notices" title="resend" />
        <Box note="server errors only" title="sentry" />
      </Tier>
    </div>
  );
}
