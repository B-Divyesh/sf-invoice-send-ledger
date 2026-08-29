# Independent verification 3 — PASS

- Work order: `invoice-send-ledger-verify-3`
- Candidate commit: `a80a0e507a7d99ff0c18b4167fe488a3285e05fc`
- Live URL: <https://invoice-send-ledger.sociobot.in>
- Verified: 29 August 2026 UTC
- Artifact: offline-first PWA
- Product code changed by verifier: no

## Verdict

**PASS.** Fresh clean-clone and live-deployment evidence confirms that the
previous deployment-only cache failure is repaired. The live site byte-matches
the candidate's deployable output, including each previously affected hashed
PDF worker, now served with immutable caching. The complete offline invoice
date-register flow, demo isolation, local-only privacy model, accessibility,
mobile layout, PWA offline reload, and service-worker update path all passed.

## Mandatory first-read and demo gate

**Pass.** A cold 1440 × 900 visit to the live root made all three required
facts clear in the first viewport:

- What it does: “Track when each client invoice was sent.”
- Who it is for: freelancers who prepare invoices over time and need reliable
  issued, sent, due, and paid dates.
- What to do first: “Try it with sample data,” followed immediately by
  “Opens three sample invoices.”

The one-click action opens `/demo`. That screen immediately shows three
realistic invoice records and the persistent “Demo — sample data, nothing is
saved” banner with **Reset demo** and **Start for real**. The fresh demo has
separate storage, as demonstrated by the clean claim test below.

The cold live root loaded without console/page errors and requested only the
same-origin document, hashed JS/CSS, and product WebP illustration. Its
visible copy plainly describes an offline invoice-date record rather than
accounting, tax, payments, or statutory bookkeeping.

## Claims gate — clean clone

`.factory/claims.json` exists and contains 13 claim entries. A new clone of
the requested SHA was clean before install; after `npm ci`, every exact test
command from the file was run separately against its demo entry point. All
passed (the log is `/tmp/invoice-claims-clean.log` in this verifier run).

| Claim | Result | Evidence checked |
|---|---|---|
| `demo-isolation` | PASS | Real and demo records remain separate across reset and exit. |
| `due-date` | PASS | Issue-day, 7, 14, 30, 45, and 60-day rules produced exact dates. |
| `time-zone` | PASS | IANA zones, including `Asia/Kolkata`, remain displayed with dates. |
| `csv-export` | PASS | Monthly CSV has the expected rows and seals exported dates. |
| `sealed-restore` | PASS | An earlier backup cannot change dates sealed by export. |
| `backup-validation` | PASS | Invalid IANA-zone backup is rejected without changing records. |
| `offline-reload` | PASS | Demo edits survive offline reload after first visit. |
| `local-only` | PASS | Demo record activity has no off-origin request. |
| `encrypted-backup` | PASS | Encrypted backup hides invoice text/passphrase and restores locally. |
| `plain-backup` | PASS | Plain JSON includes records and monthly CSV history. |
| `pdf-storage` | PASS | 10 MB limit is enforced; valid PDF survives both backups. |
| `pdf-import` | PASS | Local PDF read fills editable reference and amount fields. |
| `concurrent-write` | PASS | A stale tab cannot replace a newer recorded sent date. |

No unlisted material product promise was found in the landing page, README,
privacy, or terms copy. There is no sign-in, paid unlock, AI feature, backend
API, analytics, or third-party runtime service. The 429/`Retry-After` and
Sociobot Entra tenant checks are therefore not applicable.

## Clean local quality gates

The clean clone resolved exactly to the candidate SHA. Playwright is pinned to
`1.58.2`; there is no separate lint script, and TypeScript checking is part of
the production build.

```text
npm ci                                      PASS; 69 packages, 0 vulnerabilities
npm test                                    PASS; 4 files, 22 tests
./node_modules/.bin/tsc -b --pretty false   PASS
npm run build                               PASS; dist/ produced
npm run test:e2e                            PASS; 48 tests (desktop and mobile)
npm run check                               PASS; 22 unit + build + 48 browser tests
```

Production output is within the static-PWA initial-load budgets:

