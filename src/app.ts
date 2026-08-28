import './style.css';
import { makePortableBackup, mergeSealedInvoices, parsePortableBackup, restoreInvoices } from './backup';
import { decryptBackup, encryptBackup } from './crypto';
import { createExportAndLock, deleteInvoice, DEMO_MODE, getExports, getInvoices, putInvoice, resetDemoData, restoreData } from './db';
import { demoInvoices } from './demo';
import { readInvoicePdf } from './pdf-import';
import {
  addCalendarDays,
  csvForInvoices,
  currentMonth,
  inputFromStamp,
  invoiceStatus,
  localTimeZone,
  lockPresentDates,
  monthOfStamp,
  stampFromLocal,
  validateChronology,
} from './domain';
import {
  captureReturnedLicense,
  clearLicense,
  licenseState,
  saveLicense,
  verifyLicense,
} from './license';
import type { DateField, DateStamp, ExportInvoice, InvoiceRecord, LedgerExport, PortableBackup } from './types';

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) throw new Error('App container is missing.');
const app: HTMLDivElement = appRoot;

let invoices: InvoiceRecord[] = [];
let exportsHistory: LedgerExport[] = [];
let search = '';
let filter = 'All';
let installPrompt: BeforeInstallPromptEvent | null = null;
let storageError = '';

captureReturnedLicense();
applySavedTheme();
renderShell();
void start();

async function start(): Promise<void> {
  try {
    [invoices, exportsHistory] = await Promise.all([getInvoices(), getExports()]);
    if (DEMO_MODE && invoices.length === 0) {
      await resetDemoData(demoInvoices());
      [invoices, exportsHistory] = await Promise.all([getInvoices(), getExports()]);
    }
  } catch (error) {
    storageError = messageOf(error, 'Your browser blocked local storage. Check site permissions, then reload.');
  }
  renderLedger();
  bindGlobalEvents();
  void verifyLicense().then((state) => {
    updateLicenseUi(state.unlocked, state.reason);
    renderLedger();
  });
  registerServiceWorker();
  updateRouteMetadata();
  window.setTimeout(() => document.querySelector<HTMLElement>('#page-title')?.focus(), 0);
}

function renderShell(): void {
  const mainContent = DEMO_MODE ? demoMainMarkup() : landingMainMarkup();
  app.innerHTML = `
    ${DEMO_MODE ? `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><span>Changes stay separate from your invoice records.</span><button class="text-button" id="reset-demo" type="button">Reset demo</button><a href="/" id="start-real">Start for real</a></aside>` : ''}
    <header class="site-header">
      <a class="brand" href="/" aria-label="Send-Date Ledger home">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>Send-Date Ledger</span>
      </a>
      <nav aria-label="Primary">
        <a href="/demo">Demo</a>
        <a href="/privacy/">Privacy</a>
        <button class="quiet-button" id="install-button" type="button" hidden>Install app</button>
        <button class="icon-button" id="theme-button" type="button" aria-label="Switch to dark theme" title="Change theme">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/></svg>
        </button>
        <button class="quiet-button" id="settings-button" type="button">View PDF storage plan</button>
      </nav>
    </header>${mainContent}
    <footer>
      <p><span class="footer-mark" aria-hidden="true"></span> Record dates for invoices you create elsewhere.</p>
      <nav aria-label="Footer"><a href="/demo">Demo</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav>
      <p class="disclosure">Built by Param Factory · build polish-2 · Ceramic artwork generated for this product with Azure OpenAI.</p>
    </footer>
    ${invoiceDialogMarkup()}
    ${exportDialogMarkup()}
    ${backupDialogMarkup()}
    ${settingsDialogMarkup()}
    <dialog id="confirm-dialog" class="dialog small-dialog" aria-labelledby="confirm-title">
      <div class="dialog-heading"><div><p class="eyebrow">Please confirm</p><h2 id="confirm-title">Remove invoice?</h2></div></div>
      <p id="confirm-copy"></p>
      <div class="dialog-actions"><button class="quiet-button" data-close="confirm-dialog" type="button">Keep invoice</button><button class="danger-button" id="confirm-remove" type="button">Remove invoice</button></div>
    </dialog>
    <div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true" hidden></div>
    <div class="update-toast" id="update-toast" role="status" hidden><span>A fresh version is ready.</span><button type="button" id="reload-button">Update now</button></div>
    <div class="sr-only" id="route-announcer" aria-live="polite"></div>
  `;
}

function landingMainMarkup(): string {
  return `
    <main id="main" tabindex="-1">
      <section class="hero" aria-labelledby="page-title">
        <div class="hero-copy">
          <p class="eyebrow"><span class="online-dot" aria-hidden="true"></span><span id="connection-state">Stored in this browser</span></p>
          <h1 id="page-title" tabindex="-1">Track when each client invoice was sent</h1>
          <p class="hero-lede">For freelancers who prepare invoices over time and need reliable issued, sent, due, and paid dates.</p>
          <div class="hero-actions">
            ${DEMO_MODE ? `<button class="primary-button" id="new-invoice-button" type="button">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
              Add invoice
            </button>` : `<a class="primary-button button-link hero-demo-link" href="/demo">Try it with sample data</a>`}
            <span class="action-explainer">${DEMO_MODE ? 'Adds only to this sample record' : 'Opens three sample invoices'}</span>
          </div>
          <div class="secondary-actions">${DEMO_MODE ? '' : '<button class="text-button" id="manual-invoice-button" type="button">Add invoice manually</button>'}<button class="text-button" id="import-pdf-button" type="button">Import invoice PDF</button><input id="import-pdf-input" type="file" accept="application/pdf,.pdf" hidden><button class="text-button" id="backup-button" type="button">Back up or restore</button></div>
          <ul class="plain-facts"><li>No analytics or advertising</li><li>Edit offline after the first visit</li><li>Date record: free · PDF storage: ₹699 once</li></ul>
        </div>
        <figure class="hero-figure">
          <img src="/assets/ceramic-ledger.webp" width="1200" height="800" alt="Five handmade porcelain tiles arranged in date order" decoding="async" fetchpriority="high" />
          <figcaption>Drafted, issued, due, sent, and paid dates stay together.</figcaption>
        </figure>
      </section>
      <section id="ledger-region" class="ledger-region" aria-labelledby="ledger-title" aria-live="polite">
        <div class="loading-state"><span class="clay-spinner" aria-hidden="true"></span><p>Opening your invoice records…</p></div>
      </section>
      ${informationSectionsMarkup()}
    </main>
  `;
}

