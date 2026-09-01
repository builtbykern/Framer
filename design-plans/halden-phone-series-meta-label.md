# Phone Series Meta Line uses Label

Written against: `4aa0cbc`

## Evidence chain

- Surface: Halden Home · Phone Work List · Series Meta Line (`nyI5jW7lABZ3f5p82k`). Primary nodes: Year `XwtyrQVdF`, Type `FddpNYFNF`, Stills Label `tpUu5gNAo`. Phone replicas: `nyI5jW7lAXwtyrQVdF`, `nyI5jW7lAFddpNYFNF`, `nyI5jW7lAtpUu5gNAo`. Page `pagePath: "/"`.
- Problem: Type is already Label (IBM Plex Mono 11 / 0.14em / muted). Year and Stills Label are the same size but `letterSpacing="0.08em"` and `textColor="var(--token-282fdcc4-6cdb-45c0-b253-cdfc6872052b)"` (line token). One meta row reads as two greys and two trackings.
- Design evidence: Text style Label `I9B65psWv` (IBM Plex Mono 11px, `letterSpacing 0.14em`). `tmp/apply-type-editorial.js` `labelMetrics` uses muted `var(--token-8028b435-146d-4074-967e-823e6635036f)`. Overlay Type/Year plan `design-plans/halden-series-meta-label.md`. Line token is a hairline, not caption text.
- Owner: those three RichText nodes (primary; replicas inherit unless overridden — SET both if getNode still shows 0.08em on phone).
- Scope and affected surfaces: Home Work List Series Meta only (Desktop list is `visible=false`; Phone is the visible consumer).
- Uncertainty: none. CMS binds on Year/Type/Stills Label must remain.

## Design decision

Put Year, Type, and Stills Label on Label + muted so the meta line is one caption system. Do not restyle Title (Syne 28). Do not use the line token as text color.

## Reuse

- Label `I9B65psWv`
- muted `var(--token-8028b435-146d-4074-967e-823e6635036f)`
- Exemplar: overlay Type `hC7YJIKqd` / 404 Kicker via `textStylePreset="Label"` (see `design-plans/halden-series-meta-label.md`)

No new preset. No new token.

## Changes

1. Home `pagePath: "/"` — primary Meta Line texts

   - Change: `applyChanges` (preset + muted only; do **not** SET fontName/fontSize/letterSpacing in the same command as the preset):

     ```
     SET XwtyrQVdF textStylePreset="Label" textColor="var(--token-8028b435-146d-4074-967e-823e6635036f)";
     SET FddpNYFNF textStylePreset="Label" textColor="var(--token-8028b435-146d-4074-967e-823e6635036f)";
     SET tpUu5gNAo textStylePreset="Label" textColor="var(--token-8028b435-146d-4074-967e-823e6635036f)";
     ```

   - Preserve: CMS `text` / variable binds; Title `GAokM9PPJ` Syne; Meta Line horizontal stack; Series `link.href` + `collectionItem`; Work List padding/gap.
   - Verify: all three report `textStylePreset="Label"` (or IBM Plex Mono 11 / 0.14em) and muted token. Year/Stills no longer 0.08em or line token.

2. Phone replicas if they still diverge after (1)

   - Change: same SET on `nyI5jW7lAXwtyrQVdF`, `nyI5jW7lAFddpNYFNF`, `nyI5jW7lAtpUu5gNAo`.
   - Preserve: same as (1).
   - Verify: phone getNode matches primary.

## Scope

- Inherit: Tablet replica of Work List if it exists and is hidden; CMS repeats of Series.
- Verify: Phone Home screenshot — Year · Type · N stills one muted caption under the title.
- Exclude: Title Syne; Series Stills index (separate plan); Work detail credits; overlay; Logo Menu Roll; PageVeil; Drift Plane; publish; black/horizontal journal chrome.

## Validation

- Product: Phone series meta reads as one Label caption.
- Interface: Phone 390; a series with long title wrap; Featured list with several items.
- System: One Label owner for kickers; line token unused as fill-in text.
- Repository: Confirm `getProjectInfo().name === "Halden"` on session **1** (rebind `https://framer.com/projects/Higher-Beet--k5nCTheGrijbFstHsY31-cYfgu` if the session flipped). Then `node scripts/framer/verify.mjs -s 1 --page "/"` → `{ "ok": true }`. Do not publish.

## Stop conditions

- Stop if Label SET drops CMS binds on Year/Type/Stills Label.
- Stop if Title is forced onto Label.
- Do not publish.

## Design documentation

- After acceptance: none unless asked.
