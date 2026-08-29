# Review 3 handoff

- Work order: invoice-send-ledger-review-3
- Reviewed revision: af10d0270df195f220df8d13d2535929103134cb
- Live product: <https://invoice-send-ledger.sociobot.in>
- Outcome: **FAIL** — one minor documentation/claims finding in .factory/review-3.md (F-3-1)

## Done

- Performed a cold live review in fresh 390 × 844 and 1440 × 900 Chromium contexts.
- Entered the one-click live demo and checked sample-first presentation, reset, exit, separate storage behavior, request origin, and console output.
- Read the brief, design, claim registry, demo documentation, all earlier reviews, both polish ledgers, and the preceding handoff.
- Ran npm ci, npm test, npm run build, all 14 registered claim commands, and npm run test:e2e in /tmp/invoice-send-ledger-review3. All passed.
- Checked live routes, unknown-route 404, headers, and metadata/routing coverage. No product source files were changed.

## Remaining work

README.md says “New licenses are not for sale,” but no claim registry entry or @claim: test covers this availability statement. Remove it or use the narrower, observable “No purchase link is available in this app,” then add and run a matching claim test. See F-3-1 for the exact acceptance criterion.

## Re-run

~~~
npm ci
npm test
npm run build
npm run test:e2e
~~~

After the claims repair, run every command listed in .factory/claims.json from a clean clone as well.