function demoMainMarkup(): string {
  return `
    <main id="main" tabindex="-1">
      <section class="demo-intro" aria-labelledby="page-title">
        <div>
          <p class="eyebrow"><span class="online-dot" aria-hidden="true"></span><span id="connection-state">Stored in this browser</span></p>
          <h1 id="page-title" tabindex="-1">Sample invoice date record</h1>
          <p>Review three invoices, then add or edit a sample date.</p>
        </div>
        <div class="secondary-actions"><button class="primary-button" id="new-invoice-button" type="button">Add invoice</button><button class="text-button" id="import-pdf-button" type="button">Import invoice PDF</button><input id="import-pdf-input" type="file" accept="application/pdf,.pdf" hidden><button class="text-button" id="backup-button" type="button">Back up or restore</button></div>
      </section>
      <section id="ledger-region" class="ledger-region demo-ledger-region" aria-labelledby="ledger-title" aria-live="polite">
        <div class="loading-state"><span class="clay-spinner" aria-hidden="true"></span><p>Opening your sample invoices…</p></div>
      </section>
      ${informationSectionsMarkup()}
    </main>
  `;
}

function informationSectionsMarkup(): string {
  return `<section class="explain-section" aria-labelledby="how-title"><p class="eyebrow">Three steps</p><h2 id="how-title">How it works</h2><ol class="steps"><li><strong>Record the invoice</strong><span>Enter the details or read them from a PDF in this browser.</span></li><li><strong>Add each date</strong><span>Choose a due rule, then record when you issue, send, and get paid.</span></li><li><strong>Export the month</strong><span>Download a monthly CSV. Dates in that export become sealed.</span></li></ol></section>
    <section class="limits-section" aria-labelledby="limits-title"><div><p class="eyebrow">Limits and privacy</p><h2 id="limits-title">What this does not do and where data stays</h2></div><div><p>It does not create invoices, calculate tax, take payments, or replace accounting records.</p><p>Invoice records stay in this browser. The app sends no invoice data to a server.</p></div></section>
    <section class="price-section" aria-labelledby="price-title"><div><p class="eyebrow">PDF storage plan</p><h2 id="price-title">Keep the sent PDF with its dates</h2><p>Invoice date records, monthly CSV exports, and backups are free.</p></div><div class="price-slip"><strong>₹699 once</strong><span>Adds local PDF storage and includes PDFs in backups.</span><button class="quiet-button" id="price-plan-button" type="button">View PDF storage plan</button></div></section>`;
}

function invoiceDialogMarkup(): string {
  const zone = escapeHtml(localTimeZone());
  return `
    <dialog id="invoice-dialog" class="dialog invoice-dialog" aria-labelledby="invoice-dialog-title">
      <form id="invoice-form" novalidate>
        <div class="dialog-heading">
          <div><p class="eyebrow">Invoice date record</p><h2 id="invoice-dialog-title">Add invoice</h2></div>
          <button class="icon-button dialog-close" type="button" data-close="invoice-dialog" aria-label="Close invoice form"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
        </div>
        <div class="form-error" id="invoice-errors" role="alert" tabindex="-1" hidden></div>
        <input type="hidden" id="invoice-id" />
        <p class="required-note"><span aria-hidden="true">*</span> Required fields</p>
        <div class="form-grid">
          <div class="field"><label for="reference">Invoice reference <span aria-hidden="true">*</span></label><input id="reference" name="reference" maxlength="80" required autocomplete="off" /></div>
          <div class="field"><label for="client">Client <span aria-hidden="true">*</span></label><input id="client" name="client" maxlength="120" required autocomplete="organization" /></div>
          <div class="amount-fields">
            <div class="field"><label for="amount">Amount <span aria-hidden="true">*</span></label><input id="amount" name="amount" type="number" min="0" max="999999999" step="0.01" inputmode="decimal" required /></div>
            <div class="field currency-field"><label for="currency">Currency</label><select id="currency" name="currency"><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option><option>AUD</option><option>CAD</option><option>SGD</option><option>JPY</option></select></div>
          </div>
        </div>
        <fieldset class="date-fieldset">
          <legend>Invoice dates</legend>
          <p class="fieldset-help">Times keep the <strong>${zone}</strong> time zone. Issuing calculates the due date from the rule below.</p>
          <div class="date-grid">
            ${dateInput('drafted', 'Drafted', true)}
            ${dateInput('issued', 'Issued')}
            ${dateInput('sent', 'Sent')}
            ${dateInput('paid', 'Paid')}
          </div>
          <div class="due-rule">
            <div class="field"><label for="terms">Due rule</label><select id="terms" name="terms"><option value="7">Net 7</option><option value="14">Net 14</option><option value="30" selected>Net 30</option><option value="45">Net 45</option><option value="60">Net 60</option><option value="0">Due on issue</option></select></div>
            <div class="due-preview"><span>Calculated due date</span><strong id="due-preview">Add an issued date</strong></div>
          </div>
          <p class="sealed-note" id="sealed-note" hidden><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 10h12v10H6zM8 10V7a4 4 0 0 1 8 0v3"/></svg>These dates are sealed because they appear in a monthly CSV export.</p>
        </fieldset>
        <div class="field"><label for="note">Note <span class="optional">Optional</span></label><textarea id="note" name="note" maxlength="500" rows="3" placeholder="e.g. Sent after final scope approval"></textarea></div>
        <div class="pdf-field">
          <div><label for="pdf">Original invoice PDF <span class="studio-chip">PDF storage plan</span></label><p id="pdf-help">Keep the sent file beside its dates in this browser. PDF only, up to 10 MB.</p></div>
          <input id="pdf" name="pdf" type="file" accept="application/pdf,.pdf" aria-describedby="pdf-help" />
          <label class="remove-pdf" id="remove-pdf-label" hidden><input id="remove-pdf" type="checkbox" /> Remove current PDF</label>
          <button class="text-button small" id="pdf-upgrade-button" type="button" hidden>Unlock PDF storage</button>
        </div>
        <div class="dialog-actions"><button class="quiet-button" type="button" data-close="invoice-dialog">Cancel</button><button class="primary-button" id="save-invoice" type="submit">Save invoice</button></div>
      </form>
    </dialog>`;
}

