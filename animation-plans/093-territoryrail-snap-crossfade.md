# 093 — TerritoryRail snap title + hero crossfade

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Purpose & frequency / Easing & duration
- **Estimated scope**: 1 file (TerritoryRail), title + hero transitions
- **Audit**: `template-plans/REPORT-territoryrail-audit-2026-08-11.md` A1

## Problem

Territory changes (autoplay ~10s and strip hover/focus) animate title masks at **0.55–0.62s** and hero with a soft scale spring. That is over the UI budget (≤300ms) for a control hit tens of times per session.

```tsx
/* .tmp/Arbour_TerritoryRail_live.tsx:924–927 — SlideTitleBlock title */
transition={{
    duration: 0.62,
    ease: [0.22, 1, 0.36, 1],
}}
```

```tsx
/* .tmp/Arbour_TerritoryRail_live.tsx:1013–1016 — SlideTitleInline title */
transition={{
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1],
}}
```

```tsx
/* .tmp/Arbour_TerritoryRail_live.tsx:1151–1156 — hero */
initial={shouldAnimate ? { opacity: 0, scale: 1.02 } : undefined}
animate={{ opacity: 1, scale: 1.03, x: 0, y: 0 }}
exit={shouldAnimate ? { opacity: 0, scale: 1.01 } : undefined}
transition={{ type: "spring", stiffness, damping }}
```

Coords/meta fades also use `duration: 0.4` (~1280, ~1382, ~1451).

## Target

From AUDIT.md: UI ≤300ms; enter/exit ease-out `cubic-bezier(0.23, 1, 0.32, 1)`; springs prefer `{ type: "spring", duration: 0.5, bounce: 0.15 }` when spring remains.

```tsx
const EASE_OUT = [0.23, 1, 0.32, 1] as const
const TITLE_TRANSITION = { duration: 0.26, ease: EASE_OUT }
const META_TRANSITION = { duration: 0.2, ease: EASE_OUT }
const HERO_TRANSITION = { type: "spring", duration: 0.45, bounce: 0.12 }
```

Title mask (both blocks): `transition={TITLE_TRANSITION}` — duration **0.26**, ease **`[0.23, 1, 0.32, 1]`**.  
Meta/coords opacity: **0.2** same ease (replace 0.4).  
Hero: opacity crossfade + optional scale **1 → 1.02** max (not 1.03); `transition={HERO_TRANSITION}` — **no** stiffness/damping props (094 removes those controls).

`shouldAnimate` already gates `prefersReduced` — keep instant swap when false.

## Repo conventions to follow

- Single-file Framer component; bake motion consts near `MOTION_DEFAULTS`
- Static: `useIsStaticRenderer` — do not diverge tree
- Exemplar pattern: bake transitions as named consts, not panel springs

## Steps

1. Add `EASE_OUT`, `TITLE_TRANSITION`, `META_TRANSITION`, `HERO_TRANSITION` near motion defaults in the TerritoryRail source (dump → push `il4DSn9`).
2. Replace title transitions in `SlideTitleBlock` and `SlideTitleInline` with `TITLE_TRANSITION`.
3. Replace meta/coords `duration: 0.4` with `META_TRANSITION`.
4. Hero `motion.img`: `initial/animate/exit` opacity (+ scale 1.02 animate only); `transition={HERO_TRANSITION}`; stop passing `stiffness`/`damping` into `SlideStage` once 094 lands (can hardcode HERO_TRANSITION in this plan even if props still exist briefly).
5. Do not touch strip spring yet (095) except leave durations alone.

## Boundaries

- Do NOT change layout, strip sizes, or property control set (design plans own those).
- Do NOT add dependencies.
- Do NOT invent a divergent static mock.
- If line numbers drifted, match by symbol names (`SlideTitleBlock`, hero `AnimatePresence`).

## Verification

- **Mechanical**: push code file; `node scripts/framer/verify.mjs` clean.
- **Feel check**: Preview Home — hover strip rapidly; title should feel snappy, not a slow curtain. DevTools Animations @10%: title move completes ~260ms. `prefers-reduced-motion`: no mask slide / hero scale.
- **Done when**: no title/meta transition duration > 0.3 in Slide title/coords paths; hero not using stiffness/damping from props.

## Missed opportunity (include if cheap)

Strip button `:active` / whileTap `scale: 0.97` with ~160ms ease-out — only if a one-liner on the tab `motion.div`; otherwise skip.
