# Review 6 handoff — FAIL

- Work order: `invoice-send-ledger-review-6`
- Reviewed commit: `92fbd3288d3d652d6dcbe6f5ebe22391e884cb76`
- Live URL: <https://invoice-send-ledger.sociobot.in>
- Review: `.factory/review-6.md`

## What was done

Performed a read-only adversarial review of the live product and current code.
Checked cold 390 px and desktop first screens, the one-click demo, live
real/demo isolation and reset, offline editing, request privacy, copy, all
routes and links, metadata, history/focus, headers, accessibility, prior
findings, and missed leverage. No product code was changed.

## Verification

From fresh clone `/tmp/invoice-send-ledger-review-6-oMLdwM/repo`:

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Results: 21 unit/contract tests passed, `dist/` was produced, and all 52
Playwright tests passed. Every one of the 14 exact commands in
`.factory/claims.json` also passed separately. Initial JS is 18.11 KB gzip and
CSS is 6.06 KB gzip. The clean build and live JavaScript bundle have identical
SHA-256 hashes.

Fresh live browser checks found no console errors, off-origin demo requests,
serious/critical Axe violations, broken links, mobile overflow, or sub-44 px
tested controls. The unknown route returns the designed HTTP 404. A live demo
record remained isolated from a real record; Reset and Start for real worked.
The demo also reloaded, edited, and retained its edit offline.

## Findings left

- **F-1-17, blocking regression:** the public PDF storage plan requires a
  license but gives a new visitor no exact price or acquisition path. Add and
  test a Sociobot purchase flow, or remove the unavailable tier from public
  product surfaces.
- **F-6-1, minor:** README says “Node.js 20 or newer,” while Vite 7.3.6 requires
  `^20.19.0 || >=22.12.0`. Correct the sentence and declare `engines`.

See `.factory/review-6.md` for the complete copy audit, claim results, live
structure evidence, and per-finding history check.
