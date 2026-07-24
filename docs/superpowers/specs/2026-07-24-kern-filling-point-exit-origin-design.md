# Kern Filling Point — Exit Origin Fix (Phase 1)

**Date:** 2026-07-24  
**Status:** Approved  
**Scope:** Fix fill exit animation so layers collapse back to the pointer/entry origin (not the top-left corner).

## Problem

On pointer leave (and other exit paths), fill layers visually shrink toward the **top-left** of the CTA instead of the point where the cascade started (hover / keyboard-focus center / press origin).

The session model already stores an entry origin in `entryOriginRef`, and `startCascadeOut` already passes that point into `setLayerState`. The failure is primarily in **how layers are centered for `scale` animation**, not in missing origin bookkeeping.

Current centering uses layout margins:

- `left` / `top` = origin point
- `marginLeft` / `marginTop` = `-coverSize / 2`
- Motion animates `scale` + `opacity` with `transformOrigin: 50% 50%`

Negative margins live outside Motion’s transform stack. Combined with `scale → 0` (and occasional resets to `emptyLayers` at `0,0`), the exit can visually die into the top-left.

## Goals

1. Enter and exit share the **same origin point** for the whole session.
2. Exit collapses each fill toward that origin (hover entry point, or center for keyboard/focus).
3. No public API / property-control changes.
4. No behavior changes to reduced-motion opacity path beyond preserving correct idle reset.
5. Minimal diff: geometry + exit-origin freeze only.

## Non-goals

- New interaction modes, energy presets, or visual redesign
- Marketplace listing / copy updates
- Broader accessibility or performance refactors (later phases)
- Changing enter cascade timing, delays, or spring tuning

## Approach (selected)

**Motion-native centering with frozen session origin.**

1. Replace margin-based centering with Framer Motion `x` / `y: "-50%"` on each fill layer, keeping `left` / `top` pinned to the session origin.
2. Freeze `entryOriginRef` for the full enter → active → exit session; exit must not follow live `pointerRef`.
3. While `phase === "exiting"`, do not reset layers via `emptyLayers` (avoids a `0,0` flash mid-exit).
4. Keep reverse-index staggered exit and existing transition helpers.

## Component behavior

### Origin capture

| Trigger | Origin |
|---|---|
| Fine pointer enter | Local point from `clientX` / `clientY` |
| Coarse pointer down | Local point from press |
| Keyboard Enter / Space | Element center |
| `:focus-visible` focus | Element center |

Stored once per session in `entryOriginRef` (+ `sessionRef.origin`).

### Enter

Unchanged cadence: staggered `filled: true` with enter transitions. Layer `left` / `top` / `coverSize` set from frozen origin before/at fill.

### Exit

1. Capture `exitPoint = entryOriginRef.current`.
2. Ensure every layer’s geometry matches `exitPoint` before or as `filled` flips to `false`.
3. Stagger reverse cascade (existing `exitStepMs` / energy).
4. Animate `scale → 0` (and opacity) with exit transition; visual collapse lands on `exitPoint`.
5. After longest exit, `phase = "idle"`.

### Reduced motion

Keep opacity-fill path. Idle/cancel resets still use frozen origin when available (not hard-coded `0,0` when a session origin exists).

## Layer geometry (target)

```tsx
style={{
  position: "absolute",
  left: layer.x,
  top: layer.y,
  width: layer.coverSize,
  height: layer.coverSize,
  x: "-50%",
  y: "-50%",
  borderRadius: "50%",
  backgroundColor: layer.color,
  pointerEvents: "none",
  zIndex: index,
  willChange: "transform, opacity",
}}
```

Remove `marginLeft` / `marginTop` and redundant `transformOrigin` once `x`/`y` centering is in place.

## Guardrails

- `emptyLayers` may still initialize at `0,0` for first mount; that must not run during `exiting`.
- `onPointerMove` may update `pointerRef` for future phases, but **must not** move fill origins mid-session in phase 1.
- Cancel path (`onPointerCancel`) clears timers and resets using session origin when present.

## Acceptance criteria

1. Hover in at an arbitrary point → leave: fills shrink back to that same point.
2. Hover near bottom-right → exit ends at bottom-right, not top-left.
3. Keyboard focus / activation still enters/exits from center.
4. Coarse pointer press/release still exits toward press origin.
5. Rapid enter/leave does not leave stuck fills or a visible jump to `0,0`.
6. Reduced-motion path still toggles opacity without radial scale artifacts.
7. No new props or control-panel changes.

## Files

- Primary: Framer component module for `Kern_FillingPoint` (to be added/updated in repo from the provided source).
- This spec: `docs/superpowers/specs/2026-07-24-kern-filling-point-exit-origin-design.md`

## Spec self-review

- [x] No placeholder APIs or TBD controls
- [x] Scope limited to exit-origin geometry + freeze
- [x] No contradiction with keeping reverse staggered exit
- [x] Acceptance criteria are falsifiable in Framer preview
- [x] Later improvements explicitly deferred
