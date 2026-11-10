import { cn } from '@heroui/styles';

type ReadoutProps = { value: string; label: string; className?: string };

/** A figure the way a dashboard shows it: the number first, what it measures underneath. */
export function Readout({ value, label, className }: ReadoutProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <dt className="sr-only">{label}</dt>
      <dd className="text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">{value}</dd>
      <dd aria-hidden className="mt-1 label-mono">
        {label}
      </dd>
    </div>
  );
}
