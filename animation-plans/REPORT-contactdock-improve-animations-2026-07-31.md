# improve-animations — Contact Dock (re-audit)

Written against: `4aa0cbc` · Framer `UkECoRS` restored ~781-line build · Effort: **standard** · 2026-07-31 (pm)  
Surface: `code-components/ContactDock.tsx` only (Marketplace · Overly Interaction `2GOZzqC76RSbm2V0FOXP`)

**Context:** User restored an older working open/close build. Plans **044–051** were previously DONE on a later craft build and are **invalidated** (code no longer matches). Do not re-litigate settled product decisions. Prefer reactivating existing plan files over inventing 052+.

## Recon

| Fact | Value |
|------|--------|
| Stack | React Framer code component · `framer` + `framer-motion` only |
| Motion sites | Sheet `AnimatePresence` spring · idle pulse rings (FM loops) · orb `whileTap` · ChannelRow enter springs + CSS hover via JS · no shared motion tokens |
| Tokens | None — springs/durations inline |
| Personality | Premium Kern glass / Awwwards orb (crisp, subtle bounce only) |
| Frequency | Orb open/close: occasional · Pulse: continuous while closed + pulse on · Channel hover: only when sheet open |
| Settled (do not re-litigate) | Idle pulse on by design · orb stays + sheet popover (not morph) · spring sheet · ~40ms row stagger · Escape/outside close · simple `onClick={toggle}` · no Auto Demo |

## Findings

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Performance | `ContactDock.tsx:528–560` | Continuous pulse drives Framer Motion `scale`/`opacity` keyframe loops. FM transform shorthands run on the main thread — worst case for always-on decorative motion. | Replace with CSS `@keyframes` on `transform` + `opacity` only; keep `useReducedMotion` / pulse prop / static stub. Reactivate **044**. |
| 2 | MEDIUM | Easing & duration / Spec | `ContactDock.tsx:383–396` | Spec: close “slightly faster” than open. Exit uses the same spring `{ stiffness: 380, damping: 28 }` as enter. | Asymmetric exit spring (stiffer / shorter) + slightly more `y` toward orb. Reactivate **045**. Do not change enter pose, portal, or toggle. |
| 3 | MEDIUM | Accessibility | `ContactDock.tsx:252–259` | Channel row hover lift via `onMouseEnter`/`onMouseLeave` mutating `transform` — no `(hover: hover) and (pointer: fine)` gate; touch can flash false hover. | CSS `:hover` under fine-pointer media (or matchMedia). Reactivate **046**. |
| 4 | MEDIUM | Accessibility | `ContactDock.tsx:586` | Orb `outline: "none"` with no `:focus-visible` chrome — keyboard loses the only focus target. | Accent `:focus-visible` ring; mouse click stays unringed. Reactivate **047**. CSS-only — do not `focus()` on open. |
| 5 | LOW | Performance | `ContactDock.tsx:380–386`, `233–234` | Sheet + ChannelRow use FM `y`/`scale` shorthands (occasional). Same main-thread cost, far lower frequency than pulse. | Prefer full `transform` strings after 045 values. Reactivate **048**. Feel-check open/close carefully. |
| 6 | LOW | Physicality | `ContactDock.tsx:571` | `whileTap={{ scale: 0.94 }}` below AUDIT press band (0.95–0.98); target **0.97**. | One-number change. Reactivate **049**. Safest plan. |

### Explicitly not findings

- Idle pulse existence — locked in design spec  
- Sheet spring (vs CSS ease-out) — locked interruptible spring popover  
- Row stagger 40/80ms — within 30–80ms and matches spec  
- Sheet initial `scale: 0.94` — not `scale(0)`; within 0.9–0.97  
- `transformOrigin` bottom left/right — correct for orb-anchored sheet  
- Simple `onClick={toggle}` / portal layout — product-critical; out of motion polish scope  

## Missed opportunities

1. Chat ↔ × hard-cuts (`ContactDock.tsx:598–602`) — 125–160ms opacity crossfade would sell open state (**050**).  
2. Sheet exit toward orb — covered by finding 2 / **045**.  
3. Fine-pointer orb glow intensify (not scale) on hover (**051**).

## Improve first (motion)

**Finding 1** — always-on FM pulse is the highest-leverage perf/feel fix; does not require touching open/close handlers.

**Constraint for executors:** Restored open UX must not break. Touch only motion properties listed in the selected plan. No viewport-fixed sheet math, no dual pointer handlers, no `focus()` on open.

---

**Stop.** Which finding IDs (1–6) and/or missed ops (1, 3) should be reactivated as plans? Existing files: `044`–`051` under `animation-plans/`.
