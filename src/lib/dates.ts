const MONTH_YEAR = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const DAY_MONTH_YEAR = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** `2025-04` → `Apr 2025`. */
function formatMonth(isoMonth: string): string {
  return MONTH_YEAR.format(new Date(`${isoMonth}-01T00:00:00Z`));
}

/** `2026-11-10` → `10 Nov 2026`. */
export function formatDate(date: Date | string): string {
  return DAY_MONTH_YEAR.format(typeof date === 'string' ? new Date(date) : date);
}

export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'now'}`;
}
