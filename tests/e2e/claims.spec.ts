import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { PDFDocument, StandardFonts } from 'pdf-lib';

const evidence = (name: string) => `.factory/evidence/${name}.png`;

async function clearDatabase(page: import('@playwright/test').Page, name: string) {
  await page.evaluate((database) => new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase(database);
    request.onsuccess = request.onerror = request.onblocked = () => resolve();
  }), name);
}

async function freshDemo(page: import('@playwright/test').Page) {
  await page.goto('/demo');
  await clearDatabase(page, 'demo:send-date-ledger');
  await page.reload();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('.invoice-slip')).toHaveCount(3);
}

async function openBackup(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Back up or restore' }).click();
  await expect(page.getByRole('dialog', { name: 'Back up or restore' })).toBeVisible();
}

test.beforeAll(() => mkdirSync('.factory/evidence', { recursive: true }));

test('@claim:demo-isolation keeps sample changes away from real records', async ({ page }) => {
  await page.goto('/');
  await clearDatabase(page, 'send-date-ledger');
  await clearDatabase(page, 'demo:send-date-ledger');
  await page.reload();
  await page.getByRole('button', { name: 'Add invoice manually' }).click();
  await page.getByLabel('Invoice reference').fill('REAL-KEEP-001');
  await page.locator('#client').fill('Real Client');
  await page.getByLabel('Amount').fill('50');
  await page.getByRole('button', { name: 'Save invoice' }).click();
  await expect(page.getByRole('heading', { name: 'REAL-KEEP-001' })).toBeVisible();
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('REAL-KEEP-001')).toHaveCount(0);
  await expect(page.locator('.invoice-slip')).toHaveCount(3);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { name: 'REAL-KEEP-001' })).toBeVisible();
  await expect(page.getByText('NORTH-026')).toHaveCount(0);
  await page.screenshot({ path: evidence('claim-demo-isolation'), fullPage: true });
});

test('@claim:due-date calculates a visible due date from the selected rule', async ({ page }) => {
  await freshDemo(page);
  await page.getByRole('button', { name: 'Add invoice', exact: true }).click();
  await page.getByLabel('Invoice reference').fill('DUE-030');
  await page.locator('#client').fill('Calendar Studio');
  await page.getByLabel('Amount').fill('900');
  await page.getByLabel('Issued').fill('2026-08-02T10:00');
  await page.getByLabel('Due rule').selectOption('30');
  await expect(page.locator('#due-preview')).toContainText('Sep 01, 2026');
  await page.screenshot({ path: evidence('claim-due-date') });
});

test('@claim:csv-export downloads one CSV row per invoice and seals its dates', async ({ page }) => {
  await freshDemo(page);
  await page.getByRole('button', { name: 'Export monthly CSV' }).click();
  await page.getByLabel('Issue month').fill('2026-08');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Seal & export CSV' }).click();
  const download = await downloadPromise;
  const content = await readFile(await download.path(), 'utf8');
  expect(content.split('\n')).toHaveLength(4);
  expect(content).toContain('NORTH-026');
  expect(content).toContain('ACME-1048');
  expect(content).toContain('MOSS-118');
  await page.getByRole('button', { name: 'Close export dialog' }).click();
  await expect(page.locator('.sealed-badge')).toHaveCount(3);
  await page.screenshot({ path: evidence('claim-csv-export'), fullPage: true });
});

