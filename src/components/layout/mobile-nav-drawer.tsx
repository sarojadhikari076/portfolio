'use client';

import { Drawer } from '@heroui/react';

import { profile } from '@/data/profile';
import { NAV_ITEMS } from '@/lib/site';

import { NavLink } from './nav-link';

type MobileNavDrawerProps = { isOpen: boolean; onOpenChange: (isOpen: boolean) => void };

export default function MobileNavDrawer({ isOpen, onOpenChange }: MobileNavDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
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
                          onOpenChange(false);
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
