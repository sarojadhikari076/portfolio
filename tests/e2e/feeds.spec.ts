import { expect, test } from '@playwright/test';

test.skip(({ isMobile }) => isMobile, 'Feeds do not depend on the viewport.');

test('the RSS feed is well-formed and lists published posts only', async ({ page, request }) => {
  const response = await request.get('/feed.xml');
  expect(response.headers()['content-type']).toContain('application/rss+xml');

  const xml = await response.text();
  await page.goto('/');
  const parseError = await page.evaluate(
    (source) =>
      new DOMParser().parseFromString(source, 'application/xml').querySelector('parsererror')
        ?.textContent ?? null,
    xml,
  );

  expect(parseError).toBeNull();
  expect(xml).toContain('/writing/selling-the-last-ticket');
  expect(xml).not.toContain('shrinking-a-node-docker-image');
});

test('the sitemap covers every case study and post', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();

  for (const path of ['/work/mela', '/writing/transactional-outbox-nestjs', '/colophon']) {
    expect(sitemap).toContain(path);
  }
});
