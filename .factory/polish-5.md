# Polish 5 — zero-finding repair record

- Work order: `invoice-send-ledger-polish-5`
- Reviewed candidate: `d46b0155135ea1393e0ea2eb0730c4db9ddf5e15`
- Repair commit: `07833f9ffab5f996d3a8329ab9d81258060a5815`
- Production deployment: Static Web Apps `4a4798e7-66fa-4e43-9f7e-1655f1f21544`
- Live URL: <https://invoice-send-ledger.sociobot.in>

This round re-read every review and polish record. The two new claims-contract
findings were repaired directly, and every earlier finding was re-exercised
from the shipped demo rather than accepted solely because an earlier record
said “fixed.” Screenshot paths below are repository-relative.

| Finding ID | Change made | Evidence: test, screenshot path, live URL check |
|---|---|---|
| F-1-1 | Kept the concrete invoice-send h1 and freelancer sentence. | `site.spec.ts`; `live-polish-5/root-mobile.png`; live `/`. |
| F-1-2 | Kept isolated `/demo` and `?demo=1`, samples, banner, reset, and real-data exit. | `@claim:demo-isolation`; `claim-demo-isolation.png`; `live-polish-5/demo-mobile.png`; live `/demo`. |
| F-1-3 | Kept 14 listed observable claim tests, one tag each. | `factory.test.ts`; all 14 commands from clean clone. |
| F-1-4 | Kept transactional restore merging that retains sealed dates. | `@claim:sealed-restore`; `claim-sealed-restore.png`; live demo audit. |
| F-1-5 | Kept complete validation before atomic backup restore writes. | `backup.test.ts`; `@claim:backup-validation`; `claim-backup-validation.png`. |
| F-1-6 | Kept the dead checkout action absent. | `site.spec.ts` link crawl; live root/demo copy audit. |
| F-1-7 | Kept locked-first PDF storage after verification failure. | `@claim:paid-pdf`; network-failure browser regression. |
| F-1-8 | Kept revision checks that reject stale-tab saves. | `@claim:concurrent-write`; `claim-concurrent-write.png`. |
| F-1-9 | Kept all visible interactive controls at least 44 px. | mobile target-size assertion; live `demo-mobile.png`. |
| F-1-10 | Kept immutable caching for hashed assets. | `factory.test.ts`; live asset header check. |
| F-1-11 | Kept CSP, Permissions-Policy, nosniff, and Referrer-Policy response headers. | `factory.test.ts`; live `live-audit.json`. |
| F-1-12 | Kept a styled fallback and true HTTP 404. | `site.spec.ts`; live `/definitely-missing-polish-5` returns 404. |
| F-1-13 | Kept a real titled `/demo` with focused h1 and history behavior. | `site.spec.ts`; `verify-url/verify.json`; live `/demo`. |
| F-1-14 | Re-exercised every historic integrity, cache, header, target, and fallback defect. | related claims; full browser suite; `live-audit.json`. |
| F-1-15 | Kept route canonical, social, Twitter, and touch-icon metadata. | metadata tests; live root/legal/fallback audit. |
| F-1-16 | Kept robots, sitemap, manifest, and Static Web Apps route configuration. | `factory.test.ts`; clean build; live route checks. |
| F-1-17 | Kept the preview, three-step workflow, limits, and PDF-storage section. | `site.spec.ts`; root screenshot; live `/`. |
| F-1-18 | Advanced every app, legal, offline, and 404 footer to `build polish-5`. | cross-route test; live route audit. |
| F-1-19 | Kept stable invoice date record, invoice, monthly CSV export, sealed date, and PDF storage plan terms. | copy audit; `site.spec.ts`; live `/demo`. |
| F-1-20 | Kept editable local invoice-PDF extraction. | `@claim:pdf-import`; `claim-pdf-import.png`. |
| F-1-21 | Kept the job-first h1. | `site.spec.ts`; live root screenshot. |
| F-1-22 | Kept the freelancer-specific first-screen sentence. | copy audit; live root audit. |
| F-1-23 | Kept clear drafted, issued, sent, due, and paid copy. | `@claim:due-date`; `claim-due-date.png`. |
| F-1-24 | Kept unsupported no-account language removed. | copy audit; source regression. |
| F-1-25 | Kept precise no-analytics/no-advertising copy with request-log proof. | `@claim:local-only`; `claim-local-only.png`. |
| F-1-26 | Kept scoped offline language and tested offline reload/edit. | `@claim:offline-reload`; `claim-offline-reload.png`. |
| F-1-27 | Kept a literal caption naming the dates together. | copy audit; root screenshot. |
| F-1-28 | Kept the useful empty-state title and action. | `ledger.spec.ts`; live root screenshot. |
| F-1-29 | Kept visible due-rule copy and calculation. | `@claim:due-date`; `claim-due-date.png`. |
| F-1-30 | Kept the unsupported privacy slogan removed. | copy audit; source regression. |
| F-1-31 | Kept browser-storage wording with request-log proof. | `@claim:local-only`; live demo audit. |
| F-1-32 | Kept “Recorded invoices” as the useful list heading. | `ledger.spec.ts`; live root screenshot. |
| F-1-33 | Kept “Invoice date record” as the product-job term. | copy audit; live root/demo. |
| F-1-34 | Kept “View PDF storage plan” as the result-naming control. | `site.spec.ts`; live screenshots. |
| F-1-35 | Kept the sample CTA, adjacent outcome, and three plain facts. | `site.spec.ts`; `live-polish-5/root-mobile.png`. |
| F-1-36 | Kept a concrete freelancer-first README opening. | README copy audit; clean-clone source regression. |
| F-1-37 | Kept short, claim-backed README workflow statements. | claims registry; clean-clone claim run. |
| F-1-38 | Kept plain non-goals in README and landing copy. | copy audit; live root audit. |
| F-1-39 | Kept browser-storage language without account or sync promises. | `@claim:local-only`; README audit. |
| F-1-40 | Kept readable IANA time-zone display. | `@claim:time-zone`; `claim-time-zone.png`. |
| F-1-41 | Kept all six due-rule choices and exact results. | `@claim:due-date`; browser suite. |
| F-1-42 | Kept unsupported search/filter marketing removed. | copy audit; clean source scan. |
| F-1-43 | Kept monthly CSV sealing and sealed-date restore protection. | `@claim:csv-export`; `@claim:sealed-restore`. |
| F-1-44 | Kept readable and encrypted local backup paths. | `@claim:plain-backup`; `@claim:encrypted-backup`. |
| F-1-45 | Kept visitor copy free of PWA implementation jargon. | copy audit; live root/demo audit. |
| F-1-46 | Kept serious/critical accessibility violations at zero. | Playwright Axe suite; live `axeSeriousCritical: []`. |
| F-1-47 | Removed unsupported ₹699/free offer language while retaining verified-license PDF storage. | `@claim:paid-pdf`; `copy-assertions.json`; live `/demo`. |
| F-1-48 | Kept token-only verification request behavior. | `@claim:license-privacy`; `claim-license-privacy.png`. |
| F-1-49 | Kept unsupported setup promise removed. | copy audit; README regression. |
| F-1-50 | Kept consistent browser-storage wording for records and PDFs. | `@claim:local-only`; `@claim:paid-pdf`. |
| F-1-51 | Kept named readable-backup control and complete JSON proof. | `@claim:plain-backup`; `claim-plain-backup.png`. |
| F-1-52 | Kept passphrase encryption, non-storage, and local restoration. | `@claim:encrypted-backup`; `claim-encrypted-backup.png`. |
| F-1-53 | Kept cautious browser-data-removal guidance. | privacy route test; live `/privacy/`. |
| F-1-54 | Kept unsupported service-worker-scope copy removed. | copy audit; `@claim:offline-reload`. |
| F-1-55 | Kept all dead purchase targets absent. | visible-link crawl; live copy assertions. |
| F-1-56 | Kept untestable sales-availability language removed. | `site.spec.ts`; README source regression. |
| F-1-57 | Kept provider credentials and unsupported secret claims out of the product. | clean source/build scan; live request audit. |
| F-1-58 | Kept “Stored in this browser” as precise state wording. | `@claim:local-only`; live demo screenshot. |
| F-2-1 | Kept “Limits and privacy” as the descriptive eyebrow. | `site.spec.ts`; copy audit. |
| F-3-1 | Kept “New licenses are not for sale” absent. | `site.spec.ts`; live copy assertions. |
| F-4-1 | Kept canonical, OG, and Twitter metadata on 404 and offline pages. | fallback metadata test; live route audit. |
| F-4-2 | Kept merchant/refund/revocation assertions absent. | `site.spec.ts`; PDF-plan dialog test. |
| F-5-1 | Removed every public price, “free,” lifetime, one-time-purchase, and sale assertion. Replaced it with “PDF storage requires a verified license.” | revised `@claim:paid-pdf`; new `factory.test.ts` copy regression; `copy-assertions.json`; live root/demo/terms/privacy. |
| F-5-2 | Removed visitor-facing Azure provenance copy. Full provenance remains in `.factory/design.md` as documentation, not a product promise. | new `factory.test.ts` regression; `copy-assertions.json`; live root/demo/terms/privacy. |

