'use client';

import { RouterProvider, Toast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

// Module augmentation only works with an interface, so this is the one place the rule bends.
declare module 'react-aria-components' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>;
  }
}

type ProvidersProps = { children: ReactNode };

/**
 * The only client-side providers. HeroUI needs no provider of its own: its colours are CSS
 * variables, and `RouterProvider` is here only so a HeroUI `href` navigates through Next's router
 * instead of reloading the page.
 */
export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      themes={['dark', 'light']}
      disableTransitionOnChange
    >
      <RouterProvider
        navigate={(href, options) => {
          router.push(href, options);
        }}
      >
        {children}
        <Toast.Provider placement="bottom" />
      </RouterProvider>
    </ThemeProvider>
  );
}
