# Arbour — Full template re-audit (post A–D)

**Date:** 2026-07-17  
**Project:** [Arbour](https://framer.com/projects/Arbour--CmRyHJKPrPE6BZhC6d4S-iP6EP) (`CmRyHJKPrPE6BZhC6d4S`)  
**Mode:** site + components (read-only)  
**Session:** `3`  
**Baseline:** [2026-07-17-arbour-full-template-audit.md](./2026-07-17-arbour-full-template-audit.md)  
**Artifacts:** `state/last-audit.json`, `state/full-template-ui-scan.json`  
**Live:** https://arbour.framer.website (published `b19ddba99`)

No Canvas edits in this pass.

---

## Resumen

| Área | Antes (audit A–D) | Ahora |
| --- | --- | --- |
| Freehand `→` marketing | 14 desktop | **0** (solo `/404` cinematic ×3 bp) |
| UnderlineLink CTAs | 4 masters parciales | **13 masters** (+ réplicas) Olive/Cream tokens + hrefs OK |
| P0 dead/wrong links | 3 | **0** |
| Content bands `128 48 128 48` | 25 | **25** |
| Residual `120` bands | 0 “content 120/48/120” | **2** excepciones (About Beat 1; Property detail) |
| Chrome Nav+Footer | OK excepto 404 | **Igual** (404 sin chrome) |
| Footer Notes | Ausente | **Presente** → `/notes` (D/T/P) |
| Code components | 0 críticos | **0** críticos (22 files) |
| Publish | Production | Live + `optimizationStatus: error` |

**Veredicto:** Batches A–D cerraron los P0/P1 de CTA/links. Quedan polish de tokens (Footer Ink ID truncado, Olive hard RGB en detail) y ruido de sistema (code file legacy, estilos Light/Dark, optimize error).

---

## Regressions check (A–D)

| Check | Result |
| --- | --- |
| Neighbourhoods `START A CONVERSATION →` UL → `/contact` | Pass `WdwTrRo4j` |
| Properties `EXPLORE THE TERRITORIES →` UL → `/neighbourhoods` | Pass `gAOwaKVbo` |
| Contact `WRITE PRIVATELY →` UL mailto | Pass `BMhLvwqld` |
| Contact / Home `VIEW ALL NOTES →` UL → `/notes` | Pass |
| Notes `THE ARBOUR STORY →` UL Cream → `/about` | Pass `TERtNoUYH` |
| About `SPEAK WITH US →` UL → `/contact` | Pass `qU1PSkRMG` |
| Fake `SUBSCRIBE →` freehand wrappers | Gone |
| Contact PrimaryButton `VIEW ALL NOTES` | Gone |
| Footer `Notes` → `/notes` | Pass `qAqWkEULy` |
| FormButtons Home/Contact/Journal | Present |

---

## Inventario por página

### `/` Home
- Nav + Footer; FormButton newsletter OK  
- UL: `EXPLORE →`, `VIEW ALL →`, `VIEW →` (×3 contexts), `VIEW ALL NOTES →` — Olive token  
- Sin freehand `→`

### `/properties-2`
- UL `EXPLORE THE TERRITORIES →` → `/neighbourhoods`  
- Sin freehand `→`

### `/neighbourhoods`
- UL `START A CONVERSATION →` → `/contact`  
- Sin freehand `→` (P0 anterior cerrado)

### `/notes`
- UL `THE ARBOUR STORY →` Cream On Dark → `/about`  
- PrimaryButton `Load more` (Racing Deep) — rol sólido OK

### `/about`
- UL `SPEAK WITH US →` → `/contact`  
- Beat 1 opener `120 48 48 48` — **excepción documental** (rich opener)

### `/contact`
- UL `WRITE PRIVATELY →` + `VIEW ALL NOTES →`  
- FormButton only (sin freehand SUBSCRIBE ni PrimaryButton duplicado)

### `/404`
- Sin Nav/Footer  
- Freehand `RETURN TO ARBOUR →` cream; parent link `/` — **excepción cinematic**

### `/properties-2/:Properties`
- Chrome OK; bands mayormente 128  
- Residual `120 48 112 48` en un frame  
- Labels/kickers Olive **hard RGB** (back chip, section tags) — no token

### `/notes/:Journal`
- FormButton OK; ArticleCard tokens OK  
- Category label Olive hard RGB (× bp)

---

## Design system (live)

- **CMS:** 4 collections (Neighbourhoods 4, Agents 4, Properties 6, Journal 7)  
- **Colors:** 18 (Arbour + Chartreuse + legacy Light/Dark)  
- **Text presets:** 7 Arbour  
- **Code:** 22 files — `Arbour_EditorialReveal.tsx` en canvas; `Arbour_EditorialReveal_1.tsx` **sin uso**

**Owners (sin cambio):**
- Text CTA → UnderlineLink + Olive (Cream on dark)  
- Solid → PrimaryButton / FormButton  
- Chrome → Nav/Footer Ink  
- Excepciones → Home hero; `/404`; About Beat 1; CMS media heroes

---

## Inconsistencias priorizadas

### P0 — romper utilidad / coherencia
*Ninguno.*

### P1 — corregir pronto

| ID | Qué | Dónde | Nota |
| --- | --- | --- | --- |
| P1-1 | Footer Ink token ID truncado | Footer nav links `var(--token-e2f9a9eb-0000-…)` | Real Ink = `e2f9a9eb-668a-4021-80d9-b04413b5f392`. Riesgo de color no-resuelto. |
| P1-2 | Publish `optimizationStatus: error` | Production + staging | Site publicado; optimizar/revisar en Framer hosting |

### P2 — polish / documentar

| ID | Qué | Nota |
| --- | --- | --- |
| P2-1 | About Beat 1 `120 48 48 48` | Excepción intencional — no forzar a 128 |
| P2-2 | Property detail pad `120 48 112 48` | Alinear a 128 band si se unifica enquiry |
| P2-3 | Olive hard RGB en Property detail + Journal category | Migrar a Olive token (mismo rol que Batch C) |
| P2-4 | Footer label `Navigate` Olive hard RGB | Label no-link; OK o token |
| P2-5 | `/404` freehand RETURN | Excepción cinematic — OK |
| P2-6 | `Arbour_EditorialReveal_1` code file huérfano | Borrar o archivar tras confirmación |
| P2-7 | Color styles legacy Light/Dark/Text* | Ruido; no borrar sin mapear |
| P2-8 | Chartreuse token poco/no referenciado en scan | Kickers usan Olive hard / cream; token Chartreuse puede quedar de acento |

---

## Code components

| Check | Resultado |
| --- | --- |
| Heurísticas críticas | **Pass** (0 flags) |
| EditorialReveal en canvas | `Arbour_EditorialReveal` (About) |
| EditorialReveal_1 | Solo code file — unused |

---

## Propuesta de siguiente paso (uno)

**Batch E — token hygiene (bajo riesgo):**
1. Corregir Footer (y réplicas) `textColor` → Ink token completo `e2f9a9eb-668a-…`  
2. Property detail + Journal category: Olive hard RGB → Olive token  
3. Opcional: borrar `Arbour_EditorialReveal_1.tsx` si confirmas  
4. Revisar `optimizationStatus: error` en publish panel

No editar hasta confirmación.
