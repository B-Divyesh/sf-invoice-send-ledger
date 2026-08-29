# Adversarial first-read review 7 — PASS

- Product: Send-Date Ledger
- Live URL: <https://invoice-send-ledger.sociobot.in>
- Reviewed: 29 August 2026 UTC
- Candidate: `7a66aeffeaf3080328e3edccfe8e866ba4687477`
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; separate clean clone

## Verdict

**PASS.** No blocking or minor findings remain. The first screen is clear, the
sample path is one click and isolated, every registered claim passes from a
clean clone, all public claim-like landing and README statements are listed,
and the live structure, links, accessibility, privacy, and offline behavior
pass direct checks.

## Cold first read

Before scrolling, both fresh viewports answer all three required questions.

- What it does: records when a client invoice was sent, with issued, due, and
  paid dates named in the supporting sentence.
- For whom: freelancers who prepare invoices over time.
- What to click first: **Try it with sample data**; the adjacent text says
  **Opens three sample invoices**.

The exact first-screen copy is “Track when each client invoice was sent” and
“For freelancers who prepare invoices over time and need reliable issued,
sent, due, and paid dates.” At 390 px, the action and all three facts end at
y=758 inside the 844 px viewport. At desktop width, the same content and the
ceramic artwork are visible without scrolling.

## Copy audit

Counts treat hyphenated terms and file/path/version tokens as one word. The
tables include prose plus meaningful headings and controls. No sentence exceeds
22 words. No banned marketing adjective, metaphor or mood heading, inconsistent
product term, or non-result-naming action remains. Technical names in the
README occur only in run, file-format, or encryption documentation and their
effect is stated in plain words.

### Live landing page

| # | Exact copy | Words | Result |
|---:|---|---:|---|
| 1 | Skip to ledger | 3 | Pass: names the destination. |
| 2 | Send-Date Ledger | 2 | Pass: product name. |
| 3 | Demo | 1 | Pass: navigation destination. |
| 4 | Privacy | 1 | Pass: navigation destination. |
| 5 | Switch to dark theme | 4 | Pass: accessible action name. |
| 6 | Stored in this browser | 4 | Pass: `local-only`, `offline-reload`. |
| 7 | Track when each client invoice was sent | 7 | Pass: job-first h1. |
| 8 | For freelancers who prepare invoices over time and need reliable issued, sent, due, and paid dates. | 16 | Pass: user and outcome are explicit. |
| 9 | Try it with sample data | 5 | Pass: result-naming primary action. |
| 10 | Opens three sample invoices | 4 | Pass: `demo-isolation`. |
| 11 | Add invoice manually | 3 | Pass: result-naming action. |
| 12 | Import invoice PDF | 3 | Pass: `pdf-import`. |
| 13 | Back up or restore | 4 | Pass: names both available results. |
| 14 | No analytics or advertising | 4 | Pass: `local-only` request log and source check. |
| 15 | Edit offline after the first visit | 6 | Pass: `offline-reload`. |
| 16 | Attach PDFs up to 10 MB | 6 | Pass: `pdf-storage`. |
| 17 | Drafted, issued, due, sent, and paid dates stay together. | 9 | Pass: literal scope. |
| 18 | Invoice date record | 3 | Pass: stable product term. |
| 19 | Recorded invoices | 2 | Pass: names the section. |
| 20 | Export monthly CSV | 3 | Pass: `csv-export`. |
| 21 | No invoices recorded yet | 4 | Pass: direct empty-state heading. |
| 22 | Add the next invoice you are drafting, or record one already sent. | 12 | Pass: gives the next step. |
| 23 | Choose a due rule when you add it. | 8 | Pass: `due-date`. |
| 24 | Add your first invoice | 4 | Pass: result-naming action. |
| 25 | Three steps | 2 | Pass: informative section label. |
| 26 | How it works | 3 | Pass: required workflow heading. |
| 27 | Record the invoice | 3 | Pass: action heading. |
| 28 | Enter the details or read them from a PDF in this browser. | 12 | Pass: `pdf-import`, `local-only`. |
| 29 | Add each date | 3 | Pass: action heading. |
| 30 | Choose a due rule, then record when you issue, send, and get paid. | 13 | Pass: `due-date`. |
| 31 | Export the month | 3 | Pass: action heading. |
| 32 | Download a monthly CSV. | 4 | Pass: `csv-export`. |
| 33 | Dates in that export become sealed. | 6 | Pass: `csv-export`, `sealed-restore`. |
| 34 | Limits and privacy | 3 | Pass: names the section. |
| 35 | What this does not do and where data stays | 9 | Pass: names both section subjects. |
| 36 | It does not create invoices, calculate tax, take payments, or replace accounting records. | 13 | Pass: concrete non-goals. |
| 37 | Invoice records stay in this browser. | 6 | Pass: `local-only`, `offline-reload`. |
| 38 | The app sends no invoice data to a server. | 9 | Pass: `local-only`. |
| 39 | Invoice PDF | 2 | Pass: names the section. |
| 40 | Keep the original PDF with its dates | 7 | Pass: names the section outcome. |
| 41 | Attach an invoice PDF in this browser. | 7 | Pass: `pdf-storage`. |
| 42 | Up to 10 MB | 4 | Pass: `pdf-storage`. |
| 43 | Included in plain and encrypted backups. | 6 | Pass: `pdf-storage`. |
| 44 | Record dates for invoices you create elsewhere. | 7 | Pass: useful footer summary. |
| 45 | Built by Param Factory · build polish-6 | 6 | Pass: required maker and build identity. |
| 46 | Invoice date record loaded. | 4 | Pass: concise route announcement. |

