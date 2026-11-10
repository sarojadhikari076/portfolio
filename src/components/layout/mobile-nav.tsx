'use client';

import { Bars } from '@gravity-ui/icons';
import { Button, Drawer, useOverlayState } from '@heroui/react';

import { profile } from '@/data/profile';
import { NAV_ITEMS } from '@/lib/site';

import { NavLink } from './nav-link';

export function MobileNav() {
  const state = useOverlayState();

  return (
    <Drawer state={state}>
      <Button aria-label="Open menu" isIconOnly size="sm" variant="ghost">
        <Bars aria-hidden />
      </Button>
      <Drawer.Backdrop>
        <Drawer.Content placement="right">
          <Drawer.Dialog className="bg-background">
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading className="label-mono">menu</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav aria-label="Main">
                <ul className="flex flex-col">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href} className="border-b border-separator">
                      <NavLink
                        {...item}
                        className="w-full text-base"
                        onNavigate={() => {
                          state.close();
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </nav>
              <p className="mt-8 font-mono text-xs text-muted">
                <span aria-hidden className="me-2 inline-block size-1.5 rounded-full bg-success" />
                {profile.availability.toLowerCase()}
              </p>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
