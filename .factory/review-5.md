# Adversarial first-read review 5 — FAIL

- Product: Send-Date Ledger
- Live URL: <https://invoice-send-ledger.sociobot.in>
- Reviewed: 29 August 2026 UTC
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; separate clean clone
- Candidate: `d46b0155135ea1393e0ea2eb0730c4db9ddf5e15`

## Verdict

**FAIL.** The core job is clear and tryable, and all listed claim commands
pass. Two visitor-facing assertions remain outside the claims contract. The
standard for PASS is zero findings.

## Cold first read

Before scrolling, both viewports answer all three required questions.

- **What it does:** records when a client invoice was drafted, issued, sent,
  due, and paid. The h1 is “Track when each client invoice was sent.”
- **For whom:** freelancers who prepare invoices over time.
- **What to click first:** “Try it with sample data”; the adjacent text says
  “Opens three sample invoices.”

No first-screen blocking finding applies. The phone screenshot was visually
checked: the CTA is fully visible and is a 44 px-or-larger result-naming
action. The desktop result is the same.

## Findings

| ID | Severity | Exact quote / location | Why this fails | Concrete fix |
|---|---|---|---|---|
| **F-5-1** | Minor | Landing first-screen fact: “Date record: free · PDF storage: ₹699 once”; price section: “Invoice date records, monthly CSV exports, and backups are free.” and “₹699 once”; README: “Invoice date records are free. A ₹699 one-time plan adds PDF storage in this browser.” | These are price and availability claims. `paid-pdf` verifies that the text `₹699 once` renders and that a cached verified license gates PDF storage; it does not verify that a new visitor can acquire a ₹699 license, be charged ₹699, or that the stated free features are available without charge. The product exposes no purchase path. A first-time visitor can reasonably read this as an available upgrade offer. | Until a real Sociobot billing flow is available and can be tested, remove the price/free offer copy and say only: “PDF storage requires a verified license.” If sales are enabled, add a registered `pdf-license-purchase` claim that verifies the displayed ₹699 amount and a successful licensed return through the Sociobot flow. |
| **F-5-2** | Minor | Landing footer: “Ceramic artwork generated for this product with Azure OpenAI.” | This is a factual provenance claim on the live page, but no entry in `.factory/claims.json` names it and no tagged test proves it. The source sidecar and design record are useful internal provenance, but they are not a sandbox claim test. | Remove the footer assertion and retain the full provenance in `.factory/design.md`; or add a deterministic provenance claim/test that checks the committed source asset and sidecar against the documented generator record. |

## Demo and sandbox verification

The root CTA reaches `/demo` in one click. In a fresh 390 px context, the
first product card, **MOSS-118**, starts in the initial viewport. It shows
Moss & Finch Studio, ₹46,500.00, real-looking dates, a due rule, an absent
sent date, and a concrete next action. The 1440 px context also shows the
sample ledger immediately.

The persistent banner reads “Demo — sample data, nothing is saved” and
“Changes stay separate from your invoice records.” **Reset demo** restores
MOSS-118 to its original unsent state. **Start for real** is present as a
link and routes to the real ledger. The live demo's initial request log
contained only the document and same-origin JS/CSS assets; there were no
console errors.

The clean-clone `@claim:demo-isolation` flow additionally created
`REAL-KEEP-001` in the real namespace, confirmed it was absent in `?demo=1`,
changed and reset MOSS-118, then returned to the real record. Current code in
`src/db.ts` uses distinct `send-date-ledger` and `demo:send-date-ledger`
IndexedDB names. This confirms demo actions do not read or write real records.

`@claim:offline-reload` exercises the demo after service-worker installation,
sets the browser offline, reloads, records a sent date, and reloads again.
`@claim:local-only` records all requests during demo editing and plain backup,
then asserts that every request is same-origin. Both commands passed from the
clean clone.

## Claims and clean-clone checks

