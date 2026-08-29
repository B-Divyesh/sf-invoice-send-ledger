# Adversarial first-read review 3 — FAIL

- Product: Send-Date Ledger
- Live URL: <https://invoice-send-ledger.sociobot.in>
- Reviewed: 29 August 2026 UTC
- Repository revision: af10d0270df195f220df8d13d2535929103134cb
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; separate clean clone

## Verdict

**FAIL.** One minor finding remains. All functional, demo, routing, privacy, and accessibility checks below pass, but README includes a user-facing sales availability statement with no entry or tagged observable test in .factory/claims.json. The acceptance rule requires zero findings.

## Cold first read, before scrolling

At both widths, the first screen made all three required answers clear.

- What it does: records when a client invoice was drafted, issued, due, sent, and paid.
- For whom: freelancers who prepare invoices over time.
- What to click first: Try it with sample data; its adjacent text says it opens three sample invoices.

The evidence is the visible h1, “Track when each client invoice was sent,” the 15-word audience sentence, and the primary action. No blocking first-read finding applies. At 390 px the primary action is fully visible without scrolling; at desktop the same content sits beside the original ceramic-ledger image.

## Findings

| ID | Severity | Exact quote / location | Why this is a finding | Concrete fix |
|---|---|---|---|---|
| F-3-1 | Minor | README, What it does: “New licenses are not for sale.” | This is a concrete availability claim a prospective buyer can rely on. No .factory/claims.json item names it, and no @claim: test proves it. paid-pdf proves license-gated PDF storage, not the absence of sales. | Remove it, or replace it with the narrower observable “No purchase link is available in this app.” Add a new-license-sales registry entry and tagged browser test that verifies no purchase/checkout link or control is exposed. |

## Demo and sandbox

The live root action reached /demo in one click. Its first 390 × 844 screen already contained the populated MOSS-118 invoice slip (top 653.61px, intersecting the viewport), not a marketing-only page.

| Check | Result |
|---|---|
| Persistent banner | Present: “Demo — sample data, nothing is saved” |
| Seed data | Three realistic records: MOSS-118, ACME-1048, NORTH-026 |
| Demo isolation | Demo contains no ordinary record; returning to / contained zero sample slips |
| Reset demo | Restored exactly three sample slips |
| Start for real | Cleared the demo and opened the separate empty real ledger |
| Outgoing requests during root → demo → reset → exit | Same origin only |
| Console errors during flow | None |

Code inspection confirms the separation: src/db.ts selects demo:send-date-ledger only for /demo or ?demo=1, and resetDemoData rejects ordinary mode. src/app.ts clears demo data and demo: local-storage keys before navigating to the real ledger. This is a real sandbox, not a visual-only demo state.

## Claims and clean-clone checks

In /tmp/invoice-send-ledger-review3, cloned from the reviewed revision:

~~~
npm ci                         PASS
npm test                       PASS — 20 tests
npm run build                  PASS — dist/ produced
npm run test:e2e               PASS — 52 tests
~~~

Each registered command was then run exactly from that clean clone. All passed: demo-isolation, due-date, time-zone, csv-export, sealed-restore, backup-validation, offline-reload, local-only, encrypted-backup, plain-backup, paid-pdf, license-privacy, pdf-import, and concurrent-write.

The offline claim test uses a freshly visited demo, switches the context offline, reloads, edits, and reloads again. The local-only claim records demo requests. The PDF, backup, restore, export, IANA-zone, and stale-tab claims exercise observable outcomes rather than merely checking for controls.

All claim-like landing statements map to an existing registry entry: local-only, offline-reload, paid-pdf, pdf-import, due-date, csv-export, sealed-restore, or demo-isolation. README has the one exception in F-3-1.

## Copy audit

Counts treat hyphenated terms, paths, and version tokens as one word. There are no landing or README sentences over 22 words. No banned marketing adjective, unexplained mood heading, inconsistent product term, or non-result-naming landing button was found. The single copy finding is F-3-1 because it is an unlisted claim, not because of its length.

### Landing-page sentences

