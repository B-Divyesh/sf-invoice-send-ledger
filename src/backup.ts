import type { InvoiceRecord, LedgerExport, PortableBackup, PortableInvoice } from './types';

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
  let backup: PortableBackup;
  try {
    backup = JSON.parse(payload) as PortableBackup;
  } catch {
    throw new Error('This backup is not valid JSON.');
  }
  if (backup.format !== 'send-date-ledger' || backup.version !== 1 || !Array.isArray(backup.invoices) || !Array.isArray(backup.exports)) {
    throw new Error('This file is not a supported Send-Date Ledger backup.');
  }
  return backup;
}

export function restoreInvoices(backup: PortableBackup): InvoiceRecord[] {
  return backup.invoices.map(({ pdfDataUrl, ...invoice }) => ({
    ...invoice,
    pdf: pdfDataUrl ? dataUrlToBlob(pdfDataUrl) : undefined,
  }));
}
