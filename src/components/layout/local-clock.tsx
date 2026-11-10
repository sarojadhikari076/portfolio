'use client';

import { cn } from '@heroui/styles';
import { useSyncExternalStore } from 'react';

import { profile } from '@/data/profile';

const FORMAT = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: profile.timeZone,
  timeZoneName: 'short',
});

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => {
    window.clearInterval(id);
  };
}

const currentSecond = () => Math.floor(Date.now() / 1000);

// The server has no idea what time the reader will see the page, so it renders a placeholder of
// the same width and the clock starts on hydration without shifting anything around it.
const serverSecond = () => null;

type LocalClockProps = { className?: string };

export function LocalClock({ className }: LocalClockProps) {
  const second = useSyncExternalStore(subscribe, currentSecond, serverSecond);
  const label = second === null ? '--:--:-- ---' : FORMAT.format(second * 1000).toLowerCase();

  return (
    <span className={cn('font-mono text-xs text-muted tabular-nums', className)}>
      <span className="sr-only">Local time in Birmingham: </span>
      bhx {label}
    </span>
  );
}