### README

| # | Exact sentence | Words | Result |
|---:|---|---:|---|
| 1 | Send-Date Ledger helps freelancers record when an existing invoice was issued, sent, due, and paid. | 15 | Pass. |
| 2 | It records invoice dates. | 4 | Pass. |
| 3 | It does not create invoices, calculate tax, take payments, or replace accounting records. | 13 | Pass. |
| 4 | Records drafted, issued, sent, due, and paid dates with their time zones. | 12 | Pass: `time-zone`. |
| 5 | Calculates due dates from same-day, 7, 14, 30, 45, or 60-day terms. | 12 | Pass: `due-date`. |
| 6 | Reads invoice reference and amount from a PDF in your browser. | 11 | Pass: `pdf-import`. |
| 7 | You can correct every imported field. | 6 | Pass: `pdf-import`. |
| 8 | Exports a monthly CSV. | 4 | Pass: `csv-export`. |
| 9 | Dates included in that export become sealed against later edits. | 10 | Pass: `csv-export`, `sealed-restore`. |
| 10 | Rejects invalid backups before changing any records. | 7 | Pass: `backup-validation`. |
| 11 | Older backups cannot change sealed dates. | 6 | Pass: `sealed-restore`. |
| 12 | Downloads readable JSON or passphrase-encrypted backups. | 6 | Pass: `plain-backup`, `encrypted-backup`. |
| 13 | Edits records offline after the first visit. | 7 | Pass: `offline-reload`. |
| 14 | Stops a stale tab from overwriting a newer invoice date. | 10 | Pass: `concurrent-write`. |
| 15 | Attaches invoice PDFs up to 10 MB in browser storage and both backup formats. | 14 | Pass: `pdf-storage`. |
| 16 | Open `/demo` or `/?demo=1`. | 4 | Pass: `demo-isolation`. |
| 17 | Both load three realistic sample invoices in the separate `demo:send-date-ledger` database. | 11 | Pass: `demo-isolation`. |
| 18 | Select Reset demo to restore the original samples. | 8 | Pass: `demo-isolation`. |
| 19 | Select Start for real to discard demo changes and open the real database. | 13 | Pass: `demo-isolation`. |
| 20 | Use Node.js 20.19+ or 22.12+. | 5 | Pass: matches `package.json#engines`. |
| 21 | Playwright is pinned to 1.58.2. | 5 | Pass: package and lock file match. |
| 22 | Every product claim and its command is listed in `.factory/claims.json`. | 10 | Pass: registry contract test. |
| 23 | Invoice records and PDFs use browser storage. | 7 | Pass: `local-only`, `pdf-storage`. |
| 24 | Demo records use a separate database and never open the real one. | 12 | Pass: `demo-isolation`. |
| 25 | Select Back up or restore, then Download plain JSON for a readable backup. | 13 | Pass: `plain-backup`. |
| 26 | The encrypted option hides invoice text with a passphrase-derived AES-256-GCM key. | 11 | Pass: the effect is plain; `encrypted-backup` proves the named format and hidden text. |
| 27 | The app does not store the passphrase. | 7 | Pass: `encrypted-backup`. |
| 28 | Keep it somewhere safe because it cannot be recovered. | 9 | Pass: actionable consequence of non-storage. |
| 29 | Deploy `dist/` as a static site. | 6 | Pass: build produces the named directory. |
| 30 | The included host configuration supplies explicit routes, a 404 response, security headers, and immutable caching for hashed assets. | 18 | Pass: precise deployer documentation, verified in source and live headers. |
| 31 | MIT — see `LICENSE`. | 3 | Pass: file exists and contains the MIT license. |

