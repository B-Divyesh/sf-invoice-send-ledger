import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

let consoleErrors: string[] = [];

test.beforeEach(async ({ page }) => {
  consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  await page.goto('/');
  await page.evaluate(async () => {
    localStorage.clear();
    await new Promise<void>((resolve) => {
      const request = indexedDB.deleteDatabase('send-date-ledger');
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    });
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Recorded invoices' })).toBeVisible();
});

test.afterEach(() => {
  expect(consoleErrors).toEqual([]);
});

test('records, issues, exports, and seals an invoice', async ({ page }) => {
  await page.getByRole('button', { name: 'Add invoice manually' }).click();
  await page.getByLabel('Invoice reference').fill('INV-2026-041');
  await page.locator('#client').fill('Aurora Works');
  await page.getByLabel('Amount').fill('840.50');
  await page.getByRole('button', { name: 'Save invoice' }).click();

  const slip = page.locator('.invoice-slip').filter({ hasText: 'INV-2026-041' });
  await expect(slip).toContainText('Draft');
  await slip.getByRole('button', { name: 'Issue now' }).click();
  await expect(slip).toContainText('Net 30');
  await expect(slip).toContainText('Issued');
  await slip.getByRole('button', { name: 'Record sent' }).click();
  await expect(slip).toContainText('Sent');

  await page.getByRole('button', { name: 'Export monthly CSV' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Seal & export CSV' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('send-date-ledger-');
  await expect(page.getByText('1 invoice · sealed')).toBeVisible();
  await page.getByRole('button', { name: 'Close export dialog' }).click();

  await expect(slip.getByText('Sealed')).toBeVisible();
  await slip.getByRole('button', { name: 'Edit' }).click();
  await expect(page.getByLabel('Drafted')).toBeDisabled();
  await expect(page.getByLabel('Issued')).toBeDisabled();
  await expect(page.locator('#sent-at')).toBeDisabled();
  await expect(page.getByText('These dates are sealed')).toBeVisible();
});

test('has no serious accessibility violations and works at phone width', async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const serious = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
  expect(serious).toEqual([]);
  await page.getByRole('button', { name: 'Add invoice manually' }).click();
  await expect(page.getByRole('dialog', { name: 'Add invoice' })).toBeVisible();
  await expect(page.getByLabel('Invoice reference')).toBeFocused();
});

test('reloads the installed shell while offline', async ({ page, context }) => {
  await page.waitForFunction(() => 'serviceWorker' in navigator);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Track when each client invoice was sent' })).toBeVisible();
  await expect(page.getByText('Offline · changes still save')).toBeVisible();
  await context.setOffline(false);
});
