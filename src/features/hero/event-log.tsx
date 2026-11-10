import { cn } from '@heroui/styles';

import type { LogEntry } from './mesh-store';
import { NODE_BY_ID } from './topology';

const pad = (value: number, length = 2) => String(value).padStart(length, '0');

function clockTime(epoch: number): string {
  const date = new Date(epoch);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
}

const ROWS = 4;

type EventLogProps = { entries: readonly LogEntry[] };

/**
 * The last few hops, newest first. It is not a live region: ambient traffic would talk over
 * everything. Flows the reader starts are announced separately when they finish.
 */
export function EventLog({ entries }: EventLogProps) {
  const rows = Array.from({ length: ROWS }, (_, index) => entries[index]);

  return (
    <ol
      aria-label="Recent events"
      className="mt-3 space-y-0.5 font-mono text-[0.6875rem] leading-5"
    >
      {rows.map((entry, index) =>
        entry ? (
          <li
            key={`${String(entry.dispatchId)}-${entry.from}-${entry.to}-${String(entry.at)}`}
            className={cn('grid grid-cols-[auto_1fr_auto] gap-3', index > 0 && 'opacity-70')}
          >
            <time className="text-muted tabular-nums">{clockTime(entry.wallClock)}</time>
            <span
              className={cn(
                'truncate',
                entry.origin === 'user' ? 'text-accent-ink' : 'text-foreground',
              )}
            >
              {entry.label}
            </span>
            <span className="text-muted max-sm:hidden">
              {NODE_BY_ID.get(entry.from)?.label} → {NODE_BY_ID.get(entry.to)?.label}
            </span>
          </li>
        ) : (
          <li key={`empty-${String(index)}`} aria-hidden className="text-muted/40">
            {index === 0 ? 'waiting for events…' : '·'}
          </li>
        ),
      )}
    </ol>
  );
}
