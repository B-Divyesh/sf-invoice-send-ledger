# Adversarial first-read review 6 — FAIL

- Product: Send-Date Ledger
- Live URL: <https://invoice-send-ledger.sociobot.in>
- Reviewed: 29 August 2026 UTC
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; separate clean clone
- Candidate: `92fbd3288d3d652d6dcbe6f5ebe22391e884cb76`

## Verdict

**FAIL.** One blocking regression and one minor documentation finding remain.
The core record is clear and tryable, the demo is isolated, every registered
claim passes, and the live structure checks pass. The product nevertheless
promotes a licensed PDF-storage tier that a new visitor cannot price or acquire.
The README also overstates which Node 20 releases the pinned toolchain supports.
The required standard is zero findings.

## Cold first read

Before scrolling, both fresh viewports answer all three required questions.

- **What it does:** records when each client invoice was sent, with issued, due,
  and paid dates also named in the supporting sentence.
- **For whom:** freelancers who prepare invoices over time.
- **What to click first:** **Try it with sample data**. The adjacent copy says
  **Opens three sample invoices**.

The exact h1 is “Track when each client invoice was sent.” The exact audience
sentence is “For freelancers who prepare invoices over time and need reliable
issued, sent, due, and paid dates.” At 390 px the CTA ends at y=469 and all
three first-screen facts end at y=758, inside the 844 px viewport. At desktop
width the same content is visible without scrolling. No first-screen clarity
finding applies.

## Findings

| ID | Severity | Exact quote / location | Why this fails | Concrete fix |
|---|---|---|---|---|
| **F-1-17 (regressed)** | **BLOCKING** | Landing header and paid section: “View PDF storage plan”, “PDF storage requires a verified license”, and “Verified license”. The dialog says “Verify a license below to add PDF storage.” No price or acquisition action exists on the landing page, in the dialog, README, or any crawled link. | The standard site skeleton requires an exact price and what it unlocks when a paid tier exists. This is visibly a licensed tier, but a new visitor cannot learn its price or obtain the required license. Review 5 correctly removed an unproved ₹699 offer, but retaining the public tier without a purchasable, tested replacement regresses the price part of F-1-17. It is also the only obvious missing step implied by the brief's one-time monetization. | Integrate a real one-time purchase through the Sociobot billing API, show the exact price, and add a `pdf-license-purchase` claim that verifies the displayed amount and licensed return. Until that flow exists, remove the PDF plan from public navigation, first-screen facts, and landing sections; keep the core date record complete without advertising an unavailable tier. |
| **F-6-1** | Minor | README, Run locally: “Use Node.js 20 or newer.” | The locked Vite 7.3.6 package declares `node: ^20.19.0 || >=22.12.0`. The README wording includes unsupported releases such as Node 20.0 and 20.18. A maintainer following it can fail before the app starts. | Rewrite as `Use Node.js 20.19+ or 22.12+.` Add the same range to `package.json#engines` so `npm` can warn on unsupported runtimes. |

## Demo and sandbox verification

The root CTA reaches `/demo` in one click. The first post-click screen already
shows realistic product data:

- At 390 × 844, MOSS-118 starts at y=654 and intersects the initial viewport.
- At 1440 × 900, MOSS-118 starts at y=469.
- MOSS-118 names Moss & Finch Studio, ₹46,500.00, three IANA-zone dates, a
  Net 30 rule, an unrecorded sent date, and the **Record sent** action.
- The persistent banner says “Demo — sample data, nothing is saved” and
  “Changes stay separate from your invoice records.” It includes **Reset demo**
  and **Start for real**.

A fresh live flow created `R6-REAL-001` in the real ledger, entered the demo,
confirmed that the real record was absent, recorded MOSS-118 as sent, reset the
demo, and confirmed that **Record sent** returned. **Start for real** restored
`R6-REAL-001` and showed no sample record. Current code selects separate
`send-date-ledger` and `demo:send-date-ledger` IndexedDB databases.

The complete live demo request log contained no off-origin request. A live
service-worker run then went offline, reloaded `/demo`, edited MOSS-118, and
reloaded again; the edit remained and the page showed “Offline · changes still
save.” The offline run also recorded no off-origin request.

## Claims and clean-clone verification

Fresh clone: `/tmp/invoice-send-ledger-review-6-oMLdwM/repo` at `92fbd32`.
Every exact command in `.factory/claims.json` was run separately.

