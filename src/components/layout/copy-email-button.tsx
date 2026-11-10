'use client';

import { Copy } from '@gravity-ui/icons';
import { Button, toast, Tooltip } from '@heroui/react';

import { profile } from '@/data/profile';

/**
 * Copying beats `mailto:` for most readers: half of them have no mail client wired to the
 * browser. The address stays a real link next to this, so nothing is hidden behind JavaScript.
 */
export function CopyEmailButton() {
  return (
    <Tooltip delay={300}>
      <Button
        aria-label="Copy email address"
        isIconOnly
        size="sm"
        variant="ghost"
        onPress={() => {
          void navigator.clipboard.writeText(profile.email).then(
            () => toast.success('Email address copied'),
            () => toast.danger('Couldn’t copy. Select the address instead.'),
          );
        }}
      >
        <Copy aria-hidden />
      </Button>
      <Tooltip.Content>Copy address</Tooltip.Content>
    </Tooltip>
  );
}
