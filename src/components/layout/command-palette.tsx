'use client';

import { Header, ListBox, Modal, SearchField, useFilter } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Autocomplete } from 'react-aria-components';

import { profile } from '@/data/profile';
import type { Command, CommandGroup } from '@/lib/commands';

const GROUPS: readonly CommandGroup[] = ['pages', 'work', 'writing', 'actions'];

type CommandPaletteProps = {
  commands: readonly Command[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

/**
 * HeroUI's modal, search field and list box, joined by React Aria's `Autocomplete`, which keeps
 * focus in the search field while the arrow keys move through the results.
 */
export default function CommandPalette({ commands, isOpen, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { contains } = useFilter({ sensitivity: 'base' });

  function run(command: Command) {
    onOpenChange(false);

    if (command.group !== 'actions') {
      router.push(command.href);
      return;
    }

    switch (command.action) {
      case 'toggle-theme':
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
        break;
      case 'copy-email':
        void navigator.clipboard.writeText(profile.email);
        break;
      case 'resume':
        window.open(profile.resumePdf, '_blank', 'noopener');
        break;
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop isDismissable>
        <Modal.Container placement="top" size="md">
          <Modal.Dialog aria-label="Go to a page or run a command" className="p-0">
            <Autocomplete filter={contains}>
              <SearchField aria-label="Search pages, work and writing" autoFocus fullWidth>
                <SearchField.Group className="rounded-none border-b border-separator">
                  <SearchField.SearchIcon />
                  <SearchField.Input placeholder="Search pages, work and writing" />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
              <ListBox
                aria-label="Results"
                className="max-h-[min(60vh,28rem)] overflow-y-auto p-2"
                renderEmptyState={() => (
                  <p className="px-3 py-6 text-center label-mono">no matches</p>
                )}
                onAction={(key) => {
                  const command = commands.find(({ id }) => id === key);
                  if (command) run(command);
                }}
              >
                {GROUPS.map((group) => (
                  <ListBox.Section key={group} id={group}>
                    <Header className="px-3 pt-3 pb-1 label-mono">{group}</Header>
                    {commands
                      .filter((command) => command.group === group)
                      .map((command) => (
                        <ListBox.Item key={command.id} id={command.id} textValue={command.label}>
                          {command.label}
                        </ListBox.Item>
                      ))}
                  </ListBox.Section>
                ))}
              </ListBox>
            </Autocomplete>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
