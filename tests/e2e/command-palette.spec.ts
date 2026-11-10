import { expect, test } from '@playwright/test';

test.skip(({ isMobile }) => isMobile, 'The palette is a keyboard feature for wider screens.');

test('opens from the keyboard and goes where you search', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('ControlOrMeta+k');

  const search = page.getByRole('searchbox', { name: 'Search pages, work and writing' });
  await expect(search).toBeFocused();

  await search.fill('offline');
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL('/writing/tickets-a-phone-can-verify-offline');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('says so when nothing matches', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Search and commands/ }).click();
  await page.getByRole('searchbox').fill('zzzz');

  await expect(page.getByText('no matches')).toBeVisible();
});
