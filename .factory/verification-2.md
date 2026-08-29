# Independent verification 2 — FAIL

- Work order: `invoice-send-ledger-verify-2`
- Candidate: `ef937f47e26650bbc49ff703ccbfb36a1b4a08de`
- Live URL: <https://invoice-send-ledger.sociobot.in>
- Verified: 29 August 2026 UTC
- Artifact: offline-first PWA
- Product code changed by verifier: no

## Verdict

**FAIL.** The complete invoice-date workflow works, every declared claim passes,
the live deployment byte-matches the candidate, and the mobile Lighthouse median
meets the performance threshold. One explicit PWA performance requirement is
still unmet: three content-hashed PDF-worker files are served with a 30-second
revalidation policy instead of long-lived immutable caching.

This is a low user-severity defect because the worker is deferred and the service
worker retains it after use. It is release-blocking under this work order because
the supplied performance contract requires immutable caching for hashed assets.

## Mandatory first-read and demo gate

**Pass.** A cold 1440 x 900 visit showed, in the first viewport:

- What it does: “Track when each client invoice was sent.”
- Who it is for: freelancers who prepare invoices over time and need reliable
  issued, sent, due, and paid dates.
- What to do first: “Try it with sample data,” immediately followed by “Opens
  three sample invoices.”

The action opens `/demo` in one click. The resulting first screen contains three
realistic invoices and the persistent “Demo — sample data, nothing is saved”
banner, with **Reset demo** and **Start for real**. A fresh-context isolation test
confirmed that demo changes use `demo:send-date-ledger`, do not reveal the real
database, reset to the three samples, and are discarded on exit.

The cold page requested only `/`, the hashed application JS/CSS, and the ceramic
WebP. It produced no console or page error. Visual inspection found a clear,
product-specific ceramic-ledger treatment rather than a generic framework page.

## Claims gate

`.factory/claims.json` is present. Each ID occurs exactly once as an
`@claim:<id>` test. After `npm ci`, every exact command from that file was run
separately against the production demo entry point and passed:

| Claim | Result | Observable evidence |
|---|---|---|
| `demo-isolation` | Pass | Real record survived demo edits/reset; samples never appeared in real mode. |
| `due-date` | Pass | Same-day, Net 7, 14, 30, 45, and 60 produced the exact expected dates. |
| `time-zone` | Pass | Sample stamps retained and displayed `Asia/Kolkata`. |
| `csv-export` | Pass | August CSV had one header plus three rows; all three records became sealed. |
| `sealed-restore` | Pass | A pre-export backup could not re-enable or change sealed issue/sent dates. |
| `backup-validation` | Pass | An invalid IANA zone was rejected; reload retained only the three samples. |
| `offline-reload` | Pass | Offline reload, sent-date edit, and second offline reload all succeeded. |
| `local-only` | Pass | The complete demo edit/backup request log contained no off-origin request. |
| `encrypted-backup` | Pass | Ciphertext hid invoice text and passphrase, then restored locally. |
| `plain-backup` | Pass | JSON contained three records and the complete monthly-export history. |
| `pdf-storage` | Pass | Over 10 MB was rejected; a valid PDF persisted through both backup formats. |
| `pdf-import` | Pass | A generated PDF populated editable reference and amount fields locally. |
| `concurrent-write` | Pass | A stale tab showed a conflict and retained the newer sent date. |

Landing, legal, and README claims were cross-checked against the list. The
material promises are covered by these claim tests; no separate paid, sign-in,
AI, sync, or server-processing promise remains on the product.

## Clean candidate and local quality gates

The checkout began at the requested SHA, and `origin/main` resolved to the same
full SHA. Test-generated tracked screenshots were restored after execution; only
this report and the handoff are intentional verifier changes.

```text
npm ci                                      PASS; 69 packages, 0 vulnerabilities
npm audit --audit-level=high                PASS; 0 vulnerabilities
npm test                                    PASS; 4 files, 21 tests
./node_modules/.bin/tsc -b --pretty false   PASS
npm run build                               PASS; dist/ produced
npm run test:e2e                            PASS; 48 tests
npm run check                               PASS; 21 unit + build + 48 browser tests
```

There is no lint script. Type checking is part of the exact build and was also
run independently. Playwright resolves to the required `1.58.2` from the lockfile.

Production output sizes:

- Initial application JS: 55.39 KB raw / 16.62 KB gzip.
- CSS: 23.24 KB raw / 5.81 KB gzip.
- Hero WebP: 33.17 KB.
- Fonts: 0 bytes; the product uses system stacks.
- Deferred PDF parser: 433.00 KB raw / 128.94 KB gzip.

The initial JS, CSS, font, and hero budgets all pass.

## Deployment identity and routing

All 26 deployable files in `dist/` other than the host configuration were fetched
from their direct production paths and byte-compared. Every HTML page, hashed
bundle and map, service worker, manifest, legal asset, icon, illustration, and
social image matched. Live HTML references the locally built
`index-CKbY8eIK.js` and `index-E92yvaia.css`.

- HTTP redirects to HTTPS with 301.
- `/`, `/demo`, `/privacy/`, `/terms/`, `/manifest.webmanifest`, and `/sw.js`
  return 200.
- An unknown route returns the designed page with a real HTTP 404.
- Every visible internal link returned 2xx; external links were only documented
  `mailto:` contacts.
- Each route has the expected title, `lang="en"`, exactly one h1, one main
  landmark, route-specific canonical/OG metadata, focused h1, and shared footer.
- No route produced a console or page error.

