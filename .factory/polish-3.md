# Perfection loop 3 — cumulative repair ledger

- Base reviewed: `af10d0270df195f220df8d13d2535929103134cb`
- Review source: `098c0034060ea1269d6a5f189024f7b0fcfcd154`
- Work order: `invoice-send-ledger-polish-3`
- Live URL: <https://invoice-send-ledger.sociobot.in>

This ledger deliberately retests the whole review history. “Retained” means the
repair is present in the current product and is exercised again in this round;
it does not rely only on an earlier note. Exact clean-clone commands, browser
artifacts, and cold-live results are recorded in the handoff.

| Finding ID | Change made or retained | Evidence |
|---|---|---|
| F-1-1 | Kept the freelancer-specific, job-first h1 and audience sentence. | `site.spec.ts` root route test; cold `/` check |
| F-1-2 | Kept isolated `/demo` and `?demo=1`, three samples, banner, reset, exit, and sample-first layout. | `@claim:demo-isolation`; `demo-first-viewport-chromium-{desktop,mobile}.png`; cold `/demo` |
| F-1-3 | Kept the claim registry and one tagged observable browser test per claim. | `factory.test.ts`; every registered command |
| F-1-4 | Kept transactional sealed-date merge on restore. | `@claim:sealed-restore`; `claim-sealed-restore.png` |
| F-1-5 | Kept complete backup validation before writes. | `backup.test.ts`; `@claim:backup-validation` |
| F-1-6 | Kept the dead checkout action removed. | `site.spec.ts` link crawl; cold link crawl |
| F-1-7 | Kept locked-first PDF storage after verification failure. | `@claim:paid-pdf`; network-failure browser test |
| F-1-8 | Kept revision conflict handling for stale tabs. | `@claim:concurrent-write`; `claim-concurrent-write.png` |
| F-1-9 | Kept 44 px interactive targets on the populated phone view. | browser target-size assertion; cold 390 px check |
| F-1-10 | Kept immutable caching for hashed assets. | `factory.test.ts`; live asset header check |
| F-1-11 | Kept response CSP, Permissions-Policy, nosniff, and referrer headers. | `factory.test.ts`; live `/demo` header check |
| F-1-12 | Kept the styled, true HTTP 404 with a home link. | `site.spec.ts`; cold unknown-path check |
| F-1-13 | Kept real demo title, canonical, focused h1, and browser history behavior. | `site.spec.ts`; cold `/demo` check |
| F-1-14 | Retested every original handoff defect through F-1-4 through F-1-11. | claim, unit, and header evidence above |
| F-1-15 | Kept route-specific canonical, social metadata, social art, and touch icon. | `site.spec.ts` metadata test |
| F-1-16 | Kept robots, sitemap, manifest, and host configuration. | `factory.test.ts`; cold route checks |
| F-1-17 | Kept the preview, three-step workflow, boundaries, and price section. | root screenshot; cold `/` review |
| F-1-18 | Kept consistent accessible header, footer, legal links, skip link, and route focus. | `site.spec.ts` legal/404 tests |
| F-1-19 | Kept the stable term “PDF storage plan” everywhere. | `site.spec.ts` copy regression |
| F-1-20 | Kept editable local invoice-PDF field extraction. | `@claim:pdf-import`; `claim-pdf-import.png` |
| F-1-21 | Kept the concrete invoice-sending h1. | copy audit; root route test |
| F-1-22 | Kept the explicit freelancer sentence. | copy audit; cold `/` check |
| F-1-23 | Kept clear date copy with tested due-date behavior. | `@claim:due-date` |
| F-1-24 | Kept unsupported no-account language removed. | copy audit; cold copy check |
| F-1-25 | Kept the precise no-analytics wording and same-origin proof. | `@claim:local-only` |
| F-1-26 | Kept scoped offline wording and offline edit/reload proof. | `@claim:offline-reload` |
| F-1-27 | Kept the literal caption naming the dates kept together. | copy audit |
| F-1-28 | Kept the useful empty-state heading and next step. | browser empty-state flow |
| F-1-29 | Kept action-based due-rule copy. | `@claim:due-date` |
| F-1-30 | Kept the privacy slogan removed. | copy audit |
| F-1-31 | Kept precise browser-storage wording. | `@claim:local-only` |
| F-1-32 | Kept “Recorded invoices” as the invoice list heading. | `site.spec.ts`; cold demo |
| F-1-33 | Kept “Invoice date record” as the product-job term. | copy audit |
| F-1-34 | Kept the result-naming “View PDF storage plan” action. | `site.spec.ts` copy regression |
| F-1-35 | Kept the first-screen sample action, outcome note, and three facts. | `@claim:demo-isolation`; root screenshot |
| F-1-36 | Kept the clear freelancer-first README introduction. | README copy audit |
| F-1-37 | Kept short, claim-backed workflow statements. | `@claim:due-date`; `@claim:csv-export` |
| F-1-38 | Kept plain non-goals. | README and limits-section check |
| F-1-39 | Kept browser-storage wording without account or sync promises. | `@claim:local-only` |
| F-1-40 | Kept plain time-zone wording. | `@claim:time-zone`; `claim-time-zone.png` |
| F-1-41 | Kept every supported due term explained and tested. | `@claim:due-date` |
| F-1-42 | Kept unregistered search and filter marketing removed. | README copy audit |
| F-1-43 | Kept monthly CSV sealing and sealed restore protection. | `@claim:csv-export`; `@claim:sealed-restore` |
| F-1-44 | Kept readable and encrypted backup paths. | `@claim:plain-backup`; `@claim:encrypted-backup` |
| F-1-45 | Kept scoped offline language without PWA jargon. | `@claim:offline-reload` |
| F-1-46 | Retested serious and critical accessibility findings on all required routes. | Playwright Axe tests; cold accessibility run |
| F-1-47 | Kept honest ₹699 capability copy without a dead buy action. | `@claim:paid-pdf`; link crawl |
| F-1-48 | Kept the exact token-only verification request behavior. | `@claim:license-privacy`; `claim-license-privacy.png` |
| F-1-49 | Kept the unsupported setup promise removed. | README copy audit |
| F-1-50 | Kept consistent browser-storage wording for records and PDFs. | `@claim:local-only`; `@claim:paid-pdf` |
| F-1-51 | Kept the named readable-backup control and complete JSON proof. | `@claim:plain-backup`; `claim-plain-backup.png` |
| F-1-52 | Kept passphrase encryption, non-storage, and local restore proof. | `@claim:encrypted-backup`; `claim-encrypted-backup.png` |
| F-1-53 | Kept cautious browser data-removal guidance. | privacy page check |
| F-1-54 | Kept unsupported service-worker-scope visitor copy removed. | `@claim:offline-reload` |
| F-1-55 | Kept every dead purchase target removed. | `site.spec.ts` link crawl |
| F-1-56 | Removed the unsupported statement about license-sale availability. | README copy regression; cold live copy check |
| F-1-57 | Kept provider-secret claims removed and source/build free of credentials. | clean-clone source/build scan |
| F-1-58 | Kept “Stored in this browser” as the precise status label. | `@claim:local-only`; mobile screenshot |
| F-2-1 | Kept “Limits and privacy” in place of the non-descriptive eyebrow. | `site.spec.ts` copy regression |
| F-3-1 | Removed “New licenses are not for sale” from README and the PDF-plan dialog. The dialog now describes the tested action: verifying a license for PDF storage. | `site.spec.ts` absence regression; README copy audit; cold `/demo` and PDF-plan check |

## Required acceptance checks

- Every command in `.factory/claims.json` is run from a fresh clone after the
  repair, in addition to `npm ci`, `npm test`, `npm run build`, and
  `npm run test:e2e`.
- The deployed site is reopened in a fresh browser context. The cold checks
  cover `/`, `/demo`, `/?demo=1`, legal pages, headers, unknown-path 404,
  mobile layout, local-only requests, offline demo reload, and Axe serious and
  critical findings.
