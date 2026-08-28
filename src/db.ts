import type { InvoiceRecord, LedgerExport } from './types';

const DB_NAME = 'send-date-ledger';
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

export async function putInvoice(invoice: InvoiceRecord): Promise<void> {
  const db = await openDb();
  try {
    await requestResult(db.transaction('invoices', 'readwrite').objectStore('invoices').put(invoice));
  } finally {
    db.close();
  }
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
