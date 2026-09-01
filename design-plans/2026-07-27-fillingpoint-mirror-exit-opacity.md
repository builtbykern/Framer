# Mirror exit opacity to enter (SOTD enter↔leave identity)

Written against: `4aa0cbc`

## Evidence chain

- Surface: `Kern_FillingPoint` hover fill — enter vs leave on `/`
- Problem: Leave feels softer/ghosted vs solid paint enter; notable enter≠exit.
- Design evidence: `docs/projects/filling-point.md` — Soft checklist “retracts then fades”; Motion “enter/exit share the ink curve”
- Owner: `code-components/Kern_FillingPoint.tsx`
- Scope and affected surfaces: Framer `codeFile/APe9aGh`; demo `/`; `/thumbnail`
- Uncertainty: Late fade may briefly re-mark Solid disk edges; accept for mirror identity (Soft wash remains separate product mode)

## Design decision

Restore exit opacity as the true reverse of enter so leave reads as rewind of enter. Scale already shares ink ease; opacity was the break (early long dissolve vs short seed fade-in).

## Reuse

- Existing enter opacity ratios (`OPACITY_ENTER_*`)
- Existing `EASE_OUT` / introduce mirrored ease-in for exit only
- Exemplar: enter branch in `Kern_FillingPoint.tsx` opacity `Transition` (~L785–797)

## Changes

1. `code-components/Kern_FillingPoint.tsx`
   - Change: `OPACITY_EXIT_DELAY_RATIO = 1 - OPACITY_ENTER_DELAY_RATIO - OPACITY_ENTER_DURATION_RATIO` (→ `0.72`); `OPACITY_EXIT_DURATION_RATIO = OPACITY_ENTER_DURATION_RATIO` (→ `0.28`); exit ease = ease-in that mirrors enter’s ease-out; remove early-dissolve `EASE_OPACITY_EXIT` constants/comments
   - Preserve: origin lock, reverse cascade stagger, scale ink ease enter=exit, Soft wash, reduced-motion path, Solid default
   - Verify: Preview leave — disk stays solid while retracting, fades near end; enter still seed-visible

2. `docs/projects/filling-point.md`
   - Change: Defaults line documents mirrored opacity (enter seed fade; exit late fade = reverse)
   - Preserve: Soft Preview checklist item 4 wording (already matches)
   - Verify: Docs match runtime ratios

## Scope

- Inherit: cinematic / balanced / snappy (all use same opacity ratios × phase)
- Verify: Soft mode leave still readable
- Exclude: Soft wash redesign, clip-path, blur filter, publish

## Validation

- Product: Hover enter then leave — leave feels like rewind of enter
- Interface: Solid cinematic default; Soft once for QA then restore Solid
- System: No parallel opacity schedule; one enter / one mirrored exit
- Repository: `node scripts/framer/push-fillingpoint.mjs` → `typeErrors: []`; `node scripts/framer/verify.mjs` → ready

## Stop conditions

- Stop if mirror late-fade makes Solid edges unacceptable again — open a separate Soft-edge / wash plan; do not re-break enter↔exit identity

## Design documentation

- After acceptance: record mirrored opacity ratios in `docs/projects/filling-point.md` defaults (this plan’s change 2)
