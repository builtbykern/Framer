# 034 — Entrance scale floor and duration budget

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH (scale) / MEDIUM (duration) — treat as one plan
- **Category**: Physicality & origin / Easing & duration
- **Estimated scope**: 1 file, ~25 lines + property control defaults
- **Depends**: —
- **Project**: Framer `PBghPP85VH1cuE7BNtzx`, `Kern_InertiaGrid`

## Problem

Entrance presets use scales that feel like “from nothing,” and the default duration exceeds the UI budget for a control the designer can leave at defaults.

```ts
/* state/InertiaGrid.tsx.snapshot:206-228 — current */
const DEFAULT_ENTRANCE: EntranceConfig = {
    preset: "fade-up",
    duration: 0.6,
    staggerDelay: 0.05,
}

const ENTRANCE_PRESETS = {
    "fade-up": {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
    },
    "scale-in": {
        initial: { opacity: 0, scale: 0.6 },
        animate: { opacity: 1, scale: 1 },
    },
    "stagger-wave": {
        initial: { opacity: 0, y: 30, x: -20 },
        animate: { opacity: 1, y: 0, x: 0 },
    },
    "stagger-spiral": {
        initial: { opacity: 0, scale: 0.4, rotate: -45 },
        animate: { opacity: 1, scale: 1, rotate: 0 },
    },
}
```

```tsx
/* state/InertiaGrid.tsx.snapshot:738-745 — current */
transition={{
    type: "spring",
    stiffness: 80,
    damping: 22,
    mass: 1.2,
    delay: staggerDelay,
    duration: entrance.duration,
}}
```

Property control default for duration is also `0.6` (`snapshot:859-868`).

## Target

Exact preset values:

```ts
const DEFAULT_ENTRANCE: EntranceConfig = {
    preset: "fade-up",
    duration: 0.35,
    staggerDelay: 0.04,
}

const ENTRANCE_PRESETS = {
    "fade-up": {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
    },
    "scale-in": {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
    },
    "stagger-wave": {
        initial: { opacity: 0, y: 20, x: -12 },
        animate: { opacity: 1, y: 0, x: 0 },
    },
    "stagger-spiral": {
        initial: { opacity: 0, scale: 0.92, rotate: -8 },
        animate: { opacity: 1, scale: 1, rotate: 0 },
    },
}
```

Spring entrance transition:

```ts
transition={{
    type: "spring",
    stiffness: 80,
    damping: 22,
    mass: 1.2,
    delay: Math.min(staggerDelay, 0.4), // see step: cap total stagger
    duration: entrance.duration, // default 0.35; control max still 2 for designers who want longer
}}
```

Stagger cap (implement in delay calc):

```ts
const rawDelay =
    entrance.preset === "stagger-spiral"
        ? index * entrance.staggerDelay * 1.5
        : index * entrance.staggerDelay
const staggerDelay = Math.min(rawDelay, 0.4)
```

Property controls:

- `duration.defaultValue`: `0.35` (keep `min: 0.2`, `max: 2`)
- `staggerDelay.defaultValue`: `0.04` (keep existing min/max)

Never use initial `scale` below `0.92` in shipped presets.

## Repo conventions to follow

- AUDIT.md: never `scale(0)`; target `0.9–0.97`; UI under 300ms preferred — marketing entrance may use spring `duration: 0.35`.
- Keep preset **names** (`fade-up`, `scale-in`, `stagger-wave`, `stagger-spiral`) — essence for designers.

## Steps

1. Update `DEFAULT_ENTRANCE` and `ENTRANCE_PRESETS` to target values above.
2. Cap stagger delay at `0.4`s as shown.
3. Sync `addPropertyControls` entrance `duration` / `staggerDelay` defaults.
4. Soften fade-up / wave offsets as specified (still directional; not a new preset).
5. Push + verify.

## Boundaries

- Do NOT remove entrance feature or rename presets.
- Do NOT change hover physics / presets Drift-Repel-Glitch.
- Do NOT implement reduced-motion path here (035).
- Do NOT lower control `max` duration (designers may still choose longer).

## Verification

- **Mechanical**: defaults in controls match constants; verify.mjs OK.
- **Feel check**: Scale In and Spiral no longer pop from tiny; 8-tile grid finishes entrance by ~0.35 + 0.4s max delay; Fade Up still reads as rise, not teleport.
- **Done when**: no preset initial scale below 0.92; default duration 0.35; stagger delay capped at 0.4s.
