# Arbour — Full template audit

**Date:** 2026-07-17  
**Project:** [Arbour](https://framer.com/projects/Arbour--CmRyHJKPrPE6BZhC6d4S-iP6EP) (`CmRyHJKPrPE6BZhC6d4S`)  
**Mode:** site + components (read-only)  
**Session:** `2`  
**Artifacts:** `state/last-audit.json`, `state/full-template-ui-scan.json`

No Canvas edits in this pass.

---

## Resumen

| Área | Estado |
| --- | --- |
| Sitemap | 9 routes (7 marketing + 2 CMS detail + 404) |
| CMS | 4 collections — Neighbourhoods 4, Agents 4, Properties 6, Journal 7 |
| Estilos | 18 color styles (incl. Chartreuse + legacy Light/Dark); 7 text presets Arbour |
| Code components | 22 files — **0** heuristic críticos (export / annotations / fixed / unguarded window) |
| Chrome | Nav+Footer en todas las páginas excepto `/404` (intencional) |
| Spacing bands | **25** content bands a `128px 48px 128px 48px`; **0** residuales `120/48/120` |
| CTAs UnderlineLink | 4 masters (Home×3 + About×1) Olive token |
| CTAs freehand `→` | **14** instancias (desktop) sin UnderlineLink |
| Publish | Production + staging: `https://arbour.framer.website` (optimized) |

---

## Inventario por página

### `/` Home
- **Chrome:** Nav + Footer  
- **Secciones:** Loading, SmoothScroll, Atmosphere, Hero, Territories (+ TerritoryRail), Portfolio, Bottom/process, Recognition, Testimonial, Journal (+ ArticleCard), Footer  
- **UL CTAs:** `EXPLORE →`, `VIEW ALL →`, `VIEW →` (Olive token)  
- **Issues:** freehand chartreuse `VIEW ALL →` / `VIEW →`; freehand Olive `VIEW →` / `VIEW ALL NOTES →`; cream `SUBSCRIBE →`

### `/properties-2`
- Nav + Footer; Properties Content + PropertyCards (18 incl. breakpoints)  
- Freehand `EXPLORE THE TERRITORIES →` (Olive hard RGB)  
- Chartreuse kickers `( RESIDENCE )`, `[ MARKET ]…`  
- Hero Copy pad alineado `72/48/56/48`

### `/neighbourhoods`
- Nav + Footer; Hero + Territory grid  
- Freehand `START A CONVERSATION →` (Olive **token**, Meta) — **sin `link` en nodo ni CTA Wrap** (P0 funcional/UI)

### `/notes`
- Nav + Footer; Journal grid (21 ArticleCard incl. bp) + Manifesto dark  
- Freehand `THE ARBOUR STORY →` (Ink Soft en Racing Deep) → `/about`  
- PrimaryButton `Load more` Racing Deep fill

### `/about`
- Nav + Footer; Beat 1/2/3, Principals, Offices, Enquiry  
- UL `SPEAK WITH US →` OK (Olive token → `/contact`)  
- Enquiry CTA pads responsive ya alineados en pases previos

### `/contact`
- Nav + Footer; Hero, Opening, Journal strip  
- Freehand `WRITE PRIVATELY →` (Olive token, mailto en padre)  
- Freehand `VIEW ALL NOTES →` → padre `L0IbNEUtc` href **`/about`** (destino sospechoso; debería ser `/notes`)  
- Freehand + FormButton `SUBSCRIBE →`  
- PrimaryButton `VIEW ALL NOTES →` (Racing Deep) — duplica rol con freehand

### `/404`
- Sin Nav/Footer (cinematic)  
- Freehand `RETURN TO ARBOUR →` cream; kicker chartreuse `[ 404 — OUT OF FRAME ]`

### `/properties-2/:Properties`
- Nav + Footer; Gallery, Setting, Particulars, Continue, Enquiry  
- Content bands 128; Enquiry T/P ya corregidos en pases previos  
- Chartreuse `( CONSIDERED DETAILS )`  
- Gallery images CMS-bound

### `/notes/:Journal`
- Nav + Footer; Hero image 520, body, More From Journal  
- FormButton `SUBSCRIBE →` cream on dark  
- ArticleCard related OK (Ink title)

---

## Design system (live)

**Colors (Arbour):** Paper, Parchment, Ink, Ink 60, Ink Soft, Olive, Racing, Racing Deep, Stone, Cream On Dark, Oxblood, Chartreuse + legacy Light/Dark/Text pairs.

**Text presets:** Display, Heading, Subhead, Body, Tags, Meta, Price.

**Accepted UI owners (from prior work):**
- Paper content band `128px 48px 128px 48px`
- Secondary Hero Copy `72/48/56/48`, gap `24`, mw `1200`
- Text CTA → `Arbour_UnderlineLink` + Olive token
- Solid CTA → PrimaryButton / FormButton
- Chrome → Nav/Footer Ink (not UnderlineLink)
- Exceptions → Home hero identity; `/404` cinematic; About Beat 1 rich opener; CMS media heroes

---

## Inconsistencias priorizadas

### P0 — romper coherencia o utilidad clara

| ID | Qué | Dónde | Nota |
| --- | --- | --- | --- |
| P0-1 | `START A CONVERSATION →` sin href | `/neighbourhoods` `au_6Wzj9T` / `eg7FHOTjH` | CTA visible no navega |
| P0-2 | `VIEW ALL NOTES →` apunta a `/about` | `/contact` `L0IbNEUtc` / `Q9ZpLaN5X`; Home `RzLXFj8LG` parent también `/about` | Destino incorrecto vs label |
| P0-3 | CTAs `→` Paper freehand vs UnderlineLink | Properties `EXPLORE THE TERRITORIES`; Contact `WRITE PRIVATELY`; Home `VIEW ALL NOTES` | Mismo rol que UL Olive; sin underline animado |

### P1 — coherencia visual / sistema

| ID | Qué | Dónde | Nota |
| --- | --- | --- | --- |
| P1-1 | Chartreuse en kickers/CTAs | Home VIEW chartreuse; Properties `( RESIDENCE )` / market; Property detail; 404 | Token Chartreuse existe; compite con Olive CTA owner |
| P1-2 | `THE ARBOUR STORY →` freehand en dark | `/notes` manifesto | Debería UL + Cream On Dark / Paper en Racing Deep |
| P1-3 | Duplicidad Contact journal CTAs | Freehand Meta + PrimaryButton ambos “VIEW ALL NOTES” | Unificar a un owner |
| P1-4 | Olive hard RGB vs Olive token | Home/Properties freehand arrows | Prefer token `a16d0333…` |
| P1-5 | ArticleCard title color hard Ink RGB | Notes/Home cards `rgb(28,27,22)` | Prefer Ink token |
| P1-6 | Contact ArticleCard meta `rgba(0,0,0,0.45)` | `/contact` Journal Card | Resto usa Ink Soft `rgba(28,27,22,0.55)` |

### P2 — menor / documentar

| ID | Qué | Nota |
| --- | --- | --- |
| P2-1 | `/404` freehand RETURN + chartreuse | Excepción cinematic — OK si se mantiene intencional |
| P2-2 | `SUBSCRIBE →` cream freehand / FormButton | Newsletter dark bands — familia distinta a UL Olive |
| P2-3 | Footer rail links `/properties-2/:slug` | Esperado CMS; nav footer sin `/notes` (¿gap de IA?) |
| P2-4 | Code comps sin `position:relative` literal en source | Scroll/util/buttons — 0 críticos Framer; revisar solo si QA falla |
| P2-5 | `Arbour_EditorialReveal_1` duplicado | Posible legacy; confirmar uso en canvas |
| P2-6 | Color styles legacy Light/Dark/Text* | Ruido en sistema; no borrar sin mapear consumidores |
| P2-7 | Property card image heights 320–470 | Variación editorial OK; no forzar uniformidad |

---

## Ya alineado (no reabrir)

- Content bands marketing/detail → `128` (0× `120` residual)
- Secondary Hero Copy Desktop pads/gaps (Properties/Notes/Hoods/Contact)
- Responsive Hero Copy Notes/Properties phone/tablet (pases previos)
- Contact Native Enquiry Desktop + T/P gap `24`
- About Enquiry Tablet pad `96` / Phone gap `24` / Opening Copy T/P gap `24`
- Property detail Enquiry Tablet/Phone
- UnderlineLink Home+About Olive **token**
- Journal back label Olive Meta (match Property)
- Code components: exports + layout annotations + no fixed / no unguarded window
- `/404` sin Nav/Footer (intencional)

---

## Code components

| Check | Resultado |
| --- | --- |
| Default export named function | Pass (todos Arbour_*) |
| Layout annotations | Pass |
| Fixed position | Pass (none) |
| Unguarded window | Pass |
| Property controls | Pass |
| Motion imports | 15 files — craft review opcional, no bloqueante |

---

## Propuesta de batches de fix (sin ejecutar)

### Batch A — P0 links/CTAs (recomendado primero)
1. Neighbourhoods: convertir `START A CONVERSATION →` → `Arbour_UnderlineLink` + href `/contact` (destino natural; confirmar)  
2. Corregir `VIEW ALL NOTES →` href → `/notes` (Home + Contact)  
3. Convertir Paper freehand arrows → UnderlineLink Olive token:  
   - `EXPLORE THE TERRITORIES →`  
   - `WRITE PRIVATELY →` (mailto)  
   - `VIEW ALL NOTES →` (tras fix href)

### Batch B — Dark + story
4. Notes `THE ARBOUR STORY →` → UnderlineLink cream/Paper on dark, href `/about`  
5. Decidir política Chartreuse: acento editorial OK en kickers **o** migrar a Olive/Cream On Dark

### Batch C — Cards / tokens
6. ArticleCard title/meta → Ink / Ink Soft tokens (incl. Contact meta)  
7. Hard Olive RGB → Olive token en freehand restantes

### Batch D — Cleanup
8. Contact: un solo CTA “VIEW ALL NOTES” (UL o Primary, no ambos)  
9. Inventario Footer: ¿añadir Notes?  
10. Auditar/retirar `EditorialReveal_1` si no se usa  
11. Publicar tras batches A–C

---

## Siguiente paso

Confirmar **Batch A** (o A+B) para ejecución Framer con `applyChanges`. No se ha modificado el Canvas en esta auditoría.

---

## Status — Batch A executed (2026-07-17, session 3)

| Item | Result |
| --- | --- |
| Neighbourhoods `START A CONVERSATION →` | `Arbour_UnderlineLink` `WdwTrRo4j` → `/contact` |
| Properties `EXPLORE THE TERRITORIES →` | UL `gAOwaKVbo` → `/neighbourhoods` |
| Contact `WRITE PRIVATELY →` | UL `BMhLvwqld` → `mailto:enquiries@arbour.estate` |
| Contact `VIEW ALL NOTES →` | UL `QWVo91x8O` → `/notes` (parent link cleared) |
| Home `VIEW ALL NOTES →` | UL `m6drid56u` → `/notes` (parent link cleared) |

Olive token text+underline, `line=1`, `offset=4`, `decorative=false`. Unpublished.

**Still freehand (Batch B/C):** Home chartreuse VIEW*, Notes `THE ARBOUR STORY →`, SUBSCRIBE cream CTAs.

---

## Status — Batch B executed (2026-07-17, session 3)

| Item | Result |
| --- | --- |
| Notes `THE ARBOUR STORY →` | UL `TERtNoUYH` → `/about`, Cream On Dark token |
| Home chartreuse `VIEW ALL →` duplicate | Removed (`tKeB3b0G4`); Olive UL `IdwyBx4Vz` remains |
| Home freehand `VIEW →` (overlay/small/side) | UL Olive → `/properties-2` (`CAdGD1vAP`, `f2fxMg6nz`, `LL2hvcJ80`) |
| Chartreuse kickers `( RESIDENCE )` / market / 404 | **Kept** as editorial accent (policy) |
| `SUBSCRIBE →` freehand | Deferred (newsletter / FormButton family) |

Unpublished.

---

## Status — Batch C executed (2026-07-17, session 3)

| Item | Result |
| --- | --- |
| ArticleCard title | Ink token (Home / Notes / Contact / Journal related) |
| ArticleCard meta | Unified `rgba(28, 27, 22, 0.55)` (Contact was `rgba(0,0,0,0.45)`) |
| ArticleCard kicker | Olive token |
| Hard Olive Meta labels | → Olive token (Home / Properties / Journal) |
| Chartreuse kickers | Unchanged |
| `SUBSCRIBE →` freehand | Still deferred |

Unpublished. Batches A–C complete.

---

## Status — Batch D executed + published (2026-07-17, session 3)

| Item | Result |
| --- | --- |
| Fake `SUBSCRIBE →` freehand in form stacks | Removed wrappers Home `mR9gjNTwW`, Contact `nhLK42sno`, Journal `TWq5eDhjm` (FormButtons remain) |
| Contact duplicate `VIEW ALL NOTES` PrimaryButton | Removed `WVGDuTUsd`; UL `QWVo91x8O` → `/notes` kept |
| Footer Notes link | Added `qAqWkEULy` → `/notes` (Desktop/Tablet/Phone) |
| Footer nav Ink | Route links → Ink token `e2f9a9eb…` |
| `Arbour_EditorialReveal_1` | Left in place (unused on canvas; no delete) |

**Published** to production: https://arbour.framer.website (version `b19ddba99`).
