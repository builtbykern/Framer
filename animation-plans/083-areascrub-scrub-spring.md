# 083 — Area Scrub: Apple-style scrub spring

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Physicality & cohesion
- **Estimated scope**: 1 file (`code-components/AreaScrub.tsx`), ~5 lines

## Problem

Scrub X uses a stiffness/damping/mass spring. Gesture feel is the product; AUDIT recommends Apple-style duration/bounce springs for interruptible UI motion.

```ts
/* code-components/AreaScrub.tsx:64 — current */
const SCRUB_SPRING = { stiffness: 320, damping: 32, mass: 0.7 }
```

```ts
/* code-components/AreaScrub.tsx:328 — current */
const xSpring = useSpring(xTarget, SCRUB_SPRING)
```

## Target

```ts
/* target — AUDIT Apple-style (subtle bounce) */
const SCRUB_SPRING = { type: "spring" as const, duration: 0.45, bounce: 0.18 }
```

- Keep `xScrub = reducedMotion ? xTarget : xSpring`
- Keep enter `jumpMotion` attach under cursor (instant), then spring on subsequent moves
- Do not change draw-on duration (marketing ~1s is by-design)

## Repo conventions to follow

- Motion from `"framer-motion"` only
- Strong ease-out elsewhere: `cubic-bezier(0.23, 1, 0.32, 1)` (`CHROME_EASE`)
- Push: `node scripts/framer/push-areascrub.mjs` (session pinned to Area Scrub `iByGdsW6Rb9oE5M2Igua`)
- Exemplar pattern: jump then spring already in `onPointerEnter` / `setNormFromClientX`

## Steps

1. In `code-components/AreaScrub.tsx`, replace `SCRUB_SPRING` with `{ type: "spring", duration: 0.45, bounce: 0.18 }`.
2. Confirm `useSpring(xTarget, SCRUB_SPRING)` still typechecks (Framer Motion spring options).
3. Push with project guard; `typeErrors: []`.
4. Feel-check on Preview Home (see Verification).

## Boundaries

- Do NOT change draw-on / fill transitions
- Do NOT add snap/magnetic (spec out of v1)
- Do NOT edit Home DSL in this plan
- If `useSpring` rejects `type: "spring"` in this Motion version, STOP and report — do not invent a stiffness remapping without a new plan

## Verification

- **Mechanical**:
  ```bash
  node scripts/framer/session.mjs --url "https://framer.com/projects/Tasty-Usage--iByGdsW6Rb9oE5M2Igua-407t8" --name "Area Scrub"
  node scripts/framer/push-areascrub.mjs
  node scripts/framer/verify.mjs
  ```
  → push `typeErrors: []`; verify green
- **Feel check**:
  - Enter chart: beacon appears under cursor (no slide from far left)
  - Sweep slowly: beacon follows with soft tracking, light bounce ≤0.18
  - Sweep quickly / reverse: spring retargets without restarting from zero
  - `prefers-reduced-motion`: scrub snaps to X (no spring)
- **Done when**: Scrub feels responsive and interruptible; reduced-motion still direct
