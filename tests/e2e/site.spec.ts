import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('root and demo have route titles, metadata, focus, and working back navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle('Send-Date Ledger — track invoice send dates');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /send-date-ledger-social\.jpg$/);
  expect((await page.request.get('/assets/send-date-ledger-social.jpg')).status()).toBe(200);
  await page.getByRole('link', { name: 'Demo' }).first().click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page).toHaveTitle('Demo — Send-Date Ledger');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('h1')).toBeFocused();
  expect(errors).toEqual([]);
});

test('every visible internal link returns a successful page', async ({ page, request }) => {
  for (const path of ['/', '/demo', '/privacy/', '/terms/', '/404.html', '/offline.html']) {
    await page.goto(path);
    const links = await page.locator('a[href]').evaluateAll((items) => items.map((item) => (item as HTMLAnchorElement).href));
    for (const href of [...new Set(links)]) {
      const url = new URL(href);
      if (url.origin === new URL(page.url()).origin) expect((await request.get(url.href)).status(), href).toBe(200);
      else expect(url.protocol, href).toBe('mailto:');
    }
  }
});

for (const route of [
  { path: '/privacy/', title: 'Privacy — Send-Date Ledger', heading: 'Privacy' },
  { path: '/terms/', title: 'Terms — Send-Date Ledger', heading: 'Terms' },
  { path: '/404.html', title: 'Page not found — Send-Date Ledger', heading: 'This page does not exist' },
  { path: '/offline.html', title: 'Offline — Send-Date Ledger', heading: 'Reconnect once to open this page' },
]) {
  test(`${route.path} uses the shared accessible shell and route metadata`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(route.path);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeFocused();
    await expect(page.getByRole('link', { name: 'Demo' }).first()).toHaveAttribute('href', '/demo');
    await expect(page.getByRole('link', { name: 'Privacy', exact: true }).first()).toHaveAttribute('href', '/privacy/');
    if (route.path === '/privacy/' || route.path === '/terms/') {
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /send-date-ledger-social\.jpg$/);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    }
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({ path: `.factory/evidence/site-${route.path.replaceAll('/', '') || 'root'}.png`, fullPage: true });
  });
}
