import type { ReactNode } from 'react';

type PageHeaderProps = {
  /** Short monospace label above the title, such as `case study` or `writing`. */
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
};

export function PageHeader({ eyebrow, title, lede, children }: PageHeaderProps) {
  return (
    <header className="border-b border-separator grid-backdrop">
      <div className="mx-auto max-w-site px-4 pt-16 pb-12 sm:px-6 sm:pt-24">
        <p className="label-mono">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl">
          {title}
        </h1>
        {lede ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted">{lede}</p>
        ) : null}
        {children}
      </div>
    </header>
  );
}
