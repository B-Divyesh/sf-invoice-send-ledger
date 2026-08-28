# Perfection loop 2 — complete finding ledger

- Candidate repaired: `a3c8eaa7e25bcc12557da2025eeada7b072752ae`
- Review source: `1e613feec1f19b913574921e65b3e4b7f590307f`
- Work order: `invoice-send-ledger-polish-2`
- Live URL: <https://invoice-send-ledger.sociobot.in>

This is the cumulative acceptance record. Every review-1 finding remained
exercised in this round; review-2 findings were repaired rather than deferred.
`@claim:*` means the exact registered command in `.factory/claims.json` was
run from the clean clone described in the handoff.

| Finding ID | Change made | Evidence |
|---|---|---|
| F-1-1 | Retained the concrete freelancer headline, audience sentence, and sample action. | `site.spec.ts` root route test |
| F-1-2 | Kept isolated `/demo` and `?demo=1`; additionally made demo lead with its populated ledger. Search and filter remain below the sample slips. | `@claim:demo-isolation`; `site.spec.ts` viewport test; `demo-first-viewport-chromium-desktop.png`; `demo-first-viewport-chromium-mobile.png` |
| F-1-3 | Retained 14-entry claims registry and exact one-tag-per-claim contract test. | `factory.test.ts`; all registered commands |
| F-1-4 | Retained transactional sealed-date merge during restore. | `@claim:sealed-restore` |
| F-1-5 | Retained full pre-write backup validation. | `backup.test.ts`; `@claim:backup-validation` |
| F-1-6 | Retained removal of the dead checkout and honest sales status. | `site.spec.ts` internal-link crawl |
| F-1-7 | Retained locked-first license behavior on failed verification. | `@claim:paid-pdf`; network-failure browser test |
| F-1-8 | Retained revision conflict protection for stale tabs. | `@claim:concurrent-write` |
| F-1-9 | Retained 44 px controls and fixed the header regression caused by the longer PDF action: the phone header now keeps every target at least 44 px. | mobile target-size browser test |
| F-1-10 | Retained immutable caching for hashed assets. | `factory.test.ts`; deployed header check |
| F-1-11 | Retained CSP, Permissions-Policy, nosniff, and referrer headers. | `factory.test.ts`; deployed header check |
| F-1-12 | Retained the designed 404 and true 404 host override. | `site.spec.ts` 404 test; live missing-path check |
| F-1-13 | Retained real `/demo` title, canonical, focus, announcement, and history behavior. | `site.spec.ts` route test |
| F-1-14 | Retained all eight prior handoff repairs. | F-1-4 through F-1-11 evidence above |
| F-1-15 | Retained route metadata, social image, favicon, and touch icon. | `site.spec.ts` metadata test |
| F-1-16 | Retained robots, sitemap, and Static Web Apps configuration. | `factory.test.ts`; live route checks |
| F-1-17 | Retained the preview, three steps, limits, and price sections. | browser screenshots |
| F-1-18 | Retained shared accessible shells and legal/footer links. | `site.spec.ts` legal/404 axe and focus tests |
| F-1-19 | Replaced the remaining header abbreviation with **View PDF storage plan**; the PDF input chip also now uses the full term. | `site.spec.ts` copy regression |
| F-1-20 | Retained editable, local PDF field extraction. | `@claim:pdf-import` |
| F-1-21 | Retained the concrete landing h1. | copy audit; root route test |
| F-1-22 | Retained the freelancer-specific landing sentence. | copy audit |
| F-1-23 | Retained clear date wording and due/time-zone claims. | `@claim:due-date`; `@claim:time-zone` |
| F-1-24 | Retained removal of unsupported no-account copy. | copy audit |
| F-1-25 | Retained specific analytics wording with request-log proof. | `@claim:local-only` |
| F-1-26 | Retained scoped offline wording and offline edit/reload proof. | `@claim:offline-reload` |
| F-1-27 | Retained literal date caption. | copy audit |
| F-1-28 | Retained useful empty-state heading. | browser flow |
| F-1-29 | Retained action-based due-rule copy. | `@claim:due-date` |
| F-1-30 | Retained removal of the privacy slogan. | copy audit |
| F-1-31 | Retained precise browser-storage copy. | `@claim:local-only` |
| F-1-32 | Retained **Recorded invoices** heading. | route/browser tests |
| F-1-33 | Retained **Invoice date record** terminology. | copy audit |
| F-1-34 | Replaced the remaining header control with **View PDF storage plan**, a result-naming action. | `site.spec.ts` copy regression |
| F-1-35 | Retained the root one-click sample action and three facts. | `@claim:demo-isolation`; root screenshot |
| F-1-36 | Retained plain README introduction. | README; copy audit |
| F-1-37 | Retained short, claim-backed README workflow. | `@claim:due-date`; `@claim:csv-export` |
| F-1-38 | Retained plain non-goals. | README and limits section |
| F-1-39 | Retained browser-storage wording without unsupported sync/account promises. | `@claim:local-only` |
| F-1-40 | Retained plain time-zone wording. | `@claim:time-zone` |
| F-1-41 | Retained all six visible due terms. | `@claim:due-date` |
| F-1-42 | Retained removal of unregistered search/filter marketing claim. | README copy audit |
| F-1-43 | Retained CSV sealing and sealed restore protection. | `@claim:csv-export`; `@claim:sealed-restore` |
| F-1-44 | Retained plain and encrypted backup proof. | `@claim:plain-backup`; `@claim:encrypted-backup` |
| F-1-45 | Retained plain offline wording. | `@claim:offline-reload` |
| F-1-46 | Retained direct accessibility verification in both themes. | Playwright axe tests |
| F-1-47 | Retained honest ₹699 plan status without a dead purchase action. | `@claim:paid-pdf`; link crawl |
| F-1-48 | Retained exact license request privacy proof. | `@claim:license-privacy` |
| F-1-49 | Retained removal of unsupported setup promise. | README copy audit |
| F-1-50 | Retained consistent browser-storage wording. | `@claim:local-only`; `@claim:paid-pdf` |
| F-1-51 | Retained exact readable-backup behavior. | `@claim:plain-backup` |
| F-1-52 | Retained encrypted-backup behavior and passphrase protection. | `@claim:encrypted-backup` |
| F-1-53 | Retained cautious data-removal guidance. | privacy page |
| F-1-54 | Retained offline behavior without a user-facing scope promise. | `@claim:offline-reload` |
| F-1-55 | Retained removal of every dead purchase link. | internal-link crawl |
| F-1-56 | Retained accurate license availability wording. | README and plan copy |
| F-1-57 | Retained no-secret source/build state. | clean-clone source/build scan |
| F-1-58 | Retained **Stored in this browser** and request privacy proof. | `@claim:local-only` |
| F-2-1 | Replaced the non-descriptive **Clear boundaries** eyebrow with **Limits and privacy**. | `site.spec.ts` copy regression; `.factory/copy-audit.md` |

## Round-2 verification

- `npm test`: 20 unit/contract tests passed.
- `npm run build`: passed and produced `dist/index.html`.
- `npm run test:e2e`: 52 tests passed across desktop and mobile.
- The new viewport/copy test confirms MOSS-118 intersects the initial viewport
  on desktop and mobile, the full PDF action label is present, and both removed
  phrases are absent.
- Clean-clone claim commands, live deployment, cold live check, accessibility,
  privacy, and offline evidence are recorded in `.factory/handoff.md`.
