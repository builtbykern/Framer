# Scroll Blur — quality uplift vs ProgressiveBlur

Stamp: post ProgressiveBlur-parity rewrite  
Project: Scroll Blur (`70Gz3ecNjl8yGIatVfz0`) · code `yC_uQFE`

## Gaps closed (this pass)

| # | Sev | Problem | Fix |
| --- | --- | --- | --- |
| 1 | HIGH | Soft custom masks ≠ ProgressiveBlur banded stack | Edge uses ProgressiveBlur `transparent→black→transparent` bands |
| 2 | HIGH | `px` blur looked harsh / different | Exponential `rem` formula: `2^(p*4)*0.0625*strength` |
| 3 | HIGH | Full-frame veil washed content | `Coverage` % stack pinned to edge (default 55%) |
| 4 | MEDIUM | Scrim + visibility snap felt cheap | Removed; fade `opacity` on same nodes as `backdrop-filter` |
| 5 | MEDIUM | scrollend restarted enter → flicker | Idle refresh only; no forced re-enter |

## Feel-check

1. Mode **Always On** — banded rem blur like ProgressiveBlur; tune Strength ~1.0–1.4, Coverage ~50–60%.
2. Mode **Follow Scroll** — open **Preview**, scroll; veil eases in (~200ms) and dissolves after Settle.
3. Shape **U** — cupped mouth still present on rem stack.

## Verify

Executor already ran `node scripts/framer/verify.mjs` after push.
