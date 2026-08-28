import { describe, expect, it } from 'vitest';
import { decryptBackup, encryptBackup } from '../src/crypto';
import type { PortableBackup } from '../src/types';

const backup: PortableBackup = {
  format: 'send-date-ledger',
  version: 1,
  exportedAt: '2026-08-28T10:00:00.000Z',
  invoices: [],
  exports: [],
};

describe('encrypted backups', () => {
  it('round-trips local ledger data with AES-GCM', async () => {
    const encrypted = await encryptBackup(backup, 'a strong passphrase');
    expect(encrypted).not.toContain(backup.exportedAt);
    await expect(decryptBackup(encrypted, 'a strong passphrase')).resolves.toEqual(backup);
  });

  it('rejects a wrong passphrase', async () => {
    const encrypted = await encryptBackup(backup, 'correct passphrase');
    await expect(decryptBackup(encrypted, 'wrong passphrase')).rejects.toThrow('Could not decrypt');
  });
});
