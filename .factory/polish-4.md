# Polish 4 — zero-finding repair record

- Work order: `invoice-send-ledger-polish-4`
- Reviewed candidate: `55ad207c7c253ab3dd2078affdcac085fa20a88c`
- Repair commit: `04649b859434fb2d9721befe3faf5bf6750d1cbf`
- Production deployment: Static Web Apps `a52c77df-da66-4e0b-b581-7095c39b8019`
- Live URL: <https://invoice-send-ledger.sociobot.in>

Every issue in `review-1.md` through `review-4.md`, and each earlier polish
record, was treated as acceptance work. “Live” below means the cold production
audit in `live-polish-4/live-audit.json`; it checked root, `/demo`, `?demo=1`,
privacy, terms, fallback pages, an unknown 404, the isolated demo/reset/exit
flow, route metadata, shared footer, console state before the intentional 404,
and serious/critical Axe results.

| Finding | Change made | Evidence: test, screenshot, live URL check |
|---|---|---|
| F-1-1 | Kept the explicit invoice-send headline and freelancer sentence. | `site.spec.ts` root/demo test; `demo-first-viewport-chromium-mobile.png`; live `/`. |
| F-1-2 | Kept one-click `/demo` and `?demo=1`, the `demo:` database, banner, Reset demo, and Start for real. | `@claim:demo-isolation`; `claim-demo-isolation.png`; live `/?demo=1`. |
| F-1-3 | Kept all 14 registered observable claim tests in `.factory/claims.json`. | Fresh-clone execution of all 14 commands; claim screenshots; live `/demo`. |
| F-1-4 | Kept restore merging that preserves export-sealed dates. | `@claim:sealed-restore`; `claim-sealed-restore.png`; live `/demo`. |
| F-1-5 | Kept full backup validation before atomic restore writes. | `@claim:backup-validation`; `claim-backup-validation.png`; live `/demo`. |
| F-1-6 | Kept the unusable checkout action absent. | `site.spec.ts` visible-link crawl; `demo-first-viewport-chromium-desktop.png`; live `/`. |
| F-1-7 | Kept locked-first license behavior after verification failure. | `a first verification network failure keeps PDF storage locked`; `claim-paid-pdf.png`; live `/demo`. |
| F-1-8 | Kept revision checks that reject stale-tab saves. | `@claim:concurrent-write`; `claim-concurrent-write.png`; live `/demo`. |
| F-1-9 | Kept 44px control sizing at phone width. | `routes, metadata, accessibility, focus, and 44px targets pass`; `demo-first-viewport-chromium-mobile.png`; live `/demo`. |
| F-1-10 | Kept immutable caching for content-hashed assets. | `factory.test.ts` host config test; live `/assets/index-gLdH70jx.js` returned `max-age=31536000, immutable`. |
| F-1-11 | Kept CSP, Permissions-Policy, nosniff, and referrer headers as response headers. | `factory.test.ts`; `live-polish-4/verify.json`; live `/demo` response headers. |
| F-1-12 | Kept designed fallback and real unknown-route 404. | `site.spec.ts` fallback test; `fallback-404-live.png`; live `/definitely-missing-polish-4` returned 404. |
| F-1-13 | Kept `/demo` as a titled, focused route with canonical metadata. | `site.spec.ts` root/demo history test; `demo-live-desktop.png`; live `/demo`. |
| F-1-14 | Rechecked all eight historic integrity, target, cache, header, and 404 defects. | Claims `sealed-restore`, `backup-validation`, `paid-pdf`, `concurrent-write`; full 52-test suite; live `/demo`. |
| F-1-15 | Kept route-specific canonical, social, Twitter, and icon metadata. | `site.spec.ts` metadata tests; `site-404.html.png`; live `/`, `/privacy/`, `/terms/`. |
| F-1-16 | Kept robots, sitemap, manifest, and valid Static Web Apps routing config. | `factory.test.ts`; `live-polish-4/verify.json`; live `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`. |
| F-1-17 | Kept preview, three-step workflow, limits/privacy, and exact-price sections. | `site.spec.ts` first-viewport test; `demo-live-mobile.png`; live `/`. |
| F-1-18 | Updated every app, legal, 404, and offline footer to one `build polish-4` identity. | Updated cross-route `site.spec.ts`; `fallback-404-live.png`; live `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, `/offline.html`. |
| F-1-19 | Kept stable invoice date record, invoice, monthly CSV export, sealed date, and PDF storage plan terms. | `site.spec.ts` wording regression; `demo-first-viewport-chromium-mobile.png`; live `/demo`. |
| F-1-20 | Kept editable local PDF field extraction. | `@claim:pdf-import`; `claim-pdf-import.png`; live `/demo`. |
| F-1-21 | Kept the concrete first-screen h1. | `site.spec.ts` root route test; `demo-first-viewport-chromium-mobile.png`; live `/`. |
| F-1-22 | Kept freelancer-specific first-screen language. | `copy-audit.md`; `demo-first-viewport-chromium-mobile.png`; live `/`. |
| F-1-23 | Kept precise drafted/issued/sent/due/paid language and proof. | `@claim:due-date`; `claim-due-date.png`; live `/`. |
| F-1-24 | Kept unsupported no-account promise removed. | `copy-audit.md`; `demo-first-viewport-chromium-desktop.png`; live `/`. |
| F-1-25 | Kept the narrow no-analytics/no-advertising privacy fact and same-origin proof. | `@claim:local-only`; `claim-local-only.png`; live `/?demo=1`. |
| F-1-26 | Kept scoped after-first-visit offline wording. | `@claim:offline-reload`; `claim-offline-reload.png`; live `/demo`. |
| F-1-27 | Kept literal date caption in place of the slogan. | `copy-audit.md`; `demo-first-viewport-chromium-desktop.png`; live `/`. |
| F-1-28 | Kept the actionable empty state. | `ledger.spec.ts` records flow; `demo-live-mobile.png`; live `/`. |
| F-1-29 | Kept visible due-rule selection and calculated date. | `@claim:due-date`; `claim-due-date.png`; live `/demo`. |
| F-1-30 | Kept the unsupported privacy slogan removed. | `copy-audit.md`; `demo-first-viewport-chromium-desktop.png`; live `/`. |
| F-1-31 | Kept browser-storage wording and request proof. | `@claim:local-only`; `claim-local-only.png`; live `/demo`. |
| F-1-32 | Kept the meaningful Recorded invoices heading. | `ledger.spec.ts` and `site.spec.ts`; `demo-live-mobile.png`; live `/demo`. |
| F-1-33 | Kept Invoice date record as the product term. | `copy-audit.md`; `demo-live-mobile.png`; live `/demo`. |
| F-1-34 | Kept the result-naming View PDF storage plan control. | `site.spec.ts` wording regression; `demo-live-mobile.png`; live `/demo`. |
| F-1-35 | Kept sample CTA, adjacent result, and three plain facts in the first screen. | `site.spec.ts`; `demo-first-viewport-chromium-mobile.png`; live `/`. |
| F-1-36 | Kept concrete README opening. | `copy-audit.md`; README review; live `/`. |
| F-1-37 | Kept short, discrete README workflow sentences. | `copy-audit.md`; README review; live `/demo`. |
| F-1-38 | Kept plain non-goals. | `copy-audit.md`; `demo-live-mobile.png`; live `/`. |
| F-1-39 | Kept browser-storage language without account/sync claims. | `copy-audit.md`; `claim-local-only.png`; live `/privacy/`. |
| F-1-40 | Kept readable IANA time-zone display. | `@claim:time-zone`; `claim-time-zone.png`; live `/demo`. |
| F-1-41 | Kept the six due-rule options and exact calculated outcomes. | `@claim:due-date`; `claim-due-date.png`; live `/demo`. |
| F-1-42 | Kept unregistered search/filter marketing removed. | `copy-audit.md`; `demo-live-mobile.png`; live `/`. |
| F-1-43 | Kept monthly CSV sealing and sealed-date restore protection. | `@claim:csv-export`, `@claim:sealed-restore`; `claim-csv-export.png`; live `/demo`. |
| F-1-44 | Kept readable and encrypted backup paths. | `@claim:plain-backup`, `@claim:encrypted-backup`; matching claim screenshots; live `/demo`. |
| F-1-45 | Kept visitor copy free of PWA jargon. | `copy-audit.md`; `demo-first-viewport-chromium-mobile.png`; live `/`. |
| F-1-46 | Kept serious/critical accessibility violations at zero across routes and themes. | Playwright Axe tests and live Axe audit; `site-privacy.png`; live `/demo`. |
| F-1-47 | Kept honest ₹699 PDF-storage wording without a dead purchase action. | `@claim:paid-pdf`; `claim-paid-pdf.png`; live `/demo`. |
| F-1-48 | Kept token-only license verification request behavior. | `@claim:license-privacy`; `claim-license-privacy.png`; live `/demo`. |
| F-1-49 | Kept unsupported setup promise removed. | `copy-audit.md`; README review; live `/`. |
| F-1-50 | Kept consistent browser-storage wording for records and PDFs. | `copy-audit.md`; `claim-paid-pdf.png`; live `/privacy/`. |
| F-1-51 | Kept named readable backup control and complete JSON proof. | `@claim:plain-backup`; `claim-plain-backup.png`; live `/demo`. |
| F-1-52 | Kept passphrase encryption, non-storage, and local restore proof. | `@claim:encrypted-backup`; `claim-encrypted-backup.png`; live `/demo`. |
| F-1-53 | Kept cautious browser-data-removal guidance. | Privacy route test; `site-privacy.png`; live `/privacy/`. |
| F-1-54 | Kept unsupported service-worker scope visitor copy removed. | `copy-audit.md`; `claim-offline-reload.png`; live `/`. |
| F-1-55 | Kept all dead purchase targets absent. | `site.spec.ts` visible-link crawl; `demo-live-mobile.png`; live `/demo`. |
| F-1-56 | Kept untestable sales-availability statement removed. | `site.spec.ts` absence regression; `demo-live-mobile.png`; live `/demo`. |
| F-1-57 | Kept provider-secret claim and credentials out of the product. | Clean-clone source/build scan; `live-audit.json`; live `/demo`. |
| F-1-58 | Kept Stored in this browser as the precise status label. | `@claim:local-only`; `demo-live-mobile.png`; live `/demo`. |
| F-2-1 | Kept Limits and privacy as the descriptive eyebrow. | `site.spec.ts` wording regression; `demo-live-mobile.png`; live `/`. |
| F-3-1 | Kept New licenses are not for sale removed. | `site.spec.ts` absence regression; `demo-live-mobile.png`; live `/demo`. |
| F-4-1 | Added canonical, Open Graph, and Twitter metadata to `/404.html` and `/offline.html`. | Updated fallback metadata test; `fallback-404-live.png`, `fallback-offline-live.png`; live `/404.html`, `/offline.html`. |
| F-4-2 | Removed the untestable Sociobot/Dodo merchant, refund, and revocation statement; legal links remain. | Updated PDF-plan absence regression; `demo-live-mobile.png`; live `/demo`. |

## Verification

Fresh clone: `/tmp/invoice-send-ledger-polish-4-puAEDo`, cloned from
`04649b8`.

- `npm ci` — passed with zero vulnerabilities reported.
- `npm test` — 20 tests passed.
- `npm run build` — passed; `dist/index.html` exists. Initial app JavaScript is
  18.26 KB gzip and CSS is 6.10 KB gzip.
- Each exact command declared in `.factory/claims.json` passed separately:
  `demo-isolation`, `due-date`, `time-zone`, `csv-export`, `sealed-restore`,
  `backup-validation`, `offline-reload`, `local-only`, `encrypted-backup`,
  `plain-backup`, `paid-pdf`, `license-privacy`, `pdf-import`, and
  `concurrent-write`.
- `npm run test:e2e` — 52 Playwright tests passed across desktop and Pixel 5.

Production verification after deployment:

- `verify-url.sh https://invoice-send-ledger.sociobot.in/demo` passed with
  title, language, h1, main, alt text, labeled controls, and no console errors:
  `live-polish-4/verify.json`.
- The live cold audit passed root/demo/query-demo isolation/reset/exit, all
  legal and fallback metadata, footer equality, unknown 404, no pre-404 console
  errors, same-origin demo requests, and serious/critical Axe checks:
  `live-polish-4/live-audit.json`.
- Lighthouse mobile audit on `/demo`: Performance 99, Accessibility 100, Best
  Practices 100, SEO 100; LCP 946 ms, CLS 0.080, TBT 18 ms:
  `live-polish-4/lighthouse.json`.
