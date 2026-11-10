import { cn } from '@heroui/styles';

import type { Heading } from '@/lib/content/markdown';

type TableOfContentsProps = { headings: readonly Heading[]; className?: string };

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  if (headings.length < 3) return null;

  return (
    <nav aria-label="On this page" className={className}>
      <p className="label-mono">on this page</p>
      <ol className="mt-3 space-y-1.5 border-s border-separator text-sm">
        {headings.map(({ id, text, depth }) => (
          <li key={id}>
            <a
              className={cn(
                '-ms-px block border-s border-transparent ps-3 leading-snug text-muted transition-colors hover:border-accent hover:text-foreground',
                depth === 3 && 'ps-6 text-[0.8125rem]',
              )}
              href={`#${id}`}
            >
              {text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
