const PRODUCT_SLUG = document.documentElement.dataset.product ?? 'invoice-send-ledger';
const DEMO_MODE = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
const prefix = DEMO_MODE ? 'demo:' : '';
const LICENSE_KEY = `${prefix}sb_license:${PRODUCT_SLUG}`;
const VERDICT_KEY = `${prefix}sb_license_verdict:${PRODUCT_SLUG}`;
const ATTEMPT_KEY = `${prefix}sb_license_attempt:${PRODUCT_SLUG}`;
const API_BASE = 'https://api.sociobot.in/api/v1';
const DAY = 86_400_000;

interface Verdict {
  valid: boolean;
  checkedAt: number;
  reason?: string;
}

export interface LicenseState {
  token: string | null;
  unlocked: boolean;
  reason?: string;
}

function readVerdict(): Verdict | null {
  try {
    return JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as Verdict | null;
  } catch {
    return null;
  }
}

export function captureReturnedLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
  localStorage.removeItem(ATTEMPT_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function licenseState(): LicenseState {
  const token = localStorage.getItem(LICENSE_KEY);
  const verdict = readVerdict();
  if (!token) return { token: null, unlocked: false };
  if (!verdict) return { token, unlocked: false, reason: 'not_verified' };
  return { token, unlocked: verdict.valid, reason: verdict.reason };
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return { token: null, unlocked: false };
  const cached = readVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) return { token, unlocked: cached.valid, reason: cached.reason };
  const lastAttempt = Number(localStorage.getItem(ATTEMPT_KEY) ?? 0);
  if (!force && lastAttempt && Date.now() - lastAttempt < DAY) return licenseState();
  localStorage.setItem(ATTEMPT_KEY, String(Date.now()));
  try {
    const response = await fetch(`${API_BASE}/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable.');
    const result = (await response.json()) as { valid: boolean; reason?: string };
    const verdict: Verdict = { valid: result.valid, reason: result.reason, checkedAt: Date.now() };
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    return { token, unlocked: result.valid, reason: result.reason };
  } catch {
    const prior = readVerdict();
    return prior?.valid ? { token, unlocked: true } : { token, unlocked: false, reason: 'verification_unavailable' };
  }
}

export function saveLicense(token: string): void {
  const clean = token.trim();
  if (!clean) throw new Error('Paste a license token first.');
  localStorage.setItem(LICENSE_KEY, clean);
  localStorage.removeItem(VERDICT_KEY);
  localStorage.removeItem(ATTEMPT_KEY);
}

export function clearLicense(): void {
  localStorage.removeItem(LICENSE_KEY);
  localStorage.removeItem(VERDICT_KEY);
  localStorage.removeItem(ATTEMPT_KEY);
}
