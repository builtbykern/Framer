# improve-animations — Copy Field (post-ship)

Written against: `4aa0cbc` · Effort: standard · Scope: `code-components/CopyField.tsx`  
Stack: React + `framer-motion` (`AnimatePresence`, `motion`, `useReducedMotion`) + Framer `useIsStaticRenderer`  
Personality: Crisp Marketplace micro-interaction — occasional reveal/copy, tens/day press/hover  
Frequency: Reveal/copy occasional; press/hover tens/day; fail rare

## Recon

| Fact | Value |
| --- | --- |
| Motion home | `CopyField.tsx` only |
| Curves | `EASE_OUT` `[0.23,1,0.32,1]`, `EASE_IN_OUT` `[0.77,0,0.175,1]` |
| Settled (do not re-litigate) | Digit blur≤8 + stagger cap (039); icon morph ≥0.92 (040); toast 160/140 (041); RM/static/fine-pointer (042); press 0.97 (043); fail shake ±2px + toast-then-remask (shipped) |
| Demo | Gold Parsnip `/` dark house; instance mid-width 560 |

## Findings

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| 1 | MEDIUM | 4 Interruptibility | `CopyField.tsx:489-517` | Reveal/remask remounts each digit via `key={\`${digitVisible ? "v" : "m"}-${char}-${i}\`}` — every toggle restarts from `initial` opacity 0 / blur / translateY (keyframe-like), not an interruptible retarget | Keep one `motion.span` per slot; animate `opacity` / `transform` / `filter` from `digitVisible` without changing `key`; swap text content in place (or crossfade two absolute layers with shared layout id) |
| 2 | LOW | 5 Performance | `CopyField.tsx:475-488` | Outer `motion.span` always `animate={{ opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" }}` — dead motion work every frame | Delete the outer wrapper; keep only the inner animated span (or the static span under RM) |
| 3 | LOW | 3 Physicality | `CopyField.tsx:606-611` | While `phase === "success"`, stroke `pathLength` → 0 but `opacity` stays 1 — empty stroke shell can flash after copy | Set stroke `opacity: phase === "copying" ? 1 : 0` (success uses solid fill + check only) |

### Missed opportunities (additive)

- None high-conviction — fail shake and toast→remask sequencing already shipped.
- Feel-check only: whether remount flicker is visible on slow Preview (supports finding 1).

### Explicitly not findings

- Digit `filter: blur(8px)` peak — settled in plan 039 (under AUDIT 20px cap)
- Hover scale 1.03 fine-pointer gated — settled subtle tens/day feedback
- Press down 160 / up 100 asymmetric — correct per AUDIT
- Progress `linear` 220ms — correct for constant progress
- No Auto Demo / static mid-cycle — locked preference

## Improve first

**Finding 1** — Remount-on-toggle is the only remaining feel-breaker; dead wrapper and stroke opacity are polish after that.

---

**Stop.** Which IDs become `animation-plans/` plans? Recommend **`1`**, then **`2+3`**. Say e.g. `1`, `1+2+3`, or `plan all`.