- Initial JS: 55.39 KB raw / 16.62 KB gzip (under 200 KB).
- CSS: 23.24 KB raw / 5.81 KB gzip (under 50 KB).
- Self-hosted/system fonts: 0 bytes.
- Hero artwork: 33.17 KB (under 300 KB).
- Deferred PDF parser: 433.00 KB raw / 128.94 KB gzip; it is not on the
  initial app path.

A fresh live mobile Lighthouse run through Chromium scored Performance **97**,
Accessibility **100**, Best Practices **100**, and SEO **100**. It measured
LCP 1.067 s, CLS 0.019, total blocking time 186 ms, and 45,126 bytes
transferred. The first launcher attempt could not locate Chrome automatically;
the final recorded run used the preinstalled Chromium remote-debugging port.

## Live deployment identity, headers, and privacy

After building the candidate, all **25** deployable `dist/` files other than
host-only `staticwebapp.config.json` were fetched from their production paths
and SHA-256 byte-compared. Every file matched: root/demo/legal HTML, hashed
JS/CSS/maps, both PDF workers and their map, service worker, manifest, icons,
artwork, legal assets, sitemap, robots, offline page, and 404 page.

In particular, the repaired production workers return exactly:

```text
/assets/pdf.worker.min-CHFwMXne.mjs       Cache-Control: public, max-age=31536000, immutable
/assets/pdf.worker.min-CevBI0zc.js        Cache-Control: public, max-age=31536000, immutable
/assets/pdf.worker.min-CevBI0zc.js.map    Cache-Control: public, max-age=31536000, immutable
```

The root and service worker are `no-cache`; hashed main JS and deferred PDF
bundle are immutable; unknown paths return a designed HTTP 404. Live responses
also include restrictive same-origin CSP (`connect-src 'self'` and header-only
`frame-ancestors 'none'`), HSTS, `nosniff`, strict-origin referrer policy, and
a restrictive permissions policy. The manifest has the correct webmanifest
type. HTTP redirects to HTTPS.

`verify-url.sh` passed against both live root and demo: title, `lang="en"`,
one h1, `<main>`, image alternatives, labeled controls, and zero console/page
errors. Its captures are under `.factory/qa-evidence/verify-root/` and
`.factory/qa-evidence/verify-demo/` in this working tree. Fresh Playwright
request logging of the live root found only
`https://invoice-send-ledger.sociobot.in`; the claim suite independently logs
the complete demo edit/backup flow and likewise accepts only same-origin
requests. No invoice content was sent to another origin.

## Product, accessibility, and PWA exercise

- A fresh live demo successfully opened an Add invoice dialog with focus on
  the reference field. Required-reference submission announced the native
  “Please fill out this field” message; a negative amount gave “Value must be
  greater than or equal to 0.” After correcting to zero, the invoice saved,
  issued, and recorded Sent with no console/page error.
- The complete browser suite also covered chronology, PDF import/storage,
  encrypted/plain backup and restore, monthly sealing, time zones, stale tabs,
  routes, invalid backups, and export recovery paths.
- Live Axe WCAG A/AA scans had zero serious or critical findings on root and
  the 390 px demo. At 390 px the document width was exactly 390 px, all tested
  visible buttons/header/footer/demo controls were at least 44 × 44 CSS px,
  and there was no horizontal overflow or console/page error.
- Keyboard navigation reached every header control and the skip link; using
  the skip link moved focus to the `h1` in `main`. The dialog initially focused
  its reference field. Reduced-motion emulation reduced all inspected
  transition/animation durations to 0.01 ms.
- Live `/demo` installed and controlled through `/sw.js`; after first load it
  reloaded offline with “OFFLINE · CHANGES STILL SAVE” and no error.
- For the update-path check, the exact candidate `dist/` was served locally,
  then a valid byte-changed service worker was supplied. The app showed “A
  fresh version is ready”; **Update now** activated it and reloaded the demo
  without error.

## Defects by severity

None found.

## Result

**PASS — candidate `a80a0e507a7d99ff0c18b4167fe488a3285e05fc` is accepted for
the live URL above.**
