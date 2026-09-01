# 076 — Dive Field: whole-layer keyboard + settle boost

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Cohesion / Purpose & frequency
- **Estimated scope**: 1 file — `code-components/DiveField.tsx` (`onKey` + damp in `draw`)
- **Audit finding**: improve-animations Dive Field 2026-08-04-restore #5
- **Depends on**: ideally after **075**; same push OK
- **Supersedes craft of**: 069 — **no Snap**; use KEY_BOOST only

## Problem

Keyboard grammar is inconsistent:

- Arrow / Page: `target += 0.5` / `-= 0.5` — mid-plane.
- Space: `target = Math.round(current) + dir` — whole layer.

Settle after key can exceed the **300ms** UI budget (AUDIT.md §2) at default damping `0.48`.

Evidence (`code-components/DiveField.tsx` ~784–792):

```tsx
if (e.code === "ArrowDown" || e.code === "PageDown") {
    e.preventDefault()
    target += 0.5
} else if (e.code === "ArrowUp" || e.code === "PageUp") {
    e.preventDefault()
    target -= 0.5
} else if (e.code === "Space" && !e.repeat) {
    e.preventDefault()
    target = Math.round(current) + (e.shiftKey ? -1 : 1)
}
```

## Target

Exact constants:

```ts
const KEY_BOOST_MS = 220
const KEY_BOOST_DAMP = 0.82
```

```tsx
let keyBoostUntil = 0

// onKey branches:
if (e.code === "ArrowDown" || e.code === "PageDown") {
    e.preventDefault()
    target = Math.round(current) + 1
    keyBoostUntil = performance.now() + KEY_BOOST_MS
} else if (e.code === "ArrowUp" || e.code === "PageUp") {
    e.preventDefault()
    target = Math.round(current) - 1
    keyBoostUntil = performance.now() + KEY_BOOST_MS
} else if (e.code === "Space" && !e.repeat) {
    e.preventDefault()
    target = Math.round(current) + (e.shiftKey ? -1 : 1)
    keyBoostUntil = performance.now() + KEY_BOOST_MS
} else {
    return
}
// existing infinite clamp after branches…
```

In `draw`, where damp is computed (~820):

```tsx
let dampAmt = mot.damping
if (performance.now() < keyBoostUntil && !dragging) {
    dampAmt = Math.max(dampAmt, KEY_BOOST_DAMP)
}
const damp = 1 - Math.pow(1 - Math.min(0.99, dampAmt), dt * 60)
```

**Do not** add Snap / `armSnap`.

## Repo conventions to follow

- Space already defines whole-layer semantics — Arrow/Page copy it.
- 220ms / 0.82 matches prior KEY_BOOST craft (under 300ms UI budget).
- Push: `node scripts/framer/push-divefield.mjs`.

## Steps

1. Add `KEY_BOOST_MS` / `KEY_BOOST_DAMP` constants.
2. Add `keyBoostUntil` local; update all three key branches; wire damp boost in `draw`.
3. Push + verify.

## Boundaries

- Do NOT add Snap.
- Do NOT change wheel step math.
- Do NOT change default `damping` control value.
- If Arrow already whole-layer + KEY_BOOST exists, STOP and report.

## Verification

- **Mechanical**: push + verify green.
- **Feel check**: focused region — ArrowDown lands on next whole plane (same as Space). Settle feels decisive (~220ms boost). Wheel feel unchanged.
- **Done when**: Arrow/Page/Space share whole-layer grammar; boost only after keys, not drag.
