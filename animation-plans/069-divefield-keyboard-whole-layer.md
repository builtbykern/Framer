# 069 — Dive Field: whole-layer keyboard steps (+ snappy damp)

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Purpose & frequency / Cohesion
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (`onKey` + small damp boost)
- **Audit finding**: improve-animations Dive Field 2026-08-03 #5 (+ missed #2)
- **Depends on**: ideally after **065** (focus gate) so testing keys is safe; can land same push

## Problem

Keyboard grammar is inconsistent:

- Arrow / Page: `target += 0.5` / `-= 0.5` — lands mid-plane.
- Space: `target = Math.round(current) + dir` — whole layer.

Keyboard is high-frequency; steps should be decisive and match Space.

Evidence (`code-components/DiveField.tsx` ~834–846):

```tsx
if (e.code === "ArrowDown" || e.code === "PageDown") {
    e.preventDefault()
    target += 0.5
    armSnap(1)
} else if (e.code === "ArrowUp" || e.code === "PageUp") {
    e.preventDefault()
    target -= 0.5
    armSnap(-1)
} else if (e.code === "Space" && !e.repeat) {
    e.preventDefault()
    const dir = e.shiftKey ? -1 : 1
    target = Math.round(current) + dir
    armSnap(dir)
}
```

## Target

1. Arrow / Page use the **same whole-layer rule as Space**:

```tsx
if (e.code === "ArrowDown" || e.code === "PageDown") {
    e.preventDefault()
    target = Math.round(current) + 1
    armSnap(1)
    keySnapBoostUntil = performance.now() + 220
} else if (e.code === "ArrowUp" || e.code === "PageUp") {
    e.preventDefault()
    target = Math.round(current) - 1
    armSnap(-1)
    keySnapBoostUntil = performance.now() + 220
} else if (e.code === "Space" && !e.repeat) {
    e.preventDefault()
    const dir = e.shiftKey ? -1 : 1
    target = Math.round(current) + dir
    armSnap(dir)
    keySnapBoostUntil = performance.now() + 220
}
```

2. Brief damp boost after key (220ms), mirroring snap’s snappy path — **exact**:

```tsx
// near other locals in the effect
let keySnapBoostUntil = 0

// inside draw, where dampAmt is computed (~877–882):
let dampAmt = mot.damping
if (mot.snap && !snapArmed && !dragging) {
    const snappy = 0.82 - clamp(mot.snapInertia, 0, 1) * 0.35
    dampAmt = Math.max(dampAmt, snappy)
}
if (performance.now() < keySnapBoostUntil && !dragging) {
    dampAmt = Math.max(dampAmt, 0.82)
}
```

`0.82` matches the snap path’s high end (`0.82 - inertia*0.35`). Duration **220ms** (UI under 300ms per AUDIT.md).

Keep infinite / clamp logic after the key branches unchanged.

## Repo conventions to follow

- Space already defines whole-layer semantics — Arrow/Page must copy it.
- Snap snappy damp at `0.82` is the in-file exemplar for “decisive settle”.
- Push: `node scripts/framer/push-divefield.mjs`.

## Steps

1. Add `keySnapBoostUntil` local in the engine `useEffect`.
2. Replace Arrow/Page `target ± 0.5` with `Math.round(current) ± 1`; set boost timestamp on Arrow/Page/Space.
3. Extend damp block with the 220ms `0.82` floor when boost active.
4. Push + verify.

## Boundaries

- Do NOT change wheel step math.
- Do NOT enable Snap by default.
- Do NOT remove focus gate from plan 065 if already applied.
- No new dependencies.
- If Arrow already steps ±1 at stamp time, only add the damp boost (or STOP if both done).

## Verification

- **Mechanical**: push → `typeErrors: []`; `verify.mjs` → `ok: true`.
- **Feel check** (focus Dive Field first — 065):
  1. ArrowDown twice — lands on whole planes (not half-stops); matches Space rhythm.
  2. Key settle feels slightly snappier than a soft wheel nudge for ~200ms, then returns to normal damping.
  3. With Snap on — magnet still works after keys.
  4. Hold Space (`e.repeat`) — still ignored (only first press).
- **Done when**: Arrow/Page/Space all use `Math.round(current) ± 1` (Space shift −1); key boost present.