function dateInput(id: string, label: string, required = false): string {
  return `<div class="field date-field"><label for="${id}-at"><span class="event-dot" aria-hidden="true"></span>${label}${required ? ' <span aria-hidden="true">*</span>' : ''}<span class="locked-label" id="${id}-locked" hidden>Sealed</span></label><input id="${id}-at" name="${id}-at" type="datetime-local" ${required ? 'required' : ''} /></div>`;
}

function exportDialogMarkup(): string {
  return `
    <dialog id="export-dialog" class="dialog" aria-labelledby="export-title">
      <div class="dialog-heading"><div><p class="eyebrow">Monthly CSV export</p><h2 id="export-title">Export monthly CSV</h2></div><button class="icon-button dialog-close" type="button" data-close="export-dialog" aria-label="Close export dialog"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
      <p class="dialog-intro">Choose an issue month. The app keeps a copy of the CSV and seals every included date against later edits.</p>
      <form id="export-form" class="export-form"><div class="field"><label for="export-month">Issue month</label><input type="month" id="export-month" required /></div><button class="primary-button" type="submit">Seal &amp; export CSV</button></form>
      <div class="form-error" id="export-error" role="alert" hidden></div>
      <div class="snapshot-list"><h3>Previous monthly CSV exports</h3><div id="snapshot-list"></div></div>
    </dialog>`;
}

function backupDialogMarkup(): string {
  return `
    <dialog id="backup-dialog" class="dialog" aria-labelledby="backup-title">
      <div class="dialog-heading"><div><p class="eyebrow">Data ownership</p><h2 id="backup-title">Back up or restore</h2></div><button class="icon-button dialog-close" type="button" data-close="backup-dialog" aria-label="Close backup dialog"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
      <p class="dialog-intro">Backups include invoice records, monthly CSV history, and stored PDFs. Backup creation happens in this browser.</p>
      <section class="backup-section" aria-labelledby="backup-export-title"><h3 id="backup-export-title">Create a backup</h3><div class="field"><label for="backup-passphrase">Passphrase for encrypted backup</label><input type="password" id="backup-passphrase" minlength="8" autocomplete="new-password" aria-describedby="passphrase-help" /><p id="passphrase-help" class="field-help">Use 8+ characters. It cannot be recovered if forgotten.</p></div><div class="button-row"><button class="primary-button" id="encrypted-backup" type="button">Download encrypted</button><button class="quiet-button" id="plain-backup" type="button">Download plain JSON</button></div></section>
      <section class="backup-section" aria-labelledby="backup-restore-title"><h3 id="backup-restore-title">Restore a backup</h3><div class="field"><label for="restore-file">Backup file</label><input type="file" id="restore-file" accept="application/json,.json,.sdl" /></div><div class="field"><label for="restore-passphrase">Passphrase <span class="optional">For encrypted files</span></label><input type="password" id="restore-passphrase" autocomplete="current-password" /></div><label class="check-label"><input type="checkbox" id="restore-confirm" /> I understand that records with matching IDs will be replaced.</label><button class="quiet-button" id="restore-button" type="button">Restore selected file</button></section>
      <div class="form-error" id="backup-error" role="alert" hidden></div>
    </dialog>`;
}

function settingsDialogMarkup(): string {
  return `
    <dialog id="settings-dialog" class="dialog studio-dialog" aria-labelledby="studio-title">
      <div class="dialog-heading"><div><p class="eyebrow">Existing license feature</p><h2 id="studio-title">PDF storage plan</h2></div><button class="icon-button dialog-close" type="button" data-close="settings-dialog" aria-label="Close PDF storage plan"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
      <div class="studio-price"><span>Lifetime, this version</span><strong>₹699</strong></div>
      <p class="dialog-intro">Invoice records, monthly CSV exports, backups, and accessibility features stay free. This plan adds PDF storage in this browser.</p>
      <ul class="feature-list"><li><span aria-hidden="true">✓</span> Attach invoice PDFs up to 10 MB</li><li><span aria-hidden="true">✓</span> PDFs included in plain and encrypted backups</li><li><span aria-hidden="true">✓</span> One-time purchase—no subscription</li></ul>
      <div id="license-status" class="license-status"></div>
      <p class="checkout-paused" id="buy-link">New licenses are not for sale. Existing licenses still work.</p>
      <div class="license-restore"><h3>Have a license?</h3><label for="license-token">Paste your license token</label><div class="input-button"><input id="license-token" autocomplete="off" spellcheck="false" /><button class="quiet-button" id="restore-license" type="button">Verify</button></div><button class="text-button small" id="remove-license" type="button" hidden>Remove license from this device</button></div>
      <p class="merchant-note">License sales and refunds are handled by Sociobot/Dodo, the merchant of record. A refund revokes the license. <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></p>
    </dialog>`;
}

