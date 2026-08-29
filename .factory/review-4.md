# Adversarial first-read review 4 — FAIL

- Live URL: <https://invoice-send-ledger.sociobot.in>
- Reviewed: 29 August 2026 UTC; revision `55ad207c7c253ab3dd2078affdcac085fa20a88c`
- Contexts: fresh Chromium at 390 × 844 and 1440 × 900; clean clone

## Verdict

**FAIL.** One earlier finding regressed and two minor findings remain.

## Cold first read

Before scrolling, both viewports answer the required questions. It tracks when
client invoices were sent (and their issued/due/paid dates), is for freelancers
who prepare invoices over time, and the clear first action is **Try it with
sample data** (“Opens three sample invoices”). The exact h1 is “Track when each
client invoice was sent”; the exact audience sentence is “For freelancers who
prepare invoices over time and need reliable issued, sent, due, and paid
dates.” No first-read finding applies.

## Findings

| ID | Severity | Exact quote/location | Why / concrete fix |
|---|---|---|---|
| **F-1-18** | **BLOCKING — regression** | `/` and `/privacy/` footers: “Built by Param Factory · **build polish-3**”; `/404.html` and `/offline.html`: “Built by Param Factory · **build polish-2**”. Also present in `public/404.html` and `public/offline.html`. | This reopens the shared-shell finding: one product exposes two build identities. Use one current build id on every app, legal, 404, and offline footer; add a cross-route equality test. |
| **F-4-1** | Minor | `public/404.html` and `public/offline.html` omit canonical, Open Graph, and Twitter metadata; live head audit found no `canonical`, `og:image`, or `twitter:card`. | Fallback routes lack the required route metadata. Add canonical plus route title/description and existing 1200 × 630 social image metadata; test both routes. |
| **F-4-2** | Minor | PDF-plan dialog: “**License sales and refunds are handled by Sociobot/Dodo, the merchant of record. A refund revokes the license.**” | Concrete merchant/refund/revocation claims have no claims.json entry or tagged proof. `license-privacy` tests only verification endpoint/token/cache. Remove this statement or add a deterministic listed refund/revocation claim test. |

## Demo, claims, and behavior

Root reached `/demo` in one click. MOSS-118 was already in the first viewport
(top 653.61 px mobile; 469.08 px desktop). The banner, Reset demo, and Start
for real were present. A live manual flow created `LIVE-REAL-REVIEW-4`, entered
demo, confirmed the real record was absent and three samples present, changed
MOSS-118, reset it, then returned to the separate real record. Every request
was same-origin and there were no console errors. `src/db.ts` confirms separate
`demo:send-date-ledger` and `send-date-ledger` namespaces.

Clean clone `/tmp/invoice-send-ledger-review4-E2dZ0L` passed `npm ci`, `npm
test` (20 tests), `npm run build` (`dist/`; JS 18.31 KB gzip, CSS 6.10 KB), and
`npm run test:e2e` (52 tests). Each exact registered command passed:
`demo-isolation`, `due-date`, `time-zone`, `csv-export`, `sealed-restore`,
`backup-validation`, `offline-reload`, `local-only`, `encrypted-backup`,
`plain-backup`, `paid-pdf`, `license-privacy`, `pdf-import`, and
`concurrent-write`. Offline and request-log claims therefore have direct
Playwright evidence. No listed claim failed; F-4-2 is unlisted.

## Copy audit

No audited sentence is over 22 words; no banned marketing copy, jargon,
metaphor heading, inconsistent core term, or non-result-naming landing button
was found. Headings work out of context: **Invoice date record**, **Recorded
invoices**, **How it works**, **What this does not do and where data stays**,
and **Keep the sent PDF with its dates**. Actions name results.

### Landing sentences (word count)