test('@claim:sealed-restore preserves sealed dates when an older backup is restored', async ({ page }) => {
  await freshDemo(page);
  await openBackup(page);
  const backupPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download plain JSON' }).click();
  const backup = await backupPromise;
  await page.getByRole('button', { name: 'Close backup dialog' }).click();
  await page.getByRole('button', { name: 'Export monthly CSV' }).click();
  await page.getByLabel('Issue month').fill('2026-08');
  const csvPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Seal & export CSV' }).click();
  await csvPromise;
  await page.getByRole('button', { name: 'Close export dialog' }).click();
  await openBackup(page);
  await page.getByLabel('Backup file').setInputFiles(await backup.path());
  await page.getByLabel('I understand that records with matching IDs will be replaced.').check();
  await page.getByRole('button', { name: 'Restore selected file' }).click();
  const slip = page.locator('.invoice-slip').filter({ hasText: 'NORTH-026' });
  await slip.getByRole('button', { name: 'Edit' }).click();
  await expect(page.getByLabel('Issued')).toBeDisabled();
  await expect(page.locator('#sent-at')).toBeDisabled();
  await page.screenshot({ path: evidence('claim-sealed-restore') });
});

test('@claim:backup-validation rejects a malformed time zone without changing data', async ({ page }) => {
  await freshDemo(page);
  await openBackup(page);
  const malformed = {
    format: 'send-date-ledger', version: 1, exportedAt: '2026-08-28T10:00:00.000Z', exports: [],
    invoices: [{ id: 'bad-zone', reference: 'BAD-1', client: 'Bad Zone', amountMinor: 100, currency: 'USD', termsDays: 30, draftedAt: { instant: '2026-08-01T00:00:00.000Z', timeZone: 'Not/A_Timezone' }, note: '', lockedFields: [], revision: 1, createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z' }],
  };
  await page.getByLabel('Backup file').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(malformed)) });
  await page.getByLabel('I understand that records with matching IDs will be replaced.').check();
  await page.getByRole('button', { name: 'Restore selected file' }).click();
  await expect(page.getByRole('alert')).toContainText('invalid time zone');
  await page.reload();
  await expect(page.locator('.invoice-slip')).toHaveCount(3);
  await expect(page.getByText('BAD-1')).toHaveCount(0);
  await page.screenshot({ path: evidence('claim-backup-validation') });
});

test('@claim:offline-reload reloads and edits the demo after the first visit', async ({ page, context }) => {
  await freshDemo(page);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Offline · changes still save')).toBeVisible();
  const slip = page.locator('.invoice-slip').filter({ hasText: 'MOSS-118' });
  await slip.getByRole('button', { name: 'Record sent' }).click();
  await expect(slip).toContainText('Sent');
  await page.reload();
  await expect(page.locator('.invoice-slip').filter({ hasText: 'MOSS-118' })).toContainText('Sent');
  await page.screenshot({ path: evidence('claim-offline-reload') });
  await context.setOffline(false);
});

test('@claim:local-only sends no demo invoice data off origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await freshDemo(page);
  await page.locator('.invoice-slip').filter({ hasText: 'MOSS-118' }).getByRole('button', { name: 'Record sent' }).click();
  await openBackup(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download plain JSON' }).click();
  await downloadPromise;
  expect(requests.filter((url) => new URL(url).origin !== new URL(page.url()).origin)).toEqual([]);
  await page.screenshot({ path: evidence('claim-local-only') });
});

test('@claim:encrypted-backup hides invoice text and restores with its passphrase', async ({ page }) => {
  await freshDemo(page);
  await openBackup(page);
  await page.getByLabel('Passphrase for encrypted backup').fill('correct horse battery');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download encrypted' }).click();
  const download = await downloadPromise;
  const payload = await readFile(await download.path(), 'utf8');
  expect(payload).not.toContain('NORTH-026');
  await page.getByLabel('Backup file').setInputFiles(await download.path());
  await page.getByLabel('Passphrase', { exact: false }).last().fill('correct horse battery');
  await page.getByLabel('I understand that records with matching IDs will be replaced.').check();
  await page.getByRole('button', { name: 'Restore selected file' }).click();
  await expect(page.getByText('NORTH-026')).toBeVisible();
  await page.screenshot({ path: evidence('claim-encrypted-backup') });
});