Clean clone: `/tmp/invoice-send-ledger-review-5-Airs2f`.

| Check | Result |
|---|---|
| `npm ci` | Passed; 0 vulnerabilities reported. |
| `npm test` | Passed; 20 tests. |
| `npm run build` | Passed; `dist/` produced. Initial app JS is 18.26 KB gzip and CSS is 6.10 KB gzip. The PDF parser is a deferred chunk. |
| `npm run test:e2e` | Passed; 52 Playwright tests, including mobile, Axe, offline, routing, links, and privacy. |
| Every command in `.factory/claims.json` | Passed separately from the clean clone. |

The separately run registered commands were:
`demo-isolation`, `due-date`, `time-zone`, `csv-export`, `sealed-restore`,
`backup-validation`, `offline-reload`, `local-only`, `encrypted-backup`,
`plain-backup`, `paid-pdf`, `license-privacy`, `pdf-import`, and
`concurrent-write`. No registered test failed.

The claims registry covers the functional date, export, backup, concurrent
write, PDF extraction, license-verification, demo-isolation, offline, and
same-origin invoice-data assertions. F-5-1 and F-5-2 are coverage defects,
not failed registered commands.

## Copy audit

Word counts treat hyphenated paths, prices, and version tokens as one word.
All sentences are at or below 22 words. No banned marketing adjective,
metaphor heading, jargon-only heading, inconsistent product term, or
non-result-naming landing action was found. Rows marked with a finding are the
claims-contract exceptions above.

### Landing-page sentences

| # | Exact copy | Words | Result |
|---:|---|---:|---|
| 1 | Stored in this browser | 4 | Pass; `local-only` context. |
| 2 | Track when each client invoice was sent | 7 | Pass; concrete job headline. |
| 3 | For freelancers who prepare invoices over time and need reliable issued, sent, due, and paid dates. | 15 | Pass; audience and change are clear. |
| 4 | Try it with sample data | 5 | Pass; result-naming primary action. |
| 5 | Opens three sample invoices | 4 | Pass; states the immediate result. |
| 6 | No analytics or advertising | 4 | Pass; request-log coverage. |
| 7 | Edit offline after the first visit | 6 | Pass; `offline-reload`. |
| 8 | Date record: free · PDF storage: ₹699 once | 8 | **F-5-1.** Untested price/availability assertion. |
| 9 | Drafted, issued, due, sent, and paid dates stay together. | 9 | Pass; literal artwork caption. |
| 10 | No invoices recorded yet | 4 | Pass; clear empty state. |
| 11 | Add the next invoice you are drafting, or record one already sent. | 12 | Pass; concrete next step. |
| 12 | Choose a due rule when you add it. | 8 | Pass; `due-date`. |
| 13 | Enter the details or read them from a PDF in this browser. | 12 | Pass; `pdf-import`. |
| 14 | Choose a due rule, then record when you issue, send, and get paid. | 13 | Pass; `due-date`. |
| 15 | Download a monthly CSV. | 4 | Pass; `csv-export`. |
| 16 | Dates in that export become sealed. | 6 | Pass; `csv-export` and `sealed-restore`. |
| 17 | It does not create invoices, calculate tax, take payments, or replace accounting records. | 13 | Pass; plain scope boundary. |
| 18 | Invoice records stay in this browser. | 6 | Pass; `local-only` context. |
| 19 | The app sends no invoice data to a server. | 9 | Pass; `local-only`. |
| 20 | Invoice date records, monthly CSV exports, and backups are free. | 10 | **F-5-1.** Untested price/availability assertion. |
| 21 | Adds local PDF storage and includes PDFs in backups. | 9 | Pass; `paid-pdf`. |
| 22 | Record dates for invoices you create elsewhere. | 7 | Pass; concise product scope. |
| 23 | Ceramic artwork generated for this product with Azure OpenAI. | 9 | **F-5-2.** No registered claim/test. |

