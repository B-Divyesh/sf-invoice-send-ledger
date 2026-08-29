# Perfection loop 3 handoff

- Work order: `invoice-send-ledger-polish-3`
- Base reviewed: `af10d0270df195f220df8d13d2535929103134cb`
- Repair commit: `27bcdd5` (`fix: remove untested sales availability copy`)
- Production URL: <https://invoice-send-ledger.sociobot.in>
- Deployment: Static Web Apps `94049742-8765-41de-bd10-3d1a85e01b8e`
- Outcome: **PASS — no review finding remains open.**

## What changed

- Resolved F-3-1 completely by removing the untested sales-availability
  statement from README, the PDF storage dialog, and Terms. The dialog now
  tells people to verify a license before using the already-tested PDF storage
  action.
- Added a browser copy regression that proves the removed sentence is absent
  from demo and legal pages.
- Preserved and retested every review-1 and review-2 repair: isolated sample
  mode, data integrity, PDFs, backups, offline editing, routes/metadata, 404,
  headers, accessibility, phone layout, plain wording, and original ceramic
  visual identity.
- Updated the catalog sentence, copy audit, legal build labels, evidence, and
  the cumulative finding ledger in `.factory/polish-3.md`.

## Exact verification

From clean clone `/tmp/invoice-send-ledger-polish-3-IgRSDG` at `27bcdd5`:

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

All passed: 20 Vitest tests, production build with `dist/index.html`, and 52
Playwright desktop/Pixel 5 tests. Every command in `.factory/claims.json` was
also executed exactly as registered and passed: demo isolation, due-date,
time-zone, CSV export, sealed restore, backup validation, offline reload,
local-only requests, encrypted/plain backups, paid PDF storage, license
privacy, PDF import, and stale-write protection.

Build sizes: initial app JavaScript 18.31 KB gzip; CSS 6.10 KB gzip.

After deployment, a fresh production browser audit passed. It verified a
sample-first `/demo`, `?demo=1` isolation, Reset demo, Start for real, offline
edit/reload after service-worker activation, same-origin-only demo requests,
route titles/canonicals/focus, no 390 px overflow, real 404, CSP/security
headers, and zero serious/critical Axe findings on root, demo, privacy, terms,
and 404. `/opt/fleet/lib/verify-url.sh` recorded no console errors.

Production Lighthouse for `/demo` recorded Performance 100, Accessibility 100,
Best Practices 100, and SEO 100; LCP 1.109 s, CLS 0.019, TBT 45 ms.

Evidence is in `.factory/evidence/live-polish-3/`:

- `verify.json`, `index.html`, `screenshot-desktop.png`, `screenshot-mobile.png`
- `demo-live-desktop.png`, `demo-live-mobile.png`
- `lighthouse.json`

## Run and deploy

```sh
npm ci
npm run check
/opt/fleet/lib/deploy-static.sh invoice-send-ledger dist
```

## Known gaps and next steps

None. The product is a local-first invoice date record; it deliberately does
not create invoices, calculate tax, take payments, or act as accounting/legal
recordkeeping.
