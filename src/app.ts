import './style.css';
import { makePortableBackup, parsePortableBackup, restoreInvoices } from './backup';
import { decryptBackup, encryptBackup } from './crypto';
import { deleteInvoice, getExports, getInvoices, putExport, putExports, putInvoice, putInvoices } from './db';
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
  checkoutUrl,
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
}

function renderShell(): void {
  app.innerHTML = `
    <header class="site-header">
      <a class="brand" href="/" aria-label="Send-Date Ledger home">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>Send-Date Ledger</span>
      </a>
      <nav aria-label="Primary">
        <button class="quiet-button" id="install-button" type="button" hidden>Install app</button>
        <button class="icon-button" id="theme-button" type="button" aria-label="Switch to dark theme" title="Change theme">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/></svg>
        </button>
        <button class="quiet-button" id="settings-button" type="button">Studio</button>
      </nav>
    </header>
    <main id="main" tabindex="-1">
      <section class="hero" aria-labelledby="page-title">
        <div class="hero-copy">
          <p class="eyebrow"><span class="online-dot" aria-hidden="true"></span><span id="connection-state">Stored on this device</span></p>
          <h1 id="page-title">Know exactly when it left your hands.</h1>
          <p class="hero-lede">A calm, private chronology for invoices made somewhere else. Record the draft, issue, sent, due, and paid dates—with the rule visible.</p>
          <div class="hero-actions">
            <button class="primary-button" id="new-invoice-button" type="button">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
              Add invoice
            </button>
            <button class="text-button" id="backup-button" type="button">Back up or restore</button>
          </div>
          <p class="privacy-note"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 10h12v10H6zM8 10V7a4 4 0 0 1 8 0v3"/></svg>No account. No tracking. Works offline.</p>
        </div>
        <figure class="hero-figure">
          <img src="/assets/ceramic-ledger.webp" width="1200" height="800" alt="Five handmade porcelain ledger tiles arranged in chronological order" decoding="async" fetchpriority="high" />
          <figcaption>Five dates, one unambiguous record.</figcaption>
        </figure>
      </section>
      <section id="ledger-region" class="ledger-region" aria-labelledby="ledger-title" aria-live="polite">
        <div class="loading-state"><span class="clay-spinner" aria-hidden="true"></span><p>Opening your ledger…</p></div>
      </section>
    </main>
    <footer>
      <p><span class="footer-mark" aria-hidden="true"></span> Private by design. Your ledger and PDFs stay in this browser.</p>
      <nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav>
      <p class="disclosure">Ceramic artwork generated for this product with Azure OpenAI.</p>
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
  `;
}

