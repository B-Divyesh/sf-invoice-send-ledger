import { describe, expect, it } from 'vitest';
import { addCalendarDays, csvForInvoices, invoiceStatus, lockPresentDates, validateChronology } from '../src/domain';
import type { InvoiceRecord } from '../src/types';

function invoice(overrides: Partial<InvoiceRecord> = {}): InvoiceRecord {
  return {
    id: 'inv-1',
    reference: 'INV-001',
    client: 'Northwind',
    amountMinor: 125050,
    currency: 'USD',
    termsDays: 30,
    draftedAt: { instant: '2026-08-01T09:00:00.000Z', timeZone: 'UTC' },
    note: '',
    lockedFields: [],
    revision: 1,
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-08-01T09:00:00.000Z',
    ...overrides,
  };
}

describe('invoice chronology', () => {
  it('generates a visible calendar due date from the issue stamp', () => {
    expect(addCalendarDays({ instant: '2026-08-28T10:00:00.000Z', timeZone: 'UTC' }, 30)).toEqual({
      date: '2026-09-27',
      timeZone: 'UTC',
    });
  });

  it('rejects sent-before-issued and issue-before-draft timelines', () => {
    const record = invoice({
      issuedAt: { instant: '2026-07-31T10:00:00.000Z', timeZone: 'UTC' },
      sentAt: { instant: '2026-07-30T10:00:00.000Z', timeZone: 'UTC' },
    });
    expect(validateChronology(record)).toEqual([
      'Issued time cannot be before the draft time.',
      'Sent time cannot be before the issued time.',
    ]);
  });

  it('locks every date present at export without inventing later events', () => {
    const sealed = lockPresentDates(invoice({
      issuedAt: { instant: '2026-08-02T09:00:00.000Z', timeZone: 'UTC' },
      dueOn: { date: '2026-09-01', timeZone: 'UTC' },
    }));
    expect(sealed.lockedFields).toEqual(['draftedAt', 'issuedAt', 'dueOn']);
    expect(sealed.paidAt).toBeUndefined();
  });

  it('reports the furthest completed lifecycle stage', () => {
    expect(invoiceStatus(invoice())).toBe('Draft');
    expect(invoiceStatus(invoice({ issuedAt: { instant: '2026-08-02T09:00:00.000Z', timeZone: 'UTC' } }))).toBe('Issued');
    expect(invoiceStatus(invoice({ paidAt: { instant: '2026-08-03T09:00:00.000Z', timeZone: 'UTC' } }))).toBe('Paid');
  });
});

describe('CSV export', () => {
  it('quotes data and prevents spreadsheet formula injection', () => {
    const record = invoice({ reference: '=IMPORT("bad")', issuedAt: { instant: '2026-08-02T09:00:00.000Z', timeZone: 'UTC' } });
    const csv = csvForInvoices([record]);
    expect(csv).toContain('"\'=IMPORT(""bad"")"');
    expect(csv).toContain('"1250.50"');
  });
});
