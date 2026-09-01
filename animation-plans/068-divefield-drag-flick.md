# 068 — Dive Field: drag flick velocity on release

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (pointer handlers)
- **Audit finding**: improve-animations Dive Field 2026-08-03 #4

## Problem

During drag, each `pointermove` writes `target` from the latest sample. On release, the code only arms snap — **no velocity throw**. Release feels sticky; springs/velocity carry are the interruptibility bar for gesture-driven motion ([AUDIT.md](../.agents/skills/improve-animations/AUDIT.md) §4).

Evidence (`code-components/DiveField.tsx`):

```tsx
// ~792–821 — current
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
        // …
        armSnap(Math.sign(-dy))
    }
    kick()
}
const onPointerUp = () => {
    if (dragging) armSnap(gestureDir)
    dragging = false
    root.style.cursor = "grab"
    kick()
}
```

## Target

Track last drag delta + timestamp; on release, add a flick impulse into `target`, then `armSnap`.

Exact constants (do not invent others):

```ts
const FLICK_GAIN = 10 // multiplies (lastDy/size.h)*scrollSpeed — same spirit as TinyCard lastDelta×10
const FLICK_MAX = 1.75 // clamp |impulse| in layer units
```

Implementation sketch:

```ts
let dragY = 0
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
        armSnap(Math.sign(-dy))
    }
    kick()
}

const onPointerUp = () => {
    if (dragging) {
        const age = performance.now() - lastDragAt
        // Only flick if the last sample is fresh (< 80ms) — stale finger = no throw
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
            if (impulse !== 0) armSnap(Math.sign(impulse))
            else armSnap(gestureDir)
        } else {
            armSnap(gestureDir)
        }
    }
    dragging = false
    lastDragDy = 0
    root.style.cursor = "grab"
    kick()
}
```

Damping continues to ease `current` → `target` (interruptible). Snap magnet (if enabled) still runs after settle via existing `applySnapTarget`.

## Repo conventions to follow

- Throw scale `×10` matches TinyCard / GA-style lastDelta carry (Engram decision TinyCard motion).
- Clamp non-infinite targets the same way as wheel/drag already do.
- Push: `node scripts/framer/push-divefield.mjs`.

## Steps

1. Add `lastDragDy`, `lastDragAt` locals next to `dragY`.
2. Update `onPointerDown` / `onPointerMove` / `onPointerUp` as above (constants at top of effect or file-level `const`).
3. Push + verify.

## Boundaries

- Do NOT change wheel math.
- Do NOT change snap strength/inertia formulas.
- Do NOT add pointer capture API changes beyond existing `setPointerCapture`.
- Do NOT add dependencies.
- If drag path already has flick at stamp time, STOP and report.

## Verification

- **Mechanical**: push → `typeErrors: []`; `verify.mjs` → `ok: true`.
- **Feel check**:
  1. Slow drag and release — little/no coast (stale or tiny `lastDragDy`).
  2. Fast flick up/down — camera coasts past release point, then damps (and snaps if Snap on).
  3. Spam reverse flicks — motion retargets from current state (no keyframe restart).
  4. With Snap on — flick then magnet settles to a layer without fighting forever.
- **Done when**: a clear flick visibly overshoots the release sample; slow release stays near the release sample.
