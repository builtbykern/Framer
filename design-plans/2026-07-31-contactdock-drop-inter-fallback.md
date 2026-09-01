# Drop Inter from Contact Dock DEFAULT_FONT

Written against: `4aa0cbc` (repo) · Framer file `UkECoRS` restored ~781-line build (2026-07-31 afternoon)  
**Status:** DONE (executed 2026-07-31 — one-line fallback only; push UkECoRS typeErrors []; verify ready)

## Evidence chain

- Surface: Contact Dock open sheet — greeting, name, role text in `code-components/ContactDock.tsx`
- Problem: Runtime fallback `fontFamily` is Inter, contradicting Kern visual language when Font control omits family
- Design evidence: `docs/superpowers/specs/2026-07-31-contact-dock-design.md` Visual language — “Avoid: … Inter as runtime fallback (use `ui-sans-serif, system-ui, sans-serif` until buyer Font / Clash owns identity)”. Font control `defaultValue` correctly omits `fontFamily` (lines ~768–778)
- Owner: `DEFAULT_FONT` in `ContactDock.tsx` (lines 86–92)
- Scope and affected surfaces: Only text that spreads `{...font}` (greeting, name, role). Channel row labels use their own fontSize and are out of scope
- Uncertainty: none for the string swap. Interaction/open-close must not change (user constraint: restored version must not break)

## Design decision

Replace Inter in the runtime fallback stack with the neutral system stack named in the spec. Buyer `ControlType.Font` / project Clash via `setAttributes` continues to own identity when set.

```ts
const DEFAULT_FONT: CSSProperties = {
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: 15,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    lineHeight: 1.3,
}
```

Do not hardcode Clash (or any named web font) in Font `defaultValue.fontFamily`.

## Reuse

- Spec-mandated stack: `ui-sans-serif, system-ui, sans-serif`
- Exemplar pattern: other Kern Marketplace components that scrubbed Inter from defaults (e.g. Copy Field Font controls without Inter in `defaultValue.fontFamily`)

No new primitive.

## Changes

1. `code-components/ContactDock.tsx`
   - Change: `DEFAULT_FONT.fontFamily` from `"Inter, system-ui, sans-serif"` → `"ui-sans-serif, system-ui, sans-serif"`
   - Preserve: fontSize, fontWeight, letterSpacing, lineHeight; entire open/close/portal/sheet/orb/pulse/handlers; `ControlType.Font` block (still no `fontFamily` in `defaultValue`); Framer session must stay on Contact Dock sandbox `2GOZzqC76RSbm2V0FOXP` / codeFile `UkECoRS`
   - Verify: `rg Inter code-components/ContactDock.tsx` → zero matches; Preview still toggles sheet with `onClick` on orb

## Scope

- Inherit: all Contact Dock instances using unset / partial Font (fallback path)
- Verify: Home/demo sheet greeting + name after push; open and close still work
- Exclude: accent, glass, layout, motion, channel rows, property control schema, publish, listing assets, any second Font control

## Validation

- Product: default sheet type no longer reads as Inter
- Interface: (1) default Font — greeting/name/role use system stack; (2) buyer Font override still wins via props merge; (3) orb open/close unchanged
- System: no parallel Inter constant left in the file; no new design token file
- Repository:
  - `node scripts/framer/session.mjs --url "https://framer.com/projects/Overly-Interaction--2GOZzqC76RSbm2V0FOXP-i5R6n" --name "Contact Dock"`
  - Edit local file → `node scripts/framer/push-contactdock.mjs` → typeErrors `[]`
  - `node scripts/framer/verify.mjs` → pass
  - `rg Inter code-components/ContactDock.tsx` → no matches

## Stop conditions

- Stop if the change would require editing toggle/portal/sheet positioning (out of scope; user restored a working open UX).
- Stop if Framer canvas requires a named web font string for measurement — then use project-uploaded family via `setAttributes` on the instance, not Inter.
- Stop if session drifts off Contact Dock sandbox — re-pin before any push.

## Design documentation

- After acceptance and validation: optional one-line note in `docs/superpowers/specs/2026-07-31-contact-dock-design.md` Visual language that the implemented runtime fallback is `ui-sans-serif, system-ui, sans-serif` (executor may skip if user declines doc edits).
