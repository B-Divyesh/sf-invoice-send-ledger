# Perfection loop 1 — finding ledger

- Candidate repaired: `feedeb7c8e29c3c46b01adc387987359a48d5520`
- Review source: `518c8e3273382158b369c9fa5bb7ced22206ccb2`
- Work order: `invoice-send-ledger-polish-1`
- Live URL: <https://invoice-send-ledger.sociobot.in>

Every review finding is mapped below. Claim screenshots are in `.factory/evidence/`. The complete local browser run covers Chromium desktop and a 390 px phone viewport.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Replaced the metaphor with “Track when each client invoice was sent” and named freelancers and the four dates. | `site.spec.ts` root metadata/focus test; `local-verify/screenshot-mobile.png` |
| F-1-2 | Added one-click `/demo` and `?demo=1`, three samples, a persistent banner, reset, exit, separate IndexedDB, and separate license keys. Reset and exit clear demo-only state. | `@claim:demo-isolation`; `claim-demo-isolation.png`; `.factory/demo.md` |
| F-1-3 | Added `.factory/claims.json` with one matching tagged browser test for each of 14 claims. | `factory.test.ts` claim-registry test; all 14 registry commands pass |
| F-1-4 | Restore now preserves current sealed fields and export history in one transaction. | `@claim:sealed-restore`; `claim-sealed-restore.png` |
| F-1-5 | The complete backup is validated before writing: IDs, bounds, ISO dates, calendar dates, IANA zones, locks, PDFs, exports, and snapshot relationships. | `backup.test.ts` (10 cases); `@claim:backup-validation`; `claim-backup-validation.png` |
| F-1-6 | Removed the dead checkout action. The plan clearly states that new licenses are not for sale; no 404 purchase link is exposed. | `site.spec.ts` link crawl; cold live link crawl |
| F-1-7 | A token stays locked until a successful verdict; first-request failures cannot unlock PDF input or stored PDFs. | browser test “a first verification network failure…”; `@claim:paid-pdf` |
| F-1-8 | Added per-invoice revisions and atomic compare-before-write behavior with a visible conflict error. | `@claim:concurrent-write`; `claim-concurrent-write.png` |
| F-1-9 | All buttons and primary navigation targets are at least 44 × 44 CSS px in populated phone state. | browser test “routes, metadata, accessibility, focus, and 44px targets pass” |
| F-1-10 | Added one-year immutable caching for hashed JS, CSS, PDF reader, and worker assets; HTML and the service worker revalidate. | `factory.test.ts` host-config test; live asset header check |
| F-1-11 | Added response CSP, Permissions-Policy, nosniff, and Referrer-Policy headers. `frame-ancestors` exists only in the response CSP. | `factory.test.ts` host-config test; live response-header check |
| F-1-12 | Added a ceramic-styled 404 document and host response override with a true 404 status. | `site.spec.ts` 404 shell test; `site-404.html.png`; live missing-path check |
| F-1-13 | `/demo` is a distinct deep link with demo title, canonical, focus, announcement, and isolated data. | `site.spec.ts` root/demo navigation test; `@claim:demo-isolation` |
| F-1-14 | Repaired all eight carried findings: restore locks, validation, checkout, license verification, concurrency, targets, caching, and headers. | Evidence for F-1-4 through F-1-11 |
| F-1-15 | Added canonical, Open Graph, Twitter, SVG favicon, 180 px touch icon, and an original 1200 × 630 social image to app and legal routes. | `site.spec.ts`; `identify` dimensions; live head check |
| F-1-16 | Added `robots.txt`, `sitemap.xml`, and a valid Static Web Apps configuration. An explicit `/index.html` route lets the deployed service worker cache and install the shell. | `factory.test.ts`; live 200 and service-worker checks |
| F-1-17 | Added live invoice preview, three-step explanation, boundaries/privacy, and the exact PDF-plan price in the required order. | `local-verify/screenshot-desktop.png` and `screenshot-mobile.png` |
| F-1-18 | Unified app, legal, offline, and 404 shells with skip links, wordmark, nav, theme, footer, attribution, build ID, and h1 focus. | `site.spec.ts` legal/404 axe and focus tests |
| F-1-19 | Standardized user-facing terms: invoice date record, invoice, monthly CSV export, sealed date, demo, PDF storage plan. | `.factory/copy-audit.md`; repository copy search |
| F-1-20 | Added local PDF text extraction beside manual entry; extracted reference and amount remain editable and the PDF is not sent away. | `@claim:pdf-import`; `claim-pdf-import.png` |
| F-1-21 | Replaced the metaphorical h1 with the requested concrete job wording. | `.factory/copy-audit.md`; mobile screenshot |
| F-1-22 | Replaced “calm/private chronology” with the freelancer-specific sentence. | `.factory/copy-audit.md`; mobile screenshot |
| F-1-23 | Rewrote the date copy consistently and registered due-date and time-zone claims. | `@claim:due-date`, `@claim:time-zone` |
| F-1-24 | Removed the untested “No account” landing claim. | `.factory/copy-audit.md`; cold live copy check |
| F-1-25 | Replaced “No tracking” with concrete “No analytics or advertising” and tested all demo requests. | `@claim:local-only`; `claim-local-only.png` |
| F-1-26 | Scoped offline wording to after the first visit and proved an offline edit plus two reloads. | `@claim:offline-reload`; `claim-offline-reload.png` |
| F-1-27 | Replaced the slogan caption with a literal list of dates kept together. | `.factory/copy-audit.md`; mobile screenshot |
| F-1-28 | Replaced the metaphorical empty heading with “No invoices recorded yet.” | real-flow browser test; cold live copy check |
| F-1-29 | Rewrote the due instruction as an action and tested all six due rules. | `@claim:due-date`; `claim-due-date.png` |
| F-1-30 | Removed “Private by design.” | `.factory/copy-audit.md`; cold live copy check |
| F-1-31 | Replaced the broad claim with precise browser-storage wording and request-log proof. | `@claim:local-only`; privacy page |
| F-1-32 | Renamed “Your chronology” to “Recorded invoices.” | browser and screenshot checks |
| F-1-33 | Renamed “Issue register” to “Invoice date record.” | `.factory/copy-audit.md`; browser screenshots |
| F-1-34 | Renamed “Studio” to the action “View PDF storage plan.” | `@claim:paid-pdf`; link/control crawl |
| F-1-35 | Added the sample-data primary action, outcome note, and exactly three privacy/offline/price facts. | `@claim:demo-isolation`; `.factory/copy-audit.md`; mobile screenshot |
| F-1-36 | Rewrote the README introduction around the freelancer’s recording job. | README copy audit; `npm test` |
| F-1-37 | Split the workflow into short record, calculate, and export statements backed by claims. | `@claim:due-date`, `@claim:csv-export` |
| F-1-38 | Replaced audit jargon with concrete non-goals. | README and live boundaries section |
| F-1-39 | Replaced implementation jargon with browser-storage wording and removed unsupported account/sync marketing. | `@claim:local-only`; README check |
| F-1-40 | Replaced “timezone-tagged chronology” with plain date/time-zone wording. | `@claim:time-zone`; `claim-time-zone.png` |
| F-1-41 | Explained and tested same-day, 7, 14, 30, 45, and 60-day terms. | `@claim:due-date` loops over all six rules |
| F-1-42 | Removed the unregistered search/filter feature claim from README. | README copy search |
| F-1-43 | Explained monthly CSV sealing and fixed restore so it remains true. | `@claim:csv-export`, `@claim:sealed-restore` |
| F-1-44 | Rewrote backup copy in plain words and separately proved readable and encrypted backups, including PDFs. | `@claim:plain-backup`, `@claim:encrypted-backup`, `@claim:paid-pdf` |
| F-1-45 | Replaced PWA jargon with scoped offline wording. | `@claim:offline-reload` |
| F-1-46 | Removed the unregistered accessibility feature list; accessibility is verified directly in both themes and viewports. | Playwright axe tests; 0 serious/critical violations |
| F-1-47 | Rewrote the price in two sentences, removed the broken purchase action, and tested verified-license PDF behavior. | `@claim:paid-pdf`; live plan check |
| F-1-48 | Limited README wording to license verification and tested its exact outgoing URL and query. | `@claim:license-privacy`; `claim-license-privacy.png` |
| F-1-49 | Removed the untested environment/external-services claim. | README copy check |
| F-1-50 | Standardized the browser-storage wording and covered invoice/PDF behavior in the claims registry. | `@claim:local-only`, `@claim:paid-pdf` |
| F-1-51 | Used the exact control labels and proved the downloaded plain JSON schema and contents. | `@claim:plain-backup`; `claim-plain-backup.png` |
| F-1-52 | Split encryption wording and tested AES-256-GCM metadata, hidden invoice text, absent passphrase, and restore. | `@claim:encrypted-backup`; `claim-encrypted-backup.png` |
| F-1-53 | Replaced the overbroad clearing claim with cautious browser guidance on the privacy page. | privacy page copy check |
| F-1-54 | Removed the user-facing service-worker-scope claim; root registration is exercised by the offline test. | `@claim:offline-reload` |
| F-1-55 | Removed the dead checkout target and every visible purchase link. | `site.spec.ts` link crawl; live link crawl |
| F-1-56 | Removed the misleading claim that registration was complete and states current sales availability directly. | README and plan copy check |
| F-1-57 | Removed the untested repository-secret claim. No provider credential is present in source or built output. | source/build secret scan |
| F-1-58 | Changed the status to “Stored in this browser” and included it in same-origin request proof. | `@claim:local-only`; mobile screenshot |

