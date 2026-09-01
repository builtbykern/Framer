# 034 — Cinematic ink enter curve + duration

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: HIGH
- **Category**: Easing & duration
- **Estimated scope**: 1 file + `docs/projects/glyph-ink.md` motion line
- **Source audit**: `animation-plans/REPORT-glyphink-fill-sotd-2026-07-28.md` finding #1

## Problem

Cinematic enter front-loads progress with a strong ease-out. The ink front races
the far edge of each glyph; mid-travel never reads as wet paint (SOTD fail).

```ts
/* code-components/Kern_GlyphInk.tsx:93–123 — current */
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]
const EASE_INK: [number, number, number, number] = [0.22, 1, 0.36, 1]

const MOTION = {
    cinematic: {
        enter: { duration: 0.4, ease: EASE_INK },
        leave: { duration: 0.56, ease: EASE_OUT },
        staggerMs: 28,
        staggerCapMs: 320,
    },
    // …
}
```

Sibling house curve (do not invent a third bezier):

```ts
/* code-components/Kern_FillingPoint.tsx — house ink enter */
const EASE_INK: [number, number, number, number] = [0.65, 0, 0.35, 1]
```

## Target

```ts
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]
/** Mid-body ink — readable fill travel (Kern house / Filling Point) */
const EASE_INK: [number, number, number, number] = [0.65, 0, 0.35, 1]

const MOTION = {
    cinematic: {
        enter: { duration: 0.48, ease: EASE_INK },
        leave: { duration: 0.62, ease: EASE_OUT },
        // stagger numbers updated in plan 037 — if executing 034 alone, keep
        // existing staggerMs/Cap temporarily; prefer execute 034→037 together
        staggerMs: 28,
        staggerCapMs: 320,
    },
    balanced: {
        enter: { duration: 0.28, ease: EASE_OUT },
        leave: { duration: 0.4, ease: EASE_OUT },
        staggerMs: 24,
        staggerCapMs: 280,
    },
    snappy: {
        enter: { duration: 0.18, ease: EASE_OUT },
        leave: { duration: 0.26, ease: EASE_OUT },
        staggerMs: 16,
        staggerCapMs: 180,
    },
}
```

Leave stays **ease-out** so retract starts immediately (asymmetric vs enter).

## Repo conventions to follow

- Preset table `MOTION.cinematic` is the single source for default enter/leave.
- Custom preset still falls back to `DEFAULT_ENTER` / `DEFAULT_LEAVE` derived from cinematic.
- Exemplar: `animation-plans/025-fillingpoint-ink-enter-curve.md` (same curve family; Glyph Ink stays shorter because hover cascade is denser).

## Steps

1. In `code-components/Kern_GlyphInk.tsx`, replace `EASE_INK` with `[0.65, 0, 0.35, 1]`.
2. Set cinematic `enter.duration` to `0.48`, `leave.duration` to `0.62`.
3. Update the comment above `EASE_INK` to say mid-body ink (not “ease-out”).
4. Sync one line in `docs/projects/glyph-ink.md` Motion polish: cinematic enter `[0.65,0,0.35,1]` ~480ms; leave ease-out ~620ms.

## Boundaries

- Do NOT change balanced/snappy durations or easings.
- Do NOT reintroduce `INK_GROWTH_POWER` or settle remapping (`t / 0.9`).
- Do NOT add springs/bounce to cinematic.
- Do NOT publish.
- Do NOT touch tip % / cross-axis / stagger (plans 035–037).

## Verification

- **Mechanical**: `node scripts/framer/push-glyphink.mjs` → `typeErrors: []`; `node scripts/framer/verify.mjs` → ready.
- **Feel check**: Preview hover on Home headline at 0.25× playback:
  - First third of each glyph fill is visible mid-body (not empty then flood).
  - Leave still bites immediately on pointer out.
  - Balanced/snappy still feel like UI, not cinematic.
- **Done when**: cinematic fill reads as ink travel, not a snappy UI wipe.