function renderLedger(): void {
  const region = document.querySelector<HTMLElement>('#ledger-region');
  if (!region) return;
  if (storageError) {
    region.innerHTML = `<div class="error-state"><span aria-hidden="true">!</span><div><h2 id="ledger-title">Your invoice records could not open</h2><p>${escapeHtml(storageError)}</p><button class="quiet-button" id="reload-records" type="button">Reload invoice records</button></div></div>`;
    document.querySelector('#reload-records')?.addEventListener('click', () => location.reload());
    return;
  }
  const issued = invoices.filter((invoice) => invoice.issuedAt);
  const sentCount = issued.filter((invoice) => invoice.sentAt).length;
  const dueCount = issued.filter((invoice) => invoice.dueOn).length;
  const sentRate = issued.length ? Math.round((sentCount / issued.length) * 100) : 0;
  const dueRate = issued.length ? Math.round((dueCount / issued.length) * 100) : 0;
  const filtered = invoices
    .filter((invoice) => !search || `${invoice.reference} ${invoice.client}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    .filter((invoice) => filter === 'All' || invoiceStatus(invoice) === filter)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  region.innerHTML = `
    <div class="section-heading">
      <div><p class="eyebrow">Invoice date record</p><h2 id="ledger-title">Recorded invoices</h2></div>
      <button class="quiet-button export-button" id="export-button" type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 18v2h14v-2"/></svg>Export monthly CSV</button>
    </div>
    ${invoices.length && !DEMO_MODE ? statsMarkup(sentRate, dueRate, issued.length) : ''}
    ${invoices.length && !DEMO_MODE ? toolbarMarkup() : ''}
    <div id="invoice-list" class="invoice-list">
      ${invoices.length === 0 ? emptyStateMarkup() : filtered.length === 0 ? noResultsMarkup() : filtered.map(invoiceMarkup).join('')}
    </div>
    ${invoices.length && DEMO_MODE ? `<div class="demo-toolbar">${toolbarMarkup()}</div>` : ''}`;
  bindLedgerEvents();
}

function statsMarkup(sentRate: number, dueRate: number, issuedCount: number): string {
  const sentTarget = sentRate >= 95;
  return `<div class="health-strip" aria-label="Invoice date completeness">
    <div class="health-intro"><span class="stamp-icon" aria-hidden="true">✓</span><div><strong>${issuedCount} issued ${issuedCount === 1 ? 'invoice' : 'invoices'}</strong><span>Completeness for recorded issues</span></div></div>
    <div class="metric"><span>Sent date recorded</span><strong>${sentRate}%</strong><small>${sentTarget ? '95% pilot target met' : 'Target: 95%'}</small></div>
    <div class="metric"><span>Visible due rule</span><strong>${dueRate}%</strong><small>${dueRate === 100 ? 'Every issue is covered' : 'Add missing due dates'}</small></div>
  </div>`;
}

function toolbarMarkup(): string {
  return `<div class="ledger-toolbar"><div class="search-field"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg><label class="sr-only" for="ledger-search">Search invoices</label><input id="ledger-search" type="search" placeholder="Search reference or client" value="${escapeHtml(search)}" /></div><div class="field compact-field"><label for="status-filter">Show</label><select id="status-filter"><option ${filter === 'All' ? 'selected' : ''}>All</option><option ${filter === 'Draft' ? 'selected' : ''}>Draft</option><option ${filter === 'Issued' ? 'selected' : ''}>Issued</option><option ${filter === 'Sent' ? 'selected' : ''}>Sent</option><option ${filter === 'Paid' ? 'selected' : ''}>Paid</option></select></div></div>`;
}

function emptyStateMarkup(): string {
  return `<div class="empty-state"><div class="empty-tiles" aria-hidden="true"><i></i><i></i><i></i></div><h3>No invoices recorded yet</h3><p>Add the next invoice you are drafting, or record one already sent. Choose a due rule when you add it.</p><button class="primary-button" data-action="new" type="button">Add your first invoice</button></div>`;
}

function noResultsMarkup(): string {
  return `<div class="empty-state small"><h3>No matching invoices</h3><p>Try a different reference, client, or status.</p><button class="text-button" data-action="clear-filters" type="button">Clear filters</button></div>`;
}

function invoiceMarkup(invoice: InvoiceRecord): string {
  const status = invoiceStatus(invoice);
  const sealed = invoice.lockedFields.length > 0;
  const amount = new Intl.NumberFormat(undefined, { style: 'currency', currency: invoice.currency }).format(invoice.amountMinor / 100);
  const nextAction = !invoice.issuedAt
    ? `<button class="primary-button small" data-action="issue" data-id="${invoice.id}" type="button">Issue now</button>`
    : !invoice.sentAt
      ? `<button class="primary-button small" data-action="send" data-id="${invoice.id}" type="button">Record sent</button>`
      : !invoice.paidAt
        ? `<button class="quiet-button small" data-action="pay" data-id="${invoice.id}" type="button">Mark paid</button>`
        : '';
  return `<article class="invoice-slip" data-status="${status}">
    <div class="invoice-summary"><div><div class="reference-line"><h3>${escapeHtml(invoice.reference)}</h3><span class="status-badge status-${status.toLowerCase()}">${status}</span>${sealed ? '<span class="sealed-badge"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 10h12v10H6zM8 10V7a4 4 0 0 1 8 0v3"/></svg>Sealed</span>' : ''}</div><p>${escapeHtml(invoice.client)}</p></div><strong class="amount">${escapeHtml(amount)}</strong></div>
    <div class="event-rail" aria-label="Invoice dates">
      ${eventMarkup('Drafted', invoice.draftedAt, true)}
      ${eventMarkup('Issued', invoice.issuedAt, Boolean(invoice.issuedAt))}
      ${dueMarkup(invoice)}
      ${eventMarkup('Sent', invoice.sentAt, Boolean(invoice.sentAt))}
      ${eventMarkup('Paid', invoice.paidAt, Boolean(invoice.paidAt))}
    </div>
    ${invoice.note ? `<p class="invoice-note"><span>Note</span>${escapeHtml(invoice.note)}</p>` : ''}
    <div class="invoice-actions">${nextAction}${invoice.pdf && licenseState().unlocked ? `<button class="text-button small" data-action="pdf" data-id="${invoice.id}" type="button">Open ${escapeHtml(invoice.pdfName ?? 'PDF')}</button>` : ''}${invoice.pdf && !licenseState().unlocked ? '<span class="muted-copy">PDF locked · verify license</span>' : ''}<span class="action-spacer"></span><button class="text-button small" data-action="edit" data-id="${invoice.id}" type="button">Edit</button><button class="text-button small danger-text" data-action="remove" data-id="${invoice.id}" type="button" ${sealed ? 'disabled title="Sealed records cannot be removed"' : ''}>Remove</button></div>
  </article>`;
}

function eventMarkup(label: string, stamp: DateStamp | undefined, complete: boolean): string {
  return `<div class="event-step ${complete ? 'complete' : ''}"><span class="rail-dot" aria-hidden="true">${complete ? '✓' : ''}</span><div><span>${label}</span><strong>${stamp ? escapeHtml(formatStamp(stamp)) : 'Not recorded'}</strong>${stamp ? `<small>${escapeHtml(stamp.timeZone)}</small>` : ''}</div></div>`;
}

function dueMarkup(invoice: InvoiceRecord): string {
  return `<div class="event-step due-step ${invoice.dueOn ? 'complete' : ''}"><span class="rail-dot" aria-hidden="true">${invoice.dueOn ? '✓' : ''}</span><div><span>Due · Net ${invoice.termsDays}</span><strong>${invoice.dueOn ? escapeHtml(formatDue(invoice.dueOn.date)) : 'Not generated'}</strong>${invoice.dueOn ? `<small>${escapeHtml(invoice.dueOn.timeZone)}</small>` : ''}</div></div>`;
}

function bindGlobalEvents(): void {
  document.querySelector('#new-invoice-button')?.addEventListener('click', () => openInvoiceDialog());
  document.querySelector('#manual-invoice-button')?.addEventListener('click', () => openInvoiceDialog());
  document.querySelector('#import-pdf-button')?.addEventListener('click', () => document.querySelector<HTMLInputElement>('#import-pdf-input')?.click());
  document.querySelector('#import-pdf-input')?.addEventListener('change', importPdfFromPicker);
  document.querySelector('#backup-button')?.addEventListener('click', openBackupDialog);
  document.querySelector('#settings-button')?.addEventListener('click', openSettingsDialog);
  document.querySelector('#price-plan-button')?.addEventListener('click', openSettingsDialog);
  document.querySelector('#reset-demo')?.addEventListener('click', resetDemo);
  document.querySelector('#start-real')?.addEventListener('click', leaveDemo);
  document.querySelector('#theme-button')?.addEventListener('click', toggleTheme);
  document.querySelector('#invoice-form')?.addEventListener('submit', saveInvoiceFromForm);
  document.querySelector('#issued-at')?.addEventListener('input', updateDuePreview);
  document.querySelector('#terms')?.addEventListener('change', updateDuePreview);
  document.querySelector('#export-form')?.addEventListener('submit', createMonthlyExport);
  document.querySelector('#encrypted-backup')?.addEventListener('click', downloadEncryptedBackup);
  document.querySelector('#plain-backup')?.addEventListener('click', downloadPlainBackup);
  document.querySelector('#restore-button')?.addEventListener('click', restoreBackupFile);
  document.querySelector('#restore-license')?.addEventListener('click', restoreLicense);
  document.querySelector('#remove-license')?.addEventListener('click', removeLicense);
  document.querySelector('#pdf-upgrade-button')?.addEventListener('click', () => {
    closeDialog('invoice-dialog');
    openSettingsDialog();
  });
  document.querySelectorAll<HTMLElement>('[data-close]').forEach((button) => button.addEventListener('click', () => closeDialog(button.dataset.close ?? '')));
  document.querySelectorAll<HTMLDialogElement>('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  }));
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event as BeforeInstallPromptEvent;
    const button = document.querySelector<HTMLButtonElement>('#install-button');
    if (button) button.hidden = false;
  });
  document.querySelector('#install-button')?.addEventListener('click', installApp);
  window.addEventListener('online', updateConnectionState);
  window.addEventListener('offline', updateConnectionState);
  updateConnectionState();
}

async function resetDemo(): Promise<void> {
  try {
    await resetDemoData(demoInvoices());
    clearDemoKeys();
    [invoices, exportsHistory] = await Promise.all([getInvoices(), getExports()]);
    search = '';
    filter = 'All';
    renderLedger();
    showToast('Sample invoices reset.');
  } catch (error) {
    showToast(messageOf(error, 'Could not reset the sample invoices.'));
  }
}

async function leaveDemo(event: Event): Promise<void> {
  event.preventDefault();
  try { await resetDemoData([]); } catch { /* The real ledger is isolated even if cleanup is blocked. */ }
  clearDemoKeys();
  location.assign('/');
}

function clearDemoKeys(): void {
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key?.startsWith('demo:')) localStorage.removeItem(key);
  }
}

async function importPdfFromPicker(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  showToast('Reading the PDF in this browser…');
  try {
    const fields = await readInvoicePdf(file);
    openInvoiceDialog();
    setValue('#reference', fields.reference ?? '');
    setValue('#client', fields.client ?? '');
    setValue('#amount', fields.amount ?? '');
    if (fields.currency) setValue('#currency', fields.currency);
    if (licenseState().unlocked) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      const pdf = document.querySelector<HTMLInputElement>('#pdf');
      if (pdf) pdf.files = transfer.files;
    }
    showToast(licenseState().unlocked ? 'PDF details read. Check them before saving.' : 'PDF details read. Check them before saving; the PDF file is not stored.');
    document.querySelector<HTMLInputElement>('#reference')?.focus();
  } catch (error) {
    showToast(messageOf(error, 'Could not read that PDF. Add the invoice manually instead.'));
  } finally {
    input.value = '';
  }
}

function updateRouteMetadata(): void {
  const title = DEMO_MODE ? 'Demo — Send-Date Ledger' : 'Send-Date Ledger — track invoice send dates';
  const description = 'Record issued, sent, due, and paid dates for client invoices. Try three isolated sample invoices.';
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
  const canonicalPath = DEMO_MODE ? '/demo' : '/';
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://invoice-send-ledger.sociobot.in${canonicalPath}`);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', `https://invoice-send-ledger.sociobot.in${canonicalPath}`);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', description);
  const announcer = document.querySelector<HTMLElement>('#route-announcer');
  if (announcer) announcer.textContent = DEMO_MODE ? 'Demo loaded with three sample invoices.' : 'Invoice date record loaded.';
}

