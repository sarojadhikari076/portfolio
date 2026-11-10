import { expect, test } from '@playwright/test';

test('the diagram is there before any script runs', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');

  const hero = page.locator('section').first();
  await expect(hero.locator('svg text', { hasText: 'outbox relay' })).toBeVisible();
  await context.close();
});

test('a flow started from the keyboard lands in the log and is announced', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Scan at the door' }).click();

  const log = page.getByRole('list', { name: 'Recent events' });
  await expect(log).toContainText('sync queued scans');
  await expect(log).toContainText('SSE · check-ins', { timeout: 10_000 });
  await expect(page.getByText('Scan at the door: done.')).toBeAttached();
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('stays a static diagram and never loads three.js', async ({ page }) => {
    const scripts: string[] = [];
    page.on('response', (response) => {
      if (response.url().endsWith('.js')) scripts.push(response.url());
    });

    await page.goto('/');
    await page.waitForTimeout(3000);

    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.getByText('static', { exact: true })).toBeVisible();

    const bodies = await Promise.all(
      scripts.map(async (url) => (await page.request.get(url)).text()),
    );
    expect(bodies.some((body) => body.includes('WebGLRenderer'))).toBe(false);
  });
});
