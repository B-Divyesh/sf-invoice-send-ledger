# Review 2 handoff

- Work order: `invoice-send-ledger-review-2`
- Reviewed revision: `a3c8eaa7e25bcc12557da2025eeada7b072752ae`
- Result: **FAIL** — review only; no product code was modified.

## Review 2 summary

Wrote `.factory/review-2.md` after a fresh, adversarial live review at 390 px
and desktop. Read every prior review, polish document, and handoff. Checked the
cold landing, demo storage/reset/isolation, request log, all claims, copy,
metadata, routing, headers, links, and visual identity.

Fresh-clone verification in `/tmp/invoice-send-ledger-review2-Iqd6Sz`:

```text
npm ci                           PASS
npm test                         PASS — 20 tests
npm run build                    PASS — dist/ produced
14 claims.json commands, separate PASS
```

Live checks confirmed isolated demo records, Reset demo, Start for real, zero
off-origin demo-flow requests, valid legal/deep routes, a designed 404,
required response headers, and no console errors.

Remaining work:

1. **BLOCKING F-1-2:** Sample cards begin at y=1815 on 390 × 844 and y=1157 on
   1440 × 1000. `/demo` must show a populated sample ledger without scrolling.
2. **BLOCKING F-1-19/F-1-34:** Rename header `PDF plan` to
   `View PDF storage plan`.
3. **Minor F-2-1:** Replace or remove `Clear boundaries`.

See `.factory/review-2.md` for complete evidence and the full copy/history
audit. The historical handoff follows.

# Perfection loop 1 handoff (historical)

- Work order: `invoice-send-ledger-polish-1`
- Candidate repaired: `feedeb7c8e29c3c46b01adc387987359a48d5520`
- Review commit: `518c8e3273382158b369c9fa5bb7ced22206ccb2`
- Behavior commits: `4976d5980461259e374908bac2de9cb597a56a24`, `4e9db1899309c09d75db62ff272661b2b984097e`, `576712704f9d715e52b427d5798e4e488d45ae73`
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

Verified at commit `576712704f9d715e52b427d5798e4e488d45ae73` in `/tmp/invoice-send-ledger-polish1-final-V7sm0o`:

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

Deployment ID `7aae3b26-2626-43e4-a9d5-5ba4ad2ca2f0` succeeded on Azure Static Web Apps. A cold production check then verified:

```text
/                                      200
/index.html                            200
/demo and /?demo=1                    200
/privacy/ and /terms/                 200
/robots.txt, /sitemap.xml, manifest   200
/definitely-missing-polish-1          404 with the designed page
```

- CSP, Permissions-Policy, nosniff, and Referrer-Policy are present on production responses.
- Hashed JS returns `Cache-Control: public, max-age=31536000, immutable`; HTML and `sw.js` return `no-cache`.
- A fresh service worker activated at `https://invoice-send-ledger.sociobot.in/`, then reloaded all three demo records offline.
- The live demo isolated a real test record, showed three samples, set its canonical/title, and focused its h1.
- Root, demo, privacy, and terms produced zero console errors. The intentional 404 produced only the browser’s expected failed-main-request entry.
- Live request capture during the complete check found zero off-origin requests.
- Live axe found zero serious or critical issues.
- At 390 × 844, there was no horizontal overflow and all tested controls were at least 44 × 44 CSS px.
- Live Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.13 s, CLS 0.075, TBT 32 ms.
- Evidence: `.factory/evidence/live/`.

## Known gaps

No product defect or deferred review finding remains. New PDF licenses are not offered because the external factory product is not enabled; the repository contract prohibits changing billing infrastructure here. The former dead checkout link was removed, and the product makes no purchase promise.
