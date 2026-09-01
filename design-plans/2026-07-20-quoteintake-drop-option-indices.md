# Drop RadioTile zero-padded indices (chapter owns 01 language)


- **Status**: DONE
Written against: unavailable (SoT `state/QuoteIntake.tsx` Version: 3.10.0)

## Evidence chain

- Surface: `Kern_QuoteIntake` step 1 intent list + step 3 timeline list; chapter strip in `renderProgress`
- Problem: Option rows and chapter progress both render `01`-style numerals, so the same task shows two competing number systems
- Design evidence: Chapter strip uses `String(n).padStart(2, "0")` + step label (`state/QuoteIntake.tsx` ~576); `RadioTile` renders the same pad on every option (`~375`)
- Owner: `RadioTile` for option chrome; `renderProgress` for chapter chrome
- Scope and affected surfaces: Intent radiogroup, timeline radiogroup (both use `RadioTile`)
- Uncertainty: none — correction is remove option indices, keep chapter strip

## Design decision

Chapter progress owns zero-padded step numerals. Option rows communicate with title + helper + selected inset only — no leading index.

## Reuse

- Keep `RadioTile` selected inset (`boxShadow`) and opacity selection states
- Exemplar of list without competing indices: success “Selection” rows (`~740`) which use label/value only

## Changes

1. `state/QuoteIntake.tsx` — `RadioTile`
   - Change: Remove the leading `<span>…padStart(2,"0")…</span>` and the `index` prop if unused after removal. Adjust gap/padding if the left rail was only for the number (keep left padding for inset accent readability: keep `paddingLeft` 10–12px).
   - Preserve: `role="radio"`, selected accent inset, helper text, press motion, keyboard radiogroup wiring.
   - Verify: Intent/timeline options show title (+ helper) only; chapter strip still shows `01 Intent` etc.

2. Call sites (`~605`, `~662`)
   - Change: Stop passing `index={i}` once prop removed.
   - Preserve: `id`, `selected`, `onSelect`, refs.
   - Verify: Typecheck clean; no unused `index`.

## Scope

- Inherit: All `RadioTile` consumers in this file
- Verify: Step 1 and step 3 only
- Exclude: Chapter `renderProgress` numerals; formula line breakdown; do not invent new option markers

## Validation

- Product: On step 1, scan options — only one `01` language (chapters), not per option
- Interface: Desktop + stack (`cw < collapseBreakpoint`); selected vs unselected tiles
- System: No new token; chapter strip unchanged
- Repository: Push `Workshop/QuoteIntake.tsx`; `typecheck({ strict: true })` → 0; file ≤1000 lines; `node scripts/framer/verify.mjs` non-blocking

## Stop conditions

- Stop if product owner requires option indices for Marketplace listing screenshots — then restyle indices instead of removing (non-pad, opacity ≤0.35, not matching chapter letter-spacing)

## Design documentation

- none (Marketplace component; record in plan status only)