| # | Sentence | Words | Check |
|---:|---|---:|---|
| 1 | Stored in this browser | 4 | local-only/offline |
| 2 | Track when each client invoice was sent | 7 | concrete h1 |
| 3 | For freelancers who prepare invoices over time and need reliable issued, sent, due, and paid dates. | 15 | audience and job |
| 4 | Opens three sample invoices | 4 | demo-isolation |
| 5 | No analytics or advertising | 4 | local-only request check |
| 6 | Edit offline after the first visit | 6 | offline-reload |
| 7 | Date record: free · PDF storage: ₹699 once | 8 | paid-pdf |
| 8 | Drafted, issued, due, sent, and paid dates stay together. | 9 | useful scope |
| 9 | No invoices recorded yet | 4 | useful empty state |
| 10 | Add the next invoice you are drafting, or record one already sent. | 12 | useful next step |
| 11 | Choose a due rule when you add it. | 8 | due-date |
| 12 | Enter the details or read them from a PDF in this browser. | 12 | pdf-import/local-only |
| 13 | Choose a due rule, then record when you issue, send, and get paid. | 13 | useful workflow |
| 14 | Download a monthly CSV. | 4 | csv-export |
| 15 | Dates in that export become sealed. | 6 | csv-export/sealed-restore |
| 16 | It does not create invoices, calculate tax, take payments, or replace accounting records. | 13 | concrete boundary |
| 17 | Invoice records stay in this browser. | 6 | local-only |
| 18 | The app sends no invoice data to a server. | 9 | local-only |
| 19 | Invoice date records, monthly CSV exports, and backups are free. | 10 | paid-pdf pricing scope |
| 20 | Adds local PDF storage and includes PDFs in backups. | 9 | paid-pdf |
| 21 | Record dates for invoices you create elsewhere. | 7 | useful scope |
| 22 | Ceramic artwork generated for this product with Azure OpenAI. | 9 | provenance confirmed in design.md |

Heading outline is meaningful: Invoice date record, Recorded invoices, How it works, What this does not do and where data stays, and Keep the sent PDF with its dates name their sections. Three steps, Limits and privacy, and PDF storage plan are supporting eyebrows rather than headings. Primary and secondary controls name results: Try it with sample data, Add invoice manually, Import invoice PDF, Back up or restore, Export monthly CSV, and View PDF storage plan.

### README sentences

| # | Sentence | Words |
|---:|---|---:|
| 1 | Send-Date Ledger helps freelancers record when an existing invoice was issued, sent, due, and paid. | 15 |
| 2 | It records invoice dates. | 4 |
| 3 | It does not create invoices, calculate tax, take payments, or replace accounting records. | 13 |
| 4 | Records drafted, issued, sent, due, and paid dates with their time zones. | 12 |
| 5 | Calculates due dates from same-day, 7, 14, 30, 45, or 60-day terms. | 12 |
| 6 | Reads invoice reference and amount from a PDF in your browser. | 11 |
| 7 | You can correct every imported field. | 6 |
| 8 | Exports a monthly CSV. | 4 |
| 9 | Dates included in that export become sealed against later edits. | 10 |
| 10 | Rejects invalid backups before changing any records. | 7 |
| 11 | Older backups cannot change sealed dates. | 6 |
| 12 | Downloads readable JSON or passphrase-encrypted backups. | 6 |
| 13 | Edits records offline after the first visit. | 7 |
| 14 | Stops a stale tab from overwriting a newer invoice date. | 10 |
| 15 | Invoice date records are free. | 5 |
| 16 | A ₹699 one-time plan adds PDF storage in this browser. | 10 |
| 17 | New licenses are not for sale. | 6 |
| 18 | Open /demo or /?demo=1. | 4 |
| 19 | Both load three realistic sample invoices in the separate demo:send-date-ledger database. | 12 |
| 20 | Select Reset demo to restore the original samples. | 8 |
| 21 | Select Start for real to discard demo changes and open the real database. | 13 |
| 22 | Use Node.js 20 or newer. | 5 |
| 23 | Playwright is pinned to 1.58.2. | 5 |
| 24 | Every product claim and its command is listed in .factory/claims.json. | 10 |
| 25 | Invoice records and PDFs use browser storage. | 7 |
| 26 | Demo records use a separate database and never open the real one. | 12 |
| 27 | Select Back up or restore, then Download plain JSON for a readable backup. | 13 |
| 28 | The encrypted option hides invoice text with a passphrase-derived AES-256-GCM key. | 11 |
| 29 | The app does not store the passphrase. | 7 |
| 30 | Keep it somewhere safe because it cannot be recovered. | 9 |
| 31 | Deploy dist/ as a static site. | 6 |
| 32 | The included host configuration supplies explicit routes, a 404 response, security headers, and immutable caching for hashed assets. | 18 |
| 33 | Valid existing licenses can be pasted into the PDF storage plan. | 11 |
| 34 | Verification sends only the token to Sociobot and reuses a successful result for one day. | 15 |

## Structure, privacy, accessibility, and leverage

The live HTTP checks returned 200 for /, /demo, /?demo=1, /privacy/, /terms/, /404.html, /offline.html, robots.txt, sitemap.xml, and the manifest. An unknown path returned a real 404. /demo response headers include the response CSP with frame-ancestors 'none', Permissions-Policy, nosniff, and Referrer-Policy.

The browser suite confirms one h1, titles, description, canonical URL, Open Graph/Twitter image, lang=en, skip links, shared header/footer, h1 focus on route load and back navigation, link crawl, phone target sizes, no phone overflow, and no serious or critical axe violation. Live root and demo flows produced no console errors. The ceramic palette, serif date type, asymmetric sheet geometry, and original image match .factory/design.md and are not a generic SaaS template.

The brief calls for a local chronology guardrail, not generative assistance. Editable local PDF import and monthly CSV export provide the implied import/export leverage. No decorative runtime AI feature or provider key was found.

