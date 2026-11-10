import '@/styles/globals.css';

import type { ReactNode } from 'react';

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
