# Adversarial first-read review 2 — FAIL

- Product: Send-Date Ledger
- Live URL: <https://invoice-send-ledger.sociobot.in>
- Reviewed: 28 August 2026 UTC
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 1000
- Repository revision: a3c8eaa7e25bcc12557da2025eeada7b072752ae

## Verdict

**FAIL.** Three blocking findings and one minor finding remain. The sample
demo is isolated and resettable, but it does not show a sample invoice in its
first screen. The header also regresses two earlier copy requirements.

## Cold first read, before scrolling

The root first screen says “Track when each client invoice was sent”, “For
freelancers who prepare invoices over time and need reliable issued, sent, due,
and paid dates.”, and “Try it with sample data” followed by “Opens three
sample invoices.”

- It records the dates of a freelancer's client invoices.
- It is for freelancers who prepare invoices over time.
- Click **Try it with sample data** first.

All three answers are clear at 390 px and desktop. The ceramic still life,
serif date treatment, asymmetrical sheets, and restrained palette are a
distinct product identity, not a generic SaaS template.

## Findings

| ID | Severity | Exact quote or location | Why this fails | Concrete fix |
|---|---|---|---|---|
| **F-1-2** | **BLOCKING** | After “Try it with sample data”, the first .invoice-slip is y=1815 in a fresh 390 × 844 context and y=1157 at 1440 × 1000. Neither first viewport shows NORTH-026, ACME-1048, or MOSS-118. | This is a half-fix of the earlier demo finding. Samples exist, but the first screen after the click is a marketing hero, not the product being used with realistic sample data. | Make /demo lead with the populated ledger, place the hero below it, or show real sample slips in the initial hero. Test both viewports by asserting a named sample is inside the viewport on load. |
| **F-1-19** | **BLOCKING** | Header button: “PDF plan”. Main section, modal, and terminology table: “PDF storage plan”. | The same paid feature has two names. This regresses the prior terminology finding. | Rename the header control “View PDF storage plan” and retain “PDF storage plan” everywhere else. Add a copy/DOM regression test. |
| **F-1-34** | **BLOCKING** | Header button: “PDF plan”. | The button is not a result-naming verb, repeating the earlier control-label defect. It does not say that it opens the plan. | Change it to “View PDF storage plan”. Test the header as well as the in-page plan control. |
| **F-2-1** | Minor | Limits-section eyebrow: “Clear boundaries”. | Heard alone in a heading list, this mood label does not identify the section. The h2 below carries the useful information. | Replace with “Limits and privacy”, or remove the eyebrow. |

## Demo and sandbox verification

The F-1-2 failure is presentation after entering demo, not isolation. In a
fresh live context I created an ordinary record, entered /demo, reset it, and
exited it.

| Check | Result |
|---|---|
| “Demo — sample data, nothing is saved” banner | Present |
| Seed records | 3: NORTH-026, ACME-1048, MOSS-118 |
| Real record visible in demo | No |
| Reset demo | Restored 3 records |
| Start for real | Returned to separate real ledger |
| Complete demo-flow off-origin requests | None |
| Root/demo/legal console errors | None |

The code selects demo:send-date-ledger in demo mode and send-date-ledger
outside it. resetDemoData refuses ordinary mode. This confirms a separate
storage namespace in both code and live behavior.

## Claims

.factory/claims.json has 14 entries. In a fresh clone at
/tmp/invoice-send-ledger-review2-Iqd6Sz, I ran npm ci, npm test, npm run build,
and every listed command exactly as registered. All passed:

- demo-isolation, due-date, time-zone, csv-export, sealed-restore,
  backup-validation, offline-reload, local-only, encrypted-backup,
  plain-backup, paid-pdf, license-privacy, pdf-import, concurrent-write.

The observable tests cover demo separation, due-date output, time zones,
CSV/export locks, validation, offline reload/edit, request privacy, backup
contents/encryption, PDF gating/import, license requests, and stale writes.
No claim test failed. The live and README claim-like copy maps to the registry;
no unlisted-claim finding was found.

## Copy audit

Counts treat hyphenated and path/version tokens as one word. No sentence is
over 22 words. Buttons/headings are assessed after the tables.

### Landing page sentences

| # | Sentence | Words | Result |
|---:|---|---:|---|
| 1 | Stored in this browser | 4 | local-only/offline |
| 2 | Track when each client invoice was sent | 7 | clear h1 |
| 3 | For freelancers who prepare invoices over time and need reliable issued, sent, due, and paid dates. | 15 | clear |
| 4 | No analytics or advertising | 4 | local-only |
| 5 | Edit offline after the first visit | 6 | offline-reload |
| 6 | Date record: free · PDF storage: ₹699 once | 8 | paid-pdf |
| 7 | Drafted, issued, due, sent, and paid dates stay together. | 9 | clear |
| 8 | No invoices recorded yet | 4 | clear |
| 9 | Add the next invoice you are drafting, or record one already sent. | 12 | clear |
| 10 | Choose a due rule when you add it. | 8 | due-date |
| 11 | Enter the details or read them from a PDF in this browser. | 12 | pdf-import/local-only |
| 12 | Choose a due rule, then record when you issue, send, and get paid. | 13 | clear |
| 13 | Download a monthly CSV. | 4 | csv-export |
| 14 | Dates in that export become sealed. | 6 | csv-export/sealed-restore |
| 15 | It does not create invoices, calculate tax, take payments, or replace accounting records. | 13 | clear |
| 16 | Invoice records stay in this browser. | 6 | local-only/offline |
| 17 | The app sends no invoice data to a server. | 9 | local-only |
| 18 | Invoice date records, monthly CSV exports, and backups are free. | 10 | paid-plan scope |
| 19 | Adds local PDF storage and includes PDFs in backups. | 9 | paid-pdf |
| 20 | Record dates for invoices you create elsewhere. | 7 | clear |
| 21 | Ceramic artwork generated for this product with Azure OpenAI. | 9 | provenance confirmed in design.md |