function bindLedgerEvents(): void {
  document.querySelector('#export-button')?.addEventListener('click', openExportDialog);
  document.querySelector('#ledger-search')?.addEventListener('input', (event) => {
    search = (event.target as HTMLInputElement).value;
    renderLedger();
    document.querySelector<HTMLInputElement>('#ledger-search')?.focus();
  });
  document.querySelector('#status-filter')?.addEventListener('change', (event) => {
    filter = (event.target as HTMLSelectElement).value;
    renderLedger();
  });
  document.querySelector('#invoice-list')?.addEventListener('click', handleListAction);
}

async function handleListAction(event: Event): Promise<void> {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'new') return openInvoiceDialog();
  if (action === 'clear-filters') {
    search = '';
    filter = 'All';
    return renderLedger();
  }
  const invoice = invoices.find((item) => item.id === button.dataset.id);
  if (!invoice) return;
  if (action === 'edit') return openInvoiceDialog(invoice);
  if (action === 'remove') return askToRemove(invoice);
  if (action === 'pdf' && invoice.pdf) return openPdf(invoice);
  if (action === 'issue' || action === 'send' || action === 'pay') await applyQuickEvent(invoice, action);
}

function openInvoiceDialog(invoice?: InvoiceRecord): void {
  const form = document.querySelector<HTMLFormElement>('#invoice-form');
  const dialog = document.querySelector<HTMLDialogElement>('#invoice-dialog');
  if (!form || !dialog) return;
  form.reset();
  setText('#invoice-dialog-title', invoice ? `Edit ${invoice.reference}` : 'Add invoice');
  setValue('#invoice-id', invoice?.id ?? '');
  setValue('#reference', invoice?.reference ?? '');
  setValue('#client', invoice?.client ?? '');
  setValue('#amount', invoice ? (invoice.amountMinor / 100).toFixed(2) : '');
  setValue('#currency', invoice?.currency ?? 'USD');
  setValue('#drafted-at', invoice ? inputFromStamp(invoice.draftedAt) : inputFromStamp(nowStamp()));
  setValue('#issued-at', inputFromStamp(invoice?.issuedAt));
  setValue('#sent-at', inputFromStamp(invoice?.sentAt));
  setValue('#paid-at', inputFromStamp(invoice?.paidAt));
  setValue('#terms', String(invoice?.termsDays ?? 30));
  setValue('#note', invoice?.note ?? '');
  hideError('#invoice-errors');
  const hasLocks = Boolean(invoice?.lockedFields.length);
  toggleHidden('#sealed-note', !hasLocks);
  const mapping: Array<[string, DateField]> = [['drafted', 'draftedAt'], ['issued', 'issuedAt'], ['sent', 'sentAt'], ['paid', 'paidAt']];
  for (const [id, field] of mapping) {
    const locked = Boolean(invoice?.lockedFields.includes(field));
    const input = document.querySelector<HTMLInputElement>(`#${id}-at`);
    if (input) input.disabled = locked;
    toggleHidden(`#${id}-locked`, !locked);
  }
  const terms = document.querySelector<HTMLSelectElement>('#terms');
  if (terms) terms.disabled = Boolean(invoice?.lockedFields.includes('dueOn'));
  const unlocked = licenseState().unlocked;
  const pdf = document.querySelector<HTMLInputElement>('#pdf');
  if (pdf) pdf.disabled = !unlocked;
  toggleHidden('#pdf-upgrade-button', unlocked);
  toggleHidden('#remove-pdf-label', !Boolean(invoice?.pdf));
  updateDuePreview();
  dialog.showModal();
  window.setTimeout(() => document.querySelector<HTMLInputElement>('#reference')?.focus(), 0);
}

