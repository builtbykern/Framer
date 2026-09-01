# Launch Island — opaque Kern ink shell (default)

Written against: `4aa0cbc`

## Evidence chain

- Surface: `code-components/LaunchIsland.tsx` shell surface + property-control defaults; Home instance controls in `scripts/framer/launchisland-home.mjs`
- Problem: Sell default reads as generic frosted glass (`glass=true`, `backdrop-filter: blur(22px) saturate(1.35)`, wash gradient) on `#0A0A0A`, not BuiltByKern / SOTD opaque island ink
- Design evidence: `docs/superpowers/specs/2026-08-07-launch-island-design.md` (craft bar does not require frosted glass); `docs/projects/listings/KERN_THUMBNAIL_STYLE.md` house ground `#060606`; `HoldConfirm.tsx` default `background: "#060606"` + inset rim `boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)"` (~853); `MorphDropdown.tsx` solid `#0F0F0F` shell (no backdrop blur). Contact Dock glass is an orb-specific accepted exception, not this island
- Owner: `LaunchIsland.tsx` (`shellSurface`, defaults, `addPropertyControls`); Home sync `launchisland-home.mjs` `setAttributes` controls
- Scope and affected surfaces: Component defaults + Home dock instance only
- Uncertainty: none for defaults; optional `glass=true` path may keep a lighter blur but must not be the Marketplace sell default

## Design decision

Make the **default** Launch Island shell opaque Kern ink `#060606` with HoldConfirm-style inset hairline rim. Turn frosted glass into an opt-in (`glass` default `false`). Align Home demo controls to the same sell default so Preview matches the product identity.

## Reuse

- Ink ground `#060606` — `KERN_THUMBNAIL_STYLE.md` / `HoldConfirm.tsx` `DEFAULT_LOOK.background`
- Inset rim — `HoldConfirm.tsx` ~853 `inset 0 1px 0 rgba(255,255,255,0.06)`
- Hairline border — HoldConfirm pattern `1px solid rgba(255,255,255,…)` at low alpha (~0.08–0.1)
- Accent `#6FD3FF` — unchanged for transient/live status only
- Exemplar: `code-components/HoldConfirm.tsx` sealed/idle shell material

No new shared primitive — local shell styles in `LaunchIsland.tsx` only.

## Changes

1. `code-components/LaunchIsland.tsx`
   - Change: Default `background = "#060606"`; default `glass = false`. When `glass === false` (default): solid `background` fill; **no** `backdropFilter` / wash gradient; apply absolute inset rim span with `boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)"` (same as HoldConfirm); border `1px solid rgba(255,255,255,0.08)`. When `glass === true` (opt-in): may keep reduced blur, but sell path must not depend on it. Update `addPropertyControls` `background.defaultValue` and `glass.defaultValue` to match.
   - Preserve: Mode sizes, content layouts, accent usage for transient/live, `shadow` prop behavior (depth shadow OK; do not replace inset rim with only drop shadow)
   - Verify: Canvas Preview Mode compact/expanded/live on Home shows solid `#060606` pill without frosted smear against liquid atmosphere

2. `scripts/framer/launchisland-home.mjs`
   - Change: Instance controls `background: "#060606"`, `glass: false` (remove forced `glass: true` / `#0A0A0A`)
   - Preserve: Atmosphere liquid recipe, Stage structure, dock height
   - Verify: Re-run home script; instance matches component defaults

## Scope

- Inherit: Any future Launch Island inserts get new defaults
- Verify: Home `/` dock instance after `launchisland-home.mjs`
- Exclude: Chronograph digit wells (plan #2); Stage copy (plan #3); phase-3 morph springs; MorphDropdown / HoldConfirm source edits

## Validation

- Product: Island reads as Kern opaque live-activity shell, not generic glass UI kit
- Interface: Preview Mode compact, transient, expanded, live — all on `#060606` ink when glass off; toggle Glass On still works as opt-in
- System: Matches HoldConfirm/Morph solid-ink language; does not invent a new glass token
- Repository: `node scripts/framer/push-launchisland.mjs` → `typeErrors: []`; `node scripts/framer/launchisland-home.mjs`; `node scripts/framer/verify.mjs` → ready / non-blocking

## Stop conditions

- Stop if product owner re-accepts frosted glass as the Launch Island default (would supersede this plan)
- Stop if Framer Color control cannot express `#060606` (unlikely)

## Design documentation

- After acceptance: note in `docs/superpowers/specs/2026-08-07-launch-island-design.md` craft bar — “Default shell = opaque Kern ink `#060606`; glass opt-in only”