function invoiceDialogMarkup(): string {
  const zone = escapeHtml(localTimeZone());
  return `
    <dialog id="invoice-dialog" class="dialog invoice-dialog" aria-labelledby="invoice-dialog-title">
      <form id="invoice-form" novalidate>
        <div class="dialog-heading">
          <div><p class="eyebrow">Chronology slip</p><h2 id="invoice-dialog-title">Add invoice</h2></div>
          <button class="icon-button dialog-close" type="button" data-close="invoice-dialog" aria-label="Close invoice form"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
        </div>
        <div class="form-error" id="invoice-errors" role="alert" hidden></div>
        <input type="hidden" id="invoice-id" />
        <div class="form-grid">
          <div class="field"><label for="reference">Invoice reference <span aria-hidden="true">*</span></label><input id="reference" name="reference" maxlength="80" required autocomplete="off" /></div>
          <div class="field"><label for="client">Client <span aria-hidden="true">*</span></label><input id="client" name="client" maxlength="120" required autocomplete="organization" /></div>
          <div class="amount-fields">
            <div class="field"><label for="amount">Amount <span aria-hidden="true">*</span></label><input id="amount" name="amount" type="number" min="0" max="999999999" step="0.01" inputmode="decimal" required /></div>
            <div class="field currency-field"><label for="currency">Currency</label><select id="currency" name="currency"><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option><option>AUD</option><option>CAD</option><option>SGD</option><option>JPY</option></select></div>
          </div>
        </div>
        <fieldset class="date-fieldset">
          <legend>Invoice chronology</legend>
          <p class="fieldset-help">Times are stored with <strong>${zone}</strong>. Issuing creates the due date from your visible rule.</p>
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
          <p class="sealed-note" id="sealed-note" hidden><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 10h12v10H6zM8 10V7a4 4 0 0 1 8 0v3"/></svg>Stamped dates are locked because they appear in an exported monthly ledger.</p>
        </fieldset>
        <div class="field"><label for="note">Note <span class="optional">Optional</span></label><textarea id="note" name="note" maxlength="500" rows="3" placeholder="e.g. Sent after final scope approval"></textarea></div>
        <div class="pdf-field">
          <div><label for="pdf">Original invoice PDF <span class="studio-chip">Studio</span></label><p id="pdf-help">Keep the sent file beside its dates, locally on this device. PDF only, up to 10 MB.</p></div>
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
      <div class="dialog-heading"><div><p class="eyebrow">Immutable snapshots</p><h2 id="export-title">Export monthly ledger</h2></div><button class="icon-button dialog-close" type="button" data-close="export-dialog" aria-label="Close export dialog"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
      <p class="dialog-intro">Choose an issue month. The CSV is stored here as a sealed snapshot, and every included date is locked against later edits.</p>
      <form id="export-form" class="export-form"><div class="field"><label for="export-month">Issue month</label><input type="month" id="export-month" required /></div><button class="primary-button" type="submit">Seal &amp; export CSV</button></form>
      <div class="form-error" id="export-error" role="alert" hidden></div>
      <div class="snapshot-list"><h3>Sealed snapshots</h3><div id="snapshot-list"></div></div>
    </dialog>`;
}

function backupDialogMarkup(): string {
  return `
    <dialog id="backup-dialog" class="dialog" aria-labelledby="backup-title">
      <div class="dialog-heading"><div><p class="eyebrow">Data ownership</p><h2 id="backup-title">Back up or restore</h2></div><button class="icon-button dialog-close" type="button" data-close="backup-dialog" aria-label="Close backup dialog"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
      <p class="dialog-intro">Backups include your ledger, snapshot history, and locally stored PDFs. Nothing is uploaded.</p>
      <section class="backup-section" aria-labelledby="backup-export-title"><h3 id="backup-export-title">Create a backup</h3><div class="field"><label for="backup-passphrase">Passphrase for encrypted backup</label><input type="password" id="backup-passphrase" minlength="8" autocomplete="new-password" aria-describedby="passphrase-help" /><p id="passphrase-help" class="field-help">Use 8+ characters. It cannot be recovered if forgotten.</p></div><div class="button-row"><button class="primary-button" id="encrypted-backup" type="button">Download encrypted</button><button class="quiet-button" id="plain-backup" type="button">Download plain JSON</button></div></section>
      <section class="backup-section" aria-labelledby="backup-restore-title"><h3 id="backup-restore-title">Restore a backup</h3><div class="field"><label for="restore-file">Backup file</label><input type="file" id="restore-file" accept="application/json,.json,.sdl" /></div><div class="field"><label for="restore-passphrase">Passphrase <span class="optional">For encrypted files</span></label><input type="password" id="restore-passphrase" autocomplete="current-password" /></div><label class="check-label"><input type="checkbox" id="restore-confirm" /> I understand that records with matching IDs will be replaced.</label><button class="quiet-button" id="restore-button" type="button">Restore selected file</button></section>
      <div class="form-error" id="backup-error" role="alert" hidden></div>
    </dialog>`;
}

