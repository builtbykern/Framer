# 005 — Pace curves change gaps only (not zoom duration)

- **Status**: DONE
- **Commit**: unavailable
- **Severity**: HIGH
- **Category**: Purpose & frequency / Cohesion
- **Estimated scope**: 1 file (`code-components/ZoomImageIntro.tsx`), ~40 lines

## Problem

`paceMultiplier` is applied to **both** inter-beat gaps (`buildStartDelays`) and each layer’s `scaleDuration`. With default `paceCurve: "accelerate"`, later frames zoom in a shorter time — the camera rushes at the end. User report: “se aceleran mucho al final.”

Current (`code-components/ZoomImageIntro.tsx`):

```ts
// buildStartDelays — gaps
acc += baseGap * paceMultiplier(gapT, curve)

// layer render — durations also paced
const scaleDuration = baseScaleDuration * pace
```

Accelerate range (current mild curve) still shortens late zooms to ~90% of base; the earlier aggressive curve went to ~62%. Product intent for Accelerate is “sequence speeds up” (spacing), not “each zoom is a faster camera move.”

## Target

- Rename conceptually: gaps use `paceGapMultiplier` (same switch values as today’s mild curve).
- Each layer’s zoom duration is always `baseScaleDuration` (from Transition control / `SCALE_DURATION` default `1.35`).
- `sequenceMs` last-frame duration uses `baseScaleDuration + SETTLE_DURATION` (no pace on duration).
- Keep mild accelerate gap curve exactly:
  - accelerate: `1.16 - t * 0.26` → ~1.16 → 0.9
  - decelerate: `0.9 + t * 0.26`
  - pulse: `1.1 - mid * 0.2`
  - even: `1`

```ts
const scaleDuration = baseScaleDuration // never * pace
```

## Repo conventions to follow

- Local constants at top of `ZoomImageIntro.tsx` (`EASE_EXPO`, `SCALE_DURATION`).
- Exhaustive `switch` with `never` default (already present).
- Exemplar comment style: JSDoc above `paceMultiplier` explaining gap-only.

## Steps

1. In `code-components/ZoomImageIntro.tsx`, rename `paceMultiplier` → `paceGapMultiplier` and update its JSDoc to: “Gap-only velocity multiplier. Zoom duration stays constant.”
2. In `buildStartDelays`, call `paceGapMultiplier` (already gap-only path).
3. In the layer map, delete `const pace = paceMultiplier(...)` usage on duration. Set `const scaleDuration = baseScaleDuration`.
4. In `sequenceMs`, replace  
   `baseScaleDuration * paceMultiplier(sequenceProgress(lastIndex, images.length), paceCurve) + SETTLE_DURATION`  
   with  
   `baseScaleDuration + SETTLE_DURATION`.
5. Remove unused `pace` / duration multiplier locals. Keep `sequenceProgress` for gap builder only.
6. Push via harness: `node scripts/framer/session.mjs --id 4bWciQssfFE0Sc5PdvrG` then `setFileContent` on `aNCXc66` + `typecheck({ strict: true })`.

## Boundaries

- Do NOT change fade-in, exit, settle scale, or unmount policy (those are plans 006–008).
- Do NOT change default `delayBetweenImages` / Transition duration in this plan.
- Do NOT add dependencies.
- Do NOT re-introduce per-frame opacity fade-out.

## Verification

- **Mechanical**: Framer `typecheck({ strict: true })` → 0 errors; local file has no `scaleDuration = baseScaleDuration *`.
- **Feel check** (Preview `/preview` or Home, Pace = Accelerate, 6 images, Delay 0.5, Duration 1.35):
  - Late frames still feel slightly closer together in time, but each zoom arc lasts ~the same length as the first.
  - At 10% animation speed: scale tween length is visually equal across beats; only start times pack tighter.
  - Switch Pace → Even: equal gaps; durations unchanged.
- **Done when**: Accelerate no longer makes the last 2–3 zooms feel snappier/shorter than the first.
