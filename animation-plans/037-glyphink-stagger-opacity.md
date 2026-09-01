# 037 — Cascade stagger cap + ink opacity couple

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Cohesion / Purpose
- **Estimated scope**: 1 file (`MOTION` + `GlyphInkLetter`)
- **Source audit**: `animation-plans/REPORT-glyphink-fill-sotd-2026-07-28.md` findings #4 + #5

## Problem

1. Stagger cap ≈ 80% of enter duration → distant glyphs start as near ones finish;
   cascade feels like unfinished letters, not one weather system.
2. Ink chrominance is fully visible at tiny mask size → cyan speck flash before
   the front has body (Filling Point fixed via enter opacity couple `027`).

```ts
/* MOTION.cinematic — current (pre-037; after 034 durations become 0.48 / 0.62) */
staggerMs: 28,
staggerCapMs: 320,
```

```tsx
/* GlyphInkLetter ink layer — no opacity couple today */
<motion.span style={{ … maskImage, WebkitMaskImage: maskImage, color: colorTo }} />
```

## Target

### Stagger (assume 034 applied: enter 480ms)

```ts
cinematic: {
    enter: { duration: 0.48, ease: EASE_INK },
    leave: { duration: 0.62, ease: EASE_OUT },
    staggerMs: 22,
    staggerCapMs: 200, // ≈42% of enter — cascade finishes inside the fill window
},
```

Leave delays keep using `staggerDelay(…)` with `×1.25` on ms/cap (existing helper — do not rewrite formula).

If 034 was **not** applied yet, still set `staggerCapMs: 200` and `staggerMs: 22`, then apply 034 immediately after.

### Opacity couple

In `GlyphInkLetter`, after `maskImage` transform:

```ts
const inkOpacity = useTransform(progress, (p) => {
    if (idleFull || (staticLocked && staticFilled)) return 1
    if (staticLocked) return staticFilled ? 1 : 0
    // Enter: fade in over first 18% of progress. Leave: stay readable until mask retreats.
    if (p <= 0) return 0
    if (p >= 1) return 1
    return Math.min(1, 0.12 + p / 0.18)
})
```

Apply to ink `motion.span`:

```tsx
style={{
    …,
    maskImage,
    WebkitMaskImage: maskImage,
    opacity: inkOpacity,
    …
}}
```

Do **not** animate ghost layer opacity (ghost stays the steady underlayer).

## Repo conventions to follow

- Interrupt path already zeroes delay when `0.02 < progress < 0.98` — keep that.
- Soft max ~48 glyphs copy unchanged.
- Exemplars: Filling Point `015`/`026` (cap ≪ enter), `027` (opacity couple).

## Steps

1. Set cinematic `staggerMs: 22`, `staggerCapMs: 200` (and confirm enter duration is `0.48` from 034).
2. Add `inkOpacity` `useTransform` as above; wire to ink layer `opacity`.
3. Confirm `idleFull` / `staticLocked` paths still show full solid ink (opacity 1 when filled).
4. Sync docs: stagger cinematic `22ms` / cap `200ms`; note opacity couple on ink layer.

## Boundaries

- Do NOT fade the ghost layer.
- Do NOT use `startTransition` on pointer enter/leave.
- Do NOT add Auto Demo.
- Do NOT change tip/cross-axis (035/036).
- Do NOT publish.

## Verification

- **Mechanical**: push + verify.
- **Feel check**:
  - 12-letter headline: last glyph’s delay ≤ ~200ms; whole cascade sits inside the fill.
  - At 0.25×: no hard cyan speck at frame 0 — opacity and mask rise together in the first fifth.
  - Reduced-motion / focus / coarse: full ink, opacity 1, no cascade.
  - Spam hover interrupt: no stagger hitch (existing interrupt path).
- **Done when**: cascade reads as one system; tip contact has no chrominance pop.
