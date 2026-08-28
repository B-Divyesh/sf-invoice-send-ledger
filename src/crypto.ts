import type { PortableBackup } from './types';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function deriveKey(passphrase: string, salt: Uint8Array<ArrayBuffer>, usage: KeyUsage[]): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 250_000, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    usage,
  );
}

export async function encryptBackup(backup: PortableBackup, passphrase: string): Promise<string> {
  if (passphrase.length < 8) throw new Error('Use a passphrase with at least 8 characters.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt, ['encrypt']);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(backup)));
  return JSON.stringify({
    format: 'send-date-ledger-encrypted',
    version: 1,
    algorithm: 'AES-256-GCM',
    kdf: 'PBKDF2-SHA256-250000',
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
  });
}

export async function decryptBackup(payload: string, passphrase: string): Promise<PortableBackup> {
  let envelope: Record<string, unknown>;
  try {
    envelope = JSON.parse(payload) as Record<string, unknown>;
  } catch {
    throw new Error('This backup is not valid JSON.');
  }
  if (envelope.format !== 'send-date-ledger-encrypted') throw new Error('This is not an encrypted Send-Date Ledger backup.');
  try {
    const salt = base64ToBytes(String(envelope.salt));
    const iv = base64ToBytes(String(envelope.iv));
    const key = await deriveKey(passphrase, salt, ['decrypt']);
    const clear = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, base64ToBytes(String(envelope.ciphertext)));
    return JSON.parse(decoder.decode(clear)) as PortableBackup;
  } catch {
    throw new Error('Could not decrypt the backup. Check the passphrase and file.');
  }
}