The headings Three steps, How it works, Invoice date record, Recorded invoices,
What this does not do and where data stays, and PDF storage plan name their
sections. Clear boundaries is F-2-1. Try it with sample data, Add invoice
manually, Import invoice PDF, Back up or restore, Add your first invoice, and
View PDF storage plan name outcomes. Header PDF plan is F-1-19/F-1-34.

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

All README statements are within the limit, use plain terms, and are covered by
the relevant claim where they make an observable product claim.

## Structure, routing, and leverage

Verified live: route-specific titles, one h1, description, canonical,
Open Graph/Twitter image, favicon, lang, theme color, sitemap, robots,
manifest, skip link, shared header/footer, legal links, CSP response header,
Permissions-Policy, nosniff, referrer policy, and a designed unknown-route
404. Root, /demo, /privacy/, /terms/, robots, sitemap, manifest, and /404.html
return 200; an unknown path returns 404. No dead internal links or runtime
console errors were found. The browser suite verifies focus/back navigation,
axe serious/critical findings, touch-target size, and phone overflow.

There is no runtime AI feature or embedded provider key. The brief does not
imply an AI step; local editable PDF import and monthly CSV export provide the
obvious valuable import/export leverage.

## Earlier finding verification

Every earlier review, polish, and handoff was read. PASS below means the
current code plus live or clean-clone test verifies the earlier defect is
actually fixed. The three FAIL entries are the findings above.

| Earlier ID | Result | Evidence |
|---|---|---|
| F-1-1 | PASS | Cold h1/audience/action are explicit |
| F-1-2 | **FAIL** | Sample cards start below both first viewports |
| F-1-3 | PASS | 14 registry commands pass |
| F-1-4 | PASS | sealed-restore pass and merge code |
| F-1-5 | PASS | backup-validation pass |
| F-1-6 | PASS | no buy link; link crawl |
| F-1-7 | PASS | locked-first test |
| F-1-8 | PASS | concurrent-write and revision code |
| F-1-9 | PASS | 44 px browser test |
| F-1-10 | PASS | immutable host configuration |
| F-1-11 | PASS | live response headers |
| F-1-12 | PASS | live designed 404 |
| F-1-13 | PASS | demo title/canonical/focus |
| F-1-14 | PASS | eight original handoff defects checked |
| F-1-15 | PASS | live metadata/assets |
| F-1-16 | PASS | robots/sitemap/host config |
| F-1-17 | PASS | required main sections |
| F-1-18 | PASS | shared shells/focus/legal tests |
| F-1-19 | **FAIL** | PDF plan versus PDF storage plan |
| F-1-20 | PASS | editable local PDF import |
| F-1-21 | PASS | concrete h1 |
| F-1-22 | PASS | freelancer lede |
| F-1-23 | PASS | date wording and tests |
| F-1-24 | PASS | no unsupported no-account copy |
| F-1-25 | PASS | request-log coverage |
| F-1-26 | PASS | scoped offline copy/test |
| F-1-27 | PASS | literal date caption |
| F-1-28 | PASS | clear empty state |
| F-1-29 | PASS | due-rule test |
| F-1-30 | PASS | slogan absent |
| F-1-31 | PASS | browser-storage/request check |
| F-1-32 | PASS | Recorded invoices |
| F-1-33 | PASS | Invoice date record |
| F-1-34 | **FAIL** | header control is not an action |
| F-1-35 | PASS | root primary action and facts |
| F-1-36 | PASS | concrete README opening |
| F-1-37 | PASS | short README workflow |
| F-1-38 | PASS | plain non-goals |
| F-1-39 | PASS | plain browser-storage wording |
| F-1-40 | PASS | time-zone wording/test |
| F-1-41 | PASS | six terms explained |
| F-1-42 | PASS | stale feature claim absent |
| F-1-43 | PASS | export/restore claims |
| F-1-44 | PASS | two backup claims |
| F-1-45 | PASS | no PWA jargon |
| F-1-46 | PASS | axe checks |
| F-1-47 | PASS | price/no dead purchase |
| F-1-48 | PASS | license privacy claim |
| F-1-49 | PASS | unsupported setup claim absent |
| F-1-50 | PASS | storage wording, except F-1-19 abbreviation |
| F-1-51 | PASS | plain-backup claim |
| F-1-52 | PASS | encrypted-backup claim |
| F-1-53 | PASS | broad clearing claim absent |
| F-1-54 | PASS | no user-facing scope claim |
| F-1-55 | PASS | no dead checkout |
| F-1-56 | PASS | availability wording is accurate |
| F-1-57 | PASS | no repository-secret claim |
| F-1-58 | PASS | Stored in this browser |

## What would make this perfect

Lead /demo with a visible populated sample ledger at both viewports, rename the
header action View PDF storage plan, and replace/remove Clear boundaries.
Re-run the viewport demo check, copy audit, all claims, and the browser suite.
Only then can the verdict be PASS.

