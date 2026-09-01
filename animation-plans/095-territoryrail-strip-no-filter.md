# 095 — TerritoryRail strip: drop saturate filter animation

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 animate block on strip thumbs
- **Audit**: A3

## Problem

Desktop strip thumbs animate `filter: saturate(...)` between active/inactive. Filter animation is expensive (especially Safari) vs opacity/transform-only.

```tsx
/* .tmp/Arbour_TerritoryRail_live.tsx:1518–1534 — current */
animate={{
    y: isActive ? -stripLift : 0,
    scale: isActive ? (compactThumbs ? 1 : 1.04) : (compactThumbs ? 1 : 0.98),
    opacity: isActive ? 1 : stripInactiveOpacity,
    filter: isActive ? "saturate(1)" : "saturate(0.5)",
}}
```

## Target

Animate **opacity + transform only**. No `filter` in `animate`.

```tsx
animate={{
    y: isActive ? -stripLift : 0,
    scale: isActive
        ? compactThumbs
            ? 1
            : 1.02
        : compactThumbs
          ? 1
          : 1,
    opacity: isActive ? 1 : stripInactiveOpacity,
}}
transition={{
    type: "spring",
    stiffness: compactThumbs ? 220 : 180,
    damping: compactThumbs ? 28 : 24,
}}
```

(Scale **1.02** active desktop matches desktop-strip-craft; inactive scale **1** — avoid perpetual 0.98.)

Optional: static `filter` via CSS on inactive only is still a paint cost — **prefer no filter at all**.

## Repo conventions to follow

- AUDIT.md: animate transform + opacity only; avoid filter animation
- Keep strip spring interruptible (springs OK for hover select)

## Steps

1. Remove `filter` key from strip `motion.div` `animate`.
2. Align scale with desktop-strip-craft (1.02 / 1) if that plan already landed; otherwise apply here.
3. Leave compact mobile springs as-is.

## Boundaries

- Do NOT reintroduce saturate for “mood”
- Do NOT animate width/height of thumbs

## Verification

- **Mechanical**: verify.mjs after push
- **Feel check**: Rapid hover across tabs stays smooth; Safari no filter thrash in Layers
- **Done when**: no `saturate` in strip motion animate block