| Claim ID | Result | Observable check |
|---|---|---|
| `demo-isolation` | PASS | Real record remained separate; sample edit/reset/exit behaved correctly. |
| `due-date` | PASS | Same-day, 7, 14, 30, 45, and 60-day dates matched exact results. |
| `time-zone` | PASS | Asia/Kolkata remained visible beside recorded sample dates. |
| `csv-export` | PASS | CSV had one header plus three rows and sealed all three records. |
| `sealed-restore` | PASS | An older backup could not edit exported dates. |
| `backup-validation` | PASS | Invalid IANA-zone backup was rejected before records changed. |
| `offline-reload` | PASS | Demo reloaded and saved an edit offline after first visit. |
| `local-only` | PASS | Demo edit and backup made only same-origin requests. |
| `encrypted-backup` | PASS | Ciphertext hid invoice text/passphrase and restored locally. |
| `plain-backup` | PASS | JSON contained all invoices and monthly CSV history. |
| `paid-pdf` | PASS | Unverified/oversized files were blocked; both backup paths retained a licensed PDF. |
| `license-privacy` | PASS | Only the pasted token reached the exact Sociobot verification endpoint; the result was cached. |
| `pdf-import` | PASS | Local PDF extraction produced editable reference and amount fields. |
| `concurrent-write` | PASS | A stale tab could not erase the newer sent date. |

Additional clean-clone results:

- `npm ci`: passed; 0 vulnerabilities reported.
- `npm test`: passed, 21 tests.
- `npm run build`: passed and produced `dist/`; initial app JavaScript is
  18.11 KB gzip and CSS is 6.06 KB gzip. The 128.94 KB gzip PDF parser is
  deferred.
- `npm run test:e2e`: passed, 52 Playwright tests across desktop and mobile.
- The locally built app bundle and live bundle have the same SHA-256:
  `37730599ad24235b18ebf19f0a82b3099aa89e91e51eb3d49b894c5dbd85f76d`.

No registered claim is untested or failing. The two findings concern site
structure/acquisition and an operational README version range, not a failed
registered product claim.

## Copy audit — live landing page

Counts treat hyphenated terms as one word. Link labels, headings, and buttons
are included where they carry landing meaning. No sentence exceeds 22 words,
and no banned marketing adjective, metaphor, or inconsistent product term was
found.

| # | Exact copy | Words | Result |
|---:|---|---:|---|
| 1 | “Stored in this browser” | 4 | Pass; browser storage and request behavior are exercised by `local-only` and `offline-reload`. |
| 2 | “Track when each client invoice was sent” | 7 | Pass; concrete job-first h1. |
| 3 | “For freelancers who prepare invoices over time and need reliable issued, sent, due, and paid dates.” | 16 | Pass; names user and outcome. |
| 4 | “Try it with sample data” | 5 | Pass; result-naming primary action. |
| 5 | “Opens three sample invoices” | 4 | Pass; states the click result. |
| 6 | “No analytics or advertising” | 4 | Pass; same-origin request log and source checks support it. |
| 7 | “Edit offline after the first visit” | 6 | Pass; `offline-reload`. |
| 8 | “PDF storage requires a verified license” | 6 | The sentence is accurate and claim-tested, but its public tier context triggers F-1-17. |
| 9 | “Drafted, issued, due, sent, and paid dates stay together.” | 9 | Pass; literal caption. |
| 10 | “No invoices recorded yet” | 4 | Pass; clear empty-state heading. |
| 11 | “Add the next invoice you are drafting, or record one already sent.” | 12 | Pass; concrete empty-state action. |
| 12 | “Choose a due rule when you add it.” | 8 | Pass; `due-date`. |
| 13 | “Enter the details or read them from a PDF in this browser.” | 12 | Pass; `pdf-import` and `local-only`. |
| 14 | “Choose a due rule, then record when you issue, send, and get paid.” | 13 | Pass; `due-date`. |
| 15 | “Download a monthly CSV.” | 4 | Pass; `csv-export`. |
| 16 | “Dates in that export become sealed.” | 6 | Pass; `csv-export` and `sealed-restore`. |
| 17 | “It does not create invoices, calculate tax, take payments, or replace accounting records.” | 13 | Pass; concrete boundary. |
| 18 | “Invoice records stay in this browser.” | 6 | Pass; browser storage plus same-origin/offline evidence. |
| 19 | “The app sends no invoice data to a server.” | 9 | Pass; `local-only`. |
| 20 | “PDF storage requires a verified license.” | 6 | Accurate under `paid-pdf`; see F-1-17 for missing price/acquisition. |
| 21 | “Adds local PDF storage and includes PDFs in backups.” | 9 | Pass; `paid-pdf`. |
| 22 | “Record dates for invoices you create elsewhere.” | 7 | Pass; concrete footer summary. |