async function saveInvoiceFromForm(event: Event): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  if (!form.reportValidity()) return;
  hideError('#invoice-errors');
  const id = valueOf('#invoice-id');
  const previous = invoices.find((invoice) => invoice.id === id);
  const draftedAt = stampFromLocal(valueOf('#drafted-at'));
  if (!draftedAt) return showError('#invoice-errors', 'Add a valid drafted time.');
  const issuedAt = stampFromLocal(valueOf('#issued-at'));
  const sentAt = stampFromLocal(valueOf('#sent-at'));
  const paidAt = stampFromLocal(valueOf('#paid-at'));
  const termsDays = Number(valueOf('#terms'));
  const amount = Number(valueOf('#amount'));
  if (!Number.isFinite(amount) || amount < 0) return showError('#invoice-errors', 'Enter a valid amount of zero or more.');
  const now = new Date().toISOString();
  const candidate: InvoiceRecord = {
    id: previous?.id ?? crypto.randomUUID(),
    reference: valueOf('#reference').trim(),
    client: valueOf('#client').trim(),
    amountMinor: Math.round(amount * 100),
    currency: valueOf('#currency'),
    termsDays,
    draftedAt,
    issuedAt,
    sentAt,
    paidAt,
    dueOn: issuedAt ? addCalendarDays(issuedAt, termsDays) : undefined,
    note: valueOf('#note').trim(),
    pdf: previous?.pdf,
    pdfName: previous?.pdfName,
    lockedFields: previous?.lockedFields ?? [],
    revision: previous?.revision ?? 0,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };
  if (!candidate.reference || !candidate.client) return showError('#invoice-errors', 'Add both an invoice reference and client.');
  if (previous) preserveLockedDates(candidate, previous);
  const errors = validateChronology(candidate);
  if (errors.length) return showError('#invoice-errors', errors.join(' '));
  const pdfInput = document.querySelector<HTMLInputElement>('#pdf');
  const file = pdfInput?.files?.[0];
  if (file) {
    if (!licenseState().unlocked) return showError('#invoice-errors', 'PDF storage needs a verified license.');
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return showError('#invoice-errors', 'Choose a PDF file.');
    if (file.size > 10 * 1024 * 1024) return showError('#invoice-errors', 'Choose a PDF smaller than 10 MB.');
    candidate.pdf = file;
    candidate.pdfName = file.name;
  }
  if (document.querySelector<HTMLInputElement>('#remove-pdf')?.checked) {
    candidate.pdf = undefined;
    candidate.pdfName = undefined;
  }
  try {
    await putInvoice(candidate, previous?.revision ?? (previous ? 1 : null));
    invoices = await getInvoices();
    closeDialog('invoice-dialog');
    renderLedger();
    showToast(previous ? `${candidate.reference} updated.` : `${candidate.reference} added.`);
  } catch (error) {
    showError('#invoice-errors', messageOf(error, 'Could not save this invoice. Check browser storage and try again.'));
  }
}

function preserveLockedDates(candidate: InvoiceRecord, previous: InvoiceRecord): void {
  for (const field of previous.lockedFields) {
    if (field === 'draftedAt') candidate.draftedAt = previous.draftedAt;
    else if (field === 'issuedAt') candidate.issuedAt = previous.issuedAt;
    else if (field === 'sentAt') candidate.sentAt = previous.sentAt;
    else if (field === 'paidAt') candidate.paidAt = previous.paidAt;
    else if (field === 'dueOn') {
      candidate.dueOn = previous.dueOn;
      candidate.termsDays = previous.termsDays;
    }
  }
}

