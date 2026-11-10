import type { ReactNode } from 'react';

type CalloutProps = {
  /** A monospace label: `note`, `trade-off`, `in production`. */
  label?: string;
  children: ReactNode;
};

export function Callout({ label = 'note', children }: CalloutProps) {
  return (
    <aside className="not-prose border-s-2 border-accent bg-surface py-3 ps-4 pe-4 text-[0.9375rem] leading-relaxed sm:rounded-e-sm">
      <p className="mb-1 label-mono">{label}</p>
      <div className="[&>p+p]:mt-3">{children}</div>
    </aside>
  );
}