Landing headings work out of context: **Invoice date record**, **Recorded
invoices**, **How it works**, **What this does not do and where data stays**,
and **Keep the sent PDF with its dates**. The visible actions name their
results: **Try it with sample data**, **Add invoice manually**, **Import
invoice PDF**, **Back up or restore**, **Export monthly CSV**, and **View PDF
storage plan**.

### README sentences

| # | Exact copy | Words | Result |
|---:|---|---:|---|
| 1 | Send-Date Ledger helps freelancers record when an existing invoice was issued, sent, due, and paid. | 15 | Pass. |
| 2 | It records invoice dates. | 4 | Pass. |
| 3 | It does not create invoices, calculate tax, take payments, or replace accounting records. | 13 | Pass. |
| 4 | Records drafted, issued, sent, due, and paid dates with their time zones. | 12 | Pass; `time-zone`. |
| 5 | Calculates due dates from same-day, 7, 14, 30, 45, or 60-day terms. | 12 | Pass; `due-date`. |
| 6 | Reads invoice reference and amount from a PDF in your browser. | 11 | Pass; `pdf-import`. |
| 7 | You can correct every imported field. | 6 | Pass; `pdf-import`. |
| 8 | Exports a monthly CSV. | 4 | Pass; `csv-export`. |
| 9 | Dates included in that export become sealed against later edits. | 10 | Pass; `csv-export` and `sealed-restore`. |
| 10 | Rejects invalid backups before changing any records. | 7 | Pass; `backup-validation`. |
| 11 | Older backups cannot change sealed dates. | 6 | Pass; `sealed-restore`. |
| 12 | Downloads readable JSON or passphrase-encrypted backups. | 6 | Pass; backup claim tests. |
| 13 | Edits records offline after the first visit. | 7 | Pass; `offline-reload`. |
| 14 | Stops a stale tab from overwriting a newer invoice date. | 10 | Pass; `concurrent-write`. |
| 15 | Invoice date records are free. | 5 | **F-5-1.** Untested price/availability assertion. |
| 16 | A ₹699 one-time plan adds PDF storage in this browser. | 10 | **F-5-1.** Untested acquisition/price assertion. |
| 17 | Open `/demo` or `/?demo=1`. | 4 | Pass; live routes verified. |
| 18 | Both load three realistic sample invoices in the separate `demo:send-date-ledger` database. | 12 | Pass; `demo-isolation`. |
| 19 | Select Reset demo to restore the original samples. | 8 | Pass; manual and claim-flow verification. |
| 20 | Select Start for real to discard demo changes and open the real database. | 13 | Pass; `demo-isolation`. |
| 21 | Use Node.js 20 or newer. | 5 | Pass; local run completed on Node 22. |
| 22 | Playwright is pinned to 1.58.2. | 5 | Pass; package lock and clean clone. |
| 23 | Every product claim and its command is listed in `.factory/claims.json`. | 10 | **F-5-2 context.** The listed functional claims are present, but live provenance is omitted from the registry. |
| 24 | Invoice records and PDFs use browser storage. | 7 | Pass; local-only/demo behavior. |
| 25 | Demo records use a separate database and never open the real one. | 12 | Pass; `demo-isolation`. |
| 26 | Select Back up or restore, then Download plain JSON for a readable backup. | 13 | Pass; `plain-backup`. |
| 27 | The encrypted option hides invoice text with a passphrase-derived AES-256-GCM key. | 11 | Pass; `encrypted-backup`. |
| 28 | The app does not store the passphrase. | 7 | Pass; `encrypted-backup`. |
| 29 | Keep it somewhere safe because it cannot be recovered. | 9 | Pass; useful recovery warning. |
| 30 | Deploy dist/ as a static site. | 6 | Pass; build output verified. |
| 31 | The included host configuration supplies explicit routes, a 404 response, security headers, and immutable caching for hashed assets. | 18 | Pass; source and live headers verified. |
| 32 | Valid existing licenses can be pasted into the PDF storage plan. | 11 | Pass; `paid-pdf` and `license-privacy`. |
| 33 | Verification sends only the token to Sociobot and reuses a successful result for one day. | 15 | Pass; `license-privacy`. |

