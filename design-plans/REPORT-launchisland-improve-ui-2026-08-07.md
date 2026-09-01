# improve-ui — Launch Island

Written against: `4aa0cbc` · 2026-08-07  
Surface: Marketplace code component `Launch Island` (`code-components/LaunchIsland.tsx`) + Home sell `/` on project `DHpXX5xCoGaJHmRQfN0m`.

## Design language

- Audited surface: Launch Island detent shells (compact / transient / expanded / live) + Home Stage/Dock presentation
- Design sources: `docs/superpowers/specs/2026-08-07-launch-island-design.md` (accepted product locks + craft bar); `docs/projects/listings/KERN_THUMBNAIL_STYLE.md` (house `#060606` + accent `#6FD3FF`); Kern solid-ink exemplars `HoldConfirm.tsx` (`background: "#060606"`, inset rim) and `MorphDropdown.tsx` (`background: "#0F0F0F"` solid — no frosted shell); Contact Dock glass is a documented **orb** exception, not the island shell contract
- Documented decisions: Countdown Live Activity; expand = pure time zoom; craft bar requires **material chronograph digits**; Kern Marketplace ink ground `#060606`; sell copy must be product truth (prior Kern improve-ui reports)
- Governing owners and consumers: `LaunchIsland.tsx` defaults + `addPropertyControls`; Home chrome via `scripts/framer/launchisland-home.mjs`
- Explicit exceptions: None documented for Launch Island glass-default

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Shell reads as generic frosted glass, not Kern / Apple-DI opaque ink | Contract: Spec craft bar does not mandate frosted glass; Kern island exemplars are solid ink (`HoldConfirm` `#060606`, `MorphDropdown` `#0F0F0F`); house ground is `#060606` (`KERN_THUMBNAIL_STYLE.md`). Runtime: `glass` defaults `true` with `backdropFilter: blur(22px) saturate(1.35)` + wash gradient; `background` default `#0A0A0A` (`LaunchIsland.tsx` ~194–243, controls ~548–568); Home forces `glass: true` (`launchisland-home.mjs` ~112–116). User: lacks BuiltByKern / SOTD level. | Default `glass=false`; default `background="#060606"`; rebuild shell as opaque ink with HoldConfirm-style inset rim (`inset 0 1px 0 rgba(255,255,255,0.06)`) + hairline border; keep `glass` as optional opt-in, not the sell default. Sync Home controls. | `LaunchIsland.tsx` shell surface + defaults + Home instance controls | high |
| 2 | Expanded chronograph is flat type, not material digits | Contract: Spec craft bar — “Material chronograph digits in expanded” (`2026-08-07-launch-island-design.md`). Exemplar material language: HoldConfirm inset rim + edge sheen, not bare spans. Runtime: `Unit` = plain `fontSize: 24` spans + CSS `:` colons; seconds only differ by `foreground={accent}` (`LaunchIsland.tsx` `Unit` ~127–178, expanded block ~365–396). | Replace colon-separated spans with four digit wells (inset fill, hairline separators, tabular lining); equal unit hierarchy; accent reserved for live/transient status, not “loudest seconds”. | Expanded chronograph layout inside `LaunchIsland.tsx` only | high |
| 3 | Home Stage title contradicts countdown product state | Contract: Kern sell captions/titles = product truth for the live figure (prior improve-ui: no mismatched phase/jargon; Morph/Metric reports). Runtime: Stage Title = `The drop is live` while island defaults to countdown compact (`launchisland-home.mjs` ~83–85 vs controls `previewMode: "compact"`). | Retitle Stage to countdown truth, e.g. `Before the drop` (or `Drop soon`); keep muted caption as one product line about glanceable countdown. | Home Stage Title (+ optional Caption) via `launchisland-home.mjs` | high |

### Candidates rejected

- Transient glow / live pulse as “not SOTD” — no binding visual contract beyond “pulse”; correction would invent spring values; belongs to phase-3 motion, not improve-ui visual contract
- Compact L/R Apple DI asymmetry — research pattern, not an accepted Launch Island design decision; inventing layout intent
- Hierarchy/density of compact row without stronger contract — needs dedicated rendered stills beyond user level complaint already covered by #1–2
- Accessibility / focus rings — out of scope unless requested

## Improve first

**Finding 1** — Opaque Kern ink shell (vs default frosted glass on `#0A0A0A`) is the single highest-leverage identity fix; chronograph material (#2) and Home title (#3) still read cheap on a glass blob.

---

**Executed** (2026-08-07): plans 1→2→3 applied in `LaunchIsland.tsx` + `launchisland-home.mjs`; push `typeErrors: []`; verify ready.

1. `design-plans/2026-08-07-launch-island-opaque-ink-shell.md` — DONE
2. `design-plans/2026-08-07-launch-island-material-chronograph.md` — DONE
3. `design-plans/2026-08-07-launch-island-home-title.md` — DONE
