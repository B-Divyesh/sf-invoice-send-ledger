# Demo sandbox

- URL: <https://invoice-send-ledger.sociobot.in/demo> (the equivalent `/?demo=1` entry also works).
- Sample: three invoices for Northline Editorial, Acme Field Notes, and Moss & Finch Studio across paid, sent, and issued states.
- Storage: IndexedDB database `demo:send-date-ledger`; demo license keys use the `demo:` local-storage prefix. The real database is `send-date-ledger` and is never opened in demo mode.
- Reset: select **Reset demo** in the persistent banner. This restores the three samples and clears demo exports and demo license data.
- Exit: select **Start for real**. Demo records and demo license keys are discarded before the separate real database opens.
