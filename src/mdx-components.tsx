import type { MDXComponents } from 'mdx/types';

import { Anchor } from '@/components/mdx/anchor';
import { Callout } from '@/components/mdx/callout';
import { Figure } from '@/components/mdx/figure';

const components = {
  a: Anchor,
  Callout,
  Figure,
} satisfies MDXComponents;

export function useMDXComponents(inherited: MDXComponents): MDXComponents {
  return { ...inherited, ...components };
}
