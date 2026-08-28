# Adversarial review 1 handoff — FAIL

- Work order: `invoice-send-ledger-review-1`
- Candidate: `feedeb7c8e29c3c46b01adc387987359a48d5520`
- Live URL: <https://invoice-send-ledger.sociobot.in>
- Reviewed: 28 August 2026 UTC
- Product code changed: no

## What was done

The live product was opened cold in fresh 390 px and desktop Chromium contexts.
The landing copy and README were audited sentence by sentence. Demo routes,
storage isolation, requests, metadata, links, route focus, 404 behavior,
checkout, accessibility, and all defects from the previous handoff were checked
again. The complete review is in [`.factory/review-1.md`](review-1.md).

## Verification

From detached clean worktree `/tmp/invoice-send-ledger-review1-clean`:

```text
npm ci              PASS — 0 vulnerabilities
npm test            PASS — 7/7
npm run build       PASS — dist/ produced
npm run test:e2e    PASS — 6/6
claims.json          FAIL — missing
@claim tests         FAIL — none exist
```

The live root factory verifier passed its basic title/lang/main/alt/console
checks. Live axe found no serious or critical issue in the empty state. Direct
live tests reproduced demo/real storage mixing, sealed-date restore corruption,
invalid-timezone lockout, arbitrary-token Studio unlock, 40 px populated
controls, checkout 404, missing headers, and short asset caching. The deployed
JS hash matches the current clean build.

## Known gaps and next steps

Review verdict is **FAIL** with 58 findings, 14 blocking. Implement a genuinely
isolated one-click demo first, add and satisfy the claims registry, then correct
the eight carried-over integrity/licensing/deployment defects. Complete routing,
metadata, site structure, copy, and PDF import after the blocking behavior is
covered by regression tests. Redeploy and rerun the full review from scratch.