async function applyQuickEvent(invoice: InvoiceRecord, action: 'issue' | 'send' | 'pay'): Promise<void> {
  const updated = { ...invoice, lockedFields: [...invoice.lockedFields], updatedAt: new Date().toISOString() };
  const now = nowStamp();
  if (action === 'issue') {
    updated.issuedAt = now;
    updated.dueOn = addCalendarDays(now, updated.termsDays);
  } else if (action === 'send') updated.sentAt = now;
  else updated.paidAt = now;
  const errors = validateChronology(updated);
  if (errors.length) return showToast(errors[0]);
  try {
    await putInvoice(updated, invoice.revision ?? 1);
    invoices = await getInvoices();
    renderLedger();
    showToast(action === 'issue' ? `${invoice.reference} issued; due date set by Net ${invoice.termsDays}.` : action === 'send' ? `Sent time recorded for ${invoice.reference}.` : `${invoice.reference} marked paid.`);
  } catch (error) {
    invoices = await getInvoices().catch(() => invoices);
    renderLedger();
    showToast(messageOf(error, 'The date could not be saved.'));
  }
}

function askToRemove(invoice: InvoiceRecord): void {
  if (invoice.lockedFields.length) return showToast('Sealed invoices cannot be removed. Their exported record must remain intact.');
  setText('#confirm-copy', `${invoice.reference} for ${invoice.client} will be removed from this device. This cannot be undone unless you have a backup.`);
  const button = document.querySelector<HTMLButtonElement>('#confirm-remove');
  if (button) button.onclick = async () => {
    await deleteInvoice(invoice.id);
    invoices = await getInvoices();
    closeDialog('confirm-dialog');
    renderLedger();
    showToast(`${invoice.reference} removed.`);
  };
  document.querySelector<HTMLDialogElement>('#confirm-dialog')?.showModal();
}

function openPdf(invoice: InvoiceRecord): void {
  if (!invoice.pdf) return;
  const url = URL.createObjectURL(invoice.pdf);
  window.open(url, '_blank', 'noopener');
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function openExportDialog(): void {
  setValue('#export-month', currentMonth());
  hideError('#export-error');
  renderSnapshots();
  document.querySelector<HTMLDialogElement>('#export-dialog')?.showModal();
}

function renderSnapshots(): void {
  const target = document.querySelector<HTMLElement>('#snapshot-list');
  if (!target) return;
  const sorted = [...exportsHistory].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  target.innerHTML = sorted.length ? sorted.map((record) => `<div class="snapshot"><div><strong>${escapeHtml(formatMonth(record.month))}</strong><span>${record.invoices.length} ${record.invoices.length === 1 ? 'invoice' : 'invoices'} · sealed ${escapeHtml(formatInstant(record.createdAt))}</span></div><button class="text-button small" data-snapshot="${record.id}" type="button">Download again</button></div>`).join('') : '<p class="muted-copy">No monthly CSV exports yet.</p>';
  target.querySelectorAll<HTMLButtonElement>('[data-snapshot]').forEach((button) => button.addEventListener('click', () => {
    const snapshot = exportsHistory.find((record) => record.id === button.dataset.snapshot);
    if (snapshot) downloadText(snapshot.csv, `send-date-ledger-${snapshot.month}-${snapshot.id.slice(0, 6)}.csv`, 'text/csv;charset=utf-8');
  }));
}

async function createMonthlyExport(event: Event): Promise<void> {
  event.preventDefault();
  hideError('#export-error');
  const month = valueOf('#export-month');
  const selected = invoices.filter((invoice) => invoice.issuedAt && monthOfStamp(invoice.issuedAt) === month);
  if (!selected.length) return showError('#export-error', `No invoices were issued in ${formatMonth(month)}.`);
  const snapshots: ExportInvoice[] = selected.map((invoice) => {
    const { pdf: _pdf, ...snapshot } = invoice;
    return structuredClone(snapshot);
  });
  const record: LedgerExport = {
    id: crypto.randomUUID(),
    month,
    createdAt: new Date().toISOString(),
    invoices: snapshots,
    csv: csvForInvoices(snapshots),
  };
  try {
    await createExportAndLock(record, selected.map((invoice) => ({ ...lockPresentDates(invoice), revision: (invoice.revision ?? 1) + 1 })));
    [invoices, exportsHistory] = await Promise.all([getInvoices(), getExports()]);
    renderSnapshots();
    renderLedger();
    downloadText(record.csv, `send-date-ledger-${month}-${record.id.slice(0, 6)}.csv`, 'text/csv;charset=utf-8');
    showToast(`${formatMonth(month)} sealed and exported.`);
  } catch (error) {
    showError('#export-error', messageOf(error, 'The monthly CSV export could not be saved.'));
  }
}

function openBackupDialog(): void {
  hideError('#backup-error');
  document.querySelector<HTMLDialogElement>('#backup-dialog')?.showModal();
}

async function backupData(): Promise<PortableBackup> {
  return makePortableBackup(invoices, exportsHistory);
}

async function downloadPlainBackup(): Promise<void> {
  hideError('#backup-error');
  try {
    downloadText(JSON.stringify(await backupData(), null, 2), `send-date-ledger-backup-${currentMonth()}.json`, 'application/json');
    showToast('Plain backup downloaded.');
  } catch (error) {
    showError('#backup-error', messageOf(error, 'Could not create the backup.'));
  }
}

async function downloadEncryptedBackup(): Promise<void> {
  hideError('#backup-error');
  const passphrase = valueOf('#backup-passphrase');
  try {
    const payload = await encryptBackup(await backupData(), passphrase);
    downloadText(payload, `send-date-ledger-encrypted-${currentMonth()}.sdl`, 'application/json');
    setValue('#backup-passphrase', '');
    showToast('Encrypted backup downloaded. Keep its passphrase safe.');
  } catch (error) {
    showError('#backup-error', messageOf(error, 'Could not encrypt the backup.'));
  }
}

async function restoreBackupFile(): Promise<void> {
  hideError('#backup-error');
  const input = document.querySelector<HTMLInputElement>('#restore-file');
  const file = input?.files?.[0];
  if (!file) return showError('#backup-error', 'Choose a backup file first.');
  if (!document.querySelector<HTMLInputElement>('#restore-confirm')?.checked) return showError('#backup-error', 'Confirm that matching records may be replaced.');
  try {
    const payload = await file.text();
    let raw: Record<string, unknown>;
    try { raw = JSON.parse(payload) as Record<string, unknown>; } catch { throw new Error('This backup is not valid JSON.'); }
    const backup = raw.format === 'send-date-ledger-encrypted'
      ? parsePortableBackup(JSON.stringify(await decryptBackup(payload, valueOf('#restore-passphrase'))))
      : parsePortableBackup(payload);
    const restored = mergeSealedInvoices(restoreInvoices(backup), invoices);
    await restoreData(restored, backup.exports);
    [invoices, exportsHistory] = await Promise.all([getInvoices(), getExports()]);
    closeDialog('backup-dialog');
    renderLedger();
    showToast(`Restored ${backup.invoices.length} ${backup.invoices.length === 1 ? 'invoice' : 'invoices'}.`);
  } catch (error) {
    showError('#backup-error', messageOf(error, 'The backup could not be restored.'));
  }
}

function openSettingsDialog(): void {
  const state = licenseState();
  updateLicenseUi(state.unlocked, state.reason);
  document.querySelector<HTMLDialogElement>('#settings-dialog')?.showModal();
}

async function restoreLicense(): Promise<void> {
  const status = document.querySelector<HTMLElement>('#license-status');
  try {
    saveLicense(valueOf('#license-token'));
    if (status) status.innerHTML = '<span class="clay-spinner small" aria-hidden="true"></span> Checking license…';
    const state = await verifyLicense(true);
    updateLicenseUi(state.unlocked, state.reason);
    if (state.unlocked) showToast('PDF storage is active in this browser.');
  } catch (error) {
    if (status) status.textContent = messageOf(error, 'Could not save that license.');
  }
}

function removeLicense(): void {
  clearLicense();
  updateLicenseUi(false);
  renderLedger();
  showToast('PDF storage license removed from this browser.');
}

function updateLicenseUi(unlocked: boolean, reason?: string): void {
  const status = document.querySelector<HTMLElement>('#license-status');
  if (status) status.innerHTML = unlocked
    ? '<span class="license-good" aria-hidden="true">✓</span><div><strong>PDF storage is active</strong><span>PDF attachments can be stored in this browser.</span></div>'
    : reason && reason !== 'ok'
      ? `<span class="license-warning" aria-hidden="true">!</span><div><strong>License no longer active</strong><span>${escapeHtml(reason.replaceAll('_', ' '))}. You can restore another license below.</span></div>`
      : '<div><strong>Free date record active</strong><span>Invoice dates, monthly CSV exports, and backups are ready.</span></div>';
  toggleHidden('#buy-link', unlocked);
  toggleHidden('#remove-license', !licenseState().token);
}

function updateDuePreview(): void {
  const issued = stampFromLocal(valueOf('#issued-at'));
  const target = document.querySelector<HTMLElement>('#due-preview');
  if (!target) return;
  if (!issued) return void (target.textContent = 'Add an issued date');
  const due = addCalendarDays(issued, Number(valueOf('#terms')));
  target.textContent = `${formatDue(due.date)} · Net ${valueOf('#terms')}`;
}

function preserveThemeLabel(): void {
  const button = document.querySelector<HTMLButtonElement>('#theme-button');
  if (!button) return;
  const dark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
}

function applySavedTheme(): void {
  const saved = localStorage.getItem('sdl-theme');
  if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
}

function toggleTheme(): void {
  const actualDark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  const next = actualDark ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('sdl-theme', next);
  preserveThemeLabel();
}

function updateConnectionState(): void {
  const state = document.querySelector<HTMLElement>('#connection-state');
  const dot = document.querySelector<HTMLElement>('.online-dot');
  if (state) state.textContent = navigator.onLine ? 'Stored in this browser' : 'Offline · changes still save';
  dot?.classList.toggle('offline', !navigator.onLine);
}

async function installApp(): Promise<void> {
  if (!installPrompt) return;
  await installPrompt.prompt();
  const result = await installPrompt.userChoice;
  if (result.outcome === 'accepted') {
    const button = document.querySelector<HTMLButtonElement>('#install-button');
    if (button) button.hidden = true;
  }
  installPrompt = null;
}

function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  const register = () => {
    void navigator.serviceWorker.register('/sw.js').then((registration) => {
      if (registration.waiting) showUpdate(registration.waiting);
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate(worker);
        });
      });
    }).catch(() => undefined);
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}

