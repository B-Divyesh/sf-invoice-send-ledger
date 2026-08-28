# Send-Date Ledger

Send-Date Ledger helps freelancers record when an existing invoice was issued, sent, due, and paid.

Live product: <https://invoice-send-ledger.sociobot.in>

Sample demo: <https://invoice-send-ledger.sociobot.in/demo>

It records invoice dates. It does not create invoices, calculate tax, take payments, or replace accounting records.

## What it does

- Records drafted, issued, sent, due, and paid dates with their time zones.
- Calculates due dates from same-day, 7, 14, 30, 45, or 60-day terms.
- Reads invoice reference and amount from a PDF in your browser. You can correct every imported field.
- Exports a monthly CSV. Dates included in that export become sealed against later edits.
- Rejects invalid backups before changing any records. Older backups cannot change sealed dates.
- Downloads readable JSON or passphrase-encrypted backups.
- Edits records offline after the first visit.
- Stops a stale tab from overwriting a newer invoice date.

Invoice date records are free. A ₹699 one-time plan adds PDF storage in this browser. New licenses are not for sale.

## Try the isolated demo

Open `/demo` or `/?demo=1`. Both load three realistic sample invoices in the separate `demo:send-date-ledger` database.

Select **Reset demo** to restore the original samples. Select **Start for real** to discard demo changes and open the real database.

## Run locally

Use Node.js 20 or newer.

```sh
npm ci
npm run dev
```

## Test and build

```sh
npm test          # unit tests
npm run build     # production build in dist/
npm run test:e2e  # browser, mobile, axe, privacy, and offline tests
npm run check     # all checks above
```

Playwright is pinned to 1.58.2. Every product claim and its command is listed in [`.factory/claims.json`](.factory/claims.json).

## Data and backups

Invoice records and PDFs use browser storage. Demo records use a separate database and never open the real one.

Select **Back up or restore**, then **Download plain JSON** for a readable backup. The encrypted option hides invoice text with a passphrase-derived AES-256-GCM key.

The app does not store the passphrase. Keep it somewhere safe because it cannot be recovered.

## Deployment and PDF licenses

Deploy `dist/` as a static site. The included host configuration supplies explicit routes, a 404 response, security headers, and immutable caching for hashed assets.

Valid existing licenses can be pasted into the PDF storage plan. Verification sends only the token to Sociobot and reuses a successful result for one day.

## Product records

- [Visual system and artwork provenance](.factory/design.md)
- [Demo behavior](.factory/demo.md)
- [Repair evidence](.factory/polish-1.md)
- [Handoff](.factory/handoff.md)

## License

MIT — see [LICENSE](LICENSE).
