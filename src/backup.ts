import { csvForInvoices, DATE_FIELDS, monthOfStamp, validateChronology } from './domain';
import type { DateField, DateStamp, InvoiceRecord, LedgerExport, PortableBackup, PortableInvoice } from './types';

const CURRENCIES = new Set(['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'JPY']);
const TERMS = new Set([0, 7, 14, 30, 45, 60]);

function object(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} is not valid.`);
  return value as Record<string, unknown>;
}

function iso(value: unknown, label: string): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) || !Number.isFinite(Date.parse(value))) {
    throw new Error(`${label} has an invalid date.`);
  }
  const normalized = value.includes('.') ? value : value.replace(/Z$/, '.000Z');
  if (new Date(value).toISOString() !== normalized) throw new Error(`${label} has an invalid date.`);
  return value;
}

function calendarDate(value: unknown, label: string): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`${label} has an invalid date.`);
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
    throw new Error(`${label} has an invalid date.`);
  }
  return value;
}

function timeZone(value: unknown, label: string): string {
  if (typeof value !== 'string') throw new Error(`${label} has an invalid time zone.`);
  try { new Intl.DateTimeFormat('en', { timeZone: value }).format(); } catch { throw new Error(`${label} has an invalid time zone.`); }
  return value;
}

function stamp(value: unknown, label: string, required = false): DateStamp | undefined {
  if (value === undefined && !required) return undefined;
  const item = object(value, label);
  return { instant: iso(item.instant, label), timeZone: timeZone(item.timeZone, label) };
}

function validateInvoice(value: unknown, label: string): PortableInvoice {
  const item = object(value, label);
  if (typeof item.id !== 'string' || !/^[a-zA-Z0-9-]{1,100}$/.test(item.id)) throw new Error(`${label} has an invalid ID.`);
  if (typeof item.reference !== 'string' || !item.reference.trim() || item.reference.length > 80) throw new Error(`${label} has an invalid reference.`);
  if (typeof item.client !== 'string' || !item.client.trim() || item.client.length > 120) throw new Error(`${label} has an invalid client.`);
  if (!Number.isSafeInteger(item.amountMinor) || Number(item.amountMinor) < 0 || Number(item.amountMinor) > 99_999_999_900) throw new Error(`${label} has an invalid amount.`);
  if (typeof item.currency !== 'string' || !CURRENCIES.has(item.currency)) throw new Error(`${label} has an invalid currency.`);
  if (!TERMS.has(Number(item.termsDays))) throw new Error(`${label} has an invalid due rule.`);
  if (typeof item.note !== 'string' || item.note.length > 500) throw new Error(`${label} has an invalid note.`);
  if (!Array.isArray(item.lockedFields) || item.lockedFields.some((field) => !DATE_FIELDS.includes(field as DateField))) throw new Error(`${label} has invalid sealed fields.`);
  const draftedAt = stamp(item.draftedAt, `${label} drafted date`, true)!;
  const issuedAt = stamp(item.issuedAt, `${label} issued date`);
  const sentAt = stamp(item.sentAt, `${label} sent date`);
  const paidAt = stamp(item.paidAt, `${label} paid date`);
  let dueOn;
  if (item.dueOn !== undefined) {
    const due = object(item.dueOn, `${label} due date`);
    dueOn = { date: calendarDate(due.date, `${label} due date`), timeZone: timeZone(due.timeZone, `${label} due date`) };
  }
  if ((issuedAt && !dueOn) || (!issuedAt && dueOn)) throw new Error(`${label} has an incomplete issued and due-date pair.`);
  if (typeof item.createdAt !== 'string' || typeof item.updatedAt !== 'string') throw new Error(`${label} has invalid timestamps.`);
  iso(item.createdAt, `${label} created date`); iso(item.updatedAt, `${label} updated date`);
  if (item.pdfDataUrl !== undefined && (typeof item.pdfDataUrl !== 'string' || !item.pdfDataUrl.startsWith('data:application/pdf;base64,') || item.pdfDataUrl.length > 14_000_000)) throw new Error(`${label} has an invalid PDF attachment.`);
  if (item.pdfName !== undefined && (typeof item.pdfName !== 'string' || item.pdfName.length > 180)) throw new Error(`${label} has an invalid PDF name.`);
  if ((item.pdfDataUrl === undefined) !== (item.pdfName === undefined)) throw new Error(`${label} has an incomplete PDF attachment.`);
  const record: PortableInvoice = {
    id: item.id, reference: item.reference.trim(), client: item.client.trim(), amountMinor: item.amountMinor,
    currency: item.currency, termsDays: item.termsDays, draftedAt, issuedAt, sentAt, dueOn, paidAt,
    note: item.note, pdfName: item.pdfName as string | undefined, pdfDataUrl: item.pdfDataUrl as string | undefined,
    lockedFields: [...new Set(item.lockedFields as DateField[])], revision: Number.isSafeInteger(item.revision) && Number(item.revision) > 0 ? Number(item.revision) : 1,
    createdAt: item.createdAt, updatedAt: item.updatedAt,
  } as PortableInvoice;
  const errors = validateChronology(record as InvoiceRecord);
  if (errors.length) throw new Error(`${label}: ${errors.join(' ')}`);
  return record;
}

function validateExport(value: unknown, label: string): LedgerExport {
  const item = object(value, label);
  if (typeof item.id !== 'string' || !/^[a-zA-Z0-9-]{1,100}$/.test(item.id)) throw new Error(`${label} has an invalid ID.`);
  if (typeof item.month !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(item.month)) throw new Error(`${label} has an invalid month.`);
  iso(item.createdAt, `${label} created date`);
  if (typeof item.csv !== 'string') throw new Error(`${label} has invalid CSV content.`);
  if (!Array.isArray(item.invoices)) throw new Error(`${label} has no invoice list.`);
  const invoices = item.invoices.map((invoice, index) => {
    const portable = validateInvoice(invoice, `${label}, invoice ${index + 1}`);
    const { pdfDataUrl: _data, ...plain } = portable;
    return plain;
  });
  if (new Set(invoices.map((invoice) => invoice.id)).size !== invoices.length) throw new Error(`${label} contains a duplicate invoice.`);
  if (invoices.some((invoice) => !invoice.issuedAt || monthOfStamp(invoice.issuedAt) !== item.month)) throw new Error(`${label} contains an invoice outside its issue month.`);
  if (csvForInvoices(invoices) !== item.csv) throw new Error(`${label} CSV does not match its invoice list.`);
  return { id: item.id, month: item.month, createdAt: item.createdAt as string, csv: item.csv, invoices };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read an attached PDF.'));
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(value: string): Blob {
  const [header, content] = value.split(',', 2);
  if (!header || !content || !header.startsWith('data:')) throw new Error('An attachment in this backup is invalid.');
  const mime = header.slice(5).split(';')[0] || 'application/octet-stream';
  const bytes = Uint8Array.from(atob(content), (character) => character.charCodeAt(0));
  return new Blob([bytes], { type: mime });
}

export async function makePortableBackup(invoices: InvoiceRecord[], exports: LedgerExport[]): Promise<PortableBackup> {
  const portableInvoices: PortableInvoice[] = await Promise.all(
    invoices.map(async (invoice) => {
      const { pdf, ...withoutPdf } = invoice;
      return { ...withoutPdf, pdfDataUrl: pdf ? await blobToDataUrl(pdf) : undefined };
    }),
  );
  return {
    format: 'send-date-ledger',
    version: 1,
    exportedAt: new Date().toISOString(),
    invoices: portableInvoices,
    exports,
  };
}

export function parsePortableBackup(payload: string): PortableBackup {
  let raw: unknown;
  try {
    raw = JSON.parse(payload);
  } catch {
    throw new Error('This backup is not valid JSON.');
  }
  const value = object(raw, 'This backup');
  if (value.format !== 'send-date-ledger' || value.version !== 1 || !Array.isArray(value.invoices) || !Array.isArray(value.exports)) {
    throw new Error('This file is not a supported Send-Date Ledger backup.');
  }
  const invoices = value.invoices.map((invoice, index) => validateInvoice(invoice, `Invoice ${index + 1}`));
  const ids = new Set<string>();
  for (const invoice of invoices) {
    if (ids.has(invoice.id)) throw new Error('The backup contains a duplicate invoice ID.');
    ids.add(invoice.id);
  }
  const exports = value.exports.map((record, index) => validateExport(record, `Monthly CSV export ${index + 1}`));
  const exportIds = new Set<string>();
  for (const record of exports) {
    if (exportIds.has(record.id)) throw new Error('The backup contains a duplicate monthly CSV export ID.');
    exportIds.add(record.id);
  }
  const byId = new Map(invoices.map((invoice) => [invoice.id, invoice]));
  const backedLocks = new Map<string, Set<DateField>>();
  for (const record of exports) for (const snapshot of record.invoices) {
    const invoice = byId.get(snapshot.id);
    if (!invoice) throw new Error('A monthly CSV export refers to a missing invoice.');
    for (const field of DATE_FIELDS) if (snapshot[field] !== undefined) {
      if (JSON.stringify(invoice[field]) !== JSON.stringify(snapshot[field])) throw new Error(`A sealed date for ${invoice.reference} does not match its monthly CSV export.`);
      if (!invoice.lockedFields.includes(field)) invoice.lockedFields.push(field);
      const locks = backedLocks.get(invoice.id) ?? new Set<DateField>();
      locks.add(field);
      backedLocks.set(invoice.id, locks);
    }
  }
  for (const invoice of invoices) for (const field of invoice.lockedFields) {
    if (!backedLocks.get(invoice.id)?.has(field)) throw new Error(`A sealed date for ${invoice.reference} has no matching monthly CSV export.`);
  }
  return { format: 'send-date-ledger', version: 1, exportedAt: iso(value.exportedAt, 'Backup export date'), invoices, exports };
}

export function restoreInvoices(backup: PortableBackup): InvoiceRecord[] {
  return backup.invoices.map(({ pdfDataUrl, ...invoice }) => ({
    ...invoice,
    pdf: pdfDataUrl ? dataUrlToBlob(pdfDataUrl) : undefined,
  }));
}

export function mergeSealedInvoices(imported: InvoiceRecord[], existing: InvoiceRecord[]): InvoiceRecord[] {
  const existingById = new Map(existing.map((invoice) => [invoice.id, invoice]));
  return imported.map((invoice) => {
    const current = existingById.get(invoice.id);
    if (!current) return invoice;
    const merged = { ...invoice, lockedFields: [...new Set([...invoice.lockedFields, ...current.lockedFields])], revision: (current.revision ?? 1) + 1 };
    for (const field of current.lockedFields) {
      if (field === 'dueOn') { merged.dueOn = current.dueOn; merged.termsDays = current.termsDays; }
      else if (field === 'draftedAt') merged.draftedAt = current.draftedAt;
      else if (field === 'issuedAt') merged.issuedAt = current.issuedAt;
      else if (field === 'sentAt') merged.sentAt = current.sentAt;
      else if (field === 'paidAt') merged.paidAt = current.paidAt;
    }
    return merged;
  });
}
