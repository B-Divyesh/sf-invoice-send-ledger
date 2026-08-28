# Perfection loop 2 handoff — PASS

- Work order: `invoice-send-ledger-polish-2`
- Base reviewed: `a3c8eaa7e25bcc12557da2025eeada7b072752ae`
- Review source: `1e613feec1f19b913574921e65b3e4b7f590307f`
- Repair commit: `4e98b2828dc4410fc47f41c1ad78af94ce4725fd`
- Product: <https://invoice-send-ledger.sociobot.in>
- Demo: <https://invoice-send-ledger.sociobot.in/demo> and <https://invoice-send-ledger.sociobot.in/?demo=1>
- Deployment: `7deb3677-ccae-4c8e-a2a5-113575796dd2` — succeeded 28 August 2026 UTC

## Completed

- `/demo` and `?demo=1` still use the isolated `demo:send-date-ledger`
  namespace, show the persistent demo banner, and reset/exit safely. The demo
  now leads with the populated invoice workspace instead of placing sample
  slips below the marketing page. At a cold 390 × 844 live load, MOSS-118
  begins at y=653.61 and is visible in the first viewport.
- Standardized every user-facing paid-feature reference to **PDF storage plan**.
  The header action is now **View PDF storage plan**.
- Replaced the non-descriptive **Clear boundaries** eyebrow with
  **Limits and privacy**.
- Preserved the ceramic/date-slip visual system, existing local-first backup,
  PDF import, offline, routing, security-header, legal, and claim repairs.
- Updated the verb-first catalog description, copy audit, repair ledger, and
  build identifiers to `polish-2`.

The complete ID-by-ID mapping for review-1 and review-2 is in
`.factory/polish-2.md`. No blocking or minor review finding is deferred.

## Clean-clone verification

Performed from `/tmp/invoice-send-ledger-polish2-65UlmB`, freshly cloned at
`4e98b2828dc4410fc47f41c1ad78af94ce4725fd`:

```text
npm ci                         PASS — 69 packages; 0 vulnerabilities
npm test                       PASS — 20 tests
npm run build                  PASS — dist/index.html produced
npm run test:e2e               PASS — 52 tests, desktop and mobile
```

Each command registered in `.factory/claims.json` was then run separately from
that same clean clone and passed:

```text
demo-isolation       due-date              time-zone
csv-export           sealed-restore        backup-validation
offline-reload       local-only            encrypted-backup
plain-backup         paid-pdf              license-privacy
pdf-import           concurrent-write
```

The browser suite covers route titles/metadata/focus/back navigation, real
404s, link crawl, touch targets, mobile overflow, light/dark axe scans,
request privacy, demo isolation/reset, offline reload/edit, all backup paths,
license behavior, local PDF import, and stale-tab protection. The new
`site.spec.ts` viewport/copy regression runs in both projects and writes:

- `.factory/evidence/demo-first-viewport-chromium-desktop.png`
- `.factory/evidence/demo-first-viewport-chromium-mobile.png`

## Accessibility and performance

- Factory URL verification on the local production preview: PASS — title,
  `lang=en`, one h1, main landmark, complete image alts, labeled buttons, and
  zero console errors. Evidence: `.factory/evidence/local-polish-2/verify.json`.
- Axe CLI on local `/demo`: 0 WCAG 2 A/AA violations.
- Live axe CLI on `/demo`: 0 WCAG 2 A/AA violations.
- Live mobile Lighthouse on `/demo`: Performance **100**, Accessibility
  **100**, Best Practices **100**, SEO **100**; LCP **0.941 s**, CLS **0.019**,
  TBT **6.5 ms**. Evidence:
  `.factory/evidence/live-polish-2/lighthouse.json`.
- Current initial application assets: JS **18.33 KB gzip**, CSS **6.10 KB
  gzip**. The PDF reader remains lazy-loaded; it is not part of initial load.

## Deployed cold verification

The deployment was opened in a fresh Chromium context and verified directly.

```text
/                                      200
/demo and /?demo=1                    200
/privacy/ and /terms/                 200
/robots.txt, /sitemap.xml, manifest   200
/definitely-missing-polish-2          404
```

- `/demo` title is `Demo — Send-Date Ledger`; its banner, first-viewport
  sample record, full header label, and absence of both removed phrases were
  asserted with zero console/page errors. Evidence:
  `.factory/evidence/live-polish-2/demo-cold-mobile.png`.
- The live site has CSP, Permissions-Policy, `X-Content-Type-Options`, and
  Referrer-Policy response headers. Hashed JS returns
  `Cache-Control: public, max-age=31536000, immutable`.
- A cold live service-worker check activated the demo shell, went offline,
  reloaded, and retained all three sample invoices with the offline status.
- The factory live verifier report and screenshots are in
  `.factory/evidence/live-polish-2/`.

## Run and deploy

```sh
npm ci
npm run check
```

Deploy the generated `dist/` directory as a Static Web App. The committed
`public/staticwebapp.config.json` supplies routes, 404 behavior, security
headers, and hashed-asset caching.

## Known gaps

No unresolved acceptance finding remains. New PDF licenses are not advertised
for sale because the external factory billing product is unavailable; the app
honestly supports existing valid licenses and exposes no dead checkout link.
