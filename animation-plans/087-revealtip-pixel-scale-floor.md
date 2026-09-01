# 087 — Restore pixel cell scale floor (0.92)

- **Status**: DONE
- **Commit**: `4aa0cbc`
- **Severity**: HIGH
- **Category**: Physicality & origin
- **Estimated scope**: 1 file, `PixelPanel` cell `motion.div` only
- **Supersedes regression of**: `086-revealtip-pixel-scale.md` (DONE, then Codrops rewrite reintroduced `scale: 0`)

## Problem

Pixel cells appear from nothing. AUDIT.md: never `scale(0)`; target `scale(0.9–0.97)` + opacity.

```tsx
/* code-components/RevealTooltip.tsx:695-699 — current */
initial={
    freeze ? false : { opacity: 0, scale: 0 }
}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0 }}
```

## Target

```tsx
initial={
    freeze ? false : { opacity: 0, scale: 0.92 }
}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.92 }}
```

Keep `CELL_MS` / stagger as-is in this plan (budget handled in 088).

## Repo conventions to follow

- AUDIT physicality: scale 0.9–0.97 + opacity
- Prior target in `animation-plans/086-revealtip-pixel-scale.md`
- Ease: keep existing `cellTx` (091 may swap ease token later)

## Steps

1. In `code-components/RevealTooltip.tsx` `PixelPanel`, change cell `initial` and `exit` `scale` from `0` to `0.92`.
2. Pin session:  
   `node scripts/framer/session.mjs --url "https://framer.com/projects/Straightforward-Engineers--DHpXX5xCoGaJHmRQfN0m-dFXww" --name "Reveal Tooltip"`
3. Push: `node scripts/framer/push-revealtip.mjs` — expect `typeErrors: []`.

## Boundaries

- Do NOT change Bodak `scaleX: 0` center slice (intentional).
- Do NOT change `contentDelay` here (plan 088).
- Do NOT change follow positioning (plan 089).
- Do NOT add dependencies.
- If cells no longer use `scale` prop (drift), STOP and report.

## Verification

- **Mechanical**: push `typeErrors: []`; `node scripts/framer/verify.mjs` ok.
- **Feel check**: Preview → Tip Bottom (pixel) — cells fade/scale gently, not pop from a point. DevTools Animations 10%: no cell starts at scale 0.
- **Reduced motion / static**: freeze path unchanged (static cells already plain DOM).
- **Done when**: no pixel cell `initial`/`exit` uses `scale` &lt; 0.9.

## Key Learnings for executor

1. Always re-pin `DHpXX5x` before push — session drifts to Area Scrub.
