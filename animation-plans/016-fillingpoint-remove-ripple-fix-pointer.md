# 016 — Remove ripple; rect-only pointer

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Purpose & frequency / Interruptibility
- **Estimated scope**: 1 file

## Problem

Click ripple uses near-`scale(0)` every press. `offsetX` under parent press-scale skews origin.

## Target

- Delete ripple state, layers, pointerdown spawn
- Pointer: only `clientX/Y - currentTarget.getBoundingClientRect()`
- Keep press `scale(0.97)`

## Steps

1. Remove Ripple interface and all ripple UI/handlers.
2. `syncFromEvent` → rect-only; simplify `onPointerDown` to press only.
3. Push.

## Boundaries

- Do not add alternate decorative press effects

## Verification

- No ripple on click; origins stable under press scale
