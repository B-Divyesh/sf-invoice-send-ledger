# Adversarial first-read review 1 — FAIL

- Product: Send-Date Ledger
- Live URL: <https://invoice-send-ledger.sociobot.in>
- Reviewed: 28 August 2026 UTC
- Viewports: 390 × 844 and 1440 × 900, fresh Chromium contexts
- Candidate: `feedeb7c8e29c3c46b01adc387987359a48d5520`

## Verdict

**FAIL.** There are 58 findings, including 14 blocking findings. The product is
not tryable with sample data, `/demo` reads the real ledger namespace, the
claims registry is absent, a paid checkout is dead, and all eight defects in
the earlier handoff remain present. No claim has a declared claim test.

## Cold first read, before scrolling

At 390 px, the first screen showed the headline, description, **Add invoice**,
**Back up or restore**, and the privacy line. At desktop width it also showed
the ceramic image and caption.

- What it appears to do: keep a dated record of an invoice from draft through
  payment.
- For whom: **not answerable from the first screen**. The live copy says
  “invoices made somewhere else” but never says freelancers.
- What to click first: **Add invoice** appears to be the real-data path, but
  there is no safe sample-data action and no adjacent explanation of what the
  click will show.

This is blocking. “Know exactly when it left your hands” does not name an
invoice or the recording job. “A calm, private chronology for invoices made
somewhere else” uses “chronology” and does not identify the user.

## Blocking findings

| ID | Exact quote or location | Why this fails | Concrete fix |
|---|---|---|---|
| **F-1-1** | First screen: “Know exactly when it left your hands.” / “A calm, private chronology for invoices made somewhere else.” | A cold visitor cannot identify the user, and the headline only implies the job. This fails two of the three mandatory first-screen questions. | Use `Track when each client invoice was sent` as the h1. Follow with `For freelancers who prepare invoices over time and need reliable issued, sent, due, and paid dates.` |
| **F-1-2** | No **Try it with sample data** action; `/demo` and `?demo=1` load the ordinary app. | There is no one-click demonstration. A live test created `REAL-KEEP-001` on `/`; both demo URLs displayed it. They showed no sample records, banner, Reset, or Start-for-real control. Demo and real data are therefore not isolated. | Add a first-screen **Try it with sample data** action. Seed at least three realistic invoices in a `demo:` IndexedDB/database namespace. Show `Demo — sample data, nothing is saved`, **Reset demo**, and **Start for real**. Ensure `/demo` never reads or writes the production namespace and document it in `.factory/demo.md`. |
| **F-1-3** | `.factory/claims.json` is absent; repository-wide `@claim:` search returns zero tests. | There are no listed tests to run, so every product claim is untested under the claims contract. Passing generic tests cannot replace one tagged observable test per claim. | Add `.factory/claims.json`; give every retained claim exactly one `@claim:<id>` test against `/demo`. Include offline reload, CSV content, due-date generation, lock behavior, local-only requests, encrypted backup, and paid-PDF behavior. |
| **F-1-4** | Earlier handoff defect: restore can remove export seals. | Reproduced live. After exporting `SEAL-RESTORE-001`, restoring an older backup changed the issued value to `2026-08-28T12:00`, left the field enabled, and hid the sealed notice. A snapshot no longer protects its dates. | Validate restore against existing snapshots and retained locks. Reject or merge any replacement that changes a sealed field; add an exact regression claim test. |
| **F-1-5** | Earlier handoff defect: invalid timezone corrupts the ledger. | Reproduced live with `Not/A_Timezone`. The restore dialog closed, a `RangeError` occurred, and reload stayed at “Opening your ledger…” while the bad IndexedDB row remained. | Validate the complete backup before any write and commit invoices/exports atomically. Test malformed zones, dates, IDs, bounds, locks, and snapshot relationships. |
| **F-1-6** | **Buy Studio once** → `https://api.sociobot.in/api/v1/products/invoice-send-ledger/checkout` | Live crawl returns HTTP 404: `{"error":"enabled factory product","status":404}`. The advertised ₹699 purchase cannot complete. | Register and enable the product and return URL, then test a real checkout/return/refund cycle before showing the purchase action. |
| **F-1-7** | Earlier handoff defect: an unverified token unlocks Studio. | Reproduced live while aborting the verify request. `not-a-real-license` produced “Studio is active” and enabled the PDF input. | Default to locked unless a cached successful verdict exists. A first verification failure must keep Studio locked and explain how to retry. Add a network-failure regression test. |
| **F-1-8** | Earlier handoff defect: stale tabs overwrite chronology events. | Still present in code and therefore in the byte-identical live bundle: each tab saves its whole stale record with an unconditional IndexedDB `put`, with no revision check, merge, or conflict message. | Add a revision/version field and compare before write. Merge independent event additions or stop with a conflict message; test two tabs editing the same invoice. |
| **F-1-9** | Earlier handoff defect: `.small { min-height: 40px }`. | Reproduced live at 390 px: **Issue now**, **Edit**, and **Remove** are each 40 px high, below the required 44 px target. | Set every interactive target to at least 44 × 44 CSS px and add a populated-state target-size assertion. |
| **F-1-10** | Earlier handoff defect: hashed JS/CSS cache policy. | Live hashed assets still return `cache-control: public, must-revalidate, max-age=30`. | Serve content-hashed assets with a long max-age and `immutable`; keep HTML and `sw.js` short-lived/revalidated. |
| **F-1-11** | Earlier handoff defect: response headers. | Live responses still omit Content-Security-Policy and Permissions-Policy. | Add response CSP and Permissions-Policy headers matching the actual self-hosted resources. Keep `frame-ancestors` in the response header, not a meta element. |
| **F-1-12** | `/404`, `/definitely-missing-review-1` | Both return HTTP 200 and the ledger home screen. There is no designed 404, so bad links look valid and may expose real ledger data. | Ship a product-styled 404 route/page returning 404 with a clear home link, and configure the static host’s 404 response override. |
| **F-1-13** | `/demo` title and route behavior | `/demo` returns the home title, home h1, and real storage instead of `Demo — Send-Date Ledger`. The deep link is not a real place. | Implement a real demo route, set its route title, move focus to its h1, announce navigation, and preserve back/forward behavior. |
| **F-1-14** | All eight earlier handoff findings | None is fixed. The deployed JS SHA-256 (`f866b591…05b7c`) exactly matches the current clean build, and the direct live retests above confirm the externally observable failures. | Resolve all eight prior defects and rerun this entire review after deployment; do not mark the prior findings fixed from documentation alone. |

