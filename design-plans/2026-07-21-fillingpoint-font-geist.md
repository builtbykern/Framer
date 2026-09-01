# Replace Inter with ControlType.Font Geist

- **Status**: DONE

## Outcome

`ControlType.Font` extended (no Inter hardcode). Runtime fallback `fontFamily: "Geist"` — Framer Font `defaultValue` cannot set `fontFamily` (type error); Geist via code default + designer can pick in panel.

## Evidence chain

- Surface: `Kern_FillingPoint` label typography
- Problem: Hardcoded Inter stack — generic vs SOTD / user no-Inter rule
- Design evidence: User frontend hard rules; audit U2; `fontFamily: 'Inter…'` in component
- Owner: `code-components/Kern_FillingPoint.tsx`
- Scope: Component defaults + property controls
- Uncertainty: Geist must resolve in Framer font library (use font-search if create fails)

## Design decision

Remove Inter hardcode and separate `fontSize`/`fontWeight` controls. Add `ControlType.Font` (`controls: "extended"`) with default Geist Semibold 16px. Spread font styles onto label (and root for inheritance).

## Reuse

- Framer `ControlType.Font` pattern from Kern marketplace components
- Exemplar: `BuiltByKern/.../Kern_SectionMarker.tsx` Font controls

## Changes

1. `code-components/Kern_FillingPoint.tsx`
   - Change: prop `font` object; default `{ fontFamily: "Geist", fontSize: 16, variant: "Semibold", letterSpacing: "-0.01em", lineHeight: "1.2em" }` (or Framer variant field as required by API); drop Inter string and standalone size/weight controls
   - Preserve: labelColor, padding, radius
   - Verify: typecheck; panel shows Font control; no Inter in source

## Scope

- Inherit: all instances (may need re-pick font on canvas if old size controls orphaned)
- Exclude: demo caption typography (page RichText)

## Validation

- Product: CTA uses Geist (or selected Font)
- Repository: push + typecheck strict 0 errors + verify green

## Stop conditions

- If Geist unavailable, font-search for closest Geometric sans and set that family name once — still not Inter

## Design documentation

- none
