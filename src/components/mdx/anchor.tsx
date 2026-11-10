import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

type AnchorProps = ComponentPropsWithoutRef<'a'>;

/** Internal links go through the router; external ones open in place, without a referrer. */
export function Anchor({ href = '', children, ...props }: AnchorProps) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  if (href.startsWith('#')) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} rel="noreferrer" {...props}>
      {children}
    </a>
  );
}
