# 008 — Fade-in uses ease-out and 0.24s budget

- **Status**: DONE
- **Commit**: unavailable
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file, ~10 lines

## Problem

Layer opacity entrance uses `EASE_EXPO` (`[0.16, 1, 0.3, 1]`) with `FADE_IN_DURATION = 0.4` capped by `scaleDuration * 0.35` (`ZoomImageIntro.tsx:83`, `518`, `543–548`). Expo-out on opacity starts slow — the new frame ghosts in before the zoom reads. AUDIT: entering → **ease-out**; opacity feedback should not steal the zoom beat.

## Target

```ts
const FADE_IN_DURATION = 0.24

// opacity transition
{
  type: "tween",
  delay: 0,
  duration: Math.min(FADE_IN_DURATION, scaleDuration * 0.25),
  ease: EASE_OUT, // [0.23, 1, 0.32, 1]
}
```

- Keep `opacity: 1` final (no fade-out keyframes).
- Zoom `transform` transition continues to use `getTweenEase(transition)` / `EASE_EXPO` by default.

## Repo conventions to follow

- Split easings by job: expo for camera zoom, `EASE_OUT` for UI-like opacity (already used on reduced-motion + exit).

## Steps

1. Set `FADE_IN_DURATION = 0.24`.
2. Change opacity `ease` from `EASE_EXPO` to `EASE_OUT`.
3. Cap with `scaleDuration * 0.25` (was `0.35`).
4. Push + typecheck.

## Boundaries

- Do NOT change transform easing or duration.
- Do NOT add blur filters.
- Do NOT touch static renderer.

## Verification

- **Mechanical**: typecheck; opacity transition ease is `EASE_OUT`.
- **Feel check**: New frame appears promptly; zoom remains the hero motion. At 10% speed, opacity reaches ~1 well before scale completes.
- **Done when**: No soft “dissolve in” reading as a crossfade between stacked frames.
