# 007 — Opacity-only exit + cinematic hold default

- **Status**: DONE
- **Commit**: unavailable
- **Severity**: MEDIUM
- **Category**: Physicality / Missed opportunities
- **Estimated scope**: 1 file, ~20 lines

## Problem

1. Root exit animates `opacity: 0` **and** `transform: "scale(0.98)"` (`ZoomImageIntro.tsx:458–461`). The last frame just settled to `SETTLE_SCALE = 1.02`; exit then shrinks the whole stack — a second, conflicting zoom that softens the page reveal.
2. Default `holdAfterSequence = 0.2` (`247`, propertyControl `650`) is shorter than `SETTLE_DURATION = 0.35`, so the rare delight beat barely breathes before dismiss.

Listing promise (`docs/projects/preload-images-listing.md`): dismiss so the page underneath takes over — a clean dissolve, not another scale.

## Target

```ts
// exit animate
phase === "exit"
  ? { opacity: 0 }
  : { opacity: 1 }

// exit transition
{
  type: "tween",
  delay: 0,
  duration: 0.32, // within marketing/drawer-adjacent budget; under AUTO_EXIT_DURATION_CAP
  ease: EASE_OUT, // [0.23, 1, 0.32, 1] — AUDIT --ease-out
}
```

- Remove scale from exit `animate` entirely (do not leave `scale(1)` competing).
- `AUTO_EXIT_DURATION_CAP` may stay `0.45` as a ceiling if still used; prefer fixed `0.32` for exit duration (do not use full zoom `transition.duration`).
- Defaults:
  - `holdAfterSequence` fallback `0.45`
  - propertyControl `defaultValue: 0.45`

## Repo conventions to follow

- `EASE_OUT` already defined as AUDIT ease-out.
- Reduced-motion path stays opacity-only (`REDUCED_MOTION_FADE = 0.2`).

## Steps

1. Change root `animate` exit branch to `{ opacity: 0 }` only; enter rest `{ opacity: 1 }`.
2. Set `exitTransition.duration = 0.32` (stop deriving exit duration from zoom Transition).
3. Set hold fallback + control default to `0.45`.
4. Push `aNCXc66` + typecheck.
5. Optionally reset demo instance `kgBPE4chO` `controls.holdAfterSequence = 0.45` via `setAttributes`.

## Boundaries

- Do NOT change per-layer settle `SETTLE_SCALE` / `SETTLE_DURATION`.
- Do NOT reintroduce fade-out on image layers.
- Do NOT implement click-to-skip here (opportunity O4 — separate if requested).

## Verification

- **Mechanical**: typecheck clean; grep exit animate has no `scale(0.98)`.
- **Feel check**:
  - After last settle, brief hold, then stack dissolves; page underneath does not appear to shrink.
  - 10% speed: exit is pure opacity.
  - Reduced-motion: still gentle fade of last frame, then dismiss timing from hold.
- **Done when**: Exit no longer reads as a zoom; hold default feels like a breath after settle.
