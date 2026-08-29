# Polish 4 handoff — PASS

- Work order: `invoice-send-ledger-polish-4`
- Repair commit: `04649b859434fb2d9721befe3faf5bf6750d1cbf`
- Base reviewed: `55ad207c7c253ab3dd2078affdcac085fa20a88c`
- Production URL: <https://invoice-send-ledger.sociobot.in>
- Deployment: Static Web Apps `a52c77df-da66-4e0b-b581-7095c39b8019`
- Outcome: **PASS — no unresolved review findings.**

## What changed

- Corrected the final shared-shell regression: the app, legal pages, 404, and
  offline fallback all expose `build polish-4`. The service-worker cache name
  moved to `sdl-shell-v4`, so installed clients receive the fallback changes.
- Added canonical, Open Graph, and Twitter metadata to the designed 404 and
  offline routes, using the existing product social image.
- Removed the unsupported Sociobot/Dodo merchant, refund, and license-revocation
  statement from the PDF storage dialog. Privacy and Terms links remain.
- Added browser regressions for footer equality, fallback route metadata, and
  absence of the removed claim. The catalog line is now verb-first and 52
  characters: “Track client invoice send dates in an offline record.”
- Revalidated the substantive earlier repairs: plain first-screen wording,
  isolated one-click demo with Reset demo/Start for real, claim registry and
  observable tests, real routing/focus/404/legal links, phone layout, local
  PDF import, storage integrity, privacy, offline editing, and the distinct
  ceramic visual system.

## Verification

Fresh clone `/tmp/invoice-send-ledger-polish-4-puAEDo`, cloned from the repair
commit above:

```sh
npm ci
npm test                 # 20 passed
npm run build            # dist/index.html produced
npm run test:e2e         # 52 passed, desktop + Pixel 5
```

Every exact claim command from `.factory/claims.json` also passed separately
in that clean clone: `demo-isolation`, `due-date`, `time-zone`, `csv-export`,
`sealed-restore`, `backup-validation`, `offline-reload`, `local-only`,
`encrypted-backup`, `plain-backup`, `paid-pdf`, `license-privacy`,
`pdf-import`, and `concurrent-write`.

The built app JavaScript is 18.26 KB gzip and CSS is 6.10 KB gzip. The full
browser suite includes Playwright Axe checks, phone overflow and 44px targets,
offline reload/edit, request privacy, links, route focus, fallback metadata,
and console-error assertions.

After deployment, a cold production check passed:

- `verify-url.sh` on `/demo`: title/lang/h1/main/alt/labeled controls and no
  console errors — `.factory/evidence/live-polish-4/verify.json`.
- Browser audit of `/`, `/demo`, `?demo=1`, `/privacy/`, `/terms/`, `/404.html`,
  `/offline.html`, and a real unknown 404: separate real/demo records, reset and
  exit behavior, same-origin demo requests, current metadata, matching footer,
  and zero serious/critical Axe findings — `live-audit.json`.
- Live 404 screenshot and mobile demo screenshot were visually reviewed:
  `fallback-404-live.png` and `demo-live-mobile.png`.
- Lighthouse mobile `/demo`: Performance 99, Accessibility 100, Best Practices
  100, SEO 100; LCP 946 ms, CLS 0.080, TBT 18 ms — `lighthouse.json`.

The complete finding-by-finding mapping and evidence are in
`.factory/polish-4.md`.

## Known gaps / next steps

None.
