# Polish 6 — all-review repair record

Repair work started from candidate `92fbd3288d3d652d6dcbe6f5ebe22391e884cb76` and deployed application code
`df26cfae405d2b4fc4e0e30a01f3932f6559f09c` to <https://invoice-send-ledger.sociobot.in>.

The review-six checkout probe returned the factory endpoint's honest HTTP 404
(`enabled factory product`). Rather than show a price, license field, or
purchase action that cannot work, the repair removes that unavailable tier
entirely. A PDF up to 10 MB is now an ordinary local attachment on every
invoice date record. This is an intentional scope correction, not a mocked
payment flow: there is no checkout, license verification, or off-origin
request left in the product.

## Evidence key

- **Clean clone:** `/tmp/invoice-send-ledger-polish-6-59WkMa/repo` at
  `df26cfae405d2b4fc4e0e30a01f3932f6559f09c`: `npm ci`, `npm test` (21
  passing), `npm run build`, all 13 exact commands from `claims.json`, and
  `npm run test:e2e` (48 passing).
- **Claim evidence:** each `@claim:` below is an exact command in
  `.factory/claims.json`, run separately from that clean clone. Its
  Playwright screenshots are in `.factory/evidence/claim-*.png`.
- **Browser evidence:** `tests/e2e/site.spec.ts` and `tests/e2e/claims.spec.ts`
  are the full browser suites. Local semantic/console checks passed with
  `/opt/fleet/lib/verify-url.sh` in `.factory/evidence/local-polish-6/`.
- **Live check:** <https://invoice-send-ledger.sociobot.in>; route, link,
  focus, no-tier, request, header, offline, and Axe results are recorded in
  `.factory/evidence/live-polish-6/live-audit.json` (all failures `[]`).
  Cold screenshots: `live-polish-6/demo-cold-desktop.png` and
  `live-polish-6/demo-cold-mobile.png`.
- **Performance:** `live-polish-6/lighthouse-mobile.json` records 100/100
  Performance, Accessibility, Best Practices, and SEO; LCP 1275.795 ms,
  CLS 0.01896, TBT 34 ms.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rewrote the landing h1 as the direct invoice-send job. | `site.spec.ts` root; live `/` title/h1 in `live-audit.json`. |
