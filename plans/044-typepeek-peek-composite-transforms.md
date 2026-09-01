# 044 — Type Peek peek windows: composite transforms + surgical will-change

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`code-components/TypePeek.tsx`), ~40–70 lines

## Problem

Peek windows mix paint (`clip-path`) with Framer Motion **shorthands** `x` and `scale` (main-thread) and leave `willChange: "clip-path, opacity, transform"` standing while interactive.

```tsx
/* code-components/TypePeek.tsx:669–723 — current */
animate={
    reducedMotion
        ? { opacity: open ? 1 : 0 }
        : {
              opacity: open ? 1 : 0,
              clipPath: open
                  ? "inset(0% 0% 0% 0%)"
                  : "inset(0% 100% 0% 0%)",
              x: open ? 0 : -5,
          }
}
// …
willChange:
    freeze || reducedMotion
        ? undefined
        : "clip-path, opacity, transform",
// inner:
animate={{
    scale: open ? w.scale : w.scale + 0.08,
}}
```

Windows are small (paint OK for `clip-path`), but shorthands + permanent will-change cost compound across duplicated ticker words.

## Target

Keep left→right `clip-path` inset reveal (signature). Replace shorthands:

```tsx
// window shell — target
animate={
  reducedMotion
    ? { opacity: open ? 1 : 0 }
    : {
        opacity: open ? 1 : 0,
        clipPath: open
          ? "inset(0% 0% 0% 0%)"
          : "inset(0% 100% 0% 0%)",
        transform: open ? "translateX(0px)" : "translateX(-5px)",
      }
}

// inner media — target
animate={{
  transform: open
    ? `scale(${w.scale})`
    : `scale(${w.scale + 0.08})`,
}}
```

- `transformOrigin: "left center"` stays.
- `willChange`: **undefined** by default. Optional: set only while `open` is transitioning (e.g. clear after `transition.duration` via `onAnimationComplete`) — prefer omit entirely first.
- Ease/duration: reuse `tMotion` (`[0.23, 1, 0.32, 1]`, enter ≤0.22, leave ≤0.18).
- Stagger second window: keep `windowIndex * 0.045` (30–80ms band).

## Repo conventions to follow

- AUDIT: Framer Motion `x`/`y`/`scale` shorthands → full `transform` string.
- fixing-motion-performance: will-change temporary/surgical; clip-path OK on small isolated surfaces.
- Exemplar: `plans/033-inertiagrid-composite-transform.md`.

## Steps

1. Replace `x: open ? 0 : -5` with `transform: open ? "translateX(0px)" : "translateX(-5px)"`.
2. Replace inner `scale: …` with `transform: \`scale(${…})\``.
3. Remove standing `willChange` on peek windows (and do not reintroduce multi-property will-change).
4. Confirm reduced-motion branch stays opacity-only (no clip/transform).
5. `push-typepeek.mjs` + `verify.mjs`.

## Boundaries

- Do NOT remove `clip-path` reveal unless craft regresses (then STOP and report).
- Do NOT change anchor letter z-index / `PEEK_LAYOUTS` geometry in this plan.
- Do NOT migrate to WAAPI/GSAP.

## Verification

- **Mechanical**: typeErrors []; verify exit 0.
- **Feel check**:
  - Image still exits from behind source letter L→R.
  - Spam hover: interruptible, no restart pop from keyframes (Motion transitions OK).
  - Layers panel / Performance: fewer main-thread style recalcs vs before on hover.
  - Reduced-motion: fade only.
- **Done when**: no `x:` / `scale:` Motion shorthands in peek window code; no permanent will-change on windows.
