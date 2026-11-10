'use client';

import { Button, Kbd } from '@heroui/react';
import dynamic from 'next/dynamic';
import { useEffect, useState, useSyncExternalStore } from 'react';

import type { Command } from '@/lib/commands';

// The palette, its search and its list load the first time someone asks for them.
const CommandPalette = dynamic(() => import('./command-palette'), { ssr: false });

const subscribeToNothing = () => () => undefined;
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform);

type CommandMenuProps = { commands: readonly Command[] };

export function CommandMenu({ commands }: CommandMenuProps) {
  const [isOpen, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const apple = useSyncExternalStore(subscribeToNothing, isApple, () => true);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setHasOpened(true);
        setOpen((open) => !open);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <>
      <Button
        aria-keyshortcuts={apple ? 'Meta+K' : 'Control+K'}
        aria-label="Search and commands"
        className="font-mono text-xs text-muted"
        size="sm"
        variant="ghost"
        onPress={() => {
          setHasOpened(true);
          setOpen(true);
        }}
      >
        <Kbd>
          <Kbd.Abbr keyValue={apple ? 'command' : 'ctrl'} />
          <Kbd.Content>K</Kbd.Content>
        </Kbd>
      </Button>
      {hasOpened ? (
        <CommandPalette commands={commands} isOpen={isOpen} onOpenChange={setOpen} />
      ) : null}
    </>
  );
}
