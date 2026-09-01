# 092 — Anchored tip shell: scale 0.96 from trigger

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: LOW (opportunity)
- **Category**: Missed opportunities / Physicality & origin
- **Estimated scope**: 1 file, anchored shell `motion.div`s only (smooth + pixel non-follow)
- **Depends on**: 087, 088 preferred first (pixel feel baseline)
- **Source**: find-animation-opportunities #2

## Problem

Anchored tip shells enter as opacity-only — weak spatial link to the trigger. Follow path is handled in 089; this plan is **anchored only**.

```tsx
/* code-components/RevealTooltip.tsx:970-974 — pixel-anchor (pattern also on smooth ~989-992) */
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
```

## Target

```tsx
initial={{ opacity: 0, transform: "scale(0.96)" }}
animate={{ opacity: 1, transform: "scale(1)" }}
exit={{ opacity: 0, transform: "scale(0.96)" }}
transition={
    freeze
        ? { duration: 0 }
        : {
              duration: SHELL_MS / 1000, // 0.125
              ease: EXPAND_EASE,
          }
}
```

Set `transformOrigin` from placement:

| placement | transformOrigin |
| --- | --- |
| top | `50% 100%` (grows from trigger below) |
| bottom | `50% 0%` |
| left | `100% 50%` |
| right | `0% 50%` |

Apply on **pixel-anchor** and **smooth** shell wrappers only. **Do not** add scale on the follow wrapper (089 owns follow; opacity-only shell fade there is fine).

AUDIT: never `scale(0)`; use 0.96; tooltip duration ≤200ms — `SHELL_MS` 125 is OK.

## Repo conventions to follow

- `EXPAND_EASE`, `SHELL_MS` already in file
- Prefer `transform` string over `scale` shorthand (same as 090)

## Steps

1. Add helper `shellOrigin(placement: Placement): string` with the table above (exhaustive switch + `never`).
2. Update `pixel-anchor` and `smooth` `motion.div` initial/animate/exit + `style.transformOrigin`.
3. Leave `pixel-follow` opacity-only (or opacity + transform position from 089).
4. Pin + push + verify.

## Boundaries

- Do NOT change SmoothTip internal slice animation.
- Do NOT change PixelPanel cells (087/090).
- Do NOT animate shell longer than `SHELL_MS`.
- Do NOT add hover scale on the trigger.
- If shells already use scale (drift), STOP and reconcile.

## Verification

- **Mechanical**: typeErrors []; verify ok.
- **Feel check**: Tip Top (smooth) — tip scales subtly from trigger edge; Tip Bottom with Follow **Off** — same; Follow **On** — no double-scale fight.
- **Reduced motion**: freeze → duration 0.
- **Done when**: anchored shells use scale 0.96→1 with placement-based origin; follow path unchanged by this plan’s scale.

## Key Learnings for executor

1. Re-pin before push.
2. Run after 087–089 so feel-check isn’t masked by scale(0) / late content / left-top jank.