## Structure, routing, accessibility, and leverage

- Live `/`, `/demo`, `/?demo=1`, `/privacy/`, `/terms/`, `/404.html`,
  `/offline.html`, `/robots.txt`, `/sitemap.xml`, and the manifest return 200.
  An unknown route returns the designed 404 with HTTP 404.
- Browser-rendered `/demo` has `Demo — Send-Date Ledger`, one focused h1,
  route-specific canonical metadata, and an aria-live route announcement.
  Back returns to the focused root h1.
- Root, legal, offline, and 404 pages have one h1, a main landmark, canonical,
  OG/Twitter metadata, product favicon, consistent header/footer, skip link,
  and Privacy/Terms links. The link crawl passed; mail links are explicit.
- CSP, including response-header `frame-ancestors 'none'`, Permissions-Policy,
  nosniff, and Referrer-Policy are present. Content-hashed assets are served
  immutable. No console errors occurred in cold root or demo loads.
- The 52-test browser suite includes serious/critical Axe checks and passes.
  Visual inspection confirms no horizontal overflow at 390 px and a distinct
  ceramic-slip identity rather than a generic SaaS template.
- The brief implies editable PDF import and CSV export; both are present,
  local, and claim-tested. It does not imply an AI step. No runtime AI feature
  or provider key was found.

## Earlier-finding verification

Every earlier review, polish record, and handoff was read. The prior IDs below
were checked against the live deployment and current source/tests, rather than
accepted from a “fixed” label.

