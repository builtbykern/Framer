# Phone Series Stills index uses Label IBM Plex Mono

Written against: `4aa0cbc`

## Evidence chain

- Surface: Halden Home Series Stills instance `yGFlVus2I` (Phone replica `nyI5jW7lAyGFlVus2I`) on `pagePath: "/"`.
- Problem: `$control__indexFont` is `GF;Fragment Mono-regular` at 11px / 0.14em. Halden Label is IBM Plex Mono. Index captions (`01 · …`) sit next to Meta Line that must be Label (sibling plan). Two monos in one series row.
- Design evidence: Label `I9B65psWv` `font.selector` = `GF;IBM Plex Mono-regular`, `fontSize` 11px, `letterSpacing` 0.14em. Home instance already has `$control__indexColor="var(--token-8028b435-146d-4074-967e-823e6635036f)"` — keep it. `indexFont` default in `tmp/Series_Stills.tsx` is generic monospace, not a third family.
- Owner: instance control `$control__indexFont` on `yGFlVus2I`.
- Scope and affected surfaces: Home Series Stills only. Work detail `afUswAq7g` also uses Fragment Mono + `rgb(107, 107, 107)` — **out of scope** (do not “fix” detail in this plan).
- Uncertainty: applyChanges JSON quoting for Font controls. If SET fails, serialize the control and retry with the same shape Framer stored for Fragment Mono.

## Design decision

Point Home Series Stills index at Label’s IBM Plex Mono selector. Do not change STACK_PRINTS, layout, gap, or Gallery bind.

## Reuse

- Label `I9B65psWv` → `GF;IBM Plex Mono-regular`
- muted already on `$control__indexColor`
- Exemplar: Label text style; Meta Line after `design-plans/halden-phone-series-meta-label.md`

No new font file. Do not import another GF family.

## Changes

1. Home `pagePath: "/"` — Series Stills `yGFlVus2I`

   - Change: SET `$control__indexFont` to Label’s selector, keep size/tracking:

     Current (do not keep):

     ```json
     {
       "fontSelector": "GF;Fragment Mono-regular",
       "fontSize": "11px",
       "letterSpacing": [0.14, "em"],
       "lineHeight": [1.2, "em"]
     }
     ```

     Target:

     ```json
     {
       "fontSelector": "GF;IBM Plex Mono-regular",
       "fontSize": "11px",
       "letterSpacing": [0.14, "em"],
       "lineHeight": [1.2, "em"]
     }
     ```

     Try, in order, until getNode shows IBM Plex Mono:

     1. `SET yGFlVus2I $control__indexFont={"fontSelector":"GF;IBM Plex Mono-regular","fontSize":"11px","letterSpacing":[0.14,"em"],"lineHeight":[1.2,"em"]};`
     2. If lint/error: quote the JSON the same way the live attribute is serialized (escaped string).
     3. If phone replica still shows Fragment: same SET on `nyI5jW7lAyGFlVus2I`.

   - Preserve: `$control__layout` (Stack), `$control__gap`, `$control__index="true"`, `$control__indexColor` muted token, `$control__images` Gallery `WTTAaEd5y` → `ZkP9UsFFL` arrayToArray. `tmp/Series_Stills.tsx` STACK_PRINTS table. Code file defaults (do not change `addPropertyControls` indexFont default unless SET cannot stick).
   - Verify: getNode `$control__indexFont` contains `IBM Plex Mono`, not `Fragment Mono`. Phone still captions match Meta Line family.

## Scope

- Inherit: Phone/Tablet replicas of `yGFlVus2I` if they inherit the control.
- Verify: Phone Home still index `01` next to prints.
- Exclude: Work detail `afUswAq7g` indexFont/indexColor; Cover; Drift Plane; Title Syne; publish.

## Validation

- Product: Index and Meta Line share IBM Plex Mono.
- Interface: Index on; Stack; at least one series with a still.
- System: No third mono. Label remains the caption owner.
- Repository: Session **1**, `getProjectInfo().name === "Halden"`. `node scripts/framer/verify.mjs -s 1 --page "/"` → `{ "ok": true }`. Do not publish.

## Stop conditions

- Stop if SET drops `$control__images` Gallery bind.
- Stop if the change requires editing STACK_PRINTS or switching layout to Grid.
- Do not publish.

## Design documentation

- After acceptance: none unless asked.
