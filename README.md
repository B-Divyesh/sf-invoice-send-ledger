# Send-Date Ledger

Send-Date Ledger is a private, offline-first issue register for freelancers who
create invoices elsewhere but need the chronology to stay unambiguous. Record a
draft, issue, sent, due, and paid date; generate the due date from a visible
`Net N` rule; then seal and export a monthly CSV.

Live product: <https://invoice-send-ledger.sociobot.in>

This is an audit-hygiene utility, not an invoice creator, accounting ledger,
tax calculator, statutory record, or payment gateway.

## What v1 includes

- Local IndexedDB storage with no account, analytics, or cloud sync
- Timezone-tagged draft, issued, sent, due, and paid chronology
- Net 0/7/14/30/45/60 due-date rules
- Search, lifecycle filtering, sent-date coverage, and due-rule coverage
- Monthly CSV snapshots that lock dates already included in an export
- Plain JSON and AES-256-GCM encrypted backup/restore, including PDF data
- Installable PWA with a versioned service-worker cache and offline editing
- Light and dark treatments, keyboard-safe dialogs, reduced motion, and a
  responsive 390px layout
- Free core product; ₹699 one-time Studio license adds local PDF attachment
  storage. Checkout and verification use only the Sociobot billing API.

## Run locally

Requires a current Node.js release (Node 20+ recommended).

```sh
npm install
npm run dev
```

Open the URL printed by Vite. No environment variables or external services are
needed for the free ledger.

## Test and build

```sh
npm test          # Vitest unit tests
npm run build     # reproducible production build -> dist/
npm run test:e2e  # Playwright desktop/mobile, axe, and offline checks
npm run check     # all of the above
```

Playwright is pinned to 1.58.2 as required by the factory runner. The production
output is static and has `dist/index.html` at its root.

## Data and backups

Ledger records, export snapshots, PDFs, and license state stay in the browser.
Use **Back up or restore** to download a portable JSON file. Encrypted backups
derive an AES-GCM key from the passphrase in the browser; the passphrase is never
stored or recoverable. Clearing site data removes the local ledger, so regular
backups matter.

## Deployment and billing

Deploy the contents of `dist/` as a static site with history/folder routing
enabled for `/privacy/` and `/terms/`. The service worker is root-scoped.

The Studio buy link targets:

```text
https://api.sociobot.in/api/v1/products/invoice-send-ledger/checkout
```

The factory registers the product and return URL separately. No Dodo or other
payment-provider credentials live in this repository.

## Visual system and product record

The product-specific glacial minimal ceramics system and generated-artwork
provenance are in [`.factory/design.md`](.factory/design.md). Build verification
and known constraints are in [`.factory/handoff.md`](.factory/handoff.md).

## License

MIT — see [`LICENSE`](LICENSE).