README headings—**What it does**, **Try the isolated demo**, **Run locally**,
**Test and build**, **Data and backups**, **Deployment**, **Product records**,
and **License**—all name their sections. Named controls are result-oriented.

## Demo and sandbox

The root action reaches `/demo` in one click. MOSS-118 begins at y=654 in the
390 × 844 viewport and y=469 in the 1440 × 900 viewport. The first screen
therefore already shows a real-looking record: Moss & Finch Studio, ₹46,500,
three dated events in Asia/Kolkata, Net 30, a missing sent date, and **Record
sent**.

The persistent banner reads “Demo — sample data, nothing is saved” and
“Changes stay separate from your invoice records.” It includes **Reset demo**
and **Start for real**. A fresh live-context test created `R7-REAL-KEEP` in the
real database, confirmed it was absent from demo, changed and reset MOSS-118,
then returned to the retained real record; no sample record appeared in real
mode. Code selects `demo:send-date-ledger` and `send-date-ledger` as separate
IndexedDB databases and clears demo-only state on exit.

The complete live edit/reset/offline flow made no off-origin request. After
service-worker readiness, `/demo` reloaded offline with all three invoices and
reported “Offline · changes still save.” No console or page error occurred.

## Claims

The repository contains 13 claims. Each exact command from
`.factory/claims.json` ran separately in a clean clone at candidate `7a66aef`.

| Claim | Result | Observable evidence |
|---|---|---|
| `demo-isolation` | PASS | Real record stayed separate; reset and exit restored the expected databases. |
| `due-date` | PASS | Same-day, 7, 14, 30, 45, and 60-day rules produced exact dates. |
| `time-zone` | PASS | Asia/Kolkata remained visible beside every recorded sample date. |
| `csv-export` | PASS | August CSV contained one header plus three rows and sealed all three invoices. |
| `sealed-restore` | PASS | Restoring an older backup left exported dates disabled and unchanged. |
| `backup-validation` | PASS | An invalid IANA zone was rejected before any record changed. |
| `offline-reload` | PASS | Demo reloaded, accepted an edit, and retained it offline. |
| `local-only` | PASS | The demo edit and backup request log contained only same-origin URLs. |
| `encrypted-backup` | PASS | Ciphertext hid invoice text and the passphrase, then restored locally. |
| `plain-backup` | PASS | JSON contained all invoices and monthly CSV history. |
| `pdf-storage` | PASS | The 10 MB limit, browser persistence, both backup formats, restore, and open behavior passed. |
| `pdf-import` | PASS | Local PDF extraction populated editable reference and amount fields. |
| `concurrent-write` | PASS | A stale tab could not erase a newer sent date. |

All claim-like landing and README sentences map to these entries or are
direct operational facts checked by the clean build. No listed test failed and
no unlisted product claim remains.

## Structure, routing, accessibility, and identity

- `/` uses `Send-Date Ledger — track invoice send dates`; `/demo`, `/privacy/`,
  `/terms/`, `/404.html`, and `/offline.html` use distinct route titles.
- Every checked route has `lang="en"`, one h1, one main landmark, a description,
  canonical, Open Graph and Twitter metadata, SVG favicon, touch icon, shared
  header/footer, Privacy/Terms links, and `build polish-6`.
- H1 focus passes after direct loads and back navigation. The live route
  announcer is present. A missing path returns the designed ceramic 404 with
  HTTP 404.
- The complete cross-route link crawl returned 200 for every internal link;
  the only external links are explicit privacy/support `mailto:` links.