## Other structure and product findings

| ID | Exact quote or location | Why this fails | Concrete fix |
|---|---|---|---|
| **F-1-15** | Root, Privacy, and Terms `<head>` | Canonical, Open Graph, Twitter card, 1200 × 630 product image, and apple-touch icon metadata are absent. | Add route-specific canonical and social metadata plus a 180 px apple-touch icon. Derive the social image from the ceramic visual system. |
| **F-1-16** | `/robots.txt`, `/sitemap.xml`, `staticwebapp.config.json` | All three return 404 live; the repository contains none of them. | Add robots and sitemap files listing every real route, plus a valid Static Web Apps config for fallback, a 404 override, headers, and caching. |
| **F-1-17** | Landing structure | The page jumps from the hero directly to an empty ledger. It has no three-step “How it works”, explicit non-goals/privacy section, or visible exact-price tier in the required order. | Add the standard sections after a live/sample preview: **How it works** in three verbs, **What this does not do and where data stays**, then the exact ₹699 tier. |
| **F-1-18** | Header/footer across `/`, `/privacy/`, `/terms/` | Legal pages lose the skip link, primary nav, theme control, visual wordmark, artwork disclosure, and matching footer. No footer includes “Built by Param Factory” or a build/version. Route load focus remains on `BODY`. | Use one consistent shell on every route, add Demo and Privacy navigation, a skip link, the required footer attribution/build ID, and focus the h1 on route changes. |
| **F-1-19** | Landing/README terminology | The same product concept is called “chronology”, “issue register”, “audit-hygiene utility”, “ledger”, “snapshot”, and “record” without a stable distinction. | Use **invoice date record** for the product, **invoice** for an entry, and **monthly CSV export** for an export. Define “sealed” once only where locking occurs. |
| **F-1-20** | Brief: “import or enter a PDF/amount”; product only stores PDFs behind Studio | A freelancer with an existing invoice must retype reference, client, amount, and dates. The obvious import path in the brief is missing. | Add **Import invoice PDF** beside manual entry. Extract text locally first; if optional model help is offered, show exactly what will be sent, use the Sociobot BYOK gateway only, require explicit action, allow correction/undo, and keep manual entry available offline. |

The ceramic still life, palette, asymmetric shapes, serif display type, and
date-slip layout are recognisably product-specific. The visual identity does
not look like a generic gradient SaaS template. No runtime AI feature or
provider key was found; the Azure reference is an honest build-time artwork
provenance note.

## Copy audit — live landing page

Word counts treat hyphenated/path/version tokens as one word. Buttons and
headings without sentence punctuation are included because the brief requires
them to be audited too.

