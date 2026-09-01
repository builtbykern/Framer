# 006 — Cap PropertyCard image hover (duration, pointer gate, GPU transform)

- **Status**: DONE
- **Commit**: unavailable
- **Severity**: HIGH
- **Category**: Easing & duration + Accessibility + Performance
- **Estimated scope**: 1 code file (`Arbour_PropertyCard.tsx`)

## Problem

Listing cards on `/properties-2` use a 700ms image hover zoom — far above the UI budget (<300ms). Users skim this grid repeatedly. Hover is also ungated for coarse pointers, and Framer Motion’s `scale` shorthand is main-thread.

Current (`Arbour_PropertyCard.tsx` in Framer `codeFile/I2raC3I` — local mirror `.tmp/Arbour_PropertyCard.tsx`):

```tsx
<motion.img
    src={imgSrc}
    alt={imgAlt}
    style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
    }}
    initial={shouldAnimate ? { scale: 1.04 } : false}
    whileHover={shouldAnimate ? { scale: 1.08 } : undefined}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
/>
```

`shouldAnimate = !isCanvas && !prefersReduced` — good reduced-motion hook, but no fine-pointer gate.

## Target

```tsx
const canHoverMotion =
    shouldAnimate &&
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches

// Prefer CSS/transform string over Motion scale shorthand:
<motion.img
    src={imgSrc}
    alt={imgAlt}
    style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        willChange: "transform",
    }}
    initial={canHoverMotion ? { transform: "scale(1.02)" } : false}
    whileHover={canHoverMotion ? { transform: "scale(1.04)" } : undefined}
    transition={{
        duration: 0.22,
        ease: [0.23, 1, 0.32, 1],
    }}
/>
```

Exact values:

| Prop | Value |
| --- | --- |
| Rest / initial scale | `1.02` (not `1.04`) |
| Hover scale | `1.04` (not `1.08`) |
| Duration | **0.22s** (220ms) |
| Ease | `cubic-bezier(0.23, 1, 0.32, 1)` → `[0.23, 1, 0.32, 1]` |
| Pointer gate | `(hover: hover) and (pointer: fine)` |
| Reduced motion | keep existing `useReducedMotion()` → no transform motion |

If `matchMedia` in render is awkward under SSR, compute `canHoverMotion` once in `useEffect` + state, defaulting to `false` until known (safe: no hover zoom until confirmed fine pointer).

## Repo conventions to follow

- Code components live as Framer `CodeFile` named `Arbour_*.tsx`; update via `codeFile.setFileContent` then `typecheck({ strict: true })`
- Motion import: `import { motion, useReducedMotion } from "framer-motion"`
- Hover budget precedent: `plans/002-photo-card-hover-duration.md` (≤200ms, scale ≤1.03 on canvas frames). PropertyCard may use **1.04 / 220ms** — still under 300ms, slightly stronger than neighbourhood photo because the code card’s image is taller
- Ease family already on site: `[0.22, 1, 0.36, 1]` and `[0.23, 1, 0.32, 1]` — prefer **0.23, 1, 0.32, 1** (AUDIT `--ease-out`)
- Exemplar (shorter hover): `Arbour_ArticleCard.tsx` editorial image hover uses `scale: 1.03`, `duration: 0.5` — **do not copy 0.5**; this plan deliberately goes shorter

## Steps

1. Open Framer code file `Arbour_PropertyCard.tsx` (`framer.getCodeFile("Arbour_PropertyCard.tsx")`).
2. Add fine-pointer detection (effect + state `finePointer`, default `false`).
3. Replace `motion.img` hover block with the Target snippet (`transform` string, 0.22s, scales 1.02→1.04, gated by `shouldAnimate && finePointer`).
4. `await file.setFileContent(updated)` then `await file.typecheck({ strict: true })` — expect `[]`.
5. Do not republish unless the user asks; leave publish to them.

## Boundaries

- Do NOT change typography (see `design-plans/2026-07-16-properties2-propertycard-typography.md`).
- Do NOT add `whileTap` here (plan 007).
- Do NOT add grid stagger (plan 008).
- Do NOT touch `Arbour_ArticleCard`, canvas `hoverEffect` on neighbourhoods, or legacy Frame cards.
- Do NOT add dependencies.

## Verification

- **Mechanical**: typecheck clean; serialize/publish preview optional.
- **Feel check**:
  - Desktop mouse: hover card image — zoom settles in ~220ms; scale feels subtle (not 1.08).
  - Spam hover in/out: no sluggish 700ms catch-up.
  - DevTools Animations at 10%: confirm ~220ms transform.
  - DevTools device toolbar / touch: tap should **not** leave a stuck zoom.
  - `prefers-reduced-motion: reduce`: no scale motion.
- **Done when**: duration ≤250ms, hover scale ≤1.04, fine-pointer gated, reduced-motion respected.

## Suggested motion values (AUDIT)

- UI hover ≤300ms; prefer ~150–220ms
- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`
- Animate `transform` / `opacity` only
- Gate decorative hover with `(hover: hover) and (pointer: fine)`
