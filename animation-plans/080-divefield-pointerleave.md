# 080 — Dive Field: pointerleave resets sway target

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Interruptibility
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (~8 lines)
- **Audit finding**: improve-animations Dive Field 2026-08-04-restore #9
- **Pairs with**: **077** (same push OK)

## Problem

Pointer sway reads `pointerX` / `pointerY` from `pointermove` only. Leaving the root leaves the last offsets; `camX`/`camY` ease toward a stale target and the field can sit permanently off-center until the pointer re-enters.

Evidence (`code-components/DiveField.tsx` ~751–772, ~1076–1080):

```tsx
const onPointerMove = (e: PointerEvent) => {
    pointerX = (e.clientX / size.w - 0.5) * 2
    pointerY = (e.clientY / size.h - 0.5) * 2
    // …
}
// listeners: pointerdown/move/up/cancel — no pointerleave
```

## Target

```tsx
const onPointerLeave = () => {
    pointerX = 0
    pointerY = 0
    kick()
}
root.addEventListener("pointerleave", onPointerLeave)
// cleanup: root.removeEventListener("pointerleave", onPointerLeave)
```

Do **not** zero `camX`/`camY` instantly — existing lerp (`dt * 3`) eases back to center (interruptible).

## Repo conventions to follow

- Same kick pattern as other pointer handlers.
- Push: `node scripts/framer/push-divefield.mjs`.

## Steps

1. Add `onPointerLeave`; register + cleanup beside other pointer listeners.
2. Push + verify.

## Boundaries

- Do NOT change sway amount / camera defaults.
- Do NOT steal `pointerup` flick logic (**074**).
- If `pointerleave` already zeros pointer targets, STOP and report.

## Verification

- **Mechanical**: push + verify green.
- **Feel check**: move pointer to edge inside field → leave root → sway eases to center. Re-enter → sway tracks again. Drag-release flick (if 074 done) still works.
- **Done when**: leaving the component drives `pointerX/Y` to 0 and kicks a frame.
