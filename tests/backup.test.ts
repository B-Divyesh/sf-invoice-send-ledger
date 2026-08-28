import { describe, expect, it } from 'vitest';
import { parsePortableBackup } from '../src/backup';
import { csvForInvoices, lockPresentDates } from '../src/domain';
import type { InvoiceRecord, LedgerExport, PortableBackup } from '../src/types';

function invoice(overrides: Partial<InvoiceRecord> = {}): InvoiceRecord {
  return {
    id: 'inv-1',
    reference: 'INV-001',
    client: 'Northwind Studio',
    amountMinor: 125050,
    currency: 'USD',
    termsDays: 30,
    draftedAt: { instant: '2026-08-01T09:00:00.000Z', timeZone: 'UTC' },
    issuedAt: { instant: '2026-08-02T09:00:00.000Z', timeZone: 'UTC' },
    dueOn: { date: '2026-09-01', timeZone: 'UTC' },
    note: '',
    lockedFields: [],
    revision: 1,
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-08-02T09:00:00.000Z',
    ...overrides,
  };
}

function backup(record: InvoiceRecord = invoice(), exports: LedgerExport[] = []): PortableBackup {
  return {
    format: 'send-date-ledger',
    version: 1,
    exportedAt: '2026-08-28T10:00:00.000Z',
    invoices: [record],
    exports,
  };
}

function parse(value: PortableBackup) {
  return () => parsePortableBackup(JSON.stringify(value));
}

describe('backup validation', () => {
  it('accepts a complete generated record', () => {
    expect(parsePortableBackup(JSON.stringify(backup())).invoices[0].reference).toBe('INV-001');
  });

  it.each([
    ['invalid time zone', { draftedAt: { instant: '2026-08-01T09:00:00.000Z', timeZone: 'Not/A_Timezone' } }],
    ['invalid instant', { draftedAt: { instant: '2026-02-30T09:00:00.000Z', timeZone: 'UTC' } }],
    ['invalid ID', { id: '../bad' }],
    ['amount outside bounds', { amountMinor: 100_000_000_000 }],
    ['unknown sealed field', { lockedFields: ['unknown'] }],
    ['incomplete PDF attachment', { pdfName: 'invoice.pdf' }],
  ])('rejects %s before restore', (_name, change) => {
    expect(parse(backup(invoice(change as Partial<InvoiceRecord>)))).toThrow();
  });

  it('rejects an impossible calendar due date', () => {
    expect(parse(backup(invoice({ dueOn: { date: '2026-02-30', timeZone: 'UTC' } })))).toThrow(/invalid date/);
  });

  it('requires every sealed field to match a monthly CSV export', () => {
    expect(parse(backup(invoice({ lockedFields: ['issuedAt'] })))).toThrow(/no matching monthly CSV export/);
  });

  it('requires the exported invoice, issue month, and CSV to agree', () => {
    const sealed = lockPresentDates(invoice());
    const record: LedgerExport = {
      id: 'export-1',
      month: '2026-08',
      createdAt: '2026-08-28T10:00:00.000Z',
      invoices: [sealed],
      csv: csvForInvoices([sealed]),
    };
    expect(parsePortableBackup(JSON.stringify(backup(sealed, [record]))).exports).toHaveLength(1);
    expect(parse(backup(sealed, [{ ...record, month: '2026-07' }]))).toThrow(/outside its issue month/);
    expect(parse(backup(sealed, [{ ...record, csv: `${record.csv}\r\nforged` }]))).toThrow(/CSV does not match/);
    expect(parse(backup({ ...sealed, issuedAt: { ...sealed.issuedAt!, instant: '2026-08-03T09:00:00.000Z' } }, [record]))).toThrow(/does not match/);
  });
});
