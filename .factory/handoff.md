# Handoff — Send-Date Ledger

Work order: `invoice-send-ledger-build-1`

Completed: 2026-08-28

Build output: `dist/` (static, `dist/index.html` present)

## What was built

- A finished offline invoice issue register for draft, issued, sent, due, and
  paid events. Every timestamp carries its IANA timezone.
- Visible Net 0/7/14/30/45/60 rules. Issuing an invoice immediately generates
  its due date; timeline validation rejects issue-before-draft and
  sent-before-issue mistakes.
- Monthly CSV exports selected by issue month. Each export is retained as an
  immutable snapshot, and every date present in it becomes sealed in the live
  record. New later events, such as payment, can still be appended.
- IndexedDB persistence, search, lifecycle filters, PDF open/download, and
  sent/due completeness indicators against the 95% pilot target.
- Plain portable JSON and AES-256-GCM encrypted backup/restore. PBKDF2-SHA256
  uses 250,000 iterations. Backups include export history and attached PDFs.
- An installable PWA: 192/512/maskable icons, manifest, versioned app-shell and
  runtime caches, offline fallback, `clients.claim`, and update-available UI
  that invokes `skipWaiting`.
- ₹699 one-time Studio licensing through the Sociobot checkout/verify contract.
  The app captures returned licenses, strips them from the URL, stores them at
  `sb_license:invoice-send-ledger`, verifies at most daily, works optimistically
  offline, supports pasted-license restore, and never gates CSV, backup,
  accessibility, or chronology safety. Studio adds local PDF storage only.
- Dedicated `/privacy/` and `/terms/` pages, expanded README, MIT license, and
  the product brief preserved in `.factory/brief.json`.
- A distinctive light/dark “glacial minimal ceramics” system, documented in
  `.factory/design.md`. The reviewed original Azure OpenAI artwork source and
  prompt sidecars are in `assets/src/`; the shipping WebP is 33.2 KB.

## Verification completed

Commands run from `/work/repo`:

```sh
npm install
npm audit --audit-level=high
npm test
npm run build
npm run test:e2e
VERIFY_NODE_MODULES=/work/repo/node_modules \
  /opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 /tmp/sdl-verify
```

Results:

- `npm audit`: 0 vulnerabilities.
- Vitest: 7/7 passing (chronology, sealing, CSV formula-injection defense, and
  encrypted-backup round trip/wrong-passphrase handling).
- Playwright 1.58.2: 6/6 passing across desktop Chromium and Pixel 5 profiles.
  It covers add → issue → send → monthly export → sealed-date enforcement,
  keyboard/dialog focus, axe WCAG A/AA serious/critical checks, no browser
  console errors, and an explicit offline reload with the service worker.
- Factory `verify-url.sh`: HTTP 200; 554 ms local load; title and `lang` present;
  exactly one h1; main landmark present; 0 missing image alts; 0 unlabeled icon
  buttons; 0 console/page errors.
- Lighthouse 12.8.2 mobile run: performance 100, accessibility 100, best
  practices 100; LCP 1.5 s, CLS 0.019, total blocking time 0 ms. Lighthouse 12
  no longer reports a numeric PWA category, so install/offline behavior was
  verified directly in Playwright.
- Production assets: initial JS 42.69 KB raw / 12.95 KB gzip; CSS 20.75 KB raw /
  5.34 KB gzip; no font payload; hero WebP 33.17 KB. These are comfortably
  inside the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.
- Manual visual inspection was completed at 1440px and via the 390px mobile
  Playwright profile, including empty state and form dialog.

## Known constraints and next steps

- Browser storage is intentionally device-local. Users must make backups before
  clearing site data or changing devices; this is stated in the UI and policy.
- The factory must register the `invoice-send-ledger` paid product and return URL
  before the production checkout can complete. No product ID or provider secret
  is hardcoded here.
- Snapshot sealing is a product guardrail, not cryptographic notarization or
  statutory bookkeeping. The UI and terms say this explicitly.
- Static hosting must serve the built `/privacy/index.html` and
  `/terms/index.html` paths and leave `/sw.js` at the origin root.