| # | Exact copy | Words | Finding / proposed rewrite |
|---:|---|---:|---|
| 1 | “Know exactly when it left your hands.” | 7 | **F-1-21:** metaphor hides “invoice” and the job. Use `Track when each client invoice was sent` (7). |
| 2 | “A calm, private chronology for invoices made somewhere else.” | 9 | **F-1-22:** “calm” is a marketing adjective, “chronology” is jargon, and the user is absent. Use `For freelancers who prepare invoices elsewhere and need reliable dates.` (9). |
| 3 | “Record the draft, issue, sent, due, and paid dates—with the rule visible.” | 13 | **F-1-23:** capability claim is unlisted; “issue” is inconsistent with “issued”. Use `Record drafted, issued, sent, due, and paid dates. See the due-date rule.` |
| 4 | “No account.” | 2 | **F-1-24:** unlisted privacy claim. Keep only with a same-origin/account-flow claim test. |
| 5 | “No tracking.” | 2 | **F-1-25:** unlisted privacy claim. Use `No analytics or advertising` and test the full demo request log. |
| 6 | “Works offline.” | 2 | **F-1-26:** unlisted and broader than the exercised condition. Use `Edit your ledger offline after the first visit` with an offline demo reload test. |
| 7 | “Five dates, one unambiguous record.” | 5 | **F-1-27:** slogan that does not explain an action or section. Replace the caption with `Drafted, issued, due, sent, and paid dates stay together.` |
| 8 | “No dates to untangle yet” | 5 | **F-1-28:** metaphor/mood empty-state heading. Use `No invoices recorded yet`. |
| 9 | “Add the next invoice you are drafting—or record one already sent.” | 12 | — Clear and within the limit. |
| 10 | “Its due date will come from a visible rule.” | 9 | **F-1-29:** unlisted generation claim and passive wording. Use `Choose a due rule when you record the invoice.` and test the calculated result. |
| 11 | “Private by design.” | 3 | **F-1-30:** slogan and unlisted privacy claim. Delete it; the following concrete sentence is enough. |
| 12 | “Your ledger and PDFs stay in this browser.” | 8 | **F-1-31:** unlisted local-storage claim. Use `Invoice records and attached PDFs are stored in this browser.` with a complete request-log test. |
| 13 | “Ceramic artwork generated for this product with Azure OpenAI.” | 9 | — Useful provenance; source assets and design record support it. |
| — | Heading: “Your chronology” | 2 | **F-1-32:** meaningless without surrounding context. Use `Recorded invoices`. |
| — | Eyebrow: “Issue register” | 2 | **F-1-33:** inconsistent with “ledger” and “chronology”. Use `Invoice date record`. |
| — | Button: “Studio” | 1 | **F-1-34:** not a result-naming verb and does not say it opens pricing. Use `View PDF storage plan`. |
| — | Primary action area | — | **F-1-35:** no **Try it with sample data**, no adjacent outcome text, and the three facts omit price while repeating privacy twice. Add the demo action plus `Opens three sample invoices`; show one privacy fact, one offline fact, and `Core ledger: free · PDF storage: ₹699 once`. |
| — | Status: “Stored on this device” | 4 | **F-1-58:** unlisted storage claim. Use `Stored in this browser` and cover every demo request/storage write with the privacy test. |

No landing sentence exceeds 22 words. The defects are clarity, slogans,
terminology, missing proof, and the missing mandatory first-screen shape.

## Copy audit — README