## Local verification summary

- `npm run check`: 20 unit/contract tests and 50 browser tests pass.
- Browser matrix: Chromium desktop plus Pixel 5 / 390 px; no console errors.
- Axe: zero serious or critical findings on app, demo, privacy, terms, and 404; light and dark app themes checked.
- Lighthouse mobile on `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.51 s, CLS 0.019, TBT 28 ms.
- Initial app JS: 18.15 KB gzip; CSS: 5.94 KB gzip; hero image: 33.17 KB.
- Clean-clone claim commands and deployed checks are recorded in `.factory/handoff.md`.

## Deployed verification

- Cold `/`, `/demo`, `/?demo=1`, `/privacy/`, `/terms/`, `robots.txt`, `sitemap.xml`, and the manifest return 200.
- A cold unknown path returns HTTP 404 with “This page does not exist” and a working home link.
- Root and legal loads produce no console errors. The expected browser network entry occurs only when deliberately opening the HTTP 404.
- The demo shows three samples, hides a real test record, focuses its h1, uses the demo canonical, and makes zero off-origin requests.
- The deployed service worker activates at scope `/`; the three demo records remain available after a cold offline reload.
- Live axe has zero serious or critical findings. The 390 px page has no horizontal overflow and tested controls are at least 44 × 44 px.
- Live Lighthouse on `/demo`: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.13 s, CLS 0.075, TBT 32 ms.
- Live evidence: `.factory/evidence/live/demo-desktop.png`, `demo-mobile.png`, `404-desktop.png`, `verify.json`, and `lighthouse.json`.