function showUpdate(worker: ServiceWorker): void {
  const toast = document.querySelector<HTMLElement>('#update-toast');
  if (toast) toast.hidden = false;
  const button = document.querySelector<HTMLButtonElement>('#reload-button');
  if (button) button.onclick = () => {
    worker.postMessage({ type: 'SKIP_WAITING' });
    navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
  };
}

function nowStamp(): DateStamp {
  return { instant: new Date().toISOString(), timeZone: localTimeZone() };
}

function formatStamp(stamp: DateStamp): string {
  return new Intl.DateTimeFormat(undefined, { timeZone: stamp.timeZone, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(stamp.instant));
}

function formatDue(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(year, month - 1, day));
}

function formatInstant(instant: string): string {
  return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(instant));
}

function formatMonth(month: string): string {
  const [year, value] = month.split('-').map(Number);
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date(year, value - 1, 1));
}

function downloadText(content: string, filename: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function closeDialog(id: string): void {
  document.querySelector<HTMLDialogElement>(`#${id}`)?.close();
}

function valueOf(selector: string): string {
  const element = document.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(selector);
  return element?.value ?? '';
}

function setValue(selector: string, value: string): void {
  const element = document.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(selector);
  if (element) element.value = value;
}

function setText(selector: string, value: string): void {
  const element = document.querySelector<HTMLElement>(selector);
  if (element) element.textContent = value;
}

function toggleHidden(selector: string, hidden: boolean): void {
  const element = document.querySelector<HTMLElement>(selector);
  if (element) element.hidden = hidden;
}

function showError(selector: string, message: string): void {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) return;
  element.textContent = message;
  element.hidden = false;
  element.focus();
}

function hideError(selector: string): void {
  const element = document.querySelector<HTMLElement>(selector);
  if (element) {
    element.textContent = '';
    element.hidden = true;
  }
}

function showToast(message: string): void {
  const toast = document.querySelector<HTMLElement>('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(Number(toast.dataset.timer));
  toast.dataset.timer = String(window.setTimeout(() => { toast.hidden = true; }, 4_000));
}

function messageOf(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}
