# 036 — Glitch flicker via spring targets

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Interruptibility / Performance
- **Estimated scope**: 1 file, ~20–40 lines
- **Depends**: 032 (physics lives in one loop)
- **Project**: Framer `PBghPP85VH1cuE7BNtzx`, `Kern_InertiaGrid`

## Problem

Inside the per-frame update, Glitch spawns a new `animate()` tween on `rotate` every frame. That fights the `useSpring(rotate)` pipeline, is non-interruptible in a clean way, and wastes work.

```tsx
/* state/InertiaGrid.tsx.snapshot:626-631 — current */
if (preset === "glitch") {
    const randomFlicker = (Math.random() - 0.5) * 30
    animate(rotate, targetRotate + randomFlicker, {
        duration: 0.08,
        ease: "linear",
    })
}
```

`animate` is imported from `framer-motion` (line 13) primarily for this path.

## Target

- Remove the per-frame `animate(rotate, …)` call entirely.
- For `preset === "glitch"` only, set the **target** MotionValue that feeds the spring:

```ts
const flicker = (Math.random() - 0.5) * 12 // degrees, capped softer than 30
rotate.set(targetRotate + flicker)
```

- Keep Glitch `PRESET_BASE.glitch`: `maxDisp: 0.35`, `springStiffness: 140`, `rotationRange: 15`, `mass: 1.4` — do not retune unless required for stability.
- Non-glitch presets: `rotate.set(targetRotate)` only (no noise).
- If `animate` becomes unused, remove it from the import list.

Flicker amplitude **12°** (not 30°) so the spring can absorb noise without looking like a broken tween stack; personality stays “chaotic” vs Repel via higher rotationRange + noise.

## Repo conventions to follow

- Springs already wrap `rotate` via `useSpring` — targets should be `.set` on the source MotionValue, never a parallel `animate()` on the same value.
- After 032, this logic belongs in the shared physics tick.

## Steps

1. Locate glitch branch in the unified physics loop (post-032).
2. Replace `animate(…)` with `rotate.set(targetRotate + flicker)` using amplitude `12`.
3. Remove unused `animate` import if applicable.
4. Confirm Drift/Repel never add flicker.
5. Push + verify.

## Boundaries

- Do NOT delete the Glitch preset or rename it.
- Do NOT change Drift/Repel math.
- Do NOT reintroduce keyframed glitch.
- Do NOT implement velocity (037) here.

## Verification

- **Mechanical**: no `animate(` calls in physics path; verify.mjs OK.
- **Feel check**: Glitch still reads noisier than Repel under cursor; spamming mouse does not stack competing tweens (springs only). Drift remains calm (rotationRange 0).
- **Done when**: glitch flicker is spring-target noise only; `animate` unused or removed.
