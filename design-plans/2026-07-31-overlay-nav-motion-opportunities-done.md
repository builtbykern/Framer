# Overlay Nav motion opportunities — executed

Written against: `4aa0cbc` · executed 2026-07-31

## Applied (from find-animation-opportunities)

| # | Change | How |
| --- | --- | --- |
| 1 | Link group rise | Main Links padding `16px→1px` (+ Sub `10px→1px`); per-link opacity stagger kept; enter transitions on Open, faster exit on Closed |
| 2 | Media settle | Media Plate Closed `-36,-24 / 1272×848` → Open `0,0 / 1200×800` (~1.06), tween `0.77,0,0.175,1 0.9s 0.05s` |
| 3 | Burger press | `BurgerFlip` `whileTap scale 0.97` · `160ms` ease-out |
| 4 | Faster exit | Closed link transitions `~0.38s` delays `0–0.12s`; Open enter keeps `0.65s` + stagger |
| 5 | Link hover | **Skipped** — no durable RichText hover API via agent without inventing a parallel system |

## Note

Per-link `y` / Frame `scale` are not persisted by `@framer/agent` on relative stack text; padding + geometric media scale are the faithful substitutes within the canvas API.
