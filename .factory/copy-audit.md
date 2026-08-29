# Copy audit — polish 6

Audited 29 August 2026. Counts treat hyphenated terms as one word. No sentence exceeds 22 words. No banned marketing term remains.

| Surface | Copy | Words | Result |
|---|---|---:|---|
| H1 | Track when each client invoice was sent | 7 | Pass: job is explicit |
| Demo H1 | Sample invoice date record | 4 | Pass: names the populated sample workspace |
| Demo introduction | Review three invoices, then add or edit a sample date. | 10 | Pass: explains the next action |
| First screen | For freelancers who prepare invoices over time and need reliable issued, sent, due, and paid dates. | 15 | Pass: user and change are explicit |
| Demo action note | Opens three sample invoices | 4 | Pass |
| Demo action note | Adds only to this sample record | 6 | Pass |
| Fact | No analytics or advertising | 4 | Pass; claim `local-only` |
| Fact | Edit offline after the first visit | 6 | Pass; claim `offline-reload` |
| Fact | Attach PDFs up to 10 MB | 6 | Pass; claim `pdf-storage` |
| Artwork caption | Drafted, issued, due, sent, and paid dates stay together. | 9 | Pass |
| Empty state | No invoices recorded yet | 4 | Pass |
| Empty state | Add the next invoice you are drafting, or record one already sent. | 12 | Pass |
| Empty state | Choose a due rule when you add it. | 8 | Pass; claim `due-date` |
| Step 1 | Enter the details or read them from a PDF in this browser. | 12 | Pass; claims `pdf-import`, `local-only` |
| Step 2 | Choose a due rule, then record when you issue, send, and get paid. | 13 | Pass; claim `due-date` |
| Step 3 | Download a monthly CSV. | 4 | Pass; claim `csv-export` |
| Step 3 | Dates in that export become sealed. | 6 | Pass; claims `csv-export`, `sealed-restore` |
| Boundaries | It does not create invoices, calculate tax, take payments, or replace accounting records. | 13 | Pass |
| Privacy | Invoice records stay in this browser. | 6 | Pass; claim `local-only` |
| Privacy | The app sends no invoice data to a server. | 9 | Pass; claim `local-only` |
| PDF attachment | Attach an invoice PDF in this browser. | 8 | Pass; claim `pdf-storage` |
| PDF attachment | Included in plain and encrypted backups. | 7 | Pass; claim `pdf-storage` |
| Footer | Record dates for invoices you create elsewhere. | 7 | Pass |
| Demo banner | Demo — sample data, nothing is saved | 7 | Pass; claim `demo-isolation` |
| Demo banner | Changes stay separate from your invoice records. | 7 | Pass; claim `demo-isolation` |
| Limits eyebrow | Limits and privacy | 3 | Pass: names the section |
| Required-field note | Required fields | 2 | Pass; explains the visible asterisk |
| Catalog description | Record client invoice send dates in one local record. | 9 | Pass: verb-first and under 120 characters |

## Terminology

| Concept | One term |
|---|---|
| Product job | invoice date record |
| One item | invoice |
| Downloaded month | monthly CSV export |
| Export-protected date | sealed date |
| Try-out environment | demo |
| Invoice attachment | invoice PDF |

“Send-Date Ledger” appears only as the product name. Internal code type names and storage identifiers are not user-facing terminology.
