# Dive Field panel credit — host on last leaf

- **Status**: SUPERSEDED — user: credit must stay in general panel (top-level), never nested inside an Object leaf. 2026-08-05 follow-up hosts credit on `motion` Object `description` (last top-level group) + restores Reduce Motion help.
Written against: `4aa0cbc`

## Evidence chain

- Surface: Framer editor properties panel for Dive Field instance (code component `DiveField`)
- Problem: Author credit is hosted on the **Motion** `ControlType.Object` `description`, so Motion loses its functional help and the credit is not attached the way Matt’s Marketplace components do it (last real leaf control).
- Design evidence:
  - User exemplar screenshot: Nova Glow Navigation — credit sits under last real control **Logo Text** (not a dummy field; not an Object group).
  - Published module `https://framer.com/m/Nova-Glow-Navigation-OrJUBh.js@ZtWuxb2yxX4NlqqtHO4w` → `Logo Text` / `BLHsmjyMg`: `type: ControlType.String`, `description` is credit-only.
  - Other Matt modules piggyback the same credit `description` on the last real leaf (`Shine` Boolean, `Line Color` Color, `Studs` Number, `Padding`, etc.) — never a dedicated credits control.
  - Current owner: [`code-components/DiveField.tsx`](../code-components/DiveField.tsx) `addPropertyControls` → `motion.description` (~1507–1511) is credit-only; sibling groups Content / Look / Camera still have functional descriptions.
- Owner: `code-components/DiveField.tsx` → `addPropertyControls(DiveField, { … })`
- Scope and affected surfaces: Dive Field property panel only; no canvas / WebGL / tip publish required for this change
- Uncertainty: With Object groups, credit on a nested leaf is visible when that group is expanded. Acceptable Matt parity is “last real leaf,” not inventing a top-level credits field. Do not reintroduce `credits` Boolean or `ariaLabel` / Name.

## Design decision

Restore Motion’s functional group description. Move the author-credit `description` onto the last real leaf in the last group — `motion.respectReducedMotion` (`ControlType.Boolean`, same class of host as Matt’s `Shine`). That Boolean stays a real product control; only its `description` becomes the credit (Matt’s Shine description is credit-only).

## Reuse

- Pattern: Framer `description` on an existing leaf control (Markdown allowed per Framer property-control docs)
- Exemplar: Nova Glow Navigation `Logo Text` String; Nova Glow Button `shine` Boolean — credit as `description` only
- No new primitive / no new property key for branding

## Changes

1. `code-components/DiveField.tsx` — `addPropertyControls` → `motion`
   - Change: Set `motion.description` back to exactly: `How the dive responds to input.`
   - Preserve: Motion nested controls, defaults, titles, Loop / Auto / Speed behavior
   - Verify: Collapsed Motion row shows that help text (not BuiltByKern)

2. `code-components/DiveField.tsx` — `motion.controls.respectReducedMotion`
   - Change: Replace its current functional description with the credit-only description defined in plan **divefield-panel-credit-link** (executor: if that plan is applied in the same pass, use its exact string; if this plan alone, use interim string `BuiltByKern\n[Explore more components](https://www.framer.com/%40builtbykern/)`).
   - Preserve: `title: "Reduce Motion"`, `defaultValue: true`, `enabledTitle` / `disabledTitle`, runtime `respectReducedMotion` behavior
   - Verify: Expanding Motion → last control is Reduce Motion; credit text appears with that control (below/above per Framer’s description placement), not on the Motion group row

3. Push + typecheck
   - Change: `node scripts/framer/session.mjs --id 7mzOTQA5ZdZVnu6ZH54e --name "Dive Field"` then `node scripts/framer/push-divefield.mjs`
   - Preserve: no tip/Community publish
   - Verify: push `typeErrors: []`

## Scope

- Inherit: Dive Field instances in sandbox `7mzOTQA5ZdZVnu6ZH54e`
- Verify: Property panel after reselecting the component
- Exclude: WebGL dive feel; listing assets; other Kern components; inventing Name / Credits controls; changing `aria-label`

## Validation

- Product: Select Dive Field → Motion shows functional help; open Motion → Reduce Motion shows BuiltByKern credit (link rendering covered by sibling plan)
- Interface: Desktop Framer editor property panel; Motion collapsed vs expanded
- System: Same piggyback pattern as Matt; no parallel `credits` prop
- Repository: `node scripts/framer/push-divefield.mjs` → `typeErrors: []`; optional `node scripts/framer/verify.mjs` → no blocking errors

## Stop conditions

- Stop if Framer session for project `7mzOTQA5ZdZVnu6ZH54e` is unavailable
- Stop if product intent changes to require a dedicated visible credits control (that contradicts Matt exemplar — escalate to user)
- Stop if `respectReducedMotion` is removed or renamed — pick the new last leaf in the last group instead

## Design documentation

- None (Marketplace panel convention; record in Engram / listing notes only if user asks)
