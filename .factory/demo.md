# Demo sandbox

- URL: <https://invoice-send-ledger.sociobot.in/demo> (the equivalent `/?demo=1` entry also works).
- Sample: three invoices for Northline Editorial, Acme Field Notes, and Moss & Finch Studio across paid, sent, and issued states.
- Storage: IndexedDB database `demo:send-date-ledger`. The real database is `send-date-ledger` and is never opened in demo mode.
- Reset: select **Reset demo** in the persistent banner. This restores the three samples and clears demo exports.
- Exit: select **Start for real**. Demo records are discarded before the separate real database opens.
