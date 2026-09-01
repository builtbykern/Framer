# 036 — Cross-axis grow with primary (droplet wipe)

- **Status**: DONE
- **Commit**: 4aa0cbc
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 1 file (`inkMask` only)
- **Source audit**: `animation-plans/REPORT-glyphink-fill-sotd-2026-07-28.md` finding #3

## Problem

Directional wipe sets the cross-axis to full cover from the first frame. Enter
starts as a full-height soft bar, then advances — droplet→flood is lost; feels
mechanical vs SOTD ink contact.

```ts
/* code-components/Kern_GlyphInk.tsx:340–348 — current */
case "left":
case "right":
    rx = Math.max(seed.rx * INK_COVER * t, 0.01)
    ry = Math.max(seed.ry * INK_COVER, 0.01)
    break
case "top":
case "bottom":
    rx = Math.max(seed.rx * INK_COVER, 0.01)
    ry = Math.max(seed.ry * INK_COVER * t, 0.01)
    break
```

## Target

Primary axis still tracks `t`. Cross-axis opens from a contact fraction to full
cover so early frames read as a soft blot at the seed, then a wipe:

```ts
/** Cross-axis starts partially open (contact blot), reaches full cover with t */
const CROSS_START = 0.38

switch (seed.edge) {
    case "left":
    case "right":
        rx = Math.max(seed.rx * INK_COVER * t, 0.01)
        ry = Math.max(seed.ry * INK_COVER * (CROSS_START + (1 - CROSS_START) * t), 0.01)
        break
    case "top":
    case "bottom":
        rx = Math.max(seed.rx * INK_COVER * (CROSS_START + (1 - CROSS_START) * t), 0.01)
        ry = Math.max(seed.ry * INK_COVER * t, 0.01)
        break
    default: {
        const _exhaustive: never = seed.edge
        void _exhaustive
        rx = Math.max(seed.rx * INK_COVER * t, 0.01)
        ry = Math.max(seed.ry * INK_COVER * t, 0.01)
        break
    }
}
```

At `t=1`: both axes still `seed.* * INK_COVER` (corner-safe cover unchanged).

## Repo conventions to follow

- Keep exhaustive `switch` on `Edge` with `never` default (repo TS rule).
- Do not return to isotropic `rx*t` and `ry*t` only — directional primary remains the product.
- Essence: pointer-edge seed + cascade — this only changes early silhouette.

## Steps

1. Add `const CROSS_START = 0.38` next to `INK_COVER`.
2. Replace the left/right and top/bottom branches in `inkMask` with the target formulas.
3. Update the `inkMask` doc comment: “cross-axis opens from contact blot → full cover”.

## Boundaries

- Do NOT change tip % / `INK_COVER` formula (035).
- Do NOT change enter easing (034) or stagger (037).
- Do NOT switch back to diagonal circle bloom.
- Do NOT publish.

## Verification

- **Mechanical**: push + verify.
- **Feel check** at 0.25× on a wide letter (e.g. `M`) approached from the left:
  - Frame ~5–10%: soft oval contact at the left edge (not a full-height stripe).
  - Mid: clear horizontal wipe.
  - End: letter fully inked (corners solid).
- Approach from top/bottom on a short word and confirm the same droplet→wipe on the vertical axis.
- **Done when**: first contact reads as ink touch, not a bar wipe.
