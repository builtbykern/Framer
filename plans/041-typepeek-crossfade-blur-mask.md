# 041 — Type Peek crossfade blur mask (≤2px)

- **Status**: CANCELLED — dual opacity crossfade replaced by pointer mask
- **Commit**: `4aa0cbc`
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file (`code-components/TypePeek.tsx`), ~40 lines

## Problem

Muted + die-cut layers crossfade with opacity only. Mid-transition both glyphs are partially visible → double-expose / muddy mix (AUDIT §7).

```tsx
/* code-components/TypePeek.tsx:295-320 — current */
<motion.span animate={{ opacity: open ? 0 : 1 }} /* muted */ />
<motion.span animate={{ opacity: open ? 1 : 0 }} /* diecut */ />
```

## Target

During the crossfade only, apply a **subtle** blur on both layers, peaking mid-transition:

- Max blur: **`2px`** (AUDIT: keep transition-time blur under 20px; 2px is the cohesion recipe)
- Animate **`filter` is paint-heavy** — prefer Motion `filter: "blur(2px)"` only while progress is mid; at rest and fully open: `blur(0px)`
- Durations: reuse enter/leave from plan 040 if already applied; else both 0.22

```tsx
// Target feel (illustrative)
animate={{
  opacity: open ? 0 : 1,
  filter: open ? "blur(0px)" : "blur(0px)", // endpoints sharp
}}
// Better: drive blur with a short keyframe via animate values that peak mid,
// OR animate filter to blur(2px) when transitioning and clear on settle.
```

Practical Framer Motion approach (executor pick one, prefer interruptible):

**Option A (preferred):** animate `filter` alongside opacity:

- Rest: `opacity: 1, filter: "blur(0px)"` (muted)
- Mid / while `open` flipping: allow Motion to interpolate — set open target muted to `opacity: 0, filter: "blur(2px)"` and diecut open to `opacity: 1, filter: "blur(0px)"` with diecut from `opacity: 0, filter: "blur(2px)"` → ends sharp

So diecut enter: from `{ opacity: 0, filter: "blur(2px)" }` to `{ opacity: 1, filter: "blur(0px)" }`  
Muted leave: from `{ opacity: 1, filter: "blur(0px)" }` to `{ opacity: 0, filter: "blur(2px)" }`

**Option B:** skip if signature die-cut plan lands first and removes dual opacity crossfade — then mark this plan **CANCELLED**.

`freeze`: no blur animation (`filter: "blur(0px)"`, duration 0).

## Repo conventions to follow

- Animate compositor-friendly props; blur only ≤2px and only during transition
- Static freeze: `docs/projects/STATIC_RENDERER.md`
- Push Type Peek: `node scripts/framer/push-typepeek.mjs`

## Steps

1. Confirm plan 040 status — if TODO, either depend on 040 first or use 0.22 both ways temporarily.
2. Add `filter` to muted + diecut `animate` objects per Option A.
3. Ensure `transition` includes filter (same tween object).
4. When `freeze`, force `filter: "blur(0px)"` and duration 0.
5. If `PLAN-typepeek-signature-diecut` already replaced opacity crossfade, STOP and mark 041 CANCELLED.

## Boundaries

- Do NOT raise blur above 2px.
- Do NOT animate layout props.
- Do NOT implement pointer mask here.
- Do NOT add press feedback (042).

## Verification

- **Mechanical**: push-typepeek → `typeErrors: []`; verify.mjs ready.
- **Feel check**: 10% speed — mid-crossfade softens double-expose; endpoints (rest + full open) are sharp (0 blur). Reduced-motion: no blur tween.
- **Done when**: open/close no longer shows a hard double-glyph ghost; max blur 2px.
