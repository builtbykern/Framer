# Arbour — auditoría tipo reviewer de Framer Marketplace

**Preview:** [https://arbour.framer.website](https://arbour.framer.website)  
**Corrección en Framer:** prompts en [framer-agent-prompts/](framer-agent-prompts/) · restante [REMAINING.md](framer-agent-prompts/REMAINING.md)  
**Esta pasada:** 16 agosto 2026, ~19:16–19:19 UTC (`Last-Modified` Home: `Sun, 16 Aug 2026 19:16:32 GMT`)  
**Pasada anterior:** misma fecha, ~18:17 UTC  
**Método:** checklist oficial Framer (Help 7 ago 2026) + Chrome 148 (1440 / 768 / 390), crawl HTTP, overlay, DOM, anchos de `section` vs viewport, revisión visual.

---

## 0. Delta vs ~18:17 UTC

| Hallazgo 18:17 | Ahora (~19:16) |
|---|---|
| Home → `/neighbourhoods/chelsea` **404** (único interno roto) | **Cerrado.** CTA **SEE RESIDENCES IN THIS AREA** → `/properties`. Cero `href` a `/neighbourhoods/{slug}` en Home / Properties / Neighbourhoods / Notes / About / Contact. La URL suelta sigue 404 (aceptable) |
| `html lang=""` | **Cerrado.** `lang="en"` |
| Frognal / Ladbroke / Royal / Colville alt = “Property hero photograph” | **Cerrado.** Alts específicos en los 4 héroes |
| Contact leftover *DEMO TEMPLATE — … PRIVACY POLICY…* | **Cerrado.** No está en el HTML ni en el body |
| Notes salta `[ 05 ]`; Home waiting `[ ]` | **Igual.** Featured façade sin número; lista 06, 01, 02, 04, 03, 07. Home waiting sigue `[ ]`. Artículo waiting = **04** |
| Hover muerto, favicon default, marketing `header: 0`, scrim hero | **Igual.** Nota: **detail de Notes ya tiene `header: 1`**; Home / Properties / Neighbourhoods / Notes index / About / Contact / 404 siguen en 0 |
| Neighbourhoods lleno; full-bleed 1440; overlay demo; coords únicas | Igual (bien) |

**Scorecard ~8.0 → ~8.5 / 10.** El blocker de Links cayó. Sigue sin Featured: numeración CMS, hover, favicon, landmark en marketing, contraste del hero.

---

## 1. Cómo valora Framer hoy (oficial)

Framer **no puntúa ni aprueba templates a mano**. *“Templates can be published without manual review.”* Ranking + moderación (views, likes, remixes, previews, purchases, account health). Checklist: Originality, Design, Layout, Text, Responsive, Links, CMS, Code, Effects, Assets, Tags, Accessibility, Performance, Copyright, Community, Support.

Fuentes: [template-requirements](https://www.framer.com/template-requirements/), [publish](https://www.framer.com/help/articles/how-to-publish-a-template/), [ranking](https://www.framer.com/help/articles/how-template-ranking-works/), [a11y](https://www.framer.com/help/articles/guide-to-web-accessibility-in-framer/). Contraste AA **4.5:1**.

---

## 2. Histórico de review (ya no es gate)

Hasta Framer 3.0: 3 breakpoints, 404, CMS único, cero overflow, `lang`, favicon, OG, hover, semántica. Plugins 0–100 **no son Framer**.

---

## 3. Veredicto

**No Featured.** Ya no hay un 404 enlazado. El hueco es calidad de listing (CMS number, hover, favicon, `header` en páginas de marketing, scrim).

| Categoría | 18:17 | Ahora | Por qué |
|---|---|---|---|
| Originality | 8.0 | 8.0 | |
| Design | 8.0 | 8.0 | 404 custom bien. Favicon default |
| Layout | 8.0 | 8.0 | Full-bleed y directory se mantienen |
| Text | 7.5 | **7.5** | Privacy fuera. Home journal `[ ]`. Notes salta 05 |
| Responsive | 8.5 | 8.5 | Cero overflow 6×3 |
| Links | 5.5 | **7.5** | 404 enlazado cerrado. Hover sigue sin cambio |
| CMS | 8.0 | 8.0 | Coords/rooms/waiting. Número Home no bindea. Façade sin 05 |
| Effects | 7.5 | 7.5 | |
| Assets | 7.5 | **8.5** | Cuatro héroes con alt específico. Cheyne/Bibury OK |
| Tags | 6.0 | **7.0** | `lang=en`. Marketing `header: 0`. Notes detail `header: 1` |
| Accessibility | 6.0 | **6.5** | Lang + form labels. Scrim hero pendiente |
| Copyright | 6.5 | 6.5 | |
| **Media auditables** | **~8.0** | **~8.5 / 10** | **Changes requested. No Featured.** |

---

## 4. Mapa del sitio

| Ruta | HTTP | Nota |
|---|---|---|
| `/` | 200 | Territories CTA → `/properties`. Journal waiting `[ ]` |
| `/properties` + 6 slugs | 200 | Coords por ítem; sections 1440; alts de héroes OK |
| `/neighbourhoods` | 200 | 4 cards, counts 2/2/1/1, CTA → `/properties` |
| `/neighbourhoods/chelsea` (+ slugs de territory) | **404** | No enlazado desde páginas de marketing |
| `/notes` + 7 slugs publicados | 200 | Waiting con cuerpo **04**. Mews unpublished |
| `/notes/:Jd2WAsZn3`, `/notes/Jd2WAsZn3`, mews | 404 custom | Id solo en payload CMS, **cero `href`** |
| `/about` `/contact` | 200 | Form + labels. Sin leftover Privacy |
| `/this-page-does-not-exist-xyz` | 404 custom | *A fine address, quietly misplaced.* |

Notes: façade featured **sin número**; `[01]` second viewing; `[02]` row house; `[03]` rain; `[04]` waiting; **falta 05**; `[06]` instructing; `[07]` Colville.

---

## 5. Hallazgos

### Blocker

Ninguno. El 404 enlazado de Home está cerrado.

---

### Major (abiertos)

#### M1. Numeración Notes / Home journal

`[ 07 ENTRIES ]` pero featured façade **sin índice** y lista **06, 01, 02, 04, 03, 07**. Home waiting: **`[ ]`**. El artículo es **04**.

#### M2. Hover

`EXPLORE →` / `VIEW ALL →` / `VIEW ALL NOTES →`: sin cambio de opacity / decoration / transform. `VIEW ALL →` en cream sobre foto (`rgb(252, 250, 244)`).

#### M3. Favicon + landmark marketing + scrim

Favicon `default-favicon-light.v1.png`. Home / Properties / Neighbourhoods / Notes index / About / Contact: `header: 0` (el top bar es `nav`). H1 Home blanco `rgb(252, 250, 244)` sobre cielo — scrim no aplicado.

---

### Cerrados esta pasada (antes blocker / major)

- Home `/neighbourhoods/chelsea` **404**.
- `html lang=en`.
- Alts Frognal / Ladbroke / Royal / Colville.
- Leftover Privacy en Contact.

---

### Minor

- Neighbourhoods alts genéricos (“Neighbourhood territory photograph” / “Territory”). CTAs del directory → `/properties` sin prefiltro AREA.
- Display 84 / 88.2 ≈ 1.05.
- Overlay Mayfair `+44 20 7946 0810`, socials demo. EST. 1999.
- Home: 4 `alt` vacíos (decorativos posibles).

---

## 6. Lo que está bien

404 custom. Cero overflow. Waiting 200 + cuerpo. Featured Home 01–03 + VIEW. Coords/rooms únicos. Heroes Cheyne/Bibury + 4 alts nuevos. Form Contact. OG. `lang=en`. Overlay contact data. Neighbourhoods con stock honesto. Full-bleed Properties. Cero links a `/neighbourhoods/{slug}`. Mews unpublished. `Jd2WAsZn3` no es href.

---

## 7. Punch list

1. Notes: façade = **05**; bind número del journal Home (no `[ ]`).  
2. Hover/pressed en `EXPLORE →` / `VIEW ALL →` / `VIEW ALL NOTES →`.  
3. Tag `header` en el nav compartido de **marketing** (no rehacer Notes detail).  
4. Scrim solo en hero de Home.  
5. Favicon: humano (no pedir un mark al Agent).  
6. (Opcional) AREA preseleccionada; alts de territories.  
7. Performance panel + Lighthouse (humano).

---

## 8. Evidencia

`screenshots/`: home 1440/768/390, `neighbourhoods-desktop` (directory `scrollY ≈ 900`), tablet/mobile, properties, Cheyne/Bibury, nav overlay, waiting, 404, `neighbourhoods-chelsea-404-desktop`.

Crawl: `/tmp/arbour-audit/reaudit-1916.json`.

---

## 9. Límites

Canvas (layers, styles, reduced-motion, Lighthouse, listing) no se certifica desde `.framer.website`.

---

## Fuentes

1. https://www.framer.com/template-requirements/  
2. https://www.framer.com/help/articles/how-to-publish-a-template/  
3. https://www.framer.com/help/articles/how-template-ranking-works/  
4. https://www.framer.com/help/articles/guide-to-web-accessibility-in-framer/  
5. https://www.framer.com/help/articles/understanding-contrast-ratio/  
