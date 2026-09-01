# Phone timeline air for StatsBand values

Status: **DONE** (2026-07-18) — shipped on `KzA2jsd`; typecheck clean.

Written against: Framer code file `Arbour_StatsBand.tsx`, component id `KzA2jsd`

## Evidence chain

- Surface: Home `/` StatsBand instances `U3TeNUVXvniUaR1BQD`, `pmAxXUJ0oniUaR1BQD` — `semanticMode: description-list`; phone branch in `StatRow` when `mode === "phone"` (width &lt; 580)
- Problem: On phone, timeline markers sit at `left: 0` / tick at `left: 7`. Index and label use `phoneContentInset = 18` via `paddingLeft`, but `ddStyle` sets `paddingLeft: isPhone ? 0 : termValueGap`, which clears the value’s inset so numbers sit flush against the timeline. Designers cannot increase that air: `layoutGroup.phoneContentGap` only affects row gap and is `hidden: () => true`.
- Design evidence: Same-row contradiction inside `StatRow` (`indexStyle` / `labelStyle` vs `ddStyle`); user request for a mobile control to separate numbers from the timeline
- Owner: `Arbour_StatsBand.tsx` (`KzA2jsd`) — `StatRow` + `layoutGroup` property controls
- Scope and affected surfaces: All StatsBand instances in phone mode with `semanticMode: description-list` (Home primary); plain list path already keeps `valueStyle.paddingLeft: phoneContentInset`
- Uncertainty: Exact default inset beyond restoring consistency (18px today); recommend default `24`–`32` only if canvas review confirms 18 still feels tight — otherwise keep `18` as default and expose the slider

## Design decision

Expose a phone-only **timeline → content inset** control and apply it to the **value** (and keep index/label on the same inset) so numbers can be pulled away from the timeline without changing desktop columns.

## Reuse

- Existing hardcode: `phoneContentInset = isPhone ? 18 : 0` in `StatRow`
- Existing (hidden) control pattern: `layoutGroup.phoneContentGap`
- Exemplar: same file — `indexToTextGap` / `lineToTextGap` as visible layout sliders

No new shared primitive outside this component.

## Changes

1. `Arbour_StatsBand.tsx` (`KzA2jsd`) — props / `layoutGroup`
   - Change: Add `phoneTimelineInset` (number, px, min `12`, max `48`, step `2`, default `18`) under Layout; show control (not `hidden`). Wire through `layoutConfig` into `StatRow`.
   - Preserve: Desktop/tablet grid, markers, motion, count-up, non-phone `paddingLeft` behavior.
   - Verify: Control appears in Framer Layout panel; changing it updates phone canvas only.

2. `Arbour_StatsBand.tsx` — `StatRow`
   - Change: Replace hardcoded `phoneContentInset = isPhone ? 18 : 0` with `isPhone ? phoneTimelineInset : 0`. In `description-list` `ddStyle`, use `paddingLeft: isPhone ? phoneContentInset : termValueGap` (do **not** force `0` on phone).
   - Preserve: Index/label still use the same inset; desktop `dd` still uses `termValueGap`.
   - Verify: Phone values clear the tick/line by ≥ selected inset; index/label/value share the same left edge.

3. Home instances (optional after code ship)
   - Change: If default `18` still feels tight on device, set instance `phoneTimelineInset` to `28`–`32` on `pmAxXUJ0oniUaR1BQD` (phone-leaning pads) and matching sibling if needed.
   - Preserve: Desktop padding/gap tokens already set.
   - Verify: Live phone viewport screenshot — value not touching timeline.

## Scope

- Inherit: Every StatsBand consumer in phone + description-list
- Verify: Plain (non-dl) phone path still insets values; tablet/desktop unchanged
- Exclude: Motion changes, file split/refactor (`013-statsband-refactor.md`), token migrations, aesthetic type scale work

## Validation

- Product: On phone Home stats, author can increase air between timeline and numbers via Layout
- Interface: Phone (&lt;580), description-list, 2–4 stats; extremes `12` and `48`; reduced-motion unchanged
- System: Single inset owner — no second parallel padding prop on value only
- Repository: Framer typecheck / canvas phone preview of `KzA2jsd` → value `paddingLeft` equals control; `ddStyle` no longer zeros phone inset

## Stop conditions

- Stop if Framer property control nesting forbids a new Layout number without breaking existing instances — then migrate by aliasing from `phoneContentGap` only if product accepts coupling row-gap to inset (prefer not).
- Stop if product wants numbers on a **second column** beside the line (grid `auto 1fr`) instead of inset — that is a different layout change; do not mix.

## Design documentation

- After acceptance: In `docs/projects/arbour.md` code-components note — StatsBand phone timeline inset default `18`, control `layout.phoneTimelineInset`.
