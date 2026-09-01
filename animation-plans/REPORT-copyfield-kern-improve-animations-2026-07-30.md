# improve-animations — BuiltByKern Copy Field motion

Written against: `4aa0cbc` · Effort: standard · Scope: **pre-build** motion spec for Marketplace component  
Stack target: React + `framer-motion` + Framer `useIsStaticRenderer` / `useReducedMotion` (peer: `MetricSeal.tsx`, `KineticGrid.tsx`)  
Personality: Crisp Marketplace micro-interaction — occasional delight (reveal + copy), not continuous decoration  
Frequency: Reveal/copy = occasional; press/hover = tens/day → keep press subtle

## Recon

| Fact | Value |
| --- | --- |
| Motion home | None yet — greenfield |
| Kern curves | `EASE_OUT` `[0.23,1,0.32,1]`; `EASE_INK` `[0.65,0,0.35,1]`; `EASE_SNAPPY` `[0.16,1,0.3,1]` (`MetricSeal.tsx` ~86–90); spring `{ duration: 0.55, bounce: 0.12 }` (`KineticGrid.tsx` ~278–282) |
| Interaction contract | (1) Eye → morph copy + staggered digit reveal XXXX→digits; (2) Copy → progress stroke → solid check + feedback; (3) auto-reset |
| Settled prefs | No Auto Demo; canvas/export static gate; reduced-motion gentler not zero |

## Findings

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | 2 Easing / 7 Cohesion | Spec — digit reveal | A long slot-machine blur cascade (>500ms, heavy blur) fights Kern UI budget and AUDIT blur cap | Per-digit: `opacity` + `transform: translateY(6px→0)` + `filter: blur(8px→0)` (≤12px peak); stagger **40ms**; total span ≤ **320ms**; ease `EASE_OUT`. Masked→revealed via interruptible Motion values (not CSS keyframes). |
| 2 | HIGH | 3 Physicality / 4 Interruptibility | Spec — icon morph + copy success | Eye↔copy↔check swaps that `scale(0)` or restart keyframes feel cheap and break spam-click | Morph: crossfade icons `opacity` + `scale(0.92→1)` (never 0), `EASE_IN_OUT` `[0.77,0,0.175,1]`, **180ms**. Progress stroke: SVG `pathLength` **linear 220ms**. Success fill: **160ms** `EASE_OUT`. All transitions retargetable mid-flight. |
| 3 | MEDIUM | 1 Purpose / 3 Physicality | Spec — feedback | Feedback that pops from `scale(0)` or teleports is a jarring occasional moment | Enter: `opacity 0→1` + slight translate/scale → settled, **160ms** `EASE_OUT`. Exit: reverse **140ms**. Hold visible **1.6s** then auto-dismiss with reset. |
| 4 | MEDIUM | 6 Accessibility / 5 Performance | Spec — gates | Continuous blur stagger + hover scale without RM / fine-pointer / static gates = canvas jank + a11y miss | `useReducedMotion()` → instant unmask + opacity-only feedback/check; `useIsStaticRenderer()` → mid-cycle still (revealed + copy icon, no toast); hover scale only under `@media (hover:hover) and (pointer:fine)`; animate `transform`/`opacity`/`filter` only — no Motion `x`/`y` shorthand. |
| 5 | LOW | 3 Physicality | Spec — press | Missing press on action squircle makes copy feel dead vs Filling Point peers | `:active` / pointerdown `transform: scale(0.97)`, **160ms** `EASE_OUT` (AUDIT press). |

### Missed opportunities (additive)

- **Reset stagger reverse** — remask L→R with same 40ms stagger (mirror of reveal) so loop demos don’t hard-cut.
- **Success border pulse** — 1px accent hairline on pill fades in 160ms with check using opacity only.
- **Clipboard failure path** — brief shake `translateX` ±2px 120ms `EASE_OUT` if `clipboard.writeText` rejects (no success feedback).

### Explicitly not findings

- Marketing demo loop longer than 300ms total video (sell tape, not runtime UI)
- Auto Demo / idle loop inside component (locked: no Auto Demo)
- Non-Kern pastel timings as SoT (Kern curves own the feel)

## Improve first

**Finding 1** — Digit reveal is the product’s signature; if stagger/blur is wrong, icon/feedback polish still reads as a generic copy button.

---

**Stop.** Which finding IDs become `animation-plans/` plans? (e.g. `1+2`, `1+2+3+4`, `plan all`)