## Verification

Fresh clone: `/tmp/invoice-send-ledger-polish-5-3FLgbY`, at repair commit
`07833f9`.

- `npm ci` passed with 0 reported vulnerabilities.
- `npm test` passed: 21 tests.
- `npm run build` passed and produced `dist/index.html`; initial app JS is
  18.11 KB gzip and CSS is 6.06 KB gzip.
- `npm run test:e2e` passed: 52 Playwright tests across desktop and Pixel 5.
- Each exact `.factory/claims.json` command passed separately: `demo-isolation`,
  `due-date`, `time-zone`, `csv-export`, `sealed-restore`, `backup-validation`,
  `offline-reload`, `local-only`, `encrypted-backup`, `plain-backup`, `paid-pdf`,
  `license-privacy`, `pdf-import`, and `concurrent-write`.

Local `verify-url.sh` output is `local-polish-5/verify.json`. Local mobile
Lighthouse is Performance 100, Accessibility 100, Best Practices 100, SEO 100;
LCP 1.243 s, CLS 0.019, TBT 25 ms in `local-polish-5/lighthouse-mobile.json`.

Live `verify-url.sh` passed in `live-polish-5/verify-url/`. The cold live audit
is `live-polish-5/live-audit.json`; it records demo/reset, first-viewport
MOSS-118, route/focus/404/header checks, no off-origin demo requests, and no
serious/critical Axe violations. `live-polish-5/copy-assertions.json` proves
the removed offer/provenance text is absent on root, demo, terms, and privacy.

Production mobile Lighthouse is Performance 100, Accessibility 100, Best
Practices 100, SEO 100; LCP 0.988 s, CLS 0.019, TBT 22 ms in
`live-polish-5/lighthouse-mobile.json`.
