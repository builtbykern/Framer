# Hide the fourth Objects row on Home

Written against: `4aa0cbc`

## Evidence chain

- Surface: Strong Luxury / Aurea Home `/` · Desktop `tbK0d3g5n` · section Four Principles `AwFk6HOtT` (layer name leftover; chrome is THE OBJECTS)
- Problem: The heading reads “Three hours. Three names. The list is closed.” The list then shows a fourth row, `04 The house`.
- Design evidence: `docs/projects/aurea-copy.md` — three named objects (Morning veil, Noon cloth, Night resin); house line “The list does not grow.” Rendered Home D/T/P screenshots of `AwFk6HOtT` show the fourth row under that heading.
- Owner: row frame `KFsF7Bbgh` (layer name `Rest`) inside list stack `PuuZy_GrV`
- Scope and affected surfaces: Home `/` only · Desktop row `KFsF7Bbgh` · Tablet `J5oev3dzjKFsF7Bbgh` · Phone `IwdhW0PKTKFsF7Bbgh`
- Uncertainty: none for this row. Do not rename the section or rewrite the heading in this plan.

## Design decision

Hide the fourth Objects row on all Home breakpoints so the visible list matches the heading and the three named objects. Do not delete the row (template canvas can keep it in layers). Do not change photos, palette, type, or other sections.

## Reuse

- Visibility pattern already used on Home: `visible="false"` on unused sections (`e6bOWo9Qg` Ritual Story, `m4d_XC9bd` Past Wisdom, `Kz8OEg3EM` Ingredients Study, `ZzUzAci4K` Journal Preview)
- Exemplar: those hidden Home section frames — hide in place, do not `DEL`
- Text styles / color tokens: none. Do not bind or restyle this row.

If a new primitive is required: none. Existing `visible` on the row frame is enough.

## Changes

1. Home `/` · Four Principles list `PuuZy_GrV`
   - Change: `SET KFsF7Bbgh visible="false";` plus Tablet `J5oev3dzjKFsF7Bbgh` and Phone `IwdhW0PKTKFsF7Bbgh`. `pagePath: "/"`. Session: rebound Strong Luxury `https://framer.com/projects/Strong-Luxury--32N5ipHfkUMlPJAI6dc7-gX7Pa` and `node scripts/framer/exec.mjs -s 2`.
   - Preserve: rows Presence `BJbw0VGXG` (01 Morning veil), Nourishment `oeuljL9BJ` (02 Noon cloth), Movement `pQqMN9x0G` (03 Night resin); heading `ZdKHh3hHm`; eyebrow `FQM4zPub4`; all photos; Aurea/Editorial color tokens; other Home sections including hidden ones; Overlay Nav.
   - Verify: `getNode` on the three Rest ids reports `visible: "false"`. Screenshot `AwFk6HOtT`, `J5oev3dzjAwFk6HOtT`, `IwdhW0PKTAwFk6HOtT` — three rows only, heading unchanged.

## Scope

- Inherit: Home Tablet / Phone replicas of the Rest row (ids above)
- Verify: Home Other Rituals `LjNUhOf3g` still lists three CMS rituals; `/rituals` CMS items unchanged
- Exclude: JOIN THE CIRCLE form label (separate finding); Phone nav links; Magenta glow `QmJHdoWPn`; copy bible file; publish; new collections; layout/type/palette/photo edits

## Validation

- Product: Visitor on Home Objects reads three names under “The list is closed.”
- Interface: Desktop / Tablet / Phone Home. Content extreme: only 01–03 visible. No interaction beyond render.
- System: No new text style or token. Same hide-in-place pattern as other unused Home sections.
- Repository: `node scripts/framer/session.mjs --url "https://framer.com/projects/Strong-Luxury--32N5ipHfkUMlPJAI6dc7-gX7Pa"` then `node scripts/framer/verify.mjs -s 2` → `{ "ok": true }`. Do not publish.

## Stop conditions

- Stop if `KFsF7Bbgh` contains anything other than `IpGOnpHAB` (04) and `k5SG_t0Iq` (The house).
- Stop if hiding the row collapses `PuuZy_GrV` or clips 01–03.
- Stop if session is Arbour (project id not `32N5ipHfkUMlPJAI6dc7`).
- Do not `DEL` the row. Do not unhide Ritual Story / Journal Preview / other hidden sections.

## Design documentation

- After acceptance and validation: none in `docs/projects/aurea-copy.md` (already specifies three objects). Optional executor note only if layer `Rest` is renamed later — out of this plan.

## Executor constraints (baseline-ui on this Framer canvas)

- No new animation, gradients, or glow.
- Do not change `letterSpacing` / tracking.
- Do not introduce Tailwind or code-component work.
- One SET family: visibility on the Rest row ids listed above.
