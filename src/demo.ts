import type { InvoiceRecord } from './types';

export function demoInvoices(): InvoiceRecord[] {
  return [
    {
      id: 'demo-inv-001', reference: 'NORTH-026', client: 'Northline Editorial', amountMinor: 185000, currency: 'USD', termsDays: 30,
      draftedAt: { instant: '2026-08-03T09:15:00.000Z', timeZone: 'Europe/London' },
      issuedAt: { instant: '2026-08-07T10:00:00.000Z', timeZone: 'Europe/London' },
      sentAt: { instant: '2026-08-07T10:08:00.000Z', timeZone: 'Europe/London' },
      dueOn: { date: '2026-09-06', timeZone: 'Europe/London' }, paidAt: { instant: '2026-08-22T13:41:00.000Z', timeZone: 'Europe/London' },
      note: 'Final magazine layout and image licensing.', lockedFields: [], revision: 1,
      createdAt: '2026-08-03T09:15:00.000Z', updatedAt: '2026-08-22T13:41:00.000Z',
    },
    {
      id: 'demo-inv-002', reference: 'ACME-1048', client: 'Acme Field Notes', amountMinor: 72000, currency: 'USD', termsDays: 14,
      draftedAt: { instant: '2026-08-14T16:20:00.000Z', timeZone: 'America/New_York' },
      issuedAt: { instant: '2026-08-18T14:30:00.000Z', timeZone: 'America/New_York' },
      sentAt: { instant: '2026-08-18T14:36:00.000Z', timeZone: 'America/New_York' },
      dueOn: { date: '2026-09-01', timeZone: 'America/New_York' },
      note: 'Research and copy edit for the August field guide.', lockedFields: [], revision: 1,
      createdAt: '2026-08-14T16:20:00.000Z', updatedAt: '2026-08-18T14:36:00.000Z',
    },
    {
      id: 'demo-inv-003', reference: 'MOSS-118', client: 'Moss & Finch Studio', amountMinor: 4650000, currency: 'INR', termsDays: 30,
      draftedAt: { instant: '2026-08-24T06:45:00.000Z', timeZone: 'Asia/Kolkata' },
      issuedAt: { instant: '2026-08-27T08:00:00.000Z', timeZone: 'Asia/Kolkata' },
      dueOn: { date: '2026-09-26', timeZone: 'Asia/Kolkata' },
      note: 'Brand system milestone two. Waiting to record the sent time.', lockedFields: [], revision: 1,
      createdAt: '2026-08-24T06:45:00.000Z', updatedAt: '2026-08-27T08:00:00.000Z',
    },
  ];
}
