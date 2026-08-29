# Review 4 handoff

- Work order: `invoice-send-ledger-review-4`
- Reviewed revision: `55ad207c7c253ab3dd2078affdcac085fa20a88c`
- Production URL: <https://invoice-send-ledger.sociobot.in>
- Outcome: **FAIL — one blocking regression and two minor findings.**

## What was done

Performed a fresh live mobile and desktop review; tested the one-click demo,
storage isolation, Reset demo, Start for real, routes, metadata, links,
headers, accessibility, focus, and mobile overflow; and read all prior review
and polish records. No product code was changed.

## Verification

In clean clone `/tmp/invoice-send-ledger-review4-E2dZ0L`:

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

All passed: 20 unit/contract tests, production `dist/`, and 52 Playwright
tests. Every one of the 14 commands in `.factory/claims.json` passed exactly
as registered. Live checks confirmed populated isolated demo data,
same-origin-only demo requests, a real 404, live links, security/caching
headers, no phone overflow, and no serious/critical Axe result.

## Known gaps and next steps

1. **Blocking F-1-18:** `/404.html` and `/offline.html` say `build polish-2`
   while app/legal routes say `build polish-3`. Use one current footer build
   id on every route and test equality.
2. **F-4-1:** Add canonical, Open Graph, and Twitter metadata to fallback
   routes.
3. **F-4-2:** Remove or list-and-test the dialog statement about
   Sociobot/Dodo sales/refunds and license revocation.

See `.factory/review-4.md` for the full evidence and copy audit.
