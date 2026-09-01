# Improve UI — Reveal Tooltip (Home + tip content)

**Date:** 2026-08-08  
**Surface:** Straightforward Engineers `/` Desktop (`WQLkyLRf1`) + Product Well tip instances  
**Commit:** `4aa0cbc`  
**Focus:** estética + **utilidad** (no a11y, no motion)

## Design language

- Audited surface: Home Desktop sell stage — Eyebrow `D8m6EV91D` → Product Well `xxuQXOZ0m` (Tip Top `bxRuu8FjR` / Tip Bottom `Wqzz8XQ2I`) → Caption `CUNzYETqq`; component content controls on those instances
- Design sources: live canvas attributes (exec 2026-08-08); `scripts/framer/revealtip-home.mjs` (author of current chrome + controls); `design-plans/marketplace-desktop-stage.md` (Marketplace one-composition + product framing convention — cited only where presentation contradicts within this surface)
- Documented decisions: Dual-mode specimen (Smooth top / Pixel bottom) with Force Open Off; Desktop `#0A0A0A` 1200×900
- Governing owners and consumers: Home chrome RichText + instance `content.*` controls; component defaults in `code-components/RevealTooltip.tsx` only when they reach Home via unset props
- Explicit exceptions: None documented

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Product Well contradicts itself on **utility**: Tip Top sells a real tip verb; Tip Bottom sells FX documentation | Tip Top `label: "Follow on X"` / body craft notes; Tip Bottom `label: "Pixel reveal"` / `description: "Solid cells assemble, then content fades in."` (canvas controls + `revealtip-home.mjs` 92–96). Same well, same buyer task. | Set Tip Bottom to a real tip (e.g. title `New drop`, body one useful line); keep `reveal: "pixel"` / follow / media. Modes differ by motion props only. | Home Tip Bottom `content` (+ optional Tip Top twin content) | High |
| 2 | Caption frames a **sandbox preview**, not the product job | Caption text `Preview · hover the triggers` while Eyebrow brands `REVEAL TOOLTIP` and Tip Top already states a site verb — Desktop reads as unfinished tooling and product at once | Replace caption with one JTBD sentence that names the use (e.g. social / icon tips with two reveal crafts) — not “Preview” | Home Caption `CUNzYETqq` | High |
| 3 | At rest, both triggers are identical dark discs — dual-mode specimen does not advertise which tip is which | Tip Top / Tip Bottom both 44×44, same look colors; no mode labels under the well; only post-hover content differs | Add two muted mode labels under the well (`Smooth` / `Pixel`) or short captions under each trigger — chrome only, no `.tsx` | Home Product Well / new RichText | Medium |

## Improve first

**#1** — Highest utility leverage. Half the specimen teaches “how the pixels work” instead of “what you put this on a site for.” Fix tip copy first; then #2 caption; #3 only if feel-check still confuses modes.

## Dropped

- Flat `#0A0A0A` / missing liquid-grain atmosphere — sibling SKU plans (`epic-marketplace-atmosphere.md`) do not govern this project; would invent stage intent.
- Kern `#060606` vs `#0A0A0A` — `KERN_THUMBNAIL_STYLE.md` governs `/thumbnail`, not Home.
- Missing Clash Display title — WaveDotLink stage plan is not a contract for this surface.
- Stock tip image / Inter defaults — no binding design decision forbidding them on this SKU.
- Missing Link control — behavior/API, not visual presentation (out of improve-ui scope).

---

*Read-only. Stop — select findings for `design-plans/NNN-*.md`.*
