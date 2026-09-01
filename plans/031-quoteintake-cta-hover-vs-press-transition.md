# 031 — CTA per-gesture transition (hover ease ≠ press)

- **Status**: DONE
- **Commit**: n/a (SoT `state/QuoteIntake.tsx` Version: 3.10.0)
- **Severity**: LOW
- **Category**: Easing & duration
- **Estimated scope**: 1 file, ~15 lines

## Problem

Primary CTAs use one `transition={PRESS_TRANSITION}` (120ms ease-out) for both `whileHover` scale and `whileTap` press. Hover should use ~160ms `ease` (AUDIT); press stays 100–160ms ease-out.

```tsx
/* state/QuoteIntake.tsx:561-563, 844 — current */
const ctaHover = motionOk && canHover ? { transform: "scale(1.015)" } : undefined
…
whileHover={!submitting ? ctaHover : undefined} whileTap={!submitting && motionOk ? PRESS_TAP : undefined} transition={PRESS_TRANSITION}
```

Same pattern on success reset button (`~813`).

## Target

```tsx
const HOVER_TRANSITION = { duration: 0.16, ease: "ease" as const }
const CTA_TRANSITION = {
    transform: PRESS_TRANSITION, // whileTap scale — 0.12s EASE_OUT
    // Framer Motion applies default transition to hover unless default is overridden;
}
```

Framer Motion supports per-gesture:

```tsx
transition={{
  transform: { duration: 0.12, ease: EASE_OUT },
}}
whileHover={{ transform: "scale(1.015)", transition: { duration: 0.16, ease: "ease" } }}
whileTap={{ ...PRESS_TAP, transition: PRESS_TRANSITION }}
```

Or:

```tsx
whileHover={hoverOk ? { transform: "scale(1.015)", transition: { duration: 0.16, ease: "ease" } } : undefined}
whileTap={motionOk ? { ...PRESS_TAP, transition: PRESS_TRANSITION } : undefined}
```

Keep `PRESS_TAP = { transform: "scale(0.98)" }`, `EASE_OUT = [0.23, 1, 0.32, 1]`, fine-pointer `canHover` gate.

Apply to: primary Next (`~844`), success Start over (`~813`). Back has no hover — leave as `PRESS_TRANSITION` only.

## Repo conventions to follow

- `canHover` / `motionOk` gating already in file (`~400`, `~563`).
- Do not restore RadioTile hover (022 settled).

## Steps

1. Add hover transition inline on `whileHover` (160ms `ease`) for Next + success CTA.
2. Keep tap on `PRESS_TRANSITION` / 120ms `EASE_OUT`.
3. Remove shared `transition={PRESS_TRANSITION}` only if per-gesture covers both; otherwise keep default press-safe.
4. Push; typecheck; verify. Stay ≤1000 lines.

## Boundaries

- Do NOT change hover scale amount (1.015) or press scale (0.98).
- Do NOT animate layout properties.
- Do NOT affect RadioTile.

## Verification

- **Mechanical**: typecheck 0; verify OK.
- **Feel check**: Desktop hover on Next — scale eases ~160ms; tap snaps ~120ms. Touch: no sticky hover (`canHover` false).
- **Done when**: Hover and tap no longer share a single 120ms ease-out curve on primary CTAs.