function settingsDialogMarkup(): string {
  return `
    <dialog id="settings-dialog" class="dialog studio-dialog" aria-labelledby="studio-title">
      <div class="dialog-heading"><div><p class="eyebrow">One-time unlock</p><h2 id="studio-title">Ledger Studio</h2></div><button class="icon-button dialog-close" type="button" data-close="settings-dialog" aria-label="Close Studio dialog"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
      <div class="studio-price"><span>Lifetime, this version</span><strong>₹699</strong></div>
      <p class="dialog-intro">The free ledger, CSV export, encrypted backups, and accessibility features stay free. Studio adds local PDF attachment storage so the exact sent file lives beside its chronology.</p>
      <ul class="feature-list"><li><span aria-hidden="true">✓</span> Attach invoice PDFs up to 10 MB</li><li><span aria-hidden="true">✓</span> PDFs included in plain and encrypted backups</li><li><span aria-hidden="true">✓</span> One-time purchase—no subscription</li></ul>
      <div id="license-status" class="license-status"></div>
      <a class="primary-button button-link" id="buy-link" href="${checkoutUrl}">Buy Studio once</a>
      <div class="license-restore"><h3>Have a license?</h3><label for="license-token">Paste your license token</label><div class="input-button"><input id="license-token" autocomplete="off" spellcheck="false" /><button class="quiet-button" id="restore-license" type="button">Verify</button></div><button class="text-button small" id="remove-license" type="button" hidden>Remove license from this device</button></div>
      <p class="merchant-note">Secure checkout and refunds are handled by Sociobot/Dodo, the merchant of record. A refund revokes the license. <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></p>
    </dialog>`;
}