test('@claim:paid-pdf stores a PDF only after a cached valid license', async ({ page }) => {
  await freshDemo(page);
  await page.evaluate(() => {
    localStorage.setItem('demo:sb_license:invoice-send-ledger', 'verified-test-token');
    localStorage.setItem('demo:sb_license_verdict:invoice-send-ledger', JSON.stringify({ valid: true, reason: 'ok', checkedAt: Date.now() }));
  });
  await page.reload();
  await expect(page.getByText('₹699 once', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Add invoice', exact: true }).click();
  await page.getByLabel('Invoice reference').fill('PDF-PAID-1');
  await page.locator('#client').fill('Paper Trail Studio');
  await page.getByLabel('Amount').fill('120');
  await page.getByLabel('Original invoice PDF').setInputFiles({ name: 'paid-proof.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 test') });
  await page.getByRole('button', { name: 'Save invoice' }).click();
  await expect(page.getByRole('heading', { name: 'PDF-PAID-1' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Open paid-proof.pdf' })).toBeVisible();
  await page.screenshot({ path: evidence('claim-paid-pdf'), fullPage: true });
});

test('@claim:pdf-import reads invoice fields locally and keeps them editable', async ({ page }) => {
  await freshDemo(page);
  const pdf = await PDFDocument.create();
  const pdfPage = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  pdfPage.drawText('INVOICE INV-2026-777   BILL TO Pine Workshop   TOTAL $1,240.50', { x: 48, y: 720, size: 14, font });
  await page.getByRole('button', { name: 'Import invoice PDF' }).click();
  await page.locator('#import-pdf-input').setInputFiles({ name: 'INV-2026-777.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await pdf.save()) });
  await expect(page.getByRole('dialog', { name: 'Add invoice' })).toBeVisible();
  await expect(page.getByLabel('Invoice reference')).toHaveValue('INV-2026-777');
  await expect(page.getByLabel('Amount')).toHaveValue('1240.50');
  await expect(page.getByLabel('Invoice reference')).toBeEditable();
  await page.screenshot({ path: evidence('claim-pdf-import') });
});

test('@claim:concurrent-write stops a stale tab from erasing a newer date', async ({ page, context }) => {
  await freshDemo(page);
  const second = await context.newPage();
  await second.goto('/demo');
  const secondSlip = second.locator('.invoice-slip').filter({ hasText: 'MOSS-118' });
  await secondSlip.getByRole('button', { name: 'Edit' }).click();
  await second.getByLabel('Note').fill('Stale note edit');
  await page.locator('.invoice-slip').filter({ hasText: 'MOSS-118' }).getByRole('button', { name: 'Record sent' }).click();
  await second.getByRole('button', { name: 'Save invoice' }).click();
  await expect(second.getByRole('alert')).toContainText('changed in another tab');
  await second.reload();
  const current = second.locator('.invoice-slip').filter({ hasText: 'MOSS-118' });
  await expect(current).toContainText('Sent');
  await expect(current).not.toContainText('Stale note edit');
  await second.screenshot({ path: evidence('claim-concurrent-write') });
});

test('routes, metadata, accessibility, focus, and 44px targets pass', async ({ page }) => {
  await freshDemo(page);
  await expect(page).toHaveTitle('Demo — Send-Date Ledger');
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://invoice-send-ledger.sociobot.in/demo');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
  for (const button of await page.locator('button:visible').all()) {
    const box = await button.boundingBox();
    if (box) expect(box.height, await button.innerText()).toBeGreaterThanOrEqual(44);
  }
});

test('a first verification network failure keeps PDF storage locked', async ({ page }) => {
  await freshDemo(page);
  await page.getByRole('button', { name: 'View PDF storage plan' }).first().click();
  await page.getByLabel('Paste your license token').fill('not-a-real-license');
  await page.route('https://api.sociobot.in/**', (route) => route.abort());
  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page.getByText('License no longer active')).toBeVisible();
  await page.getByRole('button', { name: 'Close PDF storage plan' }).click();
  await page.getByRole('button', { name: 'Add invoice', exact: true }).click();
  await expect(page.getByLabel('Original invoice PDF')).toBeDisabled();
});
