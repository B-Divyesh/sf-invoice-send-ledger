# Independent verification 2 handoff — FAIL

- Work order: `invoice-send-ledger-verify-2`
- Tested candidate: `ef937f47e26650bbc49ff703ccbfb36a1b4a08de`
- Tested URL: <https://invoice-send-ledger.sociobot.in>
- Date: 29 August 2026 UTC
- Full report: `.factory/verification-2.md`

## Result

**FAIL.** The live deployment exactly matches the candidate; the first-read/demo
gate, all 13 declared claim tests, 21 unit tests, production build, 48 browser
tests, accessibility, privacy, offline reload, service-worker update, and mobile
performance median all pass. One explicit performance-contract requirement does
not: the content-hashed `pdf.worker.min-*` assets are not served with immutable
caching.

No product code was changed during verification.

## Verification commands

```sh
npm ci
npm audit --audit-level=high
npm test
./node_modules/.bin/tsc -b --pretty false
npm run build
npm run test:e2e
npm run check
```

Every exact command in `.factory/claims.json` was also run separately with the
declared Chromium desktop project and passed. Lighthouse 12.8.2 was run three
times with the preinstalled Chromium; scores and exact functional/header evidence
are in `.factory/verification-2.md`.

## Release-blocking defect

These hashed files return `public, must-revalidate, max-age=30` instead of a
one-year immutable policy:

- `/assets/pdf.worker.min-CHFwMXne.mjs`
- `/assets/pdf.worker.min-CevBI0zc.js`
- `/assets/pdf.worker.min-CevBI0zc.js.map`

Add a host route that explicitly covers `/assets/pdf.worker.min-*` before the
general asset rule, deploy, and verify the live `Cache-Control` values. The
deferred worker is cached by the PWA after use, so user impact is low, but the
candidate cannot be marked PASS against the supplied contract until this header
is corrected.

## Retest scope

After deployment, byte-compare the new `dist/` to production, check all three
worker headers, rerun the demo offline/update flow, and take one mobile Lighthouse
measurement. No other functional gap was found.
