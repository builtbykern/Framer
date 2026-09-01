# Scroll Blur motion plans

## Executed (2026-07-19)

| # | Status | Change |
|---|--------|--------|
| 015 | DONE | `useInView` — pause Follow Scroll + skip layers off-screen |
| 016 | DONE | Settle default **280ms** + “idle delay, not a fade” |
| 017 | DONE | 2 layers when Strength ≤ 4, else 4 |
| 018 | SKIP | Covered by 016 |

## Settled contract

- Show/hide via **`visibility` only**
- Never opacity / isolation / clip-path on blur layers
- Strength max **10**
- No scrim
