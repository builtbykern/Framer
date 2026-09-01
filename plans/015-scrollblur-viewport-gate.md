# 015 — Gate Scroll Blur work when off-screen

- **Status**: DONE
- **Commit**: unavailable (no HEAD); stamp date 2026-07-19
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file, ~40 lines

## Problem

Follow Scroll attaches scroll listeners to every overflow root and always mounts 4 full-frame `backdrop-filter` layers. When the component is off-screen those listeners and filters stay hot — wasted main-thread and Safari GPU cost.

```tsx
/* .tmp/BuiltByKern_ScrollBlur.tsx:188-237 — current */
useEffect(() => {
    if (!followScroll) return
    if (typeof window === "undefined") return
    // … always attaches handlers while followScroll is true
}, [followScroll, safeSettle])

/* .tmp/BuiltByKern_ScrollBlur.tsx:239-265 — current */
const layers = useMemo(() => {
    const nodes: JSX.Element[] = []
    // … always builds LAYERS (4) backdrop-filter nodes
}, [activePosition, activeShape, effectiveStrength])
```

Mirror path after push: Framer code file `yC_uQFE` (BuiltByKern_ScrollBlur). Local source of truth: `.tmp/BuiltByKern_ScrollBlur.tsx`.

## Target

1. Import `useInView` from `"framer-motion"` (allowed import).
2. `const inView = useInView(containerRef, { amount: 0, once: false })` — amount 0 = any pixel visible.
3. Follow Scroll effect: early-return unless `followScroll && inView`. Cleanup still clears idle + rAF.
4. When `followScroll && !inView`, force `visible` false via `startTransition` (do not use opacity).
5. Layer render: if `!inView && !isCanvas && !isStatic`, render **no** blur layers (empty). Canvas/static always keep layers so the editor thumbnail stays useful.
6. Never animate opacity / isolation / clip-path on backdrop-filter layers (settled).

```tsx
/* target pattern */
import { useReducedMotion, useInView } from "framer-motion"

const inView = useInView(containerRef, { amount: 0, once: false })

useEffect(() => {
    if (!followScroll || !inView) return
    // … existing scroll wiring
}, [followScroll, inView, safeSettle])

useEffect(() => {
    if (!followScroll) return
    if (!inView) startTransition(() => setVisible(false))
}, [followScroll, inView])

const layers = useMemo(() => {
    if (!inView && !isCanvas && !isStatic) return []
    // … existing layer loop
}, [activePosition, activeShape, effectiveStrength, inView, isCanvas, isStatic])
```

## Repo conventions to follow

- Allowed imports only: `react`, `react-dom`, `framer`, `framer-motion`.
- Push via `node scripts/framer/exec.mjs` + `file.setFileContent` / typecheck; then `node scripts/framer/verify.mjs`.
- Settled Safari rule (file header): never opacity on backdrop-filter parents.

## Steps

1. Edit `.tmp/BuiltByKern_ScrollBlur.tsx`: add `useInView` import and hook on `containerRef`.
2. Gate the Follow Scroll `useEffect` with `inView`; add deps `[followScroll, inView, safeSettle]`.
3. Add a small effect: when `followScroll && !inView`, `setVisible(false)` inside `startTransition`.
4. Gate `layers` useMemo: skip building nodes when off-screen outside canvas/static.
5. Push to Framer `yC_uQFE`, run typecheck + `node scripts/framer/verify.mjs`.

## Boundaries

- Do NOT reintroduce opacity fades, scrim, or Coverage.
- Do NOT change Strength range (2–10) or Shape masks.
- Do NOT add dependencies beyond `framer-motion` (already imported).
- If live Framer content drifts from `.tmp/BuiltByKern_ScrollBlur.tsx`, sync from Framer first, then apply.

## Verification

- **Mechanical**: Framer `file.typecheck()` empty; `node scripts/framer/verify.mjs` ok.
- **Feel check**:
  - Always On: blur still visible on canvas and preview when the instance is on-screen.
  - Follow Scroll (Preview): scroll → blur shows; stop → hides after Settle; scroll the instance fully off-screen → blur stays hidden and DevTools Performance shows no continuous scroll handler work from this component until it re-enters.
  - Toggle `prefers-reduced-motion`: Follow Scroll still disabled; static weaker blur remains (existing behavior).
- **Done when**: Off-screen Follow Scroll attaches zero scroll listeners; off-screen preview has zero backdrop-filter layer nodes (canvas still shows layers).
