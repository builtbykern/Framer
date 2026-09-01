# Remove hardcoded minHeight 600px from InertiaGrid

Written against: 4aa0cbc (SoT `state/InertiaGrid.tsx.snapshot` → Framer `InertiaGrid.tsx`)

- **Status**: DONE
- **Project**: `PBghPP85VH1cuE7BNtzx` (InertiaGrid) / `Kern_InertiaGrid`

## Evidence chain

- Surface: Published + canvas root container of `Kern_InertiaGrid`
- Problem: Root forces `minHeight: "600px"` while Framer annotations promise auto height, so short grids leave empty chrome and fight frame hug
- Design evidence: Annotation `// @framerSupportedLayoutHeight: auto` (snapshot lines 1–4) vs `minHeight: "600px"` in `containerStyle` (snapshot line 386). Intrinsic default remains `@framerIntrinsicHeight: 600` for insert size only
- Owner: `containerStyle` in `Kern_InertiaGrid`
- Scope and affected surfaces: All instances of the code component
- Uncertainty: none — annotation and runtime conflict are in the same file

## Design decision

Remove `minHeight: "600px"` from `containerStyle`. Height is owned by the Framer frame / parent layout. Keep `@framerIntrinsicHeight: 600` so new inserts still default to a useful size without locking minimum height at runtime.

## Reuse

- Existing Framer layout annotations on the file
- Exemplar: other Kern marketplace components that rely on intrinsic defaults without runtime `minHeight` floors (e.g. QuoteIntake frame-driven height)

## Changes

1. `InertiaGrid.tsx` (`containerStyle`, ~line 386)
   - Change: Delete `minHeight: "600px"`
   - Preserve: `position: "relative"`, background modes, alignment flex, `width/height: "100%"`, overflow, fonts
   - Verify: Frame height hugs / follows parent; empty 600px band gone when content is shorter

## Scope

- Inherit: All InertiaGrid instances
- Verify: Canvas preview and published site with tall and short item counts
- Exclude: Changing intrinsic width/height annotations; motion plans 032–039; background defaults

## Validation

- Session project `PBghPP85VH1cuE7BNtzx`
- Push code file; `node scripts/framer/verify.mjs` exit 0
- Designer: set frame height Auto / hug — no forced 600px gap below grid

## Stop conditions

- If product owner later wants a *configurable* min height control, stop and ask — do not invent a new control in this plan

## Design documentation

- none (optional note in listing later: “height follows frame”)