The standalone labels/headings are **Invoice date record**, **Recorded
invoices**, **Three steps**, **How it works**, **Record the invoice**, **Add each
date**, **Export the month**, **Limits and privacy**, **What this does not do and
where data stays**, **PDF storage plan**, and **Keep the sent PDF with its
dates**. They name their sections without mood language. The visible actions
are **Try it with sample data**, **Add invoice manually**, **Import invoice
PDF**, **Back up or restore**, **Export monthly CSV**, **Add your first
invoice**, and **View PDF storage plan**. Each action is a result-naming verb
phrase. F-1-17 concerns the unavailable licensed tier, not the grammar of its
button.

## Copy audit — README

Code blocks and bare URL labels are not sentences. Every prose sentence and
list-item sentence is below.

| # | Exact copy | Words | Result |
|---:|---|---:|---|
| 1 | “Send-Date Ledger helps freelancers record when an existing invoice was issued, sent, due, and paid.” | 15 | Pass. |
| 2 | “It records invoice dates.” | 4 | Pass. |
| 3 | “It does not create invoices, calculate tax, take payments, or replace accounting records.” | 13 | Pass. |
| 4 | “Records drafted, issued, sent, due, and paid dates with their time zones.” | 12 | Pass; `time-zone`. |
| 5 | “Calculates due dates from same-day, 7, 14, 30, 45, or 60-day terms.” | 12 | Pass; `due-date`. |
| 6 | “Reads invoice reference and amount from a PDF in your browser.” | 11 | Pass; `pdf-import`. |
| 7 | “You can correct every imported field.” | 6 | Pass; `pdf-import`. |
| 8 | “Exports a monthly CSV.” | 4 | Pass; `csv-export`. |
| 9 | “Dates included in that export become sealed against later edits.” | 10 | Pass; `csv-export` and `sealed-restore`. |
| 10 | “Rejects invalid backups before changing any records.” | 7 | Pass; `backup-validation`. |
| 11 | “Older backups cannot change sealed dates.” | 6 | Pass; `sealed-restore`. |
| 12 | “Downloads readable JSON or passphrase-encrypted backups.” | 6 | Pass; backup claim tests. |
| 13 | “Edits records offline after the first visit.” | 7 | Pass; `offline-reload`. |
| 14 | “Stops a stale tab from overwriting a newer invoice date.” | 10 | Pass; `concurrent-write`. |
| 15 | “PDF storage requires a verified license.” | 6 | Accurate under `paid-pdf`; see F-1-17. |
| 16 | “Open `/demo` or `/?demo=1`.” | 4 | Pass; both live entries work. |
| 17 | “Both load three realistic sample invoices in the separate `demo:send-date-ledger` database.” | 11 | Pass; `demo-isolation`. |
| 18 | “Select Reset demo to restore the original samples.” | 8 | Pass; live and claim flow. |
| 19 | “Select Start for real to discard demo changes and open the real database.” | 13 | Pass; live and claim flow. |
| 20 | “Use Node.js 20 or newer.” | 5 | **F-6-1:** inaccurate lower bound. Use `Use Node.js 20.19+ or 22.12+.` |
| 21 | “Playwright is pinned to 1.58.2.” | 5 | Pass; package and lock file agree. |
| 22 | “Every product claim and its command is listed in `.factory/claims.json`.” | 10 | Pass for product claims; all 14 commands ran. |
| 23 | “Invoice records and PDFs use browser storage.” | 7 | Pass; storage/request claim flows. |
| 24 | “Demo records use a separate database and never open the real one.” | 12 | Pass; `demo-isolation`. |
| 25 | “Select Back up or restore, then Download plain JSON for a readable backup.” | 13 | Pass; `plain-backup`. |
| 26 | “The encrypted option hides invoice text with a passphrase-derived AES-256-GCM key.” | 11 | Pass; `encrypted-backup`. |
| 27 | “The app does not store the passphrase.” | 7 | Pass; `encrypted-backup`. |
| 28 | “Keep it somewhere safe because it cannot be recovered.” | 9 | Pass; useful consequence of non-storage. |
| 29 | “Deploy `dist/` as a static site.” | 6 | Pass; build produced the documented output. |
| 30 | “The included host configuration supplies explicit routes, a 404 response, security headers, and immutable caching for hashed assets.” | 18 | Pass; source and live responses were checked. |
| 31 | “Valid existing licenses can be pasted into the PDF storage plan.” | 11 | Behavior passes, but it does not resolve the new-user acquisition gap in F-1-17. |
| 32 | “Verification sends only the token to Sociobot and reuses a successful result for one day.” | 15 | Pass; `license-privacy`. |
| 33 | “MIT — see LICENSE.” | 4 | Pass; `LICENSE` exists and is MIT. |

