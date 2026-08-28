# Perfection loop 1 handoff

- Work order: `invoice-send-ledger-polish-1`
- Candidate repaired: `feedeb7c8e29c3c46b01adc387987359a48d5520`
- Review commit: `518c8e3273382158b369c9fa5bb7ced22206ccb2`
- Repair commits: `4976d5980461259e374908bac2de9cb597a56a24`, `4e9db1899309c09d75db62ff272661b2b984097e`
- Product: <https://invoice-send-ledger.sociobot.in>
- Demo: <https://invoice-send-ledger.sociobot.in/demo> and <https://invoice-send-ledger.sociobot.in/?demo=1>
- Completed: 28 August 2026 UTC

## What changed

All 58 findings in `.factory/review-1.md` are addressed and mapped individually in `.factory/polish-1.md`.

- The first screen now names the invoice-recording job, freelancers, the safe sample action, its result, and three concrete facts.
- Demo mode uses `demo:send-date-ledger`, seeds three realistic invoices, never opens the real database, and has persistent reset and exit controls.
- Fourteen product claims have exactly one tagged observable browser test each.
- Restore validates all data before an atomic write and preserves existing sealed dates and exports.
- Revision checks stop stale tabs from overwriting newer dates.
- PDF text import runs locally and keeps every extracted field editable.
- PDF storage remains locked without a successful license verdict. Both backup formats retain licensed PDFs. Files over 10 MB are rejected.
- The broken purchase action is gone. The interface states that new licenses are not for sale and supports verification for existing licenses.
- Root, demo, privacy, terms, offline, and 404 pages have appropriate titles, landmarks, focus behavior, shared navigation, legal links, and the ceramic visual system.
- Static host configuration supplies a real 404, CSP, Permissions-Policy, safe referrer/MIME headers, and immutable hashed-asset caching.
- Metadata now includes canonical links, Open Graph, Twitter cards, an original 1200 × 630 preview, and a 180 px touch icon.
- The service worker precaches app/demo/legal shells and supports offline edits plus an update prompt. The host explicitly serves `/index.html` so production installation succeeds.

## Clean-clone verification

Verified at commit `4e9db1899309c09d75db62ff272661b2b984097e` in `/tmp/invoice-send-ledger-polish1-clean-PNQ7Le`:

```text
npm ci                         PASS — 69 packages, 0 vulnerabilities
npm test                       PASS — 20/20 tests across 4 files
npm run build                  PASS — dist/index.html produced
all 14 claims.json commands    PASS — each run separately on Chromium desktop
npm run test:e2e               PASS — 50/50 tests, desktop and Pixel 5
```

The browser suite includes real/demo isolation and reset, due rules, time zones, CSV contents, sealed restore, malformed backup rejection, offline reload/edit, request privacy, both backup formats, PDF gating/size/restore, license request/cache behavior, PDF import, concurrent writes, route focus/back navigation, internal-link crawl, 44 px targets, phone overflow, dark/light axe checks, and load-time console errors.

Build budgets:

```text
Initial app JS                 60.20 KB raw / 18.15 KB gzip
Initial CSS                    23.94 KB raw / 5.95 KB gzip
Hero image                     33.17 KB
Social image                   82.44 KB
```

PDF.js is a lazy import used only after choosing a PDF. Its 128.94 KB gzip chunk is not part of the initial load.

Local mobile Lighthouse on `/demo` (`.factory/evidence/lighthouse-local.json`):

```text
Performance                    100
Accessibility                  100
Best Practices                 100
SEO                            100
LCP                            1.51 s
CLS                            0.019
Total Blocking Time            28 ms
```

The factory URL verifier reported one h1, `lang=en`, a main landmark, complete alt text/button names, and zero console errors. Playwright axe reported zero serious or critical issues in both color themes and on legal/404 routes.

## Run it

```sh
npm ci
npm run dev
npm run check
```

Build with `npm run build`; deploy the contents of `dist/`.

## Deployment and live verification

The static deployment and cold production checks are recorded in the final handoff commit after deployment.

## Known gaps

No product defect or deferred review finding remains. New PDF licenses are not offered because the external factory product is not enabled; the repository contract prohibits changing billing infrastructure here. The former dead checkout link was removed, and the product makes no purchase promise.
