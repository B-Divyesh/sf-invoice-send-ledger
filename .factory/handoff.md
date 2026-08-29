# Repair handoff — PASS

- Work order: `invoice-send-ledger-repair-1`
- Report commit: `ce383e8dc2440dce8be893d8ba6c5829597d28d9`
- Repaired candidate: `ef937f47e26650bbc49ff703ccbfb36a1b4a08de`
- Repair commit: `c7f3cb5034c6940af92d94d01f3cc7f40f0518e3`
- Live URL: <https://invoice-send-ledger.sociobot.in>
- Verified: 29 August 2026 UTC

## Result

The verifier's only remaining release blocker is repaired and deployed. All
content-hashed `pdf.worker.min-*` assets now use a one-year immutable cache
policy before the general asset route. No application behavior or researched
scope changed.

## Reproduction and regression

Before the fix, the three live worker files returned:

```text
cache-control: public, must-revalidate, max-age=30
```

The new `factory.test.ts` regression initially failed because
`/assets/pdf.worker.min-*` was absent. It now asserts that the exact route
exists, precedes `/assets/*`, and has the exact policy:

```text
Cache-Control: public, max-age=31536000, immutable
```

`public/staticwebapp.config.json` now defines that route before both the
existing PDF rule and the general asset rule.

## Clean local verification

```text
npm ci                                      PASS; 69 packages, 0 vulnerabilities
npm audit --audit-level=high                PASS; 0 vulnerabilities
./node_modules/.bin/tsc -b --pretty false   PASS
npm run check                               PASS
  npm test                                  PASS; 4 files, 22 tests
  npm run build                             PASS; dist/index.html produced
  npm run test:e2e                          PASS; 48 tests, desktop + Pixel 5
```

There is no separate lint command; the production build runs TypeScript type
checking. A package/consumer test is not applicable to this static PWA. The
browser suite includes all 13 declared claim tests, desktop and 390 px mobile,
keyboard/focus, axe, touch targets, privacy request logging, offline reload,
data validation, and the complete ledger workflow.

Production output remains within budget: initial JS is 55.39 KB raw / 16.62 KB
gzip, CSS is 23.24 KB raw / 5.81 KB gzip, and the deferred PDF parser is
433.00 KB raw / 128.94 KB gzip.

## Deployment and exact live evidence

The factory static deploy completed successfully as deployment
`16b547f5-2b07-40fc-b4f4-2179fc0c0156`. The custom domain returned HTTPS 200.
All 26 deployable files other than the host configuration were downloaded and
byte-compared with `dist/`; all 26 matched. `origin/main` and the local checkout
both resolved to the repair commit above.

Exact live worker results:

| Asset | Bytes | Status | Cache-Control |
|---|---:|---:|---|
| `pdf.worker.min-CHFwMXne.mjs` | 1,262,398 | 200 | `public, max-age=31536000, immutable` |
| `pdf.worker.min-CevBI0zc.js` | 120 | 200 | `public, max-age=31536000, immutable` |
| `pdf.worker.min-CevBI0zc.js.map` | 269 | 200 | `public, max-age=31536000, immutable` |

The main hashed JS and deferred PDF bundle remain immutable. `/`,
`/index.html`, and `/sw.js` remain `no-cache`. HTTP redirects to HTTPS with 301;
root, demo, privacy, terms, manifest, and service worker return 200; an unknown
route returns the designed HTTP 404. CSP, Permissions-Policy, HSTS, nosniff,
and strict-origin referrer headers are present. The manifest is served as
`application/manifest+json`.

Header captures are under `.factory/evidence/repair-1/headers-*.txt`.

## Browser, accessibility, privacy, and PWA checks

The factory URL verifier passed the live root and demo at desktop and 390 px:
correct title and language, one h1, main landmark, image alternatives, labeled
buttons, and no console or page errors. Evidence is in
`.factory/evidence/repair-1/root/` and `.factory/evidence/repair-1/demo/`.

A fresh 390 x 844 live check found:

- zero serious or critical axe findings in light, dark, and the invoice dialog;
- working skip-link focus, Space-opened dialog, initial field focus, Escape
  close, and focus return;
- all 21 visible interactive targets at least 44 x 44 CSS px;
- no horizontal overflow;
- reduced-motion animation and transition durations of `0.00001s`;
- no console or page errors.

A fresh live PWA context reloaded offline, recorded the MOSS-118 sent event,
reloaded offline again, and retained the event. An isolated byte-changed service
worker showed “A fresh version is ready”; **Update now** transferred control,
reloaded successfully, and replaced `sdl-shell-v6-*` with
`sdl-shell-v7-repair-*`. Both checks produced no errors.

The full privacy browser test observed no off-origin request during demo edits
and backup. The deployment-only cache change adds no runtime request or data
handling.

## Mobile Lighthouse

Lighthouse 12.8.2 against the deployed root, using the mobile profile:

| Performance | Accessibility | Best practices | SEO | FCP | LCP | CLS | TBT | Transfer |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 99 | 100 | 100 | 100 | 1.00 s | 1.23 s | 0.019 | 92 ms | 78,357 B |

Raw evidence: `.factory/evidence/repair-1/lighthouse-mobile.json`.

## Known gaps and next steps

No release-blocking or known functional gaps remain from the independent
verification report. The Azure SWA local emulator normalizes asset caching to a
30-second policy, so cache-header acceptance must continue to use the deployed
host; the committed route-order regression protects the source configuration.