The app has no backend, authentication, billing call, or other server-side
product endpoint. The 429/`Retry-After` and Entra authority checks are therefore
not applicable. The removed purchase surface is documented as an intentional
deviation until a Sociobot product is provisioned.

## Independent live workflow and resilience

A fresh production demo was exercised beyond the repository tests:

- Required-field submission focused the reference field and explained the
  missing value. A negative amount was rejected, then a zero amount saved.
- The documented maximum amount `999999999` saved; `1000000000` was rejected
  with “Value must be less than or equal to 999999999.”
- Issue-before-draft and sent-before-issue produced both chronology errors. After
  correcting the dates, the same form saved normally.
- A New York record issued across the March DST change retained
  `America/New_York` and calculated 14 March from a 7 March Net 7 issue.
- A fixed 29 August issue with Net 60 previewed 28 October.
- HTML-like note text remained text and created no injected element or error.
- Search reduced the four-record sample to the intended record and recovered
  when cleared.
- The August CSV was 780 bytes with one header plus four invoice rows, included
  the new record, and disabled its exported issue/sent inputs.
- A malformed JSON restore stayed in the dialog, announced “not valid JSON,” and
  left all four records intact.
- Plain backup contained four invoices and one export. The 8,160-byte encrypted
  backup identified AES-256-GCM and did not contain the new invoice reference.
- The product reloaded offline, recorded a sent event, reloaded again offline,
  and retained the Sent state.

These valid and invalid flows generated no browser console or page error.

## Privacy and security headers

The request log covered demo reset, invalid and valid entry, search, CSV export,
plain/encrypted backup, corrupt restore, service-worker readiness, offline edit,
and reload. Its unique network URLs were only the live `/demo` document and the
same-origin hashed JS/CSS. No invoice value, analytics request, advertising
request, CDN font, external script, or third-party origin was observed. Source
review found no runtime analytics or remote API call.

Live responses include:

- `Content-Security-Policy` restricted to self, with `object-src 'none'` and
  header-only `frame-ancestors 'none'`.
- `Permissions-Policy` disabling sensors, camera, microphone, payment, and USB.
- `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, and
  `Referrer-Policy: strict-origin-when-cross-origin`.
- `no-cache` for HTML entry points and `sw.js`.

No CSP violation or other response-header console error occurred.

## Accessibility, responsive layout, and motion

- Fresh live Axe WCAG A/AA scans found zero serious/critical findings on root,
  demo light, demo dark, the 390 px invoice dialog, privacy, terms, 404, and
  offline pages.
- Initial route focus is the h1. Reverse keyboard navigation reached theme,
  Privacy, Demo, wordmark, then the skip link; activating the skip link focused
  `main`. Forward navigation reached the demo action and manual-entry button.
- Space opened the invoice dialog, reference received focus, Escape closed it,
  and focus returned to the trigger. The visible focus indicator was a 3 px
  solid outline (`rgb(189, 105, 23)`).
- Reduced-motion emulation found no visible looping animation or transition over
  10 ms.
- At 390 x 844, light/dark and dialog Axe scans passed, all 24 measured
  interactive targets were at least 44 px, the document was exactly 390 px wide,
  and the 352 x 828 dialog scrolled to reachable actions.
- The 640 px layout used as the 200%-zoom equivalent had no horizontal overflow.
- Desktop and mobile screenshots were inspected. Text, controls, event rails,
  dark mode, sticky dialog actions, and the original ceramic artwork were
  legible and coherent with `.factory/design.md`.

## PWA, offline, update, and performance

Chromium reported no manifest parse or installability error. The manifest has a
versioned start URL, standalone display, 192/512 icons, and a maskable icon. The
live controller is `/sw.js` with root scope and the expected
`sdl-shell-v6-static` / `sdl-shell-v6-runtime` caches.

An isolated server delivered the exact candidate shell, then a byte-changed
service worker. The app displayed “A fresh version is ready”; **Update now** sent
`SKIP_WAITING`, transferred control, reloaded the demo, and replaced both cache
names with the new version. No error occurred.

Three identical Lighthouse 12.8.2 mobile runs were used because the first CPU-
throttled sample was an outlier:

| Run | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | 88 | 100 | 100 | 100 | 1.15 s | 0.025 | 490 ms |
| 2 | 100 | 100 | 100 | 100 | 1.14 s | 0.025 | 33 ms |
| 3 | 98 | 100 | 100 | 100 | 1.11 s | 0.019 | 166 ms |

Median Performance is 98 and median LCP about 1.14 seconds. Each run transferred
about 78.4 KB. Synthetic navigation does not emit field INP; Event Timing across
theme, dialog-open, and keyboard-close interactions peaked at 168 ms, below the
200 ms interaction budget.

## Defect

### Low, release-blocking contract miss — hashed PDF workers are not immutable

The following candidate files contain hashes in their names but return
`cache-control: public, must-revalidate, max-age=30` in production:

```text
/assets/pdf.worker.min-CHFwMXne.mjs      1,262,398 bytes
/assets/pdf.worker.min-CevBI0zc.js             120 bytes
/assets/pdf.worker.min-CevBI0zc.js.map         269 bytes
```

The main hashed application JS/CSS and deferred `pdf-BRz36HYW.js` correctly
return `public, max-age=31536000, immutable`. The current
`/assets/pdf-*` rule does not apply to the `pdf.worker.min-*` names on the live
host, so the general 30-second asset policy wins.

Add an explicit `/assets/pdf.worker.min-*` immutable route before the broad
`/assets/*` route, deploy, and confirm all three response headers. Then rerun the
artifact comparison, offline/update test, and mobile Lighthouse. No product-code
change is needed for the observed defect.
