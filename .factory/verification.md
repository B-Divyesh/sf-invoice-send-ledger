# Independent verification — FAIL

- Work order: `invoice-send-ledger-verify-1`
- Verified candidate: `fabde45771a44f73832bd4d7d6a65001c1d37e33`
- Verified deployment: <https://invoice-send-ledger.sociobot.in>
- Verification date: 2026-08-28 UTC
- Artifact: offline-first PWA

## Verdict

**FAIL.** The deployed artifact exactly matches the candidate, the free ledger's
main workflow works, and the repository's quality gates pass. Release acceptance
is nevertheless blocked by four high-severity defects: restored data can undo
exported-date locks, a structurally invalid backup can leave IndexedDB data
unrenderable and prevent later ledger loads, the advertised checkout returns
404, and a never-verified token unlocks the paid PDF feature when verification
is unavailable.

No product code was changed during verification.

## Candidate and deployment identity

- A detached clean worktree was created from the full candidate SHA. `npm ci`
  completed there with Node `v22.23.2` and npm `10.9.8`; the detached worktree
  was clean before testing.
- `git ls-remote origin refs/heads/main` returned the candidate SHA.
- A fresh production build emitted 15 files. Every deployed file—including
  `index.html`, hashed JS/CSS, source map, service worker, manifest, icons,
  artwork, legal stylesheet, offline page, privacy page, and terms page—was
  downloaded and byte-compared with `dist/`; all 15 matched.
- The live HTML references the same `index-CeBOVwDS.js` and
  `index-7MXCzzlK.css` produced locally.
- HTTP redirects to HTTPS with 301. HTTPS returned 200 for `/`, `/privacy/`,
  `/terms/`, `/manifest.webmanifest`, and `/sw.js`.

## Quality gates

Run from the detached candidate worktree:

```text
npm ci                                      PASS; 59 packages, 0 vulnerabilities
npm audit --audit-level=high                PASS; 0 vulnerabilities
npm test                                    PASS; 7/7 tests
./node_modules/.bin/tsc -b --pretty false   PASS
npm run build                               PASS; dist/index.html present
npm run test:e2e                            PASS; 6/6 tests
npm run check                               PASS; repeats test, build, and E2E
```

There is no separate lint script. Type checking is part of the exact production
build and was also run independently.

The factory URL verifier passed both local preview and live deployment: HTTP
200, title present, `lang="en"`, exactly one h1, main landmark present, no
missing image alternatives, no unlabeled icon buttons, and no console/page
errors on the normal load. The fresh rerun observed 604 ms locally and 985 ms
live; these are smoke-test timings rather than performance-profile results.

## Functional and resilience coverage

The same independent Chromium flow was run against the production build locally
and against the live URL. Each run completed 40 checks; 39 passed and the same
44 px target check failed.

Passing coverage included:

- Empty state; add, edit, delete/cancel, search, clear-filter, issue, send, pay,
  month selection, CSV download, snapshot availability, and refresh persistence.
- Zero and maximum accepted amounts (`0` and `999999999`), rejected negative and
  above-maximum amounts, required inputs, HTML-like user text escaping, and
  chronology rejection for issue-before-draft and sent-before-issue.
- `America/New_York` stamps retained their IANA zone. An issue on 2 August with
  Net 30 previewed 1 September and exported the expected date.
- CSV content had the exact amount/date/zone values and neutralized a reference
  beginning `=SUM(2,3)` with a leading apostrophe.
- Exported date inputs were disabled through the normal edit UI, while a later
  payment event remained appendable.
- Plain backup, AES-256-GCM encrypted backup, short-passphrase rejection,
  wrong-passphrase error, encrypted restore, and plain restore into an empty
  database.
- With a mocked valid cached license: non-PDF rejection, PDF save and refresh
  persistence, PDF inclusion in backup, and rejection above 10 MB all passed.

## PWA and offline behavior

- Chromium parsed the deployed manifest with no manifest or installability
  errors. Name, versioned start URL, standalone display, 192/512 icons, and a
  maskable icon were present. The host serves the manifest as
  `application/octet-stream`, but Chromium still accepted it.
- The service worker controlled the page. Both local and live tests reloaded
  offline with existing data, created a new invoice while offline, reloaded
  again offline, and retained the new record.
- An update simulation served the candidate service worker, then a byte-changed
  version. `registration.update()` produced the in-app “A fresh version is
  ready” notice; “Update now” sent `SKIP_WAITING`, changed the controller, and
  reloaded successfully. Only `sdl-shell-v1-static` and
  `sdl-shell-v1-runtime` remained; no console/page error occurred.

## Accessibility, responsive design, and visual QA

- Axe WCAG A/AA scans found zero serious or critical findings in the light empty
  state, dark populated state, and 390 px invoice dialog, locally and live.
- Keyboard smoke tests passed: skip link is first, moves focus to main, Space
  opens the add dialog, initial focus reaches the reference field, Escape closes
  the dialog and restores focus, and the focus indicator is a visible 3 px
  outline.
- Reduced-motion emulation reduced dialog animation and transition durations to
  `0.00001s` with no continuing motion.
- The 390×844 dialog remained within the viewport and kept actions reachable.
  Desktop and phone screenshots were visually inspected in light and dark
  treatments. Content hierarchy, legibility, empty state, and generated ceramic
  artwork were coherent with `.factory/design.md`; no artwork text/brand defect
  was visible. Provenance and prompt sidecars are present.
