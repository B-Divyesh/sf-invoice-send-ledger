import type { DateField, DateStamp, DueDate, ExportInvoice, InvoiceRecord } from './types';

export const DATE_FIELDS: DateField[] = ['draftedAt', 'issuedAt', 'sentAt', 'dueOn', 'paidAt'];

export function localTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

export function stampFromLocal(value: string, timeZone = localTimeZone()): DateStamp | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return undefined;
  return { instant: date.toISOString(), timeZone };
}

export function inputFromStamp(stamp?: DateStamp): string {
  if (!stamp) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: stamp.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(stamp.instant));
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}T${value('hour')}:${value('minute')}`;
}

export function addCalendarDays(stamp: DateStamp, days: number): DueDate {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: stamp.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(stamp.instant));
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((item) => item.type === type)?.value);
  const date = new Date(Date.UTC(part('year'), part('month') - 1, part('day')));
  date.setUTCDate(date.getUTCDate() + days);
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${date.getUTCDate()}`.padStart(2, '0');
  return { date: `${year}-${month}-${day}`, timeZone: stamp.timeZone };
}

export function validateChronology(invoice: Pick<InvoiceRecord, 'draftedAt' | 'issuedAt' | 'sentAt' | 'paidAt'>): string[] {
  const errors: string[] = [];
  const draft = Date.parse(invoice.draftedAt.instant);
  const issued = invoice.issuedAt ? Date.parse(invoice.issuedAt.instant) : undefined;
  const sent = invoice.sentAt ? Date.parse(invoice.sentAt.instant) : undefined;
  const paid = invoice.paidAt ? Date.parse(invoice.paidAt.instant) : undefined;
  if (issued !== undefined && issued < draft) errors.push('Issued time cannot be before the draft time.');
  if (sent !== undefined && issued === undefined) errors.push('Add an issued time before recording sent.');
  if (sent !== undefined && issued !== undefined && sent < issued) errors.push('Sent time cannot be before the issued time.');
  if (paid !== undefined && issued === undefined) errors.push('Add an issued time before recording payment.');
  if (paid !== undefined && issued !== undefined && paid < issued) errors.push('Paid time cannot be before the issued time.');
  return errors;
}

export function invoiceStatus(invoice: InvoiceRecord): 'Paid' | 'Sent' | 'Issued' | 'Draft' {
  if (invoice.paidAt) return 'Paid';
  if (invoice.sentAt) return 'Sent';
  if (invoice.issuedAt) return 'Issued';
  return 'Draft';
}

export function monthOfStamp(stamp: DateStamp): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: stamp.timeZone,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(new Date(stamp.instant));
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  return `${year}-${month}`;
}

function csvCell(value: string | number | undefined): string {
  let text = value === undefined ? '' : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function csvForInvoices(invoices: ExportInvoice[]): string {
  const columns = ['Reference', 'Client', 'Amount', 'Currency', 'Drafted', 'Issued', 'Sent', 'Due', 'Paid', 'Time zone', 'Status'];
  const rows = invoices.map((invoice) => [
    invoice.reference,
    invoice.client,
    (invoice.amountMinor / 100).toFixed(2),
    invoice.currency,
    invoice.draftedAt.instant,
    invoice.issuedAt?.instant,
    invoice.sentAt?.instant,
    invoice.dueOn?.date,
    invoice.paidAt?.instant,
    invoice.issuedAt?.timeZone ?? invoice.draftedAt.timeZone,
    invoiceStatus(invoice as InvoiceRecord),
  ]);
  return [columns, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
}

export function lockPresentDates(invoice: InvoiceRecord): InvoiceRecord {
  const locked = new Set(invoice.lockedFields);
  for (const field of DATE_FIELDS) if (invoice[field]) locked.add(field);
  return { ...invoice, lockedFields: [...locked], updatedAt: new Date().toISOString() };
}

export function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, '0')}`;
}
