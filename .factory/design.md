# Send-Date Ledger — visual system

## Direction: glacial minimal ceramics

An invoice chronology should feel calmer and more permanent than the software
that created the invoice. The interface borrows from a ceramicist's workbench:
off-white clay, frost-blue glaze, graphite date marks, and thin incised rules.
The visual metaphor is a set of dated ceramic slips arranged in sequence—each
event is plain, tactile, and difficult to confuse with another. It is not an
accounting dashboard and avoids finance-green, dense admin chrome, gradients,
and ornamental cards.

## Palette

- `ice-0 #F4F7F5` — explicit light-mode background, like cool unglazed porcelain.
- `ice-1 #E8EFED` — inset surfaces and quiet grouping.
- `chalk #FCFDFC` — raised sheets and dialogs.
- `ink #172322` — primary text (13.9:1 on `ice-0`).
- `slate #526361` — secondary text (5.8:1 on `ice-0`).
- `fjord #176B6B` — action/accent (5.4:1 on `chalk`).
- `deep-fjord #0E4D4D` — active action surface.
- `moss #2E6A4F` — success, always paired with words or an icon.
- `ochre #85590E` — warning, always paired with words.
- `iron #9A3535` — danger, always paired with words.
- `night #101918`, `night-sheet #182422`, `night-inset #21302E` — dark treatment;
  text becomes `#F2F7F5`, muted text `#B7C5C1`, accent `#7CC9C5`.

Both treatments are fully painted. The default follows the operating-system
preference; the header toggle provides an explicit, persistent override.

## Type and number system

- Display and key invoice references: Georgia, Cambria, `Times New Roman`, serif.
  Its wedge-like forms feel stamped into clay and make the product identifiable.
- Interface and body: Inter-like native stack `ui-sans-serif, system-ui, -apple-system,
  BlinkMacSystemFont, "Segoe UI", sans-serif`. No network or font file is required.
- Scale: 14 / 16 / 20 / 28 / clamp(36–58) px. Body is 16px with 1.55 leading.
- Dates, amounts, and tabular columns use `font-variant-numeric: tabular-nums`.

## Spacing, shape, and depth

- 4px base rhythm; primary increments 8, 12, 16, 24, 32, 48, 72px.
- Content max-width 1180px; reading measure 68ch.
- Sheets use asymmetric 18px/6px corner radii, echoing hand-cut clay slabs.
- Depth is one cool shadow plus a one-pixel incised border. Nested cards are
  avoided; proximity, headings, and hairline rules establish groups.
- Phone layout drops the decorative hero copy after the first use, stacks table
  rows into chronological slips, and keeps all controls at least 44px tall.

## Interaction grammar

- A new invoice is a fresh clay slip: it opens as a focused modal originating
  from the add control. Issuing and sending are explicit event controls, never
  implicit side effects.
- The event rail reads left-to-right on wide screens and top-to-bottom on phones.
  Filled circular stamps include both icon/label and full local date/time.
- Due dates are generated from a visible `Net N` rule when an invoice is issued.
  Users can inspect the exact calendar result before saving.
- Exporting seals the included event history. Later edits remain possible, but
  an exported snapshot is never rewritten; the activity history identifies it.
- Feedback uses a lower-page kiln-note toast. Destructive removal requires a
  dialog that names the invoice.

## Motion

Transitions are 180–240ms with a soft deceleration. New slips rise 6px into
place, dialogs scale from 0.98, and the active event stamp settles once. There
are no looping effects. With `prefers-reduced-motion: reduce`, transforms and
smooth scrolling are removed and feedback changes instantly through opacity or
static state.

## Original asset plan and provenance

Hero illustration: a quiet still life of five hand-cut porcelain ledger tiles,
each carrying only abstract incised lines and circular date-like stamps, set on
a frost-blue ceramic work surface. It explains the product's chronology and
immutable snapshot metaphor without implying invoice creation.

Prompt sheet: “Editorial product still life, five thin hand-cut porcelain ledger
tiles arranged in a precise chronological row on a pale frost-blue ceramic
workbench, each tile has small abstract incised horizontal marks and one simple
unreadable circular date-stamp indentation, cool diffuse arctic window light,
chalk white and celadon glaze, graphite shadows, slight handmade irregularity,
subtle top-down 35mm perspective, generous negative space, quiet archival mood,
premium tactile realism, no people, no hands, no readable text, no letters, no
numbers, no logos, no watermark, no brand marks, no coins, no calculators, no
screens, no gradient background.”

- Generated specifically for Send-Date Ledger with Azure OpenAI image generation
  (`factory-image` deployment), 2026-08-28.
- Source PNG and prompt sidecar live in `assets/src/`; optimized WebP lives in
  `public/assets/`. Generated imagery is disclosed in the product footer.
- Product icons, status marks, and logo are original inline SVG/CSS geometry.

