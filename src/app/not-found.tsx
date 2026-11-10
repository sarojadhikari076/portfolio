import { buttonVariants } from '@heroui/styles';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Not found' };

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center border-b border-separator grid-backdrop">
      <div className="mx-auto w-full max-w-site px-4 py-24 sm:px-6">
        <p className="label-mono">
          <span className="text-danger">404</span> · route not found
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.035em] sm:text-7xl">
          Nothing is listening here.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          The page may have moved, or the link was mistyped. Everything that exists is one of these.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className={buttonVariants({ variant: 'primary' })} href="/">
            Home
          </Link>
          <Link className={buttonVariants({ variant: 'tertiary' })} href="/work">
            Work
          </Link>
          <Link className={buttonVariants({ variant: 'tertiary' })} href="/writing">
            Writing
          </Link>
        </div>
      </div>
    </main>
  );
}