1. Stored in this browser (4)
2. Track when each client invoice was sent (7)
3. For freelancers who prepare invoices over time and need reliable issued, sent, due, and paid dates. (15)
4. Try it with sample data (5)
5. Opens three sample invoices (4)
6. No analytics or advertising (4)
7. Edit offline after the first visit (6)
8. Date record: free · PDF storage: ₹699 once (8)
9. Drafted, issued, due, sent, and paid dates stay together. (9)
10. No invoices recorded yet (4)
11. Add the next invoice you are drafting, or record one already sent. (12)
12. Choose a due rule when you add it. (8)
13. Enter the details or read them from a PDF in this browser. (12)
14. Choose a due rule, then record when you issue, send, and get paid. (13)
15. Download a monthly CSV. (4)
16. Dates in that export become sealed. (6)
17. It does not create invoices, calculate tax, take payments, or replace accounting records. (13)
18. Invoice records stay in this browser. (6)
19. The app sends no invoice data to a server. (9)
20. Invoice date records, monthly CSV exports, and backups are free. (10)
21. Adds local PDF storage and includes PDFs in backups. (9)
22. Record dates for invoices you create elsewhere. (7)
23. Ceramic artwork generated for this product with Azure OpenAI. (9)

### README sentences (word count)

1. Send-Date Ledger helps freelancers record when an existing invoice was issued, sent, due, and paid. (15)
2. It records invoice dates. (4)
3. It does not create invoices, calculate tax, take payments, or replace accounting records. (13)
4. Records drafted, issued, sent, due, and paid dates with their time zones. (12)
5. Calculates due dates from same-day, 7, 14, 30, 45, or 60-day terms. (12)
6. Reads invoice reference and amount from a PDF in your browser. (11)
7. You can correct every imported field. (6)
8. Exports a monthly CSV. (4)
9. Dates included in that export become sealed against later edits. (10)
10. Rejects invalid backups before changing any records. (7)
11. Older backups cannot change sealed dates. (6)
12. Downloads readable JSON or passphrase-encrypted backups. (6)
13. Edits records offline after the first visit. (7)
14. Stops a stale tab from overwriting a newer invoice date. (10)
15. Invoice date records are free. (5)
16. A ₹699 one-time plan adds PDF storage in this browser. (10)
17. Open `/demo` or `/?demo=1`. (4)
18. Both load three realistic sample invoices in the separate `demo:send-date-ledger` database. (12)
19. Select Reset demo to restore the original samples. (8)
20. Select Start for real to discard demo changes and open the real database. (13)
21. Use Node.js 20 or newer. (5)
22. Playwright is pinned to 1.58.2. (5)
23. Every product claim and its command is listed in `.factory/claims.json`. (10)
24. Invoice records and PDFs use browser storage. (7)
25. Demo records use a separate database and never open the real one. (12)
26. Select Back up or restore, then Download plain JSON for a readable backup. (13)
27. The encrypted option hides invoice text with a passphrase-derived AES-256-GCM key. (11)
28. The app does not store the passphrase. (7)
29. Keep it somewhere safe because it cannot be recovered. (9)
30. Deploy dist/ as a static site. (6)
31. The included host configuration supplies explicit routes, a 404 response, security headers, and immutable caching for hashed assets. (18)
32. Valid existing licenses can be pasted into the PDF storage plan. (11)
33. Verification sends only the token to Sociobot and reuses a successful result for one day. (15)

## Structure, history, and leverage

Live `/`, `/demo`, `/?demo=1`, legal pages, 404, offline, robots, sitemap,
and manifest returned 200; an unknown URL returned styled HTTP 404. Crawled
links were live or explicit `mailto:`. CSP including `frame-ancestors 'none'`,
Permissions-Policy, nosniff, referrer policy, immutable hashed assets, h1
focus after navigation, back behavior, no 390 px overflow, and no
serious/critical Axe result verified. F-4-1 is the metadata exception.

The product retains its distinct ceramic visual system. The brief does not
imply AI; editable local PDF import and CSV export provide the expected
leverage. No runtime AI or provider key was found.

Every earlier item was rechecked, not merely read. F-1-1 through F-1-17 and
F-1-19 through F-1-58 are confirmed by the cold/live checks and current
source or the stated clean-clone tests: hero clarity, isolated demo, claims,
integrity, PDF gate/import, stale-write protection, targets, cache/headers,
404/routing/metadata, shared shells, terminology, copy, privacy, offline,
backups, price/link behavior, accessibility, and secret absence. **F-1-18 is
the sole earlier-item failure and is reopened above.** F-2-1 is confirmed:
“Limits and privacy” remains. F-3-1 is confirmed: “New licenses are not for
sale” remains absent.

## What would make this perfect

Use one footer build id, add fallback metadata, and remove or test the
merchant/refund claim. Rerun all listed claim commands, full browser suite,
and the cold live audit. Only zero findings supports PASS.
