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
  await page.locator('.invoice-slip').filter({ hasText: 'MOSS-118' }).getByRole('button', { name: 'Record sent' }).click();
  await expect(page.locator('.invoice-slip').filter({ hasText: 'MOSS-118' }).getByRole('button', { name: 'Record sent' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('.invoice-slip').filter({ hasText: 'MOSS-118' }).getByRole('button', { name: 'Record sent' })).toBeVisible();
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
  for (const [days, result] of [['0', 'Aug 02, 2026'], ['7', 'Aug 09, 2026'], ['14', 'Aug 16, 2026'], ['30', 'Sep 01, 2026'], ['45', 'Sep 16, 2026'], ['60', 'Oct 01, 2026']]) {
    await page.getByLabel('Due rule').selectOption(days);
    await expect(page.locator('#due-preview')).toContainText(result);
  }
  await page.screenshot({ path: evidence('claim-due-date') });
});

test('@claim:time-zone keeps the recorded IANA time zone beside invoice dates', async ({ page }) => {
  await freshDemo(page);
  const slip = page.locator('.invoice-slip').filter({ hasText: 'MOSS-118' });
  await expect(slip.getByText('Asia/Kolkata')).toHaveCount(3);
  await page.screenshot({ path: evidence('claim-time-zone') });
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
  expect(JSON.parse(payload)).toMatchObject({ algorithm: 'AES-256-GCM', kdf: 'PBKDF2-SHA256-250000' });
  expect(payload).not.toContain('NORTH-026');
  expect(await page.evaluate(() => Object.values(localStorage).some((value) => value.includes('correct horse battery')))).toBe(false);
  await page.getByLabel('Backup file').setInputFiles(await download.path());
  await page.getByLabel('Passphrase', { exact: false }).last().fill('correct horse battery');
  await page.getByLabel('I understand that records with matching IDs will be replaced.').check();
  await page.getByRole('button', { name: 'Restore selected file' }).click();
  await expect(page.getByText('NORTH-026')).toBeVisible();
  await page.screenshot({ path: evidence('claim-encrypted-backup') });
});

test('@claim:plain-backup downloads the complete portable record', async ({ page }) => {
  await freshDemo(page);
  await page.getByRole('button', { name: 'Export monthly CSV' }).click();
  await page.getByLabel('Issue month').fill('2026-08');
  const csvPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Seal & export CSV' }).click();
  await csvPromise;
  await page.getByRole('button', { name: 'Close export dialog' }).click();
  await openBackup(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download plain JSON' }).click();
  const payload = JSON.parse(await readFile(await (await downloadPromise).path(), 'utf8'));
  expect(payload.format).toBe('send-date-ledger');
  expect(payload.invoices).toHaveLength(3);
  expect(payload.invoices.map((invoice: { reference: string }) => invoice.reference)).toContain('NORTH-026');
  expect(payload.exports).toHaveLength(1);
  expect(payload.exports[0].csv).toContain('NORTH-026');
  await page.screenshot({ path: evidence('claim-plain-backup') });
});

test('@claim:pdf-storage keeps an invoice PDF in browser storage and both backup formats', async ({ page }) => {
  await freshDemo(page);
  await page.getByRole('button', { name: 'Add invoice', exact: true }).click();
  await expect(page.getByLabel('Invoice PDF')).toBeEnabled();
  await page.getByLabel('Invoice reference').fill('PDF-PAID-1');
  await page.locator('#client').fill('Paper Trail Studio');
  await page.getByLabel('Amount').fill('120');
  await page.getByLabel('Invoice PDF').setInputFiles({ name: 'too-large.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(10 * 1024 * 1024 + 1) });
  await page.getByRole('button', { name: 'Save invoice' }).click();
  await expect(page.getByRole('alert')).toContainText('smaller than 10 MB');
  await page.getByLabel('Invoice PDF').setInputFiles({ name: 'invoice-proof.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 test') });
  await page.getByRole('button', { name: 'Save invoice' }).click();
  await expect(page.getByRole('heading', { name: 'PDF-PAID-1' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Open invoice-proof.pdf' })).toBeVisible();
  await openBackup(page);
  const backupPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download plain JSON' }).click();
  const backup = JSON.parse(await readFile(await (await backupPromise).path(), 'utf8'));
  expect(backup.invoices.find((invoice: { reference: string }) => invoice.reference === 'PDF-PAID-1').pdfDataUrl).toMatch(/^data:application\/pdf;base64,/);
  await page.getByLabel('Passphrase for encrypted backup').fill('pdf backup passphrase');
  const encryptedPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download encrypted' }).click();
  const encrypted = await encryptedPromise;
  await page.getByRole('button', { name: 'Close backup dialog' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await openBackup(page);
  await page.getByLabel('Backup file').setInputFiles(await encrypted.path());
  await page.getByLabel('Passphrase', { exact: false }).last().fill('pdf backup passphrase');
  await page.getByLabel('I understand that records with matching IDs will be replaced.').check();
  await page.getByRole('button', { name: 'Restore selected file' }).click();
  await expect(page.getByRole('button', { name: 'Open invoice-proof.pdf' })).toBeVisible();
  await page.screenshot({ path: evidence('claim-pdf-storage'), fullPage: true });
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
  await page.getByRole('button', { name: /Switch to (dark|light) theme/ }).click();
  const darkResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(darkResults.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  for (const target of await page.locator('button:visible, header a:visible, footer a:visible, .demo-banner a:visible').all()) {
    const box = await target.boundingBox();
    if (box) {
      expect(box.height, await target.innerText()).toBeGreaterThanOrEqual(44);
      expect(box.width, await target.innerText()).toBeGreaterThanOrEqual(44);
    }
  }
});
