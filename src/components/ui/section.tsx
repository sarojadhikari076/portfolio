import type { ReactNode } from 'react';

type SectionProps = {
  id: string;
  /** Two digits, shown as the panel number: `01`. */
  index: string;
  title: string;
  /** A link or control on the right of the heading row. */
  action?: ReactNode;
  children: ReactNode;
};

/** A numbered panel, the unit the home page is built from. */
export function Section({ id, index, title, action, children }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className="scroll-mt-20" id={id}>
      <div className="mx-auto max-w-site px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex items-end justify-between gap-6 border-b border-separator pb-4">
          <h2
            className="flex items-baseline gap-4 text-2xl font-semibold tracking-tight"
            id={headingId}
          >
            <span className="label-mono">{index}</span>
            {title}
          </h2>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}
