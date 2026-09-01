# Wire Title tablet/mobile controls into step and success titles

Written against: unavailable (SoT `state/QuoteIntake.tsx` Version: 3.12.0)

- **Status**: DONE

## Evidence chain

- Surface: Step screen title (`#step-title`) and success summary title
- Problem: Typography panel exposes “Title tablet” / “Title mobile” but titles ignore them
- Design evidence: Controls `typography.fontSizeTablet` default 44, `fontSizeMobile` default 36 (`~887–888`); step uses `fluidSize(28, 24, 22, tab)` (`~418`, applied `~774`); success uses `isMob ? "32px" : "44px"` (`~746`)
- Owner: `typography.fontSizeTablet` / `typography.fontSizeMobile` (+ `titleFont` for family/weight)
- Scope and affected surfaces: Step title size; success title size
- Uncertainty: Desktop step title today is clamp-based 22–28, not `titleFont.fontSize` (56) — keep desktop step title smaller than display estimate; only replace the hardcoded mobile/tablet legs with the control values

## Design decision

Resolve step title font size with `tierN` (or `fluidSize`) using:
- Desktop leg: keep a compact step size — use `28` (current fluid max) or parse from a dedicated value; do **not** force full `titleFont.fontSize` (56) onto the step H1 (that would blow the form). Prefer: `fluidSize(28, typography.fontSizeTablet, typography.fontSizeMobile, tab)` **only if** tablet/mobile control values are ≤ desktop leg; defaults 44/36 are **larger** than current 24/22 — that would enlarge mobile titles vs today.

Re-read defaults: fontSizeTablet 44, fontSizeMobile 36 vs current step 28/24/22. Wiring controls literally **increases** small-size titles. User asked for better small layout (usually denser/smaller). 

Correct interpretation of the controls given their names and defaults: they were meant for **display/estimate-adjacent titles** or success, not the smaller step question. Options:
A) Wire success title to `fontSizeMobile` / `fontSizeTablet` / desktop 44 — matches success’s current `isMob ? 32 : 44` pattern more closely (use controls instead of 32).
B) Change control defaults to 22/24 and wire step title — invents new defaults.
C) Wire step title as `fluidSize(28, min(24, fontSizeTablet), min(22, fontSizeMobile), tab)` — weird.

Best single correction per audit: **Use the controls as the mobile/tablet legs for step title**, and **update defaultValues** of the controls to match current step scale (`fontSizeTablet: 24`, `fontSizeMobile: 22`) so panel and runtime agree without enlarging small layouts. Success title: `tierN` → mobile `fontSizeMobile`, tablet `fontSizeTablet`, desktop `44` (or keep 44 hardcoded desktop only).

Actually audit said: "Wire step (+ success) title sizes to typography.fontSizeTablet / fontSizeMobile". If we wire with current defaults 44/36, small layouts get bigger type — opposite of density. Plan must:
1. Set control defaults to `24` tablet / `22` mobile (match current `fluidSize` legs).
2. `stepTitleSize = fluidSize(28, typography.fontSizeTablet, typography.fontSizeMobile, tab)`.
3. Success: `tierN(cw, mob, tab, 44, typography.fontSizeTablet, typography.fontSizeMobile)` as px strings — or keep success slightly larger: desktop 44, tablet fontSizeTablet, mobile fontSizeMobile after defaults updated… Success currently 32 mobile / 44 else — with defaults 22/24 success would shrink a lot. Better: success uses `tierN(..., 44, 36, 32)` hardcoded OR separate — audit said wire to controls.

Practical decision:
- Step title: `fluidSize(28, fontSizeTablet, fontSizeMobile, tab)` + **change defaults to 24 and 22**.
- Success title: `isMob ? fontSizeMobile : fontSizeTablet` is wrong for desktop. Use `tierN(cw, mob, tab, 44, fontSizeTablet, fontSizeMobile)` with success-oriented defaults — conflict if same props used for step.

**Same two props cannot be both 22/24 (step) and 36/44 (success).** 

Audit finding was controls unused. Correction with one owner:
- Use controls for **step title** fluid legs; update defaults to 24/22.
- Success title: keep `tierN(cw, mob, tab, 44, 36, 32)` as literals OR use `titleFont.fontSize` on desktop only — state in plan: success stays on explicit tier `44 / 36 / 32` unless we add new props (out of scope). Only step title consumes `fontSizeTablet` / `fontSizeMobile`.

That is one deterministic correction without inventing a third control.

## Reuse

- `fluidSize`, `typography.fontSizeTablet`, `typography.fontSizeMobile`, `layout.tabletBreakpoint`
- Exemplar: existing `fluidSize(28, 24, 22, tab)` call site — replace 24/22 with props; align defaults

## Changes

1. `DEFAULT_PROPS.typography` + property controls (`~148–149`, `~887–888`)
   - Change: `fontSizeTablet: 24`, `fontSizeMobile: 22` (defaults + control `defaultValue`).
   - Preserve: Control titles “Title tablet” / “Title mobile”.
   - Verify: Panel defaults match step scale.

2. Step title (`~418`)
   - Change: `const stepTitleSize = fluidSize(28, typography.fontSizeTablet, typography.fontSizeMobile, tab)`.
   - Preserve: `titleFont` family/weight on the element; clamp behavior.
   - Verify: Changing Title mobile in Framer updates step H1 on narrow widths.

3. Success title (`~746`)
   - Change: Leave as `isMob ? "32px" : "44px"` **or** `tierN` with literals 44/36/32 — do not bind to fontSizeTablet/Mobile after step owns those props. Document in plan notes.
   - Preserve: Success hierarchy larger than step question on desktop.
   - Verify: Success unchanged visually from 3.12 unless using 44/36/32 tier (36 tablet was not in UI before — prefer leave success line as-is).

## Scope

- Inherit: Step title only for the controls
- Verify: Phone / tablet / desktop step 1 copy length extremes
- Exclude: Estimate price sizes; new property controls; success rebinding to same props

## Validation

- Product: Typography → Title mobile/tablet changes step title size at matching BPs
- Interface: Defaults still read ~22–28px step titles (not 36–44)
- System: No dead controls
- Repository: typecheck 0; verify.mjs OK

## Stop conditions

- Stop if designer intent was for these controls to size **success** or **estimate** instead of step — re-audit before wiring

## Design documentation

- none
