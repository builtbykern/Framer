# improve-animations — Metric Seal (Ink Seal wipe)

Written against: `4aa0cbc` · Effort: standard · Scope: `code-components/MetricSeal.tsx` + home instance delays  
Stack: React + `framer-motion` (`animate`, `useMotionValue`, `useTransform`, `useInView`, `useReducedMotion`) + Framer `useIsStaticRenderer`  
Personality: Marketing Marketplace seal — rare on-enter delight, Glyph Ink family tip language  
Frequency: once per enter (`once: true`) — long durations allowed; still must feel decisive

## Recon

| Fact | Value |
| --- | --- |
| Motion home | `MetricSeal.tsx` only (no CSS keyframes) |
| Curves | `EASE_INK` [0.65,0,0.35,1], `EASE_OUT` [0.23,1,0.32,1], `EASE_SNAPPY` [0.16,1,0.3,1] — match Glyph Ink house |
| Default wipe | 1.4s cinematic (marketing) |
| Settled (do not re-litigate) | Tip 72→82 / 86→92; `CROSS_START` 0.38; no full-number ghost; indigo `#8B9BFF`; reduced-motion → sealed end; canvas mid-wipe 0.55 |

## Findings

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | 7 Cohesion / 3 Physicality | `MetricSeal.tsx` ~71, ~448–476 | Bloom stays at `BLOOM_OPACITY` 0.32 after seal — solid + bloom double-expose the sealed figure | Fade bloom opacity to 0 for `p ≥ 0.85` (or onComplete ≤160ms `EASE_OUT`); rest state = one ink layer |
| 2 | HIGH | 1 Purpose / 8 Missed | `~68`, `~289–303`, `~412–413` | Late-count path paints `startLabel` under the ink for progress `< 0.72`. Demo `from=0` → soft tip reveals `0+` / `0%` / `$0.0M`, then digit thrash — wipe no longer seals the metric | Masked text = `finalLabel` until `COUNT_START`; then from→to in the late window only. If `from === 0`, never paint zero under ink |
| 3 | MEDIUM | 3 Physicality | `~63–64`, `~379–387` | Seal finish `sealScale.set(1.012)` then animate to 1 = discontinuous pop; densify already carries the seal | Drop scale settle **or** animate `1 → 1.012 → 1` with `EASE_OUT` ≤180ms without a hard set; prefer bloom extinguish + opacity lock as the seal |
| 4 | MEDIUM | 2 Easing | `~289–299` | Count remaps linear in wipe-progress space, so digits inherit `EASE_INK` mid-body crawl in the last 28% | In late window, map count with local `EASE_OUT` (or `t*t*(3-2*t)`) independent of wipe ease; keep wipe on `EASE_INK` |
| 5 | LOW | 7 Cohesion | `~90–94`, elevate delays | Cinematic default 1.4s is ~3× Glyph Ink cinematic enter (0.48s); reads sluggish next to family peers | Cap default / cinematic scale so wipe lands ~0.9–1.1s; keep buyer Duration control max 8s |

### Missed opportunities (additive)

- **Bloom strength couple** — higher bloom early (wet tip), fade as tip hardens (not a flat 0.32).
- **Tip rim without second text layer** — amplify mask mid-stop alpha only (one glyph layer) if bloom text still feels double.
- **Post-seal digit settle** — optional ≤200ms from→to *after* wipe completes when buyers want CountUp; wipe stays hero.

### Explicitly not findings

- Tip soft→hard constants (Glyph parity — settled)
- Full-number ghost under wipe (rejected)
- `once: true` / no Auto Demo (locked preference)
- Marketing wipe >300ms (AUDIT allows explanatory)

## Improve first

**Finding 1** — Bloom extinguish. Without a clean sealed rest state, tip/count polish still looks muddy.

---

**Stop.** Which IDs become `plans/` plans? Recommend **`1+2`** (bloom + label path), then **`3`**. Say e.g. `1+2`, `1+2+3`, or `plan all`.
