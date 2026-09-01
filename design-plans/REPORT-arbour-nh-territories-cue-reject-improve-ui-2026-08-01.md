# Improve UI — Arbour NH Territory cards (VIEW cue strip rejection)

- **Date:** 2026-08-01
- **Commit:** `4aa0cbc`
- **Skill:** `improve-ui` (read-only; no Framer / product edits)
- **Surface:** `/neighbourhoods` → Territory Card `i56eWdACt` + `Arbour_TerritoryHoverMedia` (`nMMl08t` / instance `z2kRrpzAZ`)
- **User evidence:** Explicit rejection — cue strip is “horror” aesthetically; not SOTD / not Arbour
- **Runtime proof:** Canvas session Arbour; photo `hX5NduSNi` height `428px` (D) / `348px` (T/P); component contains `.arbour-thm__cue` Paper band (`padding: 18px 20px 22px`, `justify-content: space-between`); prior overlay class `.arbour-thm__view` removed (`overlayGone: true`)

---

## Design language

- Audited surface: `/neighbourhoods` Directory → Territory Card (photograph media → Paper dossier)
- Design sources:
  - `docs/projects/arbour.md` — Territory Cards: **image-led** + HoverMedia; Meta **`VIEW →` on media**; Dossier **Paper + hairline**; Chartreuse accent; CTA → `/properties`
  - `docs/projects/arbour/LISTING.md` — “calm, precise, not tech-demo”; Paper & Ink system
  - Sibling exemplar: `Arbour_PropertyCard.tsx` — Meta `VIEW` **on the media plane** (light type over photo), not a Paper footer shelf
  - Prior accepted image-led / SOTD plans (canvas history): photo band full-bleed → dossier; VIEW as media Meta
- Documented decisions: Image-led vertical card; Hero↔Map hover cycle + zoom on media; VIEW Meta on media; dossier owns Paper; one accent (Chartreuse)
- Governing owners and consumers: `Arbour_TerritoryHoverMedia` + Territory Card template (D/T/P); sibling Properties cards as Meta-on-media exemplar
- Explicit exceptions: None documented for a Paper cue strip between photograph and dossier

---

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Photograph is no longer image-led: a Paper **cue strip** sits under the media inside HoverMedia, splitting the photo plane and inserting UI chrome between hero and dossier | **Contract:** `arbour.md` — Meta `VIEW →` **on media**; image-led card. **Runtime:** `.arbour-thm` is `flex-direction: column` with `.arbour-thm__cue` Paper band; photo frame grown to `428px`/`348px` to host the strip; user rejects as non-SOTD/non-Arbour. **Correction:** Restore full-bleed media root (no cue column). Put Meta `VIEW →` back **on the media** as a quiet overlay (PropertyCard-class Meta), with hover limited to opacity + slight arrow nudge — not a Paper shelf | TerritoryHoverMedia + photo heights D/T/P | high |
| 2 | Two consecutive Paper surfaces (cue strip + dossier) read as a labeled toolbar, not one editorial dossier | **Contract:** Dossier owns Paper + hairline; photograph is media. Listing tone: calm estate, not tech-demo. **Runtime:** `$control__cueBG` → Paper token; dossier `backgroundColor` Paper; cue padding `18–22px` creates a second Paper band. **Correction:** Remove cue background entirely; keep bottom air only via dossier padding (already `… 40px` / `36px`) — do not invent a second Paper owner | HoverMedia cue removal; dossier padding preserved | high |
| 3 | `VIEW` + Chartreuse `→` in `space-between` toolbar layout contradicts the Properties Meta pattern | **Contract / exemplar:** PropertyCard places Meta `VIEW` on media (inline Meta type over photo), not left-label / right-arrow chrome. **Runtime:** `.arbour-thm__cue` uses `justify-content: space-between`, Ink label + accent arrow at opposite edges. **Correction:** Single inline Meta string `VIEW →` (or label + arrow as one cluster, bottom-left on media), Chartreuse on the whole Meta or arrow only — never full-width justify toolbar | HoverMedia VIEW markup/CSS only | high |

## Improve first

**#1** — Restoring Meta **on media** and killing the Paper cue strip is the root fix: it re-aligns the card with the documented image-led contract and the PropertyCard exemplar; #2 and #3 collapse once the strip is gone.

---

¿Cuáles convierto en planes? (`1` / `1+2` / `all`)

Nota para el executor (cuando elijas): preservar la intención “aire abajo + flecha que se anima en hover”, pero **dentro** del contrato Arbour — aire = padding del dossier; animación = Meta overlay en media (no franja Paper).
