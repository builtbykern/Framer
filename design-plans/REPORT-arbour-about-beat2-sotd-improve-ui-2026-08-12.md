# Improve UI — About Beat 2 (Arbour / SOTD bar)

- **Date:** 2026-08-12
- **Commit:** `4aa0cbc`
- **Skills:** `improve-ui` · `audit-ui-identity` (lens) · `baseline-ui` (density/air only)
- **Surface:** `/about` · Beat 2 — Cinematic Image (`SbkA8xJAz`)
- **User selection:** all findings at Arbour + SOTD bar → **plans 177–179**

---

## Design language

- Audited surface: Beat 2 Ink stage + Image Editorial Overlay + meta strip
- Design sources: `docs/projects/arbour.md`; About sibling sections; canvas screenshots `tmp/beat2-{d,t,p}.png`
- Documented decisions: T/P pad X 40/16; pause Y 96/72/48; D content 90%
- Governing owners: `SbkA8xJAz` → `WZkTO3vdm` → `QQiiFaHAX` (EditorialReveal) + `rwwNROs8R` / ScrollCue
- Explicit exceptions: None documented

---

## Plans (execute in order)

| # | Plan | Outcome | Confidence |
|---|------|---------|------------|
| 1 | [`177-about-beat2-overlay-padx-tp.md`](177-about-beat2-overlay-padx-tp.md) | T/P overlay pad X 40/16 | high |
| 2 | [`178-about-beat2-overlay-pady-pause.md`](178-about-beat2-overlay-pady-pause.md) | Overlay padY → pause 96/72/48 (compose X with 177) | high |
| 3 | [`179-about-beat2-phone-meta-dossier.md`](179-about-beat2-phone-meta-dossier.md) | Phone meta = horizontal dossier + cue air 16 | medium–high |

**Executor:** `framer-external` (Cursor-only `applyChanges`). Do not edit `Arbour_EditorialReveal` source unless 178 clip forces a size control tweak on the **instance**.

**Execute order:** `177` → `178` (single SET per overlay with final pad string) → `179` → `verify.mjs`.

---

## Out of scope (not Arbour/SOTD contracts)

- Adding a photographic “cinematic image” layer (section name ≠ design contract)
- Rebrand / new tokens
- Code-component refactors
