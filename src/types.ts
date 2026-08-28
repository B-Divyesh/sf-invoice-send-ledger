export type DateField = 'draftedAt' | 'issuedAt' | 'sentAt' | 'dueOn' | 'paidAt';

export interface DateStamp {
  instant: string;
  timeZone: string;
}

export interface DueDate {
  date: string;
  timeZone: string;
}

export interface InvoiceRecord {
  id: string;
  reference: string;
  client: string;
  amountMinor: number;
  currency: string;
  termsDays: number;
  draftedAt: DateStamp;
  issuedAt?: DateStamp;
  sentAt?: DateStamp;
  dueOn?: DueDate;
  paidAt?: DateStamp;
  note: string;
  pdf?: Blob;
  pdfName?: string;
  lockedFields: DateField[];
  revision: number;
  createdAt: string;
  updatedAt: string;
}

export type ExportInvoice = Omit<InvoiceRecord, 'pdf'> & { pdfName?: string };

export interface LedgerExport {
  id: string;
  month: string;
  createdAt: string;
  invoices: ExportInvoice[];
  csv: string;
}

export interface PortableInvoice extends Omit<InvoiceRecord, 'pdf'> {
  pdfDataUrl?: string;
}

export interface PortableBackup {
  format: 'send-date-ledger';
  version: 1;
  exportedAt: string;
  invoices: PortableInvoice[];
  exports: LedgerExport[];
}
