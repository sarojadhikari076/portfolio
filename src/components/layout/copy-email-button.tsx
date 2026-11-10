'use client';

import { Check, Copy } from '@gravity-ui/icons';
import { Button, Tooltip } from '@heroui/react';
import { useEffect, useState } from 'react';

import { profile } from '@/data/profile';

type CopyState = 'idle' | 'copied' | 'failed';

const RESET_AFTER_MS = 2000;

/**
 * Copying beats `mailto:` for most readers: half of them have no mail client wired to the browser.
 * The address stays a real link beside this, so nothing is hidden behind JavaScript. Confirmation
 * is the button itself rather than a toast: it's where the reader is already looking.
 */
export function CopyEmailButton() {
  const [state, setState] = useState<CopyState>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const id = setTimeout(() => {
      setState('idle');
    }, RESET_AFTER_MS);
    return () => {
      clearTimeout(id);
    };
  }, [state]);

  return (
    <>
      <Tooltip delay={300}>
        <Button
          aria-label="Copy email address"
          isIconOnly
          size="sm"
          variant="ghost"
          onPress={() => {
            navigator.clipboard.writeText(profile.email).then(
              () => {
                setState('copied');
              },
              () => {
                setState('failed');
              },
            );
          }}
        >
          {state === 'copied' ? (
            <Check aria-hidden className="text-success" />
          ) : (
            <Copy aria-hidden />
          )}
        </Button>
        <Tooltip.Content>{state === 'copied' ? 'Copied' : 'Copy address'}</Tooltip.Content>
      </Tooltip>
      <span aria-live="polite" className="sr-only">
        {state === 'copied' ? 'Email address copied' : null}
        {state === 'failed' ? 'Couldn’t copy. Select the address instead.' : null}
      </span>
    </>
  );
}
