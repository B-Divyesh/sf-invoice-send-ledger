# Polish 5 handoff — PASS

- Work order: `invoice-send-ledger-polish-5`
- Base reviewed: `d46b0155135ea1393e0ea2eb0730c4db9ddf5e15`
- Repair commit: `07833f9ffab5f996d3a8329ab9d81258060a5815`
- Deployment: Static Web Apps `4a4798e7-66fa-4e43-9f7e-1655f1f21544`
- Live URL: <https://invoice-send-ledger.sociobot.in>

## What changed

Removed all visitor-facing pricing, free-tier, lifetime, one-time-purchase,
and sale assertions because no working purchase flow can prove them. The PDF
feature now says only “PDF storage requires a verified license,” and its
observable test proves locking, the 10 MB limit, and both backup formats.
Removed the visitor-facing Azure-artwork assertion; asset provenance remains
in `.factory/design.md`. Updated every footer to `build polish-5`, bumped the
service-worker cache/version, refreshed the PWA start URL, updated the catalog
sentence, and added source/browser regressions for the removed copy. The
glacial-ceramic visual system is unchanged.

## How to run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

The build output is `dist/`. Run each exact command in `.factory/claims.json`
as well; all 14 are required. The one-click isolated demo is `/demo` or
`/?demo=1`; it uses `demo:send-date-ledger`, while real records use
`send-date-ledger`. The banner supplies Reset demo and Start for real.

## Exact evidence

Fresh clone `/tmp/invoice-send-ledger-polish-5-3FLgbY` at `07833f9` passed
`npm ci`, 21 unit tests, `npm run build`, the 52-test Playwright suite, and
each claim command individually. Initial JS is 18.11 KB gzip; CSS is 6.06 KB
gzip.

`verify-url.sh` passed locally and live. Live evidence is in
`.factory/evidence/live-polish-5/`: `verify-url/verify.json`,
`live-audit.json`, `copy-assertions.json`, `root-mobile.png`, and
`demo-mobile.png`. The live audit confirms the first screen, demo isolation
and reset, focus, routing, legal pages, headers, true 404, no pre-404 console
errors, no cross-origin demo requests, and zero serious/critical Axe issues.

Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
100, SEO 100; LCP 0.988 s, CLS 0.019, TBT 22 ms. See
`.factory/evidence/live-polish-5/lighthouse-mobile.json`.

## Known gaps and next steps

None. There is intentionally no purchase offer until a real Sociobot billing
flow can be registered and tested end to end. Existing valid licenses can still
be verified for PDF storage.