| Earlier finding(s) | Current verification | Result |
|---|---|---|
| F-1-1 | Cold root has the explicit invoice-send h1, freelancer sentence, and sample CTA. | Fixed. |
| F-1-2 | `/demo` immediately shows MOSS-118, banner, reset, exit, and three samples. | Fixed. |
| F-1-3 | Registry exists; all 14 exact commands passed separately. | Fixed. |
| F-1-4 | `sealed-restore` passed; source merges retained sealed fields. | Fixed. |
| F-1-5 | `backup-validation` passed before records are changed. | Fixed. |
| F-1-6 | No checkout/dead purchase link is exposed; all visible internal links passed. | Fixed. |
| F-1-7 | `paid-pdf` begins locked and requires a verified cached verdict. | Fixed. |
| F-1-8 | `concurrent-write` passed for two stale demo tabs. | Fixed. |
| F-1-9 | Browser suite checks 44 px controls at phone width. | Fixed. |
| F-1-10 | Host config and live hashed assets use immutable caching. | Fixed. |
| F-1-11 | Live CSP, Permissions-Policy, nosniff, and Referrer-Policy are response headers. | Fixed. |
| F-1-12 | Unknown route is a styled HTTP 404 with a return action. | Fixed. |
| F-1-13 | `/demo` is a titled, canonical, focused route; back navigation works. | Fixed. |
| F-1-14 | Original integrity, cache, header, target, and fallback defects remain covered by the current checks above. | Fixed. |
| F-1-15 | Root/legal/fallback metadata, social image, and icons are live. | Fixed. |
| F-1-16 | Robots, sitemap, manifest, and host routing are live. | Fixed. |
| F-1-17 | Preview/ledger, three-step, limits, and plan sections are present. | Fixed. |
| F-1-18 | Every checked app, legal, offline, and 404 footer uses `build polish-4`. | Fixed. |
| F-1-19 | Current interface consistently says “PDF storage plan.” | Fixed. |
| F-1-20 | `pdf-import` extracts editable local reference/amount fields. | Fixed. |
| F-1-21 | The h1 names the invoice-send job. | Fixed. |
| F-1-22 | The first-screen sentence names freelancers. | Fixed. |
| F-1-23 | Date language remains plain and due-date tested. | Fixed. |
| F-1-24 | Unsupported no-account copy remains absent. | Fixed. |
| F-1-25 | First-screen analytics/privacy copy has same-origin demo-request evidence. | Fixed. |
| F-1-26 | Offline wording is scoped to after the first visit and tested. | Fixed. |
| F-1-27 | The hero caption literally names the date set. | Fixed. |
| F-1-28 | Empty state names what is absent and how to add it. | Fixed. |
| F-1-29 | Due-rule instruction is concrete and tested. | Fixed. |
| F-1-30 | Unsupported privacy slogan remains absent. | Fixed. |
| F-1-31 | Browser-storage wording and same-origin evidence remain. | Fixed. |
| F-1-32 | “Recorded invoices” remains the list heading. | Fixed. |
| F-1-33 | “Invoice date record” remains the stable product term. | Fixed. |
| F-1-34 | Header control is “View PDF storage plan.” | Fixed. |
| F-1-35 | Root CTA, outcome explanation, and three facts are visible. | Fixed. |
| F-1-36 | README opening is concrete and freelancer-specific. | Fixed. |
| F-1-37 | README workflow statements are short and claim-backed. | Fixed. |
| F-1-38 | README non-goals are concrete. | Fixed. |
| F-1-39 | Browser-storage wording has no unsupported account/sync promise. | Fixed. |
| F-1-40 | Time-zone wording and visible IANA zones are tested. | Fixed. |
| F-1-41 | All six due rules are listed and tested. | Fixed. |
| F-1-42 | Unsupported search/filter marketing remains absent. | Fixed. |
| F-1-43 | Monthly export sealing and restore protection pass. | Fixed. |
| F-1-44 | Plain and encrypted backup paths pass. | Fixed. |
| F-1-45 | Visitor copy avoids PWA implementation jargon. | Fixed. |
| F-1-46 | Serious/critical Axe checks pass across required routes. | Fixed. |
| F-1-47 | No dead checkout remains; current separate price-claim concern is F-5-1. | Fixed; see F-5-1. |
| F-1-48 | Token-only verification endpoint/cache behavior passes. | Fixed. |
| F-1-49 | Unsupported setup promise remains absent. | Fixed. |
| F-1-50 | Storage wording is consistent. | Fixed. |
| F-1-51 | Plain backup content passes. | Fixed. |
| F-1-52 | Encrypted backup/passphrase behavior passes. | Fixed. |
| F-1-53 | Data-removal guidance remains cautious. | Fixed. |
| F-1-54 | Unsupported service-worker scope claim remains absent. | Fixed. |
| F-1-55 | No checkout target appears in the link crawl. | Fixed. |
| F-1-56 | Unsupported sales-availability statement remains absent. | Fixed. |
| F-1-57 | No provider key or credential is exposed. | Fixed. |
| F-1-58 | “Stored in this browser” remains the precise status label. | Fixed. |
| F-2-1 | “Limits and privacy” remains the descriptive eyebrow. | Fixed. |
| F-3-1 | “New licenses are not for sale” remains absent. | Fixed. |
| F-4-1 | Offline and 404 pages now have canonical, OG, and Twitter metadata. | Fixed. |
| F-4-2 | Merchant/refund/revocation copy remains absent. | Fixed. |

No earlier finding is reopened with its former ID. F-5-1 and F-5-2 are new
claims-contract findings from this complete round.

## What would make this perfect

Either ship and test an actual Sociobot ₹699 license acquisition flow, or
remove all price/free offer copy until it exists. Move the Azure-generation
statement out of visitor copy or add a deterministic provenance claim test.
Then rerun every registered claim command, the full browser suite, and the
cold live audit. A PASS requires no remaining finding.
