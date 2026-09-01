# 094 — TerritoryRail bake hero spring (drop stiffness/damping props)

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file — MotionGroup + SlideStage props
- **Audit**: A2 · pairs with `design-plans/2026-08-11-territoryrail-trim-controls.md`

## Problem

Motion Object exposes `springStiffness` / `springDamping`. Control defaults (**60** / **20**) disagree with `MOTION_DEFAULTS` (**90** / **22**). Remixers get inconsistent feel; craft belongs in code.

```ts
/* MOTION_DEFAULTS */
springStiffness: 90,
springDamping: 22,

/* addPropertyControls motion — defaultValue drift */
springStiffness: { defaultValue: 60, ... },
springDamping: { defaultValue: 20, ... },
```

## Target

```ts
const MOTION_DEFAULTS = {
    slideInterval: 10,
    pauseOnHover: true,
}

const HERO_TRANSITION = {
    type: "spring" as const,
    duration: 0.45,
    bounce: 0.12,
}
```

- Remove `springStiffness` / `springDamping` from `MotionGroup` type, defaults, destructuring, `SlideStageProps`, and property controls.
- Hero uses `HERO_TRANSITION` only (same as 093 target).
- Keep `slideInterval` default **10** and `pauseOnHover` **true**; align control `defaultValue` for interval to **10** (panel currently shows **6**).

## Repo conventions to follow

- Bake physics; expose only interval/pause — matches trim-controls design plan
- Apple-style spring from AUDIT.md: `{ type: "spring", duration: 0.5, bounce: 0.2 }` — use **0.45 / 0.12** for quieter editorial (within 0.1–0.3 bounce band)

## Steps

1. Implement `HERO_TRANSITION` const; wire hero `transition={HERO_TRANSITION}`.
2. Delete stiffness/damping from types, defaults, controls, and call sites.
3. Align `slideInterval` control `defaultValue: 10`.
4. Coordinate with design trim plan so Atmosphere/Layout removals do not fight this diff — same push OK.

## Boundaries

- Do NOT retune strip thumb springs here (095 / strip craft).
- Do NOT change autoplay interval behavior beyond default alignment.

## Verification

- **Mechanical**: Typecheck in Framer editor; verify.mjs
- **Feel check**: Hero crossfade interruptible mid-hover; no panel Stiffness/Damping
- **Done when**: grep of pushed file has zero `springStiffness` / `springDamping`
