# 074 — Dive Field: drag flick velocity on release

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Interruptibility
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (pointer handlers)
- **Audit finding**: improve-animations Dive Field 2026-08-04-restore #3
- **Supersedes craft of**: 068 — missing after restore; **no Snap** in this build

## Problem

Drag writes `target` from the latest sample. On release, code only clears `dragging` — **no velocity throw**. Gesture dies; AUDIT.md §4 expects velocity carry on gesture-driven motion.

Evidence (`code-components/DiveField.tsx` ~744–772):

```tsx
const onPointerDown = (e: PointerEvent) => {
    dragging = true
    dragY = e.clientY
    root.setPointerCapture(e.pointerId)
    root.style.cursor = "grabbing"
    kick()
}
const onPointerMove = (e: PointerEvent) => {
    pointerX = (e.clientX / size.w - 0.5) * 2
    pointerY = (e.clientY / size.h - 0.5) * 2
    if (dragging) {
        const dy = e.clientY - dragY
        dragY = e.clientY
        target -= (dy / size.h) * motionRef.current.scrollSpeed * 2
        // clamp if !infinite …
    }
    kick()
}
const onPointerUp = () => {
    dragging = false
    root.style.cursor = "grab"
    kick()
}
```

## Target

Exact constants (do not invent others):

```ts
const FLICK_GAIN = 10
const FLICK_MAX = 1.75
```

```ts
let lastDragDy = 0
let lastDragAt = 0

const onPointerDown = (e: PointerEvent) => {
    dragging = true
    dragY = e.clientY
    lastDragDy = 0
    lastDragAt = performance.now()
    root.setPointerCapture(e.pointerId)
    root.style.cursor = "grabbing"
    kick()
}

const onPointerMove = (e: PointerEvent) => {
    pointerX = (e.clientX / size.w - 0.5) * 2
    pointerY = (e.clientY / size.h - 0.5) * 2
    if (dragging) {
        const dy = e.clientY - dragY
        dragY = e.clientY
        lastDragDy = dy
        lastDragAt = performance.now()
        target -= (dy / size.h) * motionRef.current.scrollSpeed * 2
        if (!motionRef.current.infinite && engine) {
            target = clamp(target, 0, Math.max(0, engine.layers.length - 1))
        }
    }
    kick()
}

const onPointerUp = () => {
    if (dragging) {
        const age = performance.now() - lastDragAt
        if (age < 80 && Math.abs(lastDragDy) > 0.5) {
            const speed = motionRef.current.scrollSpeed
            let impulse =
                -(lastDragDy / Math.max(size.h, 1)) * speed * FLICK_GAIN
            impulse = clamp(impulse, -FLICK_MAX, FLICK_MAX)
            target += impulse
            if (!motionRef.current.infinite && engine) {
                target = clamp(
                    target,
                    0,
                    Math.max(0, engine.layers.length - 1)
                )
            }
        }
    }
    dragging = false
    root.style.cursor = "grab"
    kick()
}
```

Also apply the same flick path on `pointercancel` (shared `onPointerUp`).

**Do not** call any Snap / `armSnap` — product has no Snap.

## Repo conventions to follow

- Drag already uses `scrollSpeed` and `size.h` — flick multiplies the same units.
- Push: `node scripts/framer/push-divefield.mjs`.

## Steps

1. Add `FLICK_GAIN` / `FLICK_MAX` near other motion constants at top of file (or next to the effect locals — prefer file-top constants).
2. Add `lastDragDy` / `lastDragAt`; wire down/move/up as above.
3. Push + verify.

## Boundaries

- Do NOT add Snap / magnet.
- Do NOT change wheel or keyboard in this plan.
- Do NOT change damping defaults.
- If flick already exists with these constants, STOP and report.

## Verification

- **Mechanical**: push + verify green.
- **Feel check**: fast vertical drag → release → field continues briefly then damps. Slow release / pause >80ms before up → no throw. Finite mode still clamps.
- **Done when**: fresh release carries impulse capped at ±1.75 layers; stale release does not.
