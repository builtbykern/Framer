# improve-animations — PathTypeKinetic

Written against: `4aa0cbc` · Effort: **standard** · File: `code-components/PathTypeKinetic.tsx` (~580 lines)  
Stack: React + `framer-motion` (`useScroll`, `useTransform`, `useInView`) + `useIsStaticRenderer`  
Personality target: Kern kinetic-editorial (rare / marketing delight — can be longer than UI 300ms if authored)  
Note: Product direction is **SKU B** (new unique gesture). Findings below inform what to kill vs salvage; do not polish Path multi-mode as the ship product.

## Recon

- Motion library: framer-motion only
- Frequency: Path autoPlay = continuous loop while in view (high cost if left on); scroll modes = occasional
- Tokens: none — no shared ease/duration tokens in this component project
- Static: `staticMode = prefersReduced \|\| useIsStaticRenderer()` — good platform pattern
- Modes: Path (auto rAF + scroll), ColorReveal, Blur, Scramble

## Findings

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Performance | `PathTypeKinetic.tsx:341-353` | Path `autoPlay` calls `setLoop(t)` every `requestAnimationFrame` → full React re-render per frame | Drive offset with `useMotionValue` + `useAnimationFrame` writing to MV only (or Motion `animate`); never `setState` per frame |
| 2 | HIGH | Performance | `PathTypeKinetic.tsx:202-230`, `271-277` | Scramble: one rAF + `setState` per letter unit; Blur: per-letter `filter: blur()` | Shared ticker; prefer opacity/color over blur; cap letter count; for SKU B avoid this pattern entirely |
| 3 | MEDIUM | Purpose & frequency | Path `autoPlay` default `true` (`:321`, controls `:566`) | Continuous decorative path crawl while in view has weak “why” vs competitors; burns main thread | Default autoPlay off for scroll-driven Path; or delete Path mode in SKU B |
| 4 | MEDIUM | Accessibility | Scramble branch `:279-290` + parent `aria-label` | Mutating glyph strings stay in the accessibility tree | `aria-hidden` on animated glyphs + stable accessible name; keep reduced-motion static |
| 5 | MEDIUM | Cohesion | Four modes, linear scroll maps, no Kern ink curve | Motion personality is starter-kit, not Filling Point cinematic authorship (`ease [0.65,0,0.35,1]`, asymmetric leave) | SKU B: one gesture, authored enter/leave curves from Kern bar |
| 6 | LOW | Easing & duration | Path loop duration default 8s linear | Constant motion correctly uses linear; 8s is fine for marquee-class — not a UI-ease-in bug | Only retune if Path survives; prefer scroll-scrubbed Path over long auto loop |

### Missed opportunities (additive — for SKU B, not PathTypeKinetic polish)

1. Pointer-origin reveal across glyphs (transfer Filling Point seed geometry to type) — no Marketplace clone with nearest-border letter seeds
2. Interruptible hover leave that breathes longer than enter (asymmetric timing — AUDIT §4)
3. Canvas static preview that shows mid-gesture ink (not only idle text) so Assets/thumbnail sell the product

### Platform pass

- `useIsStaticRenderer` + `prefers-reduced-motion`: present
- Root `position: relative`: present
- No finding for modal-style transform-origin (N/A)

## Improve first

**Finding 1** — setState-per-frame makes Path feel cheap and janky under load; any Path remnant or new continuous motion must use MotionValues. For SKU B, treat this as a hard constraint in the design, not a reason to keep PathTypeKinetic.

---

**Stop.** Which findings become `animation-plans/NNN-*.md`? Recommended if keeping any Path code: **1**. If pivoting fully to B: skip Path plans; encode 1–2–5 as constraints in the B design spec instead.
