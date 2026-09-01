# 012 — FillingPoint spring defaults + click ripple

- **Status**: DONE

## Outcome

Defaults stiffness 420 / damping 36; click ripple 180ms from press point.
- **Commit**: 4aa0cbc
- **Severity**: LOW / MEDIUM (ripple)
- **Category**: Cohesion & missed opportunity
- **Estimated scope**: 1 file

## Problem

Defaults `stiffness: 280`, `damping: 28` feel soft for Kern. No click feedback ripple.

## Target

1. Defaults + property control defaults: `stiffness: 420`, `damping: 36`
2. On `pointerdown` (not disabled): spawn one ripple at local coords:
   - circle, `backgroundColor: fillColor` or white at 0.35 opacity
   - animate `opacity: 0.35 → 0`, `scale: 0 → ~2` (relative to small seed size ~20px)
   - duration **180ms**, ease `[0.23, 1, 0.32, 1]`
   - `pointer-events: none`; remove after complete
3. Ripple OK under reduced motion (opacity only, scale optional duration 180)

## Steps

1. Update defaultProps + addPropertyControls numbers.
2. Ripple state `{id,x,y}` array max 1–2; onPointerDown push; onAnimationComplete remove.
3. Push + verify.

## Boundaries

- No custom cursor / magnet
- Ripple must not block clicks

## Verification

- Hover spring snappier
- Click shows brief ripple from press point
- Feel-check at 0.25× speed in DevTools if available