README headings are descriptive. No sentence exceeds 22 words. F-6-1 is the
only wording/accuracy flag.

## Structure, routing, accessibility, and visual identity

- `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, and `/offline.html` each
  return 200 with the expected route title, `lang="en"`, one h1, one main,
  route-specific description/canonical/Open Graph data, favicon, touch icon,
  shared footer, and focused h1. An unknown path returns the designed page with
  HTTP 404.
- Back navigation from `/demo` returns to `/` and focuses the root h1. The demo
  route announces its loaded state. All visible internal links returned 200;
  the only external links are explicit `mailto:` contacts.
- Live response headers include CSP with `frame-ancestors 'none'`,
  Permissions-Policy, nosniff, and Referrer-Policy. The hashed live bundle uses
  `max-age=31536000, immutable`.
- Fresh live Axe checks found zero serious or critical WCAG A/AA violations on
  every checked route. There is no horizontal overflow at 390 px, and all
  tested visible buttons/header/footer/demo-banner targets are at least 44 px.
- `robots.txt`, `sitemap.xml`, the manifest, and host configuration are present.
  The sitemap lists the four indexable routes.
- The frost-blue ceramic image, incised borders, asymmetric slab corners,
  serif date/reference type, and chronological slips are product-specific and
  match `.factory/design.md`. The page is not a generic gradient/card SaaS
  template. Original image provenance is recorded internally rather than used
  as an untested visitor claim.

The only structure failure is the unavailable paid-tier presentation in
F-1-17.

## Earlier-finding verification

Every prior `review-*.md`, `polish-*.md`, and the handoff was read. Each prior
finding was checked against the byte-identical live bundle, current source, and
the newly run claim/browser tests.

| Earlier ID | Current verification | Result |
|---|---|---|
| F-1-1 | Cold h1, freelancer sentence, and CTA answer all three first-read questions. | Fixed. |
| F-1-2 | One-click demo immediately shows MOSS-118; isolation, reset, and exit pass live. | Fixed. |
| F-1-3 | Registry has 14 claims and every exact command passes. | Fixed. |
| F-1-4 | `sealed-restore` preserves exported dates. | Fixed. |
| F-1-5 | `backup-validation` rejects the bad zone before writes. | Fixed. |
| F-1-6 | No dead checkout or purchase link appears in the crawl. | Fixed. |
| F-1-7 | PDF storage stays locked without a verified verdict. | Fixed. |
| F-1-8 | `concurrent-write` rejects the stale save and retains the sent date. | Fixed. |
| F-1-9 | Live populated mobile controls meet 44 px. | Fixed. |
| F-1-10 | Live hashed bundle has one-year immutable caching. | Fixed. |
| F-1-11 | Live CSP and Permissions-Policy are response headers. | Fixed. |
| F-1-12 | Unknown route is a styled HTTP 404 with a home action. | Fixed. |
| F-1-13 | `/demo` has its own title, canonical, focus, announcement, and history behavior. | Fixed. |
| F-1-14 | The eight carried integrity/license/concurrency/target/cache/header defects were re-exercised. | Fixed. |
| F-1-15 | Root, legal, demo, fallback metadata and icons are present live. | Fixed. |
| F-1-16 | Robots, sitemap, manifest, and host routing are present and live. | Fixed. |
| F-1-17 | Preview, workflow, and limits remain, but the visible licensed tier no longer supplies the exact price or acquisition path. | **BLOCKING regression.** |
| F-1-18 | App, legal, offline, and 404 shells share header/footer, links, focus, and build ID. | Fixed. |
| F-1-19 | UI consistently uses “PDF storage plan” and the other defined terms. | Fixed. |
| F-1-20 | `pdf-import` reads local fields and leaves them editable. | Fixed. |
| F-1-21 | Concrete invoice-send h1 remains. | Fixed. |
| F-1-22 | Freelancer-specific sentence remains. | Fixed. |
| F-1-23 | Drafted/issued/sent/due/paid wording remains plain and tested. | Fixed. |
| F-1-24 | Unsupported “No account” copy remains absent. | Fixed. |
| F-1-25 | “No analytics or advertising” has current same-origin/source evidence. | Fixed. |
| F-1-26 | Offline wording remains scoped and passes live plus claim tests. | Fixed. |
| F-1-27 | Caption literally names the dates. | Fixed. |
| F-1-28 | Empty state says what is absent and how to add it. | Fixed. |
| F-1-29 | Due-rule instruction and six exact calculations pass. | Fixed. |
| F-1-30 | Unsupported privacy slogan remains absent. | Fixed. |
| F-1-31 | Browser-storage wording is supported by storage/request tests. | Fixed. |
| F-1-32 | “Recorded invoices” remains the list heading. | Fixed. |
| F-1-33 | “Invoice date record” remains the product-job term. | Fixed. |
| F-1-34 | “View PDF storage plan” is still a result-naming control. | Fixed; availability is F-1-17. |
| F-1-35 | CTA, outcome note, and three facts remain in the first screen. | Fixed. |
| F-1-36 | README opening remains concrete and freelancer-specific. | Fixed. |
| F-1-37 | README workflow remains short and claim-backed. | Fixed. |
| F-1-38 | Non-goals remain plain. | Fixed. |
| F-1-39 | Browser-storage wording avoids implementation jargon. | Fixed. |
| F-1-40 | Time-zone wording and displayed IANA zones pass. | Fixed. |
| F-1-41 | All six due terms remain listed and tested. | Fixed. |
| F-1-42 | Unsupported search/filter marketing remains absent. | Fixed. |
| F-1-43 | CSV sealing and older-backup protection pass. | Fixed. |
| F-1-44 | Plain and encrypted backup flows pass. | Fixed. |
| F-1-45 | Visitor copy avoids PWA jargon and offline behavior passes. | Fixed. |
| F-1-46 | Full browser suite and fresh live Axe run have no serious/critical violations. | Fixed. |
| F-1-47 | Unsupported price/purchase copy and dead checkout remain absent; licensed behavior itself passes. | Fixed; F-1-17 covers the remaining tier-structure gap. |
| F-1-48 | `license-privacy` proves the exact token-only request and cache. | Fixed. |
| F-1-49 | Unsupported environment/external-services promise remains absent. | Fixed. |
| F-1-50 | Records/PDF browser-storage terms remain consistent and tested. | Fixed. |
| F-1-51 | Plain JSON control and complete payload pass. | Fixed. |
| F-1-52 | Encryption, passphrase non-storage, and restore pass. | Fixed. |
| F-1-53 | Privacy page keeps cautious browser-data removal guidance. | Fixed. |
| F-1-54 | Unsupported visitor-facing service-worker-scope claim remains absent. | Fixed. |
| F-1-55 | Link crawl exposes no dead checkout. | Fixed. |
| F-1-56 | Unsupported sales-availability assertion remains absent. | Fixed. |
| F-1-57 | Source/build scan finds no provider credential or unsupported secret claim. | Fixed. |
| F-1-58 | “Stored in this browser” remains precise and test-supported. | Fixed. |
| F-2-1 | “Limits and privacy” remains the descriptive eyebrow. | Fixed. |
| F-3-1 | “New licenses are not for sale” remains absent. | Fixed. |
| F-4-1 | 404 and offline pages have canonical, OG, Twitter, and icon metadata. | Fixed. |
| F-4-2 | Untested merchant/refund/revocation copy remains absent. | Fixed. |
| F-5-1 | Unproved price/free/sale assertions remain absent. | Fixed; removing the price while retaining the tier exposed the separate F-1-17 regression. |
| F-5-2 | Visitor-facing Azure provenance remains absent; provenance stays in design documentation. | Fixed. |

## Missed leverage

The brief already implies the two most useful adjacent capabilities: import an
existing invoice and export the monthly record. Both exist and pass observable
tests. Cloud sync would conflict with the local-first privacy position unless
explicitly designed as optional. An AI step would add little to deterministic
date recording and local PDF field extraction, so no AI feature is warranted.

The one missing high-value step is not AI: a real Sociobot purchase path for
the licensed PDF-storage feature. That is covered by blocking F-1-17. No raw
provider key, Azure endpoint, decorative AI feature, or embedded Sociobot key
was found.

## What would make this perfect

Resolve F-1-17 by either shipping and claim-testing an exact-price Sociobot
license purchase or removing the unavailable licensed tier from the public
product. Correct README's Node range to `20.19+ or 22.12+` and declare it in
`package.json`. Then rerun all 14 claim commands, the full 52-test browser
suite, and the cold live audit. Nothing else remains from this review.