| # | Exact sentence/list item | Words | Finding / proposed rewrite |
|---:|---|---:|---|
| 1 | “Send-Date Ledger is a private, offline-first issue register for freelancers who create invoices elsewhere but need the chronology to stay unambiguous.” | 21 | **F-1-36:** “offline-first”, “issue register”, “chronology”, and “unambiguous” delay the job. Use `Send-Date Ledger helps freelancers record when an existing invoice was issued, sent, due, and paid.` |
| 2 | “Record a draft, issue, sent, due, and paid date; generate the due date from a visible Net N rule; then seal and export a monthly CSV.” | 26 | **F-1-37:** exceeds 22 words, packs three ideas, and contains unlisted claims. Use three sentences: `Record each invoice date. Calculate the due date from a rule you can see. Lock exported dates in a monthly CSV record.` |
| 3 | “This is an audit-hygiene utility, not an invoice creator, accounting ledger, tax calculator, statutory record, or payment gateway.” | 18 | **F-1-38:** “audit-hygiene” and “statutory record” are jargon. Use `It records invoice dates. It does not create invoices, calculate tax, take payments, or replace your accounting records.` |
| 4 | “Local IndexedDB storage with no account, analytics, or cloud sync” | 10 | **F-1-39:** implementation jargon plus unlisted storage/privacy claims. Use `Stores records in this browser, with no account, analytics, or cloud sync.` |
| 5 | “Timezone-tagged draft, issued, sent, due, and paid chronology” | 8 | **F-1-40:** “timezone-tagged” and “chronology” are jargon; claim is unlisted. Use `Keeps the time zone with every drafted, issued, sent, due, and paid date.` |
| 6 | “Net 0/7/14/30/45/60 due-date rules” | 4 | **F-1-41:** unexplained “Net” term and unlisted option claim. Use `Calculates due dates from same-day, 7, 14, 30, 45, or 60-day terms.` |
| 7 | “Search, lifecycle filtering, sent-date coverage, and due-rule coverage” | 8 | **F-1-42:** “lifecycle” and “coverage” are jargon; capabilities are unlisted. Use `Search invoices, filter by status, and find missing sent or due dates.` |
| 8 | “Monthly CSV snapshots that lock dates already included in an export” | 11 | **F-1-43:** “snapshot” is unexplained and the lock claim currently fails restore. Use `Export a monthly CSV. After export, those dates cannot change in the app.` only after the restore bug has a test. |
| 9 | “Plain JSON and AES-256-GCM encrypted backup/restore, including PDF data” | 9 | **F-1-44:** compressed jargon and unlisted backup/encryption claims. Use `Download a readable JSON backup or a passphrase-encrypted backup. Both include attached PDFs.` |
| 10 | “Installable PWA with a versioned service-worker cache and offline editing” | 10 | **F-1-45:** developer jargon in a user feature and unlisted offline claim. Use `Install the app and edit records offline after your first visit.` |
| 11 | “Light and dark treatments, keyboard-safe dialogs, reduced motion, and a responsive 390px layout” | 13 | **F-1-46:** “treatments” and “keyboard-safe” are vague; four unlisted accessibility/responsive claims. Use `Supports light and dark themes, keyboard controls, reduced motion, and 390px-wide screens.` |
| 12 | “Free core product; ₹699 one-time Studio license adds local PDF attachment storage.” | 12 | **F-1-47:** unlisted price/feature claim; the purchase route is broken. Use `Invoice date records are free. A ₹699 one-time purchase adds PDF storage in this browser.` only after checkout works and is tested. |
| 13 | “Checkout and verification use only the Sociobot billing API.” | 9 | **F-1-48:** unlisted network claim. Add a request-log test for purchase/verification or remove “only”. |
| 14 | “Requires a current Node.js release (Node 20+ recommended).” | 8 | — Clear operational requirement; the clean run used Node 22. |
| 15 | “Open the URL printed by Vite.” | 6 | — Clear instruction. |
| 16 | “No environment variables or external services are needed for the free ledger.” | 12 | **F-1-49:** unlisted setup/runtime claim. Add a clean-start and free-flow network test, or say `The free ledger starts without environment variables.` |
| 17 | “Playwright is pinned to 1.58.2 as required by the factory runner.” | 11 | — Verified in `package.json`; operational documentation, not landing/product behavior. |
| 18 | “The production output is static and has dist/index.html at its root.” | 11 | — Verified by the clean build. |
| 19 | “Ledger records, export snapshots, PDFs, and license state stay in the browser.” | 12 | **F-1-50:** unlisted local-storage claim. Use consistent terms and test all demo requests and stores. |
| 20 | “Use Back up or restore to download a portable JSON file.” | 11 | **F-1-51:** unlisted backup claim and the control name is awkward in prose. Use `Select Back up or restore, then Download plain JSON.` and test the downloaded schema. |
| 21 | “Encrypted backups derive an AES-GCM key from the passphrase in the browser; the passphrase is never stored or recoverable.” | 19 | **F-1-52:** two unlisted security claims. Split them and add tests for browser-side derivation and absence from storage/output. |
| 22 | “Clearing site data removes the local ledger, so regular backups matter.” | 11 | **F-1-53:** unlisted data-removal claim. Add a clean-storage test or rewrite as browser guidance without promising complete removal. |
| 23 | “Deploy the contents of dist/ as a static site with history/folder routing enabled for /privacy/ and /terms/.” | 17 | — Clear deployment instruction. |
| 24 | “The service worker is root-scoped.” | 5 | **F-1-54:** unlisted technical claim. Assert the live registration scope in a tagged test. |
| 25 | “The Studio buy link targets:” | 5 | **F-1-55:** the following target is dead. Replace with a working URL only after an end-to-end checkout test. |
| 26 | “The factory registers the product and return URL separately.” | 9 | **F-1-56:** the live 404 shows registration is not complete; this wording misleads maintainers. Use `Deployment requires the factory to register the product and return URL.` |
| 27 | “No Dodo or other payment-provider credentials live in this repository.” | 10 | **F-1-57:** unlisted security claim. Add a secret scan to CI and phrase it as a verified repository check. |
| 28 | “The product-specific glacial minimal ceramics system and generated-artwork provenance are in .factory/design.md.” | 12 | — Verified. |
| 29 | “Build verification and known constraints are in .factory/handoff.md.” | 8 | — Verified at review time. |
| 30 | “MIT — see LICENSE.” | 3 | — Verified. |

