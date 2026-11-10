'use client';

import { Moon, Sun } from '@gravity-ui/icons';
import { ToggleButton, useIsHydrated } from '@heroui/react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isHydrated = useIsHydrated();
  const isLight = isHydrated && resolvedTheme === 'light';

  return (
    <ToggleButton
      aria-label="Light theme"
      isIconOnly
      isSelected={isLight}
      size="sm"
      variant="ghost"
      onChange={(selected) => {
        setTheme(selected ? 'light' : 'dark');
      }}
    >
      {isLight ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </ToggleButton>
  );
}