## Earlier-history retest

I read review-1.md, review-2.md, polish-1.md, polish-2.md, and the previous handoff. “PASS” below means the live behavior and relevant current source/test were checked again, not merely that a prior document marked it fixed.

| Earlier finding | Result | Current evidence |
|---|---|---|
| F-1-1 | PASS | Cold h1, audience, and CTA are explicit. |
| F-1-2 | PASS | MOSS-118 intersects initial phone demo viewport. |
| F-1-3 | PASS | 14 registered commands pass from clean clone. |
| F-1-4 | PASS | sealed-restore passes; merge preserves locked dates. |
| F-1-5 | PASS | backup-validation passes before data write. |
| F-1-6 | PASS | Link crawl finds no checkout or dead purchase link. |
| F-1-7 | PASS | paid-pdf verifies a license before storage. |
| F-1-8 | PASS | concurrent-write retains the newer date. |
| F-1-9 | PASS | Browser suite checks 44 px phone targets. |
| F-1-10 | PASS | Host configuration has immutable hashed-asset caching. |
| F-1-11 | PASS | Live CSP and security response headers present. |
| F-1-12 | PASS | Unknown path is designed 404 with return link. |
| F-1-13 | PASS | /demo has its own URL, title, canonical, focus. |
| F-1-14 | PASS | The eight original handoff defects remain covered by F-1-4–11. |
| F-1-15 | PASS | Route metadata, social art, and icons are present. |
| F-1-16 | PASS | robots, sitemap, host routes, and manifest return successfully. |
| F-1-17 | PASS | Preview, workflow, limits, and price sections exist. |
| F-1-18 | PASS | Shared accessible shells and legal links are present. |
| F-1-19 | PASS | All current UI uses “PDF storage plan.” |
| F-1-20 | PASS | pdf-import confirms editable local extraction. |
| F-1-21 | PASS | Concrete headline remains. |
| F-1-22 | PASS | Freelancer-specific first-screen sentence remains. |
| F-1-23 | PASS | Date wording and due/time-zone claims remain tested. |
| F-1-24 | PASS | Unsupported no-account promise is absent. |
| F-1-25 | PASS | Local-only request recording covers first-screen privacy fact. |
| F-1-26 | PASS | Offline language is scoped after first visit and tested. |
| F-1-27 | PASS | Image caption names the dates it depicts. |
| F-1-28 | PASS | Empty state names what is missing and next step. |
| F-1-29 | PASS | Due-rule instruction is action-based and tested. |
| F-1-30 | PASS | Removed privacy slogan remains absent. |
| F-1-31 | PASS | Browser-storage wording is specific and request-tested. |
| F-1-32 | PASS | “Recorded invoices” remains the ledger label. |
| F-1-33 | PASS | “Invoice date record” terminology remains consistent. |
| F-1-34 | PASS | Header says “View PDF storage plan.” |
| F-1-35 | PASS | Root has sample CTA, outcome text, and three facts. |
| F-1-36 | PASS | README opening is concrete. |
| F-1-37 | PASS | README workflow is short and claim-backed. |
| F-1-38 | PASS | Non-goals are plain and concrete. |
| F-1-39 | PASS | No unsupported account/sync marketing remains. |
| F-1-40 | PASS | Time-zone wording is plain and tested. |
| F-1-41 | PASS | All six due rules are listed and tested. |
| F-1-42 | PASS | Unsupported search/filter marketing is absent. |
| F-1-43 | PASS | Export sealing and restore protection are tested. |
| F-1-44 | PASS | Plain and encrypted backup paths are tested. |
| F-1-45 | PASS | PWA jargon is absent from visitor copy. |
| F-1-46 | PASS | Axe browser suite passes the required routes. |
| F-1-47 | PASS | ₹699 wording has no dead purchase action. |
| F-1-48 | PASS | License request scope is tested. |
| F-1-49 | PASS | Unsupported setup claim is absent. |
| F-1-50 | PASS | Browser-storage terminology is consistent. |
| F-1-51 | PASS | Plain backup contents are tested. |
| F-1-52 | PASS | Encrypted backup and passphrase behavior are tested. |
| F-1-53 | PASS | Data-removal guidance is cautious. |
| F-1-54 | PASS | No unsupported service-worker-scope claim remains. |
| F-1-55 | PASS | No checkout target is exposed. |
| F-1-56 | PASS | Availability language is honest, subject to new F-3-1 claim-registry gap. |
| F-1-57 | PASS | No provider credential claim or exposed key found. |
| F-1-58 | PASS | “Stored in this browser” remains current state copy. |
| F-2-1 | PASS | “Limits and privacy” replaces “Clear boundaries.” |

## What would make this perfect

Resolve F-3-1 by removing the unregistered sales statement or turning it into an exact, observable claim with a tagged test. Then rerun the clean-clone claim commands and the full browser suite. No other product, usability, or structure change is identified in this round.