- At the 640 CSS px layout equivalent to 200% zoom from a 1280 px viewport, the
  page and dialog had no horizontal overflow. The 390 px dialog's due-rule field
  and actions remained reachable by scrolling, and the computed body size was
  16 px.
- Valid flows produced zero browser console/page errors. The corrupt-import case
  below produces a reproducible page error.

## Privacy, network, headers, and performance

- A request log across the full free workflow, backup, reload, and offline tests
  contained only the application origin. Source review found no analytics,
  tracking, CDN font, or third-party runtime script. The only external runtime
  endpoint is the disclosed Sociobot license API.
- License verification CORS accepts the live origin and returns `cache-control:
  no-store`. The app strips a returned token from the visible URL, stores it at
  the specified localStorage key, sends only that token to verification, reacts
  to an invalid verdict, and does not call verification again within a day.
- Live responses include HSTS, `X-Content-Type-Options: nosniff`, and
  `Referrer-Policy: strict-origin-when-cross-origin`. They do not include CSP or
  Permissions-Policy.
- Lighthouse 12.8.2 against the live mobile profile: performance 100,
  accessibility 100, best practices 100, SEO 100; FCP 1.0 s, LCP 1.3 s, CLS
  0.024, TBT 89 ms, 7 requests, 73,342 total transferred bytes. Lab Lighthouse
  does not emit field INP for a synthetic navigation; exercised UI actions
  showed no visible interaction delay.
- Production payloads: JS 42.69 KB raw / 12.95 KB gzip, CSS 20.75 KB raw /
  5.34 KB gzip, hero WebP 33.17 KB, fonts 0. All stated size budgets pass.

## Defects

### High — restoring an older backup removes export seals and changes sealed dates

1. Create an invoice issued 2 August and sent 2 August.
2. Export August; the record becomes sealed and date controls are disabled.
3. Restore a pre-export/plain backup with the same invoice ID, changed issue and
   sent dates, and no `lockedFields`.
4. The live record changes from issue instant `2026-08-02T09:00:00.000Z` to
   `2026-08-05T09:00:00.000Z`; `lockedFields` becomes `[]`, and the issued input
   is editable, while the old export snapshot remains.

This violates the brief's “immutable once exported” constraint and the UI's
promise that every included date is locked against later edits. Restore must
merge against retained snapshots/locks or reject changes to sealed fields.

### High — a structurally invalid backup is committed before validation and prevents later loads

A JSON file with the supported format/version and a record containing timezone
`Not/A_Timezone` is accepted far enough to persist the record. Rendering then
throws `Invalid time zone specified: Not/A_Timezone`; the restore dialog has
already closed, so its error is hidden. On reload the same page error occurs and
the ledger remains indefinitely at “Opening your ledger…”. The invalid row is
still in IndexedDB. Because restore is additive, a normal valid backup does not
remove it; practical recovery requires clearing site storage and losing local
data.

Validate the complete schema, dates, zones, numeric bounds, IDs, locks, and
snapshot relationships before beginning any write, and commit restore data
atomically only after validation and render-safe normalization.

### High — advertised Studio checkout is unavailable in production

`GET https://api.sociobot.in/api/v1/products/invoice-send-ledger/checkout`
returned HTTP 404 with:

```json
{"error":"enabled factory product","status":404}
```

The live ₹699 “Buy Studio once” action therefore cannot complete. Register and
enable the production product/return URL, then exercise a real hosted checkout
and returned license before release.

### High — an unverified arbitrary token unlocks Studio when verification fails

With the verification request forced to a network failure, pasting
`not-a-real-license` and selecting “Verify” displays “Studio is active” and
enables the PDF input. A token with no cached valid verdict must remain locked;
offline optimism should apply only to a previously validated cached verdict.

### Medium — a stale second tab can silently erase a newly recorded event

Two tabs loaded the same draft. Tab A recorded “Issue now”. Tab B, still holding
the stale draft, edited only its note and saved. Reloading Tab A showed that
`issuedAt` had been removed. There is no conflict notice or visible edit history.
This is a material chronology-loss risk for a local audit guardrail.

### Medium — compact invoice actions are below the required touch target

The populated ledger's visible `Edit` action measured 55.08×40 CSS px. The
shared `.small` rule sets a 40 px minimum height, so other compact lifecycle and
row actions can also fall below the contract's 44×44 px minimum. Axe does not
flag target size in this configuration.

### Low — immutable deployment caching is not configured for hashed assets

The hashed JS and CSS both return `cache-control: public, must-revalidate,
max-age=30`, as do images and icons. The performance contract calls for
long-lived immutable caching for content-hashed assets. Keep short/no-cache
revalidation for HTML and `sw.js`, but serve hashed assets with a long max-age
and `immutable`.

### Low — response hardening omits CSP and Permissions-Policy

HSTS, referrer policy, and MIME sniffing protection are present, but neither a
Content-Security-Policy nor Permissions-Policy is returned. This did not cause a
functional or Lighthouse failure, but CSP is worthwhile defense in depth for an
application holding invoice metadata and PDFs in browser storage.

## Release decision and retest

Do not release this candidate as accepted. Correct all high-severity defects,
add regression tests for sealed-record restore, full backup schema validation,
initial-license verification failure, and two-tab stale writes, then repeat the
live checkout, exact-artifact comparison, offline/update, axe, response-header,
and Lighthouse checks. The cache and touch-target issues should also be fixed to
meet the supplied platform contract.
