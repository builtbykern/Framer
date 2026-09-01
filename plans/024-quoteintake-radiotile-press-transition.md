# 024 — Per-gesture transitions on RadioTile (press ≠ hover)

- **Status**: DONE
- **Commit**: n/a (no git HEAD; SoT `state/QuoteIntake.tsx` Version: 3.9.1)
- **Severity**: MEDIUM
- **Category**: Interruptibility / Easing & duration
- **Estimated scope**: 1 file, ~15 lines

## Problem

`RadioTile` uses a single `transition={HOVER_TRANSITION}` (220ms ease-out) for both hover and tap. Press feedback should be **100–160ms**; 220ms makes taps feel soft. After plan 022 removes hover transform, press must still use the short curve.

```tsx
/* state/QuoteIntake.tsx:56-61, 371-372 — current */
const PRESS_TAP = { transform: "scale(0.98)" }
const PRESS_TRANSITION = { duration: 0.12, ease: EASE_OUT }
const HOVER_TRANSITION = { duration: 0.22, ease: EASE_OUT }
…
whileHover={motionOk ? { transform: "translateX(6px)" } : undefined} whileTap={motionOk ? PRESS_TAP : undefined} transition={HOVER_TRANSITION}
```

CTA buttons already do this correctly:

```tsx
/* state/QuoteIntake.tsx:824 — exemplar */
whileHover={!submitting ? ctaHover : undefined} whileTap={!submitting && motionOk ? PRESS_TAP : undefined} transition={PRESS_TRANSITION}
```

## Target

Framer Motion per-gesture transition object:

```tsx
transition={{
    transform: PRESS_TRANSITION,
    // if any hover opacity remains after 022:
    // opacity: { duration: 0.16, ease: "ease" },
}}
```

Simplest correct target after 022 (no hover motion):

```tsx
whileTap={motionOk ? PRESS_TAP : undefined}
transition={PRESS_TRANSITION}
```

If hover is kept for a non-transform property later:

- Hover / color: `duration: 0.16`, easing **`ease`** (AUDIT: hover → ease) — Motions array form or CSS.
- Press: `{ duration: 0.12, ease: EASE_OUT }` where `EASE_OUT = [0.23, 1, 0.32, 1]`.

Press scale stays **0.98** (AUDIT 0.95–0.98).

## Repo conventions to follow

- Imitate CTA `transition={PRESS_TRANSITION}` at L824.
- Do not invent a second press scale.

## Steps

1. Ensure plan 022 applied (no `translateX` hover) **or** apply both in one edit.
2. Set RadioTile `transition={PRESS_TRANSITION}`.
3. If `HOVER_TRANSITION` becomes unused file-wide, remove the constant (check CTAs — they use `PRESS_TRANSITION` / `ctaHover` only). Grep before deleting.
4. Push, typecheck, verify.

## Boundaries

- Do NOT change `PRESS_TAP` scale value.
- Do NOT slow CTA press to match old hover.
- Do NOT add dependencies.

## Verification

- **Mechanical**: typecheck 0; `HOVER_TRANSITION` either still used or deleted cleanly.
- **Feel check**:
  - Press an intent row @ 10% playback — transform duration ≈ 120ms, not 220ms.
  - Release returns quickly; no sluggish settle.
- **Done when**: RadioTile press uses `PRESS_TRANSITION` (0.12s).
