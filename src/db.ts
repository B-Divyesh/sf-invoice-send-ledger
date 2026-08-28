import type { InvoiceRecord, LedgerExport } from './types';

export const DEMO_MODE = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
const DB_NAME = DEMO_MODE ? 'demo:send-date-ledger' : 'send-date-ledger';
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('invoices')) db.createObjectStore('invoices', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('exports')) db.createObjectStore('exports', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open browser storage.'));
    request.onblocked = () => reject(new Error('Storage upgrade is blocked by another open tab.'));
  });
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Browser storage request failed.'));
  });
}

export async function getInvoices(): Promise<InvoiceRecord[]> {
  const db = await openDb();
  try {
    return await requestResult(db.transaction('invoices').objectStore('invoices').getAll());
  } finally {
    db.close();
  }
}

export async function putInvoice(invoice: InvoiceRecord, expectedRevision: number | null = null): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('invoices', 'readwrite');
    const store = transaction.objectStore('invoices');
    const lookup = store.get(invoice.id);
    lookup.onsuccess = () => {
      const current = lookup.result as InvoiceRecord | undefined;
      const currentRevision = current?.revision ?? (current ? 1 : 0);
      if (expectedRevision !== null && currentRevision !== expectedRevision) {
        transaction.abort();
        reject(new Error('This invoice changed in another tab. Review the latest dates, then try again.'));
        return;
      }
      store.put({ ...invoice, revision: currentRevision + 1 });
    };
    lookup.onerror = () => reject(lookup.error ?? new Error('Could not check the latest invoice.'));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not save this invoice.'));
    transaction.onabort = () => undefined;
  }).finally(() => db.close());
}

export async function putInvoices(invoices: InvoiceRecord[]): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('invoices', 'readwrite');
    const store = transaction.objectStore('invoices');
    for (const invoice of invoices) store.put(invoice);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not save imported invoices.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Invoice import was cancelled.'));
  }).finally(() => db.close());
}

export async function deleteInvoice(id: string): Promise<void> {
  const db = await openDb();
  try {
    await requestResult(db.transaction('invoices', 'readwrite').objectStore('invoices').delete(id));
  } finally {
    db.close();
  }
}

export async function getExports(): Promise<LedgerExport[]> {
  const db = await openDb();
  try {
    return await requestResult(db.transaction('exports').objectStore('exports').getAll());
  } finally {
    db.close();
  }
}

export async function putExport(record: LedgerExport): Promise<void> {
  const db = await openDb();
  try {
    await requestResult(db.transaction('exports', 'readwrite').objectStore('exports').add(record));
  } finally {
    db.close();
  }
}

export async function putExports(records: LedgerExport[]): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('exports', 'readwrite');
    const store = transaction.objectStore('exports');
    for (const record of records) store.put(record);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not restore export history.'));
  }).finally(() => db.close());
}

export async function restoreData(invoices: InvoiceRecord[], records: LedgerExport[]): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(['invoices', 'exports'], 'readwrite');
    const invoiceStore = transaction.objectStore('invoices');
    const exportStore = transaction.objectStore('exports');
    for (const invoice of invoices) {
      const lookup = invoiceStore.get(invoice.id);
      lookup.onsuccess = () => {
        const current = lookup.result as InvoiceRecord | undefined;
        if (!current?.lockedFields.length) return void invoiceStore.put(invoice);
        const merged = { ...invoice, lockedFields: [...new Set([...invoice.lockedFields, ...current.lockedFields])], revision: (current.revision ?? 1) + 1 };
        for (const field of current.lockedFields) {
          if (field === 'draftedAt') merged.draftedAt = current.draftedAt;
          else if (field === 'issuedAt') merged.issuedAt = current.issuedAt;
          else if (field === 'sentAt') merged.sentAt = current.sentAt;
          else if (field === 'paidAt') merged.paidAt = current.paidAt;
          else if (field === 'dueOn') { merged.dueOn = current.dueOn; merged.termsDays = current.termsDays; }
        }
        invoiceStore.put(merged);
      };
    }
    for (const record of records) exportStore.put(record);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not restore this backup.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('The restore was cancelled without changing your records.'));
  }).finally(() => db.close());
}

export async function resetDemoData(seed: InvoiceRecord[]): Promise<void> {
  if (!DEMO_MODE) throw new Error('Demo reset is unavailable outside the demo.');
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(['invoices', 'exports'], 'readwrite');
    const invoicesStore = transaction.objectStore('invoices');
    invoicesStore.clear();
    transaction.objectStore('exports').clear();
    for (const invoice of seed) invoicesStore.add(invoice);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not reset the demo.'));
  }).finally(() => db.close());
}

export async function createExportAndLock(record: LedgerExport, selected: InvoiceRecord[]): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(['invoices', 'exports'], 'readwrite');
    transaction.objectStore('exports').add(record);
    const invoiceStore = transaction.objectStore('invoices');
    for (const invoice of selected) {
      const lookup = invoiceStore.get(invoice.id);
      lookup.onsuccess = () => {
        const current = lookup.result as InvoiceRecord | undefined;
        if (!current || (current.revision ?? 1) + 1 !== invoice.revision) return void transaction.abort();
        invoiceStore.put(invoice);
      };
    }
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not seal the monthly CSV export.'));
    transaction.onabort = () => reject(new Error('An invoice changed in another tab. Review the latest dates, then export again.'));
  }).finally(() => db.close());
}