- Live response headers include CSP with response-header `frame-ancestors
  'none'`, Permissions-Policy, nosniff, HSTS, and strict-origin referrer policy.
  The current hashed JS and PDF worker return one-year immutable caching.
- Live Axe found zero serious or critical violations after reset settled. All
  visible mobile controls measured at least 44 × 44 CSS px, no horizontal
  overflow occurred, and the reduced-motion rules remain in both style sheets.
- `verify-url.sh` passed live root and demo: correct title, language, h1, main,
  image alternatives, labeled buttons, and no console errors.
- The current clean build and live `index.html`, main JS, CSS, PDF chunk, and
  PDF worker have matching SHA-256 hashes.
- The frost-blue ceramic still life, incised borders, asymmetric slab corners,
  serif date/reference type, and chronological slips match `.factory/design.md`
  and do not resemble a generic SaaS template.

`robots.txt`, `sitemap.xml`, the web manifest, and Static Web Apps configuration
are present. The sitemap lists all four indexable routes. The full clean-clone
browser suite also passed all desktop and 390 px tests.

## Earlier-finding verification

Every prior `review-*.md`, `polish-*.md`, and handoff was read. Each finding
below was checked against the current code plus the byte-matching live build;
claim-backed items were exercised again rather than accepted from prior notes.

| Earlier ID | Current verification | Result |
|---|---|---|
| F-1-1 | Job-first h1, freelancer sentence, and sample action answer all first-read questions. | Fixed |
| F-1-2 | One-click sample-first demo, isolation, banner, reset, and exit pass. | Fixed |
| F-1-3 | Thirteen registry entries each have one tagged observable test; all pass. | Fixed |
| F-1-4 | `sealed-restore` preserves exported dates. | Fixed |
| F-1-5 | `backup-validation` rejects the bad zone before writes. | Fixed |
| F-1-6 | No checkout or dead purchase link exists. | Fixed |
| F-1-7 | The removed license gate cannot unlock on a failed verification. | Fixed |
| F-1-8 | `concurrent-write` retains the newer date. | Fixed |
| F-1-9 | Live mobile controls are at least 44 px. | Fixed |
| F-1-10 | Current hashed assets use one-year immutable caching. | Fixed |
| F-1-11 | CSP and Permissions-Policy are live response headers. | Fixed |
| F-1-12 | Unknown live URL returns the styled HTTP 404. | Fixed |
| F-1-13 | `/demo` has its own title, canonical, focused h1, announcement, and history behavior. | Fixed |
| F-1-14 | Every original integrity, target, cache, header, and route defect was re-exercised. | Fixed |
| F-1-15 | Route metadata, social art, favicon, and touch icon are present. | Fixed |
| F-1-16 | Robots, sitemap, manifest, and host configuration are present and live. | Fixed |
| F-1-17 | Required preview, workflow, and limits remain; the unavailable paid tier is fully absent. | Fixed |
| F-1-18 | App, legal, 404, and offline shells share navigation, footer, focus, and build identity. | Fixed |
| F-1-19 | Terms remain consistent: invoice date record, invoice, monthly CSV export, sealed date, demo, invoice PDF. | Fixed |
| F-1-20 | `pdf-import` reads fields locally and leaves them editable. | Fixed |
| F-1-21 | The metaphorical headline remains replaced. | Fixed |
| F-1-22 | The audience sentence explicitly names freelancers. | Fixed |
| F-1-23 | Date names are consistent and due-date behavior passes. | Fixed |
| F-1-24 | Unsupported “No account” copy remains absent. | Fixed |
| F-1-25 | Narrow analytics/advertising copy has a clean request log and source check. | Fixed |
| F-1-26 | Offline wording remains scoped to after the first visit and passes. | Fixed |
| F-1-27 | The image caption names the five dates literally. | Fixed |
| F-1-28 | Empty state names the absence and next action. | Fixed |
| F-1-29 | Due-rule instruction and all six calculations pass. | Fixed |
| F-1-30 | “Private by design” remains absent. | Fixed |
| F-1-31 | Browser-storage wording remains precise and tested. | Fixed |
| F-1-32 | “Recorded invoices” remains the list heading. | Fixed |
| F-1-33 | “Invoice date record” remains the product term. | Fixed |
| F-1-34 | The obsolete Studio/PDF-plan control remains absent. | Fixed |
| F-1-35 | CTA, adjacent outcome, and three tested facts remain above the fold. | Fixed |
| F-1-36 | README opens with the direct freelancer job. | Fixed |
| F-1-37 | README workflow is split into short claim-backed statements. | Fixed |
| F-1-38 | Non-goals remain concrete and free of audit jargon. | Fixed |
| F-1-39 | Browser-storage wording replaces IndexedDB/account jargon. | Fixed |
| F-1-40 | Time zones are stated plainly and displayed by `time-zone`. | Fixed |
| F-1-41 | All six due terms are named and tested. | Fixed |
| F-1-42 | Unsupported search/filter marketing remains absent. | Fixed |
| F-1-43 | CSV sealing and older-backup protection both pass. | Fixed |
| F-1-44 | Plain and encrypted backup paths both pass. | Fixed |
| F-1-45 | Visitor copy avoids PWA/service-worker jargon. | Fixed |
| F-1-46 | Fresh live and clean-suite accessibility checks have no serious/critical failures. | Fixed |
| F-1-47 | Unsupported price and purchase copy remain absent; PDF storage is included and tested. | Fixed |
| F-1-48 | Billing/license network copy and its external request path remain absent. | Fixed |
| F-1-49 | README gives the exact supported Node ranges. | Fixed |
| F-1-50 | Record and PDF storage terminology remains consistent. | Fixed |
| F-1-51 | Named plain-JSON backup behavior passes. | Fixed |
| F-1-52 | Encryption, passphrase non-storage, and local restore pass. | Fixed |
| F-1-53 | Privacy page uses cautious browser-data removal guidance. | Fixed |
| F-1-54 | Unsupported service-worker scope copy remains absent. | Fixed |
| F-1-55 | Complete live crawl finds no dead checkout target. | Fixed |
| F-1-56 | Unsupported sales-availability copy remains absent. | Fixed |
| F-1-57 | Source/build scan and live request log expose no provider credential. | Fixed |
| F-1-58 | “Stored in this browser” remains the status wording. | Fixed |
| F-2-1 | “Limits and privacy” remains the descriptive section label. | Fixed |
| F-3-1 | “New licenses are not for sale” remains absent. | Fixed |
| F-4-1 | 404 and offline pages contain canonical, Open Graph, Twitter, and icon metadata. | Fixed |
| F-4-2 | Merchant/refund/revocation claims remain absent. | Fixed |
| F-5-1 | Unproved price/free/sale assertions remain absent. | Fixed |
| F-5-2 | Visitor-facing Azure provenance remains absent; internal provenance remains documented. | Fixed |
| F-6-1 | README and `package.json` use Node.js 20.19+ or 22.12+. | Fixed |

