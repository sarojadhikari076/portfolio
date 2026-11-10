import { expect, test } from '@playwright/test';

import { ROUTES } from './routes';

for (const { path, heading } of ROUTES) {
  test(`${path} renders its heading and no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    const response = await page.goto(path);

    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    expect(errors).toEqual([]);
  });
}

test('an unknown route answers 404 with a way back', async ({ page }) => {
  const response = await page.goto('/no-such-page');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nothing is listening here.');
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page).toHaveURL('/');
});

test('the skip link moves focus past the header', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard navigation is a desktop concern.');
  await page.goto('/about');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('the theme choice survives a reload', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The toggle is the same on every width.');
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('button', { name: 'Light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('the mobile menu opens, navigates and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu only exists below the medium breakpoint.');
  await page.goto('/');

  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.getByRole('dialog');
  await menu.getByRole('link', { name: 'writing' }).click();

  await expect(page).toHaveURL('/writing');
  await expect(menu).toBeHidden();
});
