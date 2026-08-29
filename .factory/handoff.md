# Polish 6 handoff — PASS

- Work order: `invoice-send-ledger-polish-6`
- Repaired/deployed application commit:
  `df26cfae405d2b4fc4e0e30a01f3932f6559f09c`
- Starting candidate: `92fbd3288d3d652d6dcbe6f5ebe22391e884cb76`
- Deployment: Static deployment `6c084474-0274-4980-9763-4818f73c1aae`
- Live URL: <https://invoice-send-ledger.sociobot.in>
- Finding record: `.factory/polish-6.md`

## What changed

Review 6 found the only public licensed feature could not be bought: the
factory checkout endpoint returned HTTP 404. The repair therefore removed the
unavailable PDF storage plan, its token verification, checkout language, price
claims, API dependency, and license UI. PDFs up to 10 MB are now normal local
invoice attachments, including in both backup formats. This provides the
brief's PDF path without advertising a fake paid flow.

The repair also corrected the documented and declared Node range to
`^20.19.0 || >=22.12.0`, updated cache/manifest build identifiers to polish 6,
renewed every claim/screenshot, and updated the catalog description to:
“Record client invoice send dates in one local record.”

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

To run the app locally:

```sh
npm run dev
```

Use Node.js 20.19+ or 22.12+. The production demo is
<https://invoice-send-ledger.sociobot.in/demo> (or `?demo=1`); it seeds three
sample invoices in the separate `demo:` storage namespace. The banner offers
Reset demo and Start for real. `.factory/demo.md` describes this boundary.

## Exact verification evidence

From clean clone `/tmp/invoice-send-ledger-polish-6-59WkMa/repo` at the
deployed application commit:

- `npm ci` completed with zero vulnerabilities.
- `npm test` passed: 21 tests.
- `npm run build` passed and produced `dist/`; initial application JS is
  16.62 KB gzip and CSS is 5.81 KB gzip. The deferred local PDF parser is
  128.94 KB gzip.
- Each of the 13 exact test commands in `.factory/claims.json` passed
  separately from a clean state.
- `npm run test:e2e` passed: 48 Playwright tests.
- Local `verify-url.sh` passed for `/demo` with title, `lang`, main landmark,
  image alt, and no console errors in `.factory/evidence/local-polish-6/`.

After deployment, a cold live browser audit checked `/`, `/demo`, `/privacy/`,
`/terms/`, `/404.html`, `/offline.html`, plus an unknown URL. It found correct
titles, focused h1s, working internal links, no console errors, no external
demo requests, no serious/critical Axe findings, no public license/price/tier
copy, correct CSP/Permissions-Policy/cache headers, and a real HTTP 404.
It also verified demo/real isolation, reset, start-for-real, and offline save.
See `.factory/evidence/live-polish-6/live-audit.json`, cold mobile/desktop
screenshots in that directory, and `lighthouse-mobile.json`.

Mobile Lighthouse score was 100 for Performance, Accessibility, Best
Practices, and SEO (LCP 1275.795 ms, CLS 0.01896, TBT 34 ms).

## Known gaps / next steps

None for the released product. The absence of a paid PDF tier is deliberate:
the factory has not provisioned a checkout for this product. If a future work
order registers that product, it must add a real Sociobot purchase return flow,
an exact-price claim, and a deterministic purchase verification before making a
new public offer.
