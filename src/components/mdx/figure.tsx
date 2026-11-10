import type { ReactNode } from 'react';

type FigureProps = { caption: ReactNode; children: ReactNode };

export function Figure({ caption, children }: FigureProps) {
  return (
    <figure className="not-prose my-10 sm:-mx-8">
      <div className="overflow-x-auto border border-border bg-surface p-4 sm:rounded-sm sm:p-6">
        {children}
      </div>
      <figcaption className="mt-3 px-4 label-mono sm:px-8">{caption}</figcaption>
    </figure>
  );
}
