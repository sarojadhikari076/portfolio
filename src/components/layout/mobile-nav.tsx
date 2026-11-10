'use client';

import { Bars } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Most readers never open the menu, and on a desktop they never see it, so the drawer and its
// overlay code load on the first press instead of with every page.
const MobileNavDrawer = dynamic(() => import('./mobile-nav-drawer'), { ssr: false });

export function MobileNav() {
  const [isOpen, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  return (
    <>
      <Button
        aria-expanded={isOpen}
        aria-label="Open menu"
        isIconOnly
        size="sm"
        variant="ghost"
        onPress={() => {
          setHasOpened(true);
          setOpen(true);
        }}
      >
        <Bars aria-hidden />
      </Button>
      {hasOpened ? <MobileNavDrawer isOpen={isOpen} onOpenChange={setOpen} /> : null}
    </>
  );
}