function renderLedger(): void {
  const region = document.querySelector<HTMLElement>('#ledger-region');
  if (!region) return;
  if (storageError) {
    region.innerHTML = `<div class="error-state"><span aria-hidden="true">!</span><div><h2 id="ledger-title">Your ledger could not open</h2><p>${escapeHtml(storageError)}</p><button class="quiet-button" type="button" onclick="location.reload()">Reload ledger</button></div></div>`;
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
      <div><p class="eyebrow">Issue register</p><h2 id="ledger-title">Your chronology</h2></div>
      <button class="quiet-button export-button" id="export-button" type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 18v2h14v-2"/></svg>Export month</button>
    </div>
    ${invoices.length ? statsMarkup(sentRate, dueRate, issued.length) : ''}
    ${invoices.length ? toolbarMarkup() : ''}
    <div id="invoice-list" class="invoice-list">
      ${invoices.length === 0 ? emptyStateMarkup() : filtered.length === 0 ? noResultsMarkup() : filtered.map(invoiceMarkup).join('')}
    </div>`;
  bindLedgerEvents();
}

function statsMarkup(sentRate: number, dueRate: number, issuedCount: number): string {
  const sentTarget = sentRate >= 95;
  return `<div class="health-strip" aria-label="Ledger completeness">
    <div class="health-intro"><span class="stamp-icon" aria-hidden="true">✓</span><div><strong>${issuedCount} issued ${issuedCount === 1 ? 'invoice' : 'invoices'}</strong><span>Completeness for recorded issues</span></div></div>
    <div class="metric"><span>Sent date recorded</span><strong>${sentRate}%</strong><small>${sentTarget ? '95% pilot target met' : 'Target: 95%'}</small></div>
    <div class="metric"><span>Visible due rule</span><strong>${dueRate}%</strong><small>${dueRate === 100 ? 'Every issue is covered' : 'Add missing due dates'}</small></div>
  </div>`;
}

function toolbarMarkup(): string {
  return `<div class="ledger-toolbar"><div class="search-field"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg><label class="sr-only" for="ledger-search">Search invoices</label><input id="ledger-search" type="search" placeholder="Search reference or client" value="${escapeHtml(search)}" /></div><div class="field compact-field"><label for="status-filter">Show</label><select id="status-filter"><option ${filter === 'All' ? 'selected' : ''}>All</option><option ${filter === 'Draft' ? 'selected' : ''}>Draft</option><option ${filter === 'Issued' ? 'selected' : ''}>Issued</option><option ${filter === 'Sent' ? 'selected' : ''}>Sent</option><option ${filter === 'Paid' ? 'selected' : ''}>Paid</option></select></div></div>`;
}

function emptyStateMarkup(): string {
  return `<div class="empty-state"><div class="empty-tiles" aria-hidden="true"><i></i><i></i><i></i></div><h3>No dates to untangle yet</h3><p>Add the next invoice you are drafting—or record one already sent. Its due date will come from a visible rule.</p><button class="primary-button" data-action="new" type="button">Add your first invoice</button></div>`;
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
    <div class="event-rail" aria-label="Invoice chronology">
      ${eventMarkup('Drafted', invoice.draftedAt, true)}
      ${eventMarkup('Issued', invoice.issuedAt, Boolean(invoice.issuedAt))}
      ${dueMarkup(invoice)}
      ${eventMarkup('Sent', invoice.sentAt, Boolean(invoice.sentAt))}
      ${eventMarkup('Paid', invoice.paidAt, Boolean(invoice.paidAt))}
    </div>
    ${invoice.note ? `<p class="invoice-note"><span>Note</span>${escapeHtml(invoice.note)}</p>` : ''}
    <div class="invoice-actions">${nextAction}${invoice.pdf ? `<button class="text-button small" data-action="pdf" data-id="${invoice.id}" type="button">Open ${escapeHtml(invoice.pdfName ?? 'PDF')}</button>` : ''}<span class="action-spacer"></span><button class="text-button small" data-action="edit" data-id="${invoice.id}" type="button">Edit</button><button class="text-button small danger-text" data-action="remove" data-id="${invoice.id}" type="button" ${sealed ? 'disabled title="Sealed records cannot be removed"' : ''}>Remove</button></div>
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
  document.querySelector('#backup-button')?.addEventListener('click', openBackupDialog);
  document.querySelector('#settings-button')?.addEventListener('click', openSettingsDialog);
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
    if (!licenseState().unlocked) return showError('#invoice-errors', 'PDF storage needs an active Studio license.');
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
    await putInvoice(candidate);
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
    await putInvoice(updated);
    invoices = await getInvoices();
    renderLedger();
    showToast(action === 'issue' ? `${invoice.reference} issued; due date set by Net ${invoice.termsDays}.` : action === 'send' ? `Sent time recorded for ${invoice.reference}.` : `${invoice.reference} marked paid.`);
  } catch (error) {
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
  target.innerHTML = sorted.length ? sorted.map((record) => `<div class="snapshot"><div><strong>${escapeHtml(formatMonth(record.month))}</strong><span>${record.invoices.length} ${record.invoices.length === 1 ? 'invoice' : 'invoices'} · sealed ${escapeHtml(formatInstant(record.createdAt))}</span></div><button class="text-button small" data-snapshot="${record.id}" type="button">Download again</button></div>`).join('') : '<p class="muted-copy">No monthly snapshots yet.</p>';
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
    await putExport(record);
    await Promise.all(selected.map((invoice) => putInvoice(lockPresentDates(invoice))));
    [invoices, exportsHistory] = await Promise.all([getInvoices(), getExports()]);
    renderSnapshots();
    renderLedger();
    downloadText(record.csv, `send-date-ledger-${month}-${record.id.slice(0, 6)}.csv`, 'text/csv;charset=utf-8');
    showToast(`${formatMonth(month)} sealed and exported.`);
  } catch (error) {
    showError('#export-error', messageOf(error, 'The monthly snapshot could not be saved.'));
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
      ? await decryptBackup(payload, valueOf('#restore-passphrase'))
      : parsePortableBackup(payload);
    await Promise.all([putInvoices(restoreInvoices(backup)), putExports(backup.exports)]);
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
    if (state.unlocked) showToast('Studio unlocked on this device.');
  } catch (error) {
    if (status) status.textContent = messageOf(error, 'Could not save that license.');
  }
}

function removeLicense(): void {
  clearLicense();
  updateLicenseUi(false);
  renderLedger();
  showToast('Studio license removed from this device.');
}

function updateLicenseUi(unlocked: boolean, reason?: string): void {
  const status = document.querySelector<HTMLElement>('#license-status');
  if (status) status.innerHTML = unlocked
    ? '<span class="license-good" aria-hidden="true">✓</span><div><strong>Studio is active</strong><span>PDF storage is unlocked on this device.</span></div>'
    : reason && reason !== 'ok'
      ? `<span class="license-warning" aria-hidden="true">!</span><div><strong>License no longer active</strong><span>${escapeHtml(reason.replaceAll('_', ' '))}. You can restore another license below.</span></div>`
      : '<div><strong>Free ledger active</strong><span>All chronology, CSV, and backup tools are ready.</span></div>';
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
  if (state) state.textContent = navigator.onLine ? 'Stored on this device' : 'Offline · changes still save';
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
