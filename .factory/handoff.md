# Verification handoff — FAIL

- Work order: `invoice-send-ledger-verify-1`
- Candidate: `fabde45771a44f73832bd4d7d6a65001c1d37e33`
- Live URL: <https://invoice-send-ledger.sociobot.in>
- Verified: 2026-08-28 UTC
- Decision: **FAIL — do not release as accepted**

## What was done

Independent QA was run from a detached clean checkout. No product code was
changed. The candidate was installed, audited, type checked, tested, built, and
exercised locally and live across desktop, 390 px mobile, keyboard, dark mode,
reduced motion, invalid input, backup/restore, CSV sealing, licensing, privacy,
offline persistence, and service-worker update paths.

The deployed site is online and all 15 deployed build files byte-match the
candidate. The free happy path is functional, but release acceptance fails on
data-integrity and paid-unlock requirements.

## Verification summary

- `npm ci`: pass; 0 vulnerabilities.
- `npm run check`: pass; 7/7 Vitest and 6/6 Playwright tests, with exact
  production build.
- Independent core flow: 39/40 checks passed locally and 39/40 live; the failure
  is a 40 px compact action below the 44 px contract.
- Axe serious/critical: 0 in light empty, dark populated, and 390 px dialog
  states.
- Valid-flow console/page errors: 0 locally and live.
- PWA: manifest/installability diagnostics pass; offline reload and offline
  edits persist; simulated update toast, `skipWaiting`, controller change, and
  reload pass.
- Privacy: no third-party requests in the free flow; only the disclosed
  Sociobot license endpoint exists at runtime.
- Lighthouse live mobile: performance 100, accessibility 100, best practices
  100, SEO 100; LCP 1.22 s, CLS 0.024, TBT 89 ms, 73,342 transferred bytes.
- Bundles: 42.69 KB JS, 20.75 KB CSS, 33.17 KB hero, no fonts—all within budget.

## Blocking defects

1. **High:** restoring an older pre-export backup overwrites a sealed
   invoice's dates, clears its locks, and makes exported date fields editable.
2. **High:** a supported-envelope backup with an invalid timezone is persisted
   before validation; the error is hidden, later loads throw, and the ledger is
   stuck at its loading state until site data is manually repaired or cleared.
3. **High:** the live Studio checkout endpoint returns HTTP 404
   (`{"error":"enabled factory product","status":404}`).
4. **High:** if initial verification is unavailable, any pasted token is treated
   as active and enables paid PDF storage without a cached valid verdict.
5. **Medium:** a stale second tab can overwrite and erase an issue event with no
   conflict warning/history.
6. **Medium:** compact invoice controls use a 40 px minimum height instead of the
   required 44 px.
7. **Low:** hashed production assets use `max-age=30, must-revalidate`, not
   long-lived immutable caching.
8. **Low:** live responses omit CSP and Permissions-Policy hardening.

Full reproduction steps, passing evidence, response-policy details, build
identity, and retest requirements are in [`.factory/verification.md`](verification.md).

## Next steps

Fix and add regression coverage for the four high-severity defects first. Then
address stale-tab conflict handling and target sizing, configure immutable
caching for hashed assets, add appropriate response policies, redeploy, and run
the independent verification suite again—including a real checkout/return
cycle. The repository remains buildable at handoff.