| F-1-2 | Added isolated `/demo` and `?demo=1`, three realistic samples, persistent banner, Reset demo, and Start for real. | `@claim:demo-isolation`; `demo-cold-mobile.png`; live `/demo`. |
| F-1-3 | Added a claims registry with one exact tagged observable test for every public claim. | `factory.test.ts`; all 13 clean-clone claim commands. |
| F-1-4 | Restore now validates locked exported fields and rejects a conflicting replacement. | `@claim:sealed-restore`; `claim-sealed-restore.png`; live `/demo`. |
| F-1-5 | Backup parsing validates the full structure, dates, zones, ids, bounds, and locks before any write. | `@claim:backup-validation`; `claim-backup-validation.png`; live `/demo`. |
| F-1-6 | Removed the dead checkout instead of exposing an unprovisioned purchase flow. | `site.spec.ts` no-tier assertions; live `/` noTier `true`. |
| F-1-7 | Removed token unlock/verification and made local PDF attachment an included capability. | `@claim:pdf-storage`; `claim-pdf-storage.png`; live `/demo` external requests `[]`. |
| F-1-8 | Added invoice revision checks and conflict handling for stale-tab writes. | `@claim:concurrent-write`; `claim-concurrent-write.png`; live `/demo`. |
| F-1-9 | Made populated-state controls at least 44 px and checked phone layout. | `site.spec.ts` target/layout checks; `demo-cold-mobile.png`; live `/demo`. |
| F-1-10 | Configured immutable caching for hashed assets and short revalidation for HTML/SW. | `site.spec.ts` headers; live headers `immutableAsset`. |
| F-1-11 | Added response CSP, Permissions-Policy, Referrer-Policy, and response-header frame protection. | `site.spec.ts` headers; live `headers.txt`. |
| F-1-12 | Added a styled 404 page and Static Web Apps 404 override. | `site.spec.ts`; `missing.html`; live unknown URL returns 404. |
| F-1-13 | Made `/demo` a real history route with route title, h1 focus, and announcement. | `site.spec.ts` routing/focus; live `/demo` audit. |
| F-1-14 | Retested all original eight defects after the implementations above. | Full 48-test suite; live audit failures `[]`. |
| F-1-15 | Added per-route canonical, description, Open Graph/Twitter metadata, social image, and apple touch icon. | `site.spec.ts` metadata; live `/`, `/privacy/`, `/terms/`. |
| F-1-16 | Added robots, sitemap, and valid static host configuration. | `site.spec.ts` crawl/config checks; live route/link audit. |
| F-1-17 | Removed the unbuyable PDF license tier and all price/license/checkout surfaces; retained local PDF attachment. | `@claim:pdf-storage`; `claim-pdf-storage.png`; live all routes `noTier: true`. |
| F-1-18 | Unified header, skip link, nav, footer attribution, build id, and route h1 focus across app/legal/fallback pages. | `site.spec.ts` shell/focus; live all audited route h1s. |
| F-1-19 | Standardized copy on invoice date record, invoice, monthly CSV export, and invoice PDF. | `factory.test.ts` copy checks; live `/` and `/demo`. |
| F-1-20 | Added local PDF import with editable extracted fields and automatic attachment within the 10 MB limit. | `@claim:pdf-import` and `@claim:pdf-storage`; `claim-pdf-import.png`; live `/demo`. |
| F-1-21 | Replaced metaphor headline with a plain direct task. | `site.spec.ts`; live `/` h1. |
| F-1-22 | Rewrote the first-screen audience sentence in plain words. | `factory.test.ts` copy audit; live `/`. |
| F-1-23 | Uses drafted, issued, sent, due, and paid consistently, with due-rule proof. | `@claim:due-date`; `claim-due-date.png`; live `/demo`. |
| F-1-24 | Replaced unproved account slogan with tested local-only behavior. | `@claim:local-only`; `claim-local-only.png`; live demo requests `[]`. |
| F-1-25 | Removed tracking slogan; states no analytics/ads only where request logging proves it. | `@claim:local-only`; live `/demo` external requests `[]`. |
| F-1-26 | Constrained offline wording and tests to editing after the first visit. | `@claim:offline-reload`; `claim-offline-reload.png`; live offline audit. |
| F-1-27 | Replaced slogan caption with concrete grouped-date copy. | `factory.test.ts`; live `/`. |
| F-1-28 | Added a direct empty state and next action. | `site.spec.ts`; live `/` fresh real mode. |
| F-1-29 | Shows and proves the selected due rule and calculated date. | `@claim:due-date`; `claim-due-date.png`; live `/demo`. |
| F-1-30 | Removed the untestable privacy slogan. | `factory.test.ts` copy audit; live `/`. |
| F-1-31 | Describes browser storage plainly and verifies no external request in demo use. | `@claim:local-only`; `claim-local-only.png`; live `/demo`. |
| F-1-32 | Renamed the record area “Recorded invoices.” | `factory.test.ts`; live `/demo`. |
| F-1-33 | Uses “Invoice date record” consistently. | `factory.test.ts`; live `/`. |
| F-1-34 | Removed the ambiguous PDF-plan control with the unavailable tier. | `site.spec.ts` no-tier checks; live `/` noTier `true`. |
| F-1-35 | Put Try sample data and its outcome beside the first-screen action and gave three tested facts. | `site.spec.ts`; `demo-cold-desktop.png`; live `/`. |
| F-1-36 | Rewrote README introduction for the direct job. | `factory.test.ts`; clean-clone README review. |
| F-1-37 | Split README capability copy into short claim-backed sentences. | `factory.test.ts`; all listed claims pass. |
| F-1-38 | States plain non-goals without accounting jargon. | `factory.test.ts`; live `/` limits section. |
| F-1-39 | Replaced storage implementation jargon with browser wording. | `@claim:local-only`; live `/privacy/`. |
| F-1-40 | Preserves a time zone with each recorded date. | `@claim:time-zone`; `claim-time-zone.png`; live `/demo`. |
| F-1-41 | Lists plain same-day/7/14/30/45/60-day due choices and proves calculation. | `@claim:due-date`; live `/demo`. |
| F-1-42 | Kept the working search/status/missing-date tools without unsupported marketing claims. | `site.spec.ts` app flow; live `/demo`. |
| F-1-43 | CSV export locks included dates and restore cannot bypass the lock. | `@claim:csv-export` and `@claim:sealed-restore`; live `/demo`. |
| F-1-44 | Provides readable and encrypted backups including allowed PDFs. | `@claim:plain-backup` and `@claim:encrypted-backup`; live `/demo`. |
| F-1-45 | Uses user-facing offline/install wording, not PWA implementation jargon. | `@claim:offline-reload`; live `/offline.html`. |
| F-1-46 | Kept keyboard, reduced-motion, theme, responsive, contrast, and dialog behavior covered by browser/Axe checks. | `site.spec.ts`; live Axe serious/critical `[]`. |
| F-1-47 | Removed untestable price/free promise; PDF attachment is local and tested. | `@claim:pdf-storage`; live no-tier audit. |
| F-1-48 | Removed billing-network claim and the associated external request path. | `@claim:local-only`; live CSP `connect-src 'self'`. |
| F-1-49 | Documents the actual local start requirements and verifies clean install/start. | clean-clone `npm ci`, test, build; README. |
| F-1-50 | Uses consistent record/export/PDF terminology and tests local storage behavior. | `factory.test.ts`; `@claim:local-only`. |
| F-1-51 | Uses explicit backup action names and verifies downloaded/restoreable data. | `@claim:plain-backup`; `claim-plain-backup.png`. |
| F-1-52 | Tests encrypted backup behavior without storing the passphrase. | `@claim:encrypted-backup`; `claim-encrypted-backup.png`. |
| F-1-53 | Gives browser-data/removal guidance only with a complete local-storage design. | `@claim:local-only`; live `/privacy/`. |
| F-1-54 | Removed technical service-worker scope marketing copy. | `factory.test.ts` copy audit; live `/`. |
| F-1-55 | Removed the dead purchase target. | `site.spec.ts` link crawl/no-tier; live all links audited. |
| F-1-56 | Removed incorrect factory registration instructions from public documentation. | `factory.test.ts`; README review. |
| F-1-57 | Removed the unproved provider-credential assurance from public copy. | `factory.test.ts`; README review. |
| F-1-58 | Uses accurate “Stored in this browser” wording, proven by request logging. | `@claim:local-only`; live `/demo`. |
| F-2-1 | Renamed the limits eyebrow to “Limits and privacy.” | `factory.test.ts`; live `/`. |
| F-3-1 | Prior review found no outstanding defect; its prior-finding recheck remains covered here. | Full clean-clone and live audit failures `[]`. |
| F-4-1 | Added canonical/social metadata to 404 and offline fallback pages. | `site.spec.ts` fallback metadata; live `/404.html`, `/offline.html`. |
| F-4-2 | Removed untestable merchant/refund/revocation language with the unavailable license UI. | `site.spec.ts` no-tier/copy checks; live `/`. |
| F-5-1 | Removed unverified ₹699/free availability assertions and tier offer. | `site.spec.ts`; live all routes `noTier: true`. |
| F-5-2 | Removed public Azure provenance claim while retaining internal provenance in design documentation. | `factory.test.ts`; live `/` footer. |
| F-6-1 | Corrected Node requirement and declared the exact Vite-supported engine range. | `factory.test.ts`; clean-clone `npm ci`; README and `package.json`. |

No finding remains open. The product keeps its ceramic ledger visual system;
this repair changes capability and wording only where the review required it.
