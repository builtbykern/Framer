# Improve-animations — Glyph Ink

Written against: `4aa0cbc` · Effort: **standard** · Scope: `code-components/Kern_GlyphInk.tsx`  
Product SoT: `docs/projects/glyph-ink.md` · Bar: [AUDIT.md](../.agents/skills/improve-animations/AUDIT.md)

## Recon

| | |
| --- | --- |
| Stack | React 18 + `framer-motion` (`animate`, `useMotionValue`, `useTransform`, `useReducedMotion`) + Framer `useIsStaticRenderer` |
| Motion surface | Per-glyph elliptical `mask-image` driven by progress 0→1; cascade stagger by pointer distance |
| Tokens | Local `EASE_INK` `[0.22,1,0.36,1]`, `EASE_OUT` `[0.23,1,0.32,1]`, `INK_GROWTH_POWER = 1.22` |
| Personality | Kern kinetic editorial / Marketplace sell — hover is the product (same family as Filling Point) |
| Frequency | Hero headline hover: tens/day in Preview/buyer demos — treat as interactive UI, not rare onboarding |
| Settled by design | Leave longer than enter; no Auto Demo; reduced-motion / coarse / focus → full ink (no cascade) |

Sibling craft: Filling Point settled cinematic enter on **ease-in-out** `[0.77,0,0.175,1]` (`animation-plans/025`) so paint reads mid-travel — Glyph Ink still front-loads with ease-out **and** stacks a growth power.

---

## Findings

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Interruptibility / Purpose | `Kern_GlyphInk.tsx:622–639` | Pointer enter/leave wraps `setActive` / seeds in `startTransition`. Hover paint is the product; Transition API can defer the update → late/mushy cascade start vs pointer. | Use synchronous `setState` for enter/leave geometry + active (keep `startTransition` only for non-urgent resets e.g. text change). |
| 2 | HIGH | Easing & duration | `Kern_GlyphInk.tsx:94–105`, `304–310`, `110–116` | Double curve: cinematic `animate` uses ease-out `EASE_INK` **and** `inkMask` applies `Math.pow(t, 1.22)`. Progress races ahead while radius lags → hesitant tip then flood (the “raro”). Filling Point already moved cinematic enter to ease-in-out for readable mid-paint. | Pick **one** shaping path: (A) linear progress + power, or (B) preferred — cinematic enter `ease: [0.77,0,0.175,1]` (AUDIT ease-in-out) and **remove** `INK_GROWTH_POWER` (`grow = t`). Leave stays ease-out. |
| 3 | HIGH | Physicality / Cohesion | `Kern_GlyphInk.tsx:305–307` | At `t >= 1` mask snaps to `linear-gradient(#000,#000)`; any `t < 1` uses soft ellipse. Leave starts by dropping below 1 → soft halo pops in at the glyph edge then shrinks. Enter completion does the reverse snap. | Never special-case t=0/1 with a different mask family. Use ellipse at full axes for t=1 (or opaque fill that matches the last ellipse frame); at t=0 keep transparent without a different gradient type if it causes a flash — e.g. `ellipse … transparent 100%` with rx/ry near 0. |
| 4 | MEDIUM | Interruptibility | `Kern_GlyphInk.tsx:424–444` | `animate(...)` effect depends on `seed`. Every re-enter builds new seed objects → effect cleanup + restart **re-applies stagger `delay`** from the current progress. Flicker-hover hitch: ink freezes for `rank * staggerMs` then resumes. | Keep seed out of the animate deps (store seed in ref for mask); or call `animate` without delay when `progress.get()` is between 0 and 1 (interrupt path). |
| 5 | MEDIUM | Physicality | `Kern_GlyphInk.tsx:106–108`, `280–283`, `450–454` | Optical pad `0.18em`/`0.32em` inflates measured box; `ry = max(y,h-y)` on padded height → tall ellipses vs letter ink. Reads as soft vertical wash, especially on narrow glyphs. | Measure seed/axes from content box (unpadded) or subtract pad px when building `InkSeed`; keep pad only for paint clipping. |
| 6 | LOW | Performance | `Kern_GlyphInk.tsx:446–447`, `472–488` | Per-glyph `useTransform` → `mask-image` string every frame (paint). Soft-max copy exists (~48); still the hot path. | Accept for SKU; optional later: shared ticker / fewer mask stops. No change unless jank measured. |

### Not findings (by design / exempt)

- Leave duration > enter (product contract “breathe”).
- Full ink on reduced-motion / coarse / focus (a11y).
- Marketing enter 360ms (cinematic) — over UI 300ms budget but allowed for explanatory/sell motion; still fix curve shape (#2).
- Mid-ink static on canvas (`STATIC_FILL_RATIO`) — sell freeze, not a motion bug.

### Missed opportunities (additive)

1. **Pointer-move seed update** while hovered — ink origin could track slowly (delight); only if it doesn’t fight nearest-edge cascade story.
2. **Shared progress clock** for the whole line — one MotionValue + per-glyph delay offset would cut effect churn (#4) and unify interrupt behavior.
3. **Press/active scale** — not a text control; skip unless product adds click.

---

## Improve first

**#1 + #2 together** — deferred hover (`startTransition`) plus fighting curves explain “algo raro” more than feather size. Then **#3** (solid snap flash on leave).

---

**Stop.** Findings **1–5** executed 2026-07-28 → `029-033-glyphink-motion-craft.md` (DONE). Finding **6** skipped (accept).