## Missed leverage

No missing obvious feature remains. The brief's high-value adjacent actions are
local PDF import, monthly CSV export, plain and encrypted backup, and offline
editing; each is implemented and claim-tested. Cloud sync would conflict with
the local-first boundary unless explicitly made optional. AI would add little
to deterministic date recording and local editable PDF extraction, so no AI
feature is warranted. No runtime model call, raw provider key, or decorative AI
surface exists.

## Verification summary

Clean clone at `7a66aef`:

- `npm ci`: PASS, 69 packages, 0 vulnerabilities reported.
- All 13 exact `.factory/claims.json` commands: PASS.
- `npm test`: PASS, 22 tests.
- `npm run build`: PASS; `dist/` produced; initial JS 16.62 KB gzip and CSS
  5.81 KB gzip. The PDF parser is deferred.
- `npm run test:e2e`: PASS, 48 tests across desktop and mobile.

Live checks:

- cold root and demo at 390 × 844 and 1440 × 900: PASS;
- demo isolation/reset/exit and offline reload: PASS;
- complete cross-route crawl and true 404: PASS;
- response headers, metadata, focus, 44 px targets, overflow, console, and Axe:
  PASS;
- `/opt/fleet/lib/verify-url.sh` on root and demo: PASS.

## What would make this perfect

Nothing remains to change from this review. Preserve the one-test-per-claim
contract, demo namespace separation, live-route crawl, and clean-clone browser
matrix on future changes.
