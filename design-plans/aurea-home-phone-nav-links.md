# Show Home Phone text nav links

Written against: `4aa0cbc`

## Evidence chain

- Surface: Strong Luxury / Aurea Home `/` · Phone breakpoint `IwdhW0PKT` · Page Stage `IwdhW0PKTXCnmX0_xB` · `Aurea Text Nav` `IwdhW0PKTfx_MrEXNC`
- Problem: Phone hero chrome shows AUREA only. Rituals / Journal / Contact are hidden. Desktop and Tablet show those three links. Home Overlay Nav instance `wbYBYGaP0` is also `visible="false"`, so Phone has no header nav until the footer.
- Design evidence: `docs/projects/aurea-copy.md` chrome nav AUREA · RITUALS · JOURNAL · CONTACT. Rendered `hero-d` / `hero-t` show the three links; `hero-p` does not. Runtime: `IwdhW0PKTV4CSfJUIl` `visible="false"`; Desktop `V4CSfJUIl` and Tablet `J5oev3dzjV4CSfJUIl` visible.
- Owner: Nav Links frame `V4CSfJUIl` · Phone replica `IwdhW0PKTV4CSfJUIl`
- Scope and affected surfaces: Home Phone only
- Uncertainty: Phone stage is 390px. Desktop Nav Links rect width is 252px; Phone nav pad is 20px + 20px; logo is auto. 252 + ~47 + 40 < 390, so unhide should fit with existing `stackDistribution="space-between"`. If it overflows or wraps, stop (do not invent a hamburger or unhide Overlay in this plan).

## Design decision

Unhide Phone `Nav Links` so Home Phone uses the same text-nav owner as Desktop and Tablet. Do not enable Overlay Nav on Home. Do not change type, gap, or padding in this plan.

## Reuse

- Owner: `Aurea Text Nav` / `Nav Links` already on Home Desktop and Tablet
- Exemplar: Tablet `J5oev3dzjV4CSfJUIl` (visible, same three links)
- Visibility inverse of unused Home sections: this node should be visible, like Tablet

If a new primitive is required: none. Do not add Overlay or a menu icon in this plan.

## Changes

1. Home `/` · Phone Page Stage nav
   - Change: `SET IwdhW0PKTV4CSfJUIl visible="true";` with `pagePath: "/"`. Rebound Strong Luxury; `node scripts/framer/exec.mjs -s 2`.
   - Preserve: Phone nav bar `IwdhW0PKTfx_MrEXNC` width 390px, height 68px, pad `0px 20px`, `stackDistribution="space-between"`; logo `IwdhW0PKTLS90FfVvl`; link targets `/rituals` `/journal` `/contact`; Desktop/Tablet nav; Overlay instance `wbYBYGaP0` stays hidden; hero photo; type.
   - Verify: `getNode` Phone Nav Links `visible` not false. Screenshot `IwdhW0PKTXCnmX0_xB` — AUREA left, RITUALS JOURNAL CONTACT right, no overlap with the hero title. `getRect` on `IwdhW0PKTV4CSfJUIl` width ≤ remaining bar (stage 390 minus pad minus logo).

## Scope

- Inherit: none (Phone replica only)
- Verify: Tablet and Desktop nav unchanged; footer Phone links still work
- Exclude: Overlay Nav; type/gap/pad changes; JOIN THE CIRCLE; Four Principles 04; glow; publish

## Validation

- Product: Phone visitor can open Rituals, Journal, Contact from the Home header.
- Interface: Home Phone 390. Also spot-check that hero title `A house / of modern / ritual.` is not covered.
- System: Same Nav Links stack as Tablet.
- Repository: rebound Strong Luxury then `node scripts/framer/verify.mjs -s 2` → `{ "ok": true }`. Do not publish.

## Stop conditions

- Stop if unhiding overflows the 390px bar, wraps onto the title, or collides with logo. Do not reduce font size or gap in this plan — report and wait.
- Stop if Phone nav links are a different node than `IwdhW0PKTV4CSfJUIl`.
- Stop if session is not `32N5ipHfkUMlPJAI6dc7`.

## Design documentation

- After acceptance: none.

## Executor constraints (baseline-ui)

- No new animation or overlay.
- Do not change letter-spacing or font size to make it fit.
- One SET: Phone Nav Links visibility.
