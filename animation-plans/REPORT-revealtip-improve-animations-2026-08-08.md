# Improve Animations — Reveal Tooltip

**Date:** 2026-08-08  
**Effort:** standard  
**SKU:** `code-components/RevealTooltip.tsx` → Framer `OzC4vaD` · sandbox `DHpXX5xCoGaJHmRQfN0m`  
**Commit:** `4aa0cbc`  
**Recon note:** Prior plans `083–086` marked **DONE** in `animation-plans/README-revealtip.md`, then Codrops/VRTL pixel rewrite landed. Several fixes **regressed**. This pass re-audits current source only.

## Recon

| Fact | Value |
| --- | --- |
| Stack | React + `framer-motion` (`AnimatePresence`, `motion.*`) + `useIsStaticRenderer` / `useReducedMotion` |
| Personality | Crisp Marketplace utility tip (Bodak smooth + Codrops pixel) — not playful marketing loops |
| Frequency | Hover/focus tips: **tens/day** in toolbars; keep short; delete showy motion |
| Tokens in file | `EXPAND_EASE = [0.23, 1, 0.32, 1]` ✓ AUDIT; `EXPAND_MS=180`, `LABEL_MS=120`, `SHELL_MS=125`, `CELL_MS=100`, `STAGGER=0.02` |
| Still good | Press `:active` scale 0.97 (084); ease token (085); Smooth Bodak `scaleX` expand; reduced-motion freeze |

## Findings

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Physicality | `RevealTooltip.tsx` ~695–699 | **Regression of 086:** pixel cells `initial/exit` use `scale: 0` | `scale: 0.92` + opacity; exit same floor |
| 2 | HIGH | Easing & duration | ~601–604, ~725–735 | **Regression of 083:** `contentDelay` up to **0.45s** before tip body — over tooltip budget 125–200ms | Cap content delay so readable content ≤~180–200ms from open (e.g. `Math.min(0.08, …)`); keep cell stagger as accent |
| 3 | HIGH | Performance | ~820–824, ~862–867, ~959–962 | Follow-cursor tip: React `setCursor` → style `left`/`top` every `pointermove` (layout) | `MotionValue` + `transform: translate3d(...)`; no per-move React state |
| 4 | MEDIUM | Performance | ~473–488, ~693–704 | Framer Motion `scale` / `scaleX` / `x` shorthands on expand path (main-thread) | Prefer `transform` string where it does not fight Bodak slice math; at least on pixel cells |
| 5 | LOW | Cohesion | ~572 | Pixel `cellTx` uses `ease: "easeOut"` string while file token is `EXPAND_EASE` | Use `EXPAND_EASE` everywhere |

## Missed opportunities (additive — see also find-animation-opportunities)

Listed in companion opportunities section below — not severity fixes.

## Improve first

**#1 + #2 together on pixel path** — scale(0) + 0.45s content wait is why Pixel feels “demo FX” instead of a tip. Then **#3** so follow feels glued to the cursor without jank.

## Dropped / by design

- Smooth center `scaleX: 0` — intentional Bodak 1px expand (called out in 086 boundaries).
- Shell opacity-only fade at 125ms — within budget; not a defect.
- Press feedback — already shipped (084).
- `EXPAND_EASE` values — match AUDIT (085).
- Close delay 60–80ms — idle wait, not enter duration.

---

# Find Animation Opportunities — Reveal Tooltip

Gate: frequency → purpose → speed → function. Restraint first.

## Opportunities

| # | Location | Today | Purpose | Frequency | Suggested motion |
| --- | --- | --- | --- | --- | --- |
| 1 | Pixel follow tip wrapper ~946–965 | Tip teleports via `left`/`top` updates | Spatial consistency / preventing a jarring change | Occasional hover session (continuous while held) | Drive position with MotionValues; `transform: translate3d(xpx, ypx, 0)`; optional soft spring `{ type: "spring", duration: 0.35, bounce: 0.12 }` **or** direct set for zero lag — feel-check which; reduced-motion: snap, no spring. Animate transform only. |
| 2 | Anchored tip shell (smooth + pixel non-follow) ~970–1000 | Shell enters as opacity-only | Spatial consistency (tip ↔ trigger) | Occasional | Enter `opacity: 0` + `transform: scale(0.96)` → `1`, `duration: 0.125–0.16`, `ease: cubic-bezier(0.23, 1, 0.32, 1)`; `transform-origin` toward trigger (placement-based). Stay inside tooltip budget. |

## Rejected candidates

- Trigger hover scale / glow — **Rejected: frequency tens/day; already has press feedback.**
- Extra gooey SVG morph between cells — **Rejected: purpose “looks cool”; blows tooltip budget.**
- Animate tip open on keyboard focus with a longer beat — **Rejected: keyboard-initiated; keep current short open or none extra.**
- Idle breathing on closed trigger — **Rejected: decoration on high-frequency chrome.**
- Home page stagger of the two tips on load — **Rejected: marketing stage, not product utility; not in component.**
- Distance-to-cursor cell stagger (Codrops-adjacent) — **Rejected: speed — cannot keep readable content ≤200ms if stagger grows with pointer distance.**

## Verdict

This SKU needs **less late motion**, not more. Pixel path is over-budget and physically wrong (`scale: 0`); follow is the one real gesture seam worth polishing (Opportunity 1 ≡ Finding 3). Opportunity 2 is optional polish after regressions are fixed. Handoff: `improve-animations` plans for findings 1–3 first; opportunity 2 only if feel-check still wants origin.

---

*Read-only. Stop — select finding IDs for new `animation-plans/NNN-*.md` (next free after 086; mark 083/086 regressions explicitly).*