README headings are understandable out of context. Its feature list needs the
plain-language and claim-test corrections above.

## Claims and sandbox evidence

`.factory/claims.json` does not exist, so there were zero declared claim test
commands to run. This is not a vacuous pass: every claim referenced by
F-1-23–F-1-26, F-1-29–F-1-31, F-1-36–F-1-57, and F-1-58 is unlisted and therefore
untested.

From detached clean worktree `/tmp/invoice-send-ledger-review1-clean`:

```text
npm ci              PASS — 59 packages, 0 vulnerabilities
npm test            PASS — 7/7 generic unit tests
npm run build       PASS — dist/ produced; JS 42.69 KB raw / 12.95 KB gzip
npm run test:e2e    PASS — 6/6 generic Playwright tests
@claim: tags         FAIL — 0 found
claims.json          FAIL — missing
```

A fresh live Playwright flow covering load, real record creation, `/demo`, and
`?demo=1` made only same-origin application requests and logged no console
errors. That supports the narrow free-flow privacy behavior, but it cannot
prove the advertised demo sandbox because no sandbox exists. The existing
offline E2E passed locally, but it is not a declared claim test and does not use
sample demo data.

## Earlier-history retest

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files.
The earlier `.factory/handoff.md` and `.factory/verification.md` contain eight
defects but did not assign finding IDs, so this review assigns current IDs.
Each was checked again:

| Earlier finding | Live/code confirmation | Current ID |
|---|---|---|
| Restoring an older backup removes sealed locks | Reproduced live with changed issued time and enabled field | F-1-4 |
| Invalid timezone persists and prevents later loads | Reproduced live; `RangeError` and permanent loading state | F-1-5 |
| Studio checkout returns 404 | Reproduced with live HTTP request | F-1-6 |
| Unverified token unlocks Studio on network failure | Reproduced live; PDF input enabled | F-1-7 |
| Stale tab can erase an issue event | Unconditional full-record `put` remains; deployed bundle is byte-identical | F-1-8 |
| Compact actions are 40 px | Reproduced live for Issue now, Edit, and Remove | F-1-9 |
| Hashed assets have 30-second revalidation caching | Reproduced from live response headers | F-1-10 |
| CSP and Permissions-Policy absent | Reproduced from live response headers | F-1-11 |

All eight are blocking again because none is fixed.

## Structure, links, and accessibility checks

- Root, Privacy, and Terms each have one h1, `lang="en"`, a `<main>`, a
  route-pattern title, descriptions, and an SVG favicon.
- `/demo` and unknown routes have the wrong home title and h1. Unknown routes
  return 200. Canonical, OG, Twitter, and apple-touch metadata are absent.
- `/privacy/` and `/terms/` return 200. The visible checkout link returns 404.
  `robots.txt`, `sitemap.xml`, and the static-host config return 404.
- Browser back works as a normal document navigation, but route loads leave
  focus on `BODY`; legal pages have no skip link or live route announcement.
- The factory URL verifier passed the root page: one h1, title, language, main,
  alt text, labeled buttons, and no load-time console errors.
- Live axe WCAG A/AA scan found zero serious or critical issues in the empty
  state. The populated 390 px target-size failure remains F-1-9.
- The root request log contained no third-party requests. The only exposed
  external action is the broken Sociobot checkout; no Azure/provider key or
  decorative runtime AI feature was found.

## What would make this perfect

Resolve every finding above, deploy the result, and rerun the review cold. A
perfect result has a freelancer-specific first screen, an isolated one-click
demo with useful invoices, a complete claims registry whose tagged tests all
pass, no prior integrity or licensing regression, working checkout, real 404
and metadata, consistent routes, 44 px controls, and no flagged sentence or
untested claim. There is currently no pass-adjacent remainder to waive.
