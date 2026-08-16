# Arbour — auditoría tipo reviewer de Framer Marketplace

**Preview:** [https://arbour.framer.website](https://arbour.framer.website)  
**Corrección en Framer:** prompts en [framer-agent-prompts/](framer-agent-prompts/) · restante [REMAINING.md](framer-agent-prompts/REMAINING.md)  
**Esta pasada:** 16 agosto 2026, ~18:17–18:22 UTC (`Last-Modified` Home: `Sun, 16 Aug 2026 18:17:47 GMT`)  
**Pasada anterior:** misma fecha, ~16:30 UTC  
**Método:** checklist oficial Framer (Help 7 ago 2026) + Chrome 148 (1440 / 768 / 390), crawl HTTP, overlay, DOM, anchos de `section` vs viewport, revisión visual.

---

## 0. Delta vs ~16:30 UTC

| Hallazgo 16:30 | Ahora (~18:17) |
|---|---|
| Home → `/neighbourhoods/chelsea` **404** | **Sigue 404.** Único interno roto del crawl |
| Neighbourhoods flaco: blurbs + conteos falsos (`5 PROPERTIES` / `001`) | **Lleno:** grid 2×2, copy de calle, **2 / 2 / 1 / 1** honestos, featured (Cheyne, Ladbroke, Frognal, Bibury) → property, CTA → `/properties` |
| Properties/Neighbourhoods section BG **1080px** (rieles 180px); stats **1200** | **Cerrado.** Properties bands (incl. charcoal stats) **1440** full-bleed. Neighbourhoods hero **1440**; directory inner **72px** (como Home) |
| Notes salta `[ 05 ]`; Home waiting `[ 06 ]` vs artículo `[ 04 ]` | Sigue el hueco **05**. Home waiting ahora **`[ ]` vacío** (peor) |
| `lang` vacío, favicon default, hover muerto, `header: 0` | Igual |
| Overlay tels/socials, EST. 1999, coords únicas, waiting con cuerpo | Igual (bien) |

**Scorecard ~7.6 → ~8.0 / 10.** Layout y Neighbourhoods suben. El 404 de Home impide Featured.

---

## 1. Cómo valora Framer hoy (oficial)

Framer **no puntúa ni aprueba templates a mano**. *“Templates can be published without manual review.”* Ranking + moderación (views, likes, remixes, previews, purchases, account health). Checklist: Originality, Design, Layout, Text, Responsive, Links, CMS, Code, Effects, Assets, Tags, Accessibility, Performance, Copyright, Community, Support.

Fuentes: [template-requirements](https://www.framer.com/template-requirements/), [publish](https://www.framer.com/help/articles/how-to-publish-a-template/), [ranking](https://www.framer.com/help/articles/how-template-ranking-works/), [a11y](https://www.framer.com/help/articles/guide-to-web-accessibility-in-framer/). Contraste AA **4.5:1**.

---

## 2. Histórico de review (ya no es gate)

Hasta Framer 3.0: 3 breakpoints, 404, CMS único, cero overflow, `lang`, favicon, OG, hover, semántica. Plugins 0–100 **no son Framer**.

---

## 3. Veredicto

**No Featured.** El índice de territories ya parece una página de template; Properties ya pinta el fondo al borde. El listing sigue siendo reportable mientras Home enlace a un 404.

| Categoría | 16:30 | Ahora | Por qué |
|---|---|---|---|
| Originality | 8.0 | 8.0 | |
| Design | 8.0 | 8.0 | Favicon default. 404 custom bien |
| Layout | 6.5 | **8.0** | Full-bleed alineado a Home. Neighbourhoods ya no es columna 1080 |
| Text | 7.5 | **7.5** | Directory honesto. Home journal `[ ]` vacío. Notes salta 05 |
| Responsive | 8.5 | 8.5 | Cero overflow 6×3 |
| Links | 5.5 | **5.5** | **`/neighbourhoods/chelsea` 404**. Hover sin cambio |
| CMS | 8.0 | 8.0 | Coords/rooms/waiting. Número Home no bindea |
| Effects | 7.5 | 7.5 | |
| Assets | 7.5 | 7.5 | Cheyne/Bibury OK. Resto de alts genéricos |
| Tags | 6.0 | 6.0 | `lang` vacío. `header: 0` marketing |
| Accessibility | 6.0 | 6.0 | Form labels. Scrim hero pendiente |
| Copyright | 6.5 | 6.5 | |
| **Media auditables** | **~7.6** | **~8.0 / 10** | **Changes requested. No Featured.** |

---

## 4. Mapa del sitio

| Ruta | HTTP | Nota |
|---|---|---|
| `/` | 200 | Territories CTA → `/neighbourhoods/chelsea` **404** |
| `/properties` + 6 slugs | 200 | Coords por ítem; sections 1440 |
| `/neighbourhoods` | 200 | 4 cards, counts 2/2/1/1, featured reales |
| `/neighbourhoods/chelsea` (+ notting-hill, hampstead, cotswolds) | **404** | |
| `/notes` + 7 slugs | 200 | Waiting con cuerpo `[ 04 ]` |
| `/notes/:Jd2WAsZn3`, mews | 404 custom | Correcto |
| `/about` `/contact` | 200 | Form + leftover Privacy |
| `/this-page-does-not-exist-xyz` | 404 custom | *A fine address, quietly misplaced.* |

Notes: façade featured; `[01]` second viewing; `[02]` row house; `[03]` rain; `[04]` waiting; **falta 05**; `[06]` instructing; `[07]` Colville.

---

## 5. Hallazgos

### Blocker

#### B1. Home → `/neighbourhoods/chelsea` 404

Help: *“Broken or inactive links have been removed.”*  
El índice `/neighbourhoods` existe. Las 4 cards del índice van a `/properties`. El CTA de Home Territories no.

**Fix:** retarget a `/neighbourhoods` o `/properties`. Cero `/neighbourhoods/{slug}`. No crear páginas nuevas.

---

### Major (abiertos)

#### M1. Numeración Notes / Home journal

`[ 07 ENTRIES ]` pero **01, 02, 03, 04, 06, 07**. Home waiting: **`[ ]`** (número vacío). El artículo es `[ 04 ]`.

#### M2. SEO settings

`html lang` vacío. Favicon `default-favicon-light.v1.png`. OG presente. Alts: Cheyne/Bibury específicos; Frognal/Ladbroke/Royal/Colville = “Property hero photograph”.

#### M3. Hover

`EXPLORE →` / `VIEW ALL →` / `VIEW ALL NOTES →`: color `rgb(84, 98, 45)` sin cambio de opacity/decoration/transform.

---

### Cerrados esta pasada (antes Major)

- **Neighbourhoods vacío.** Grid 2×2, copy, counts honestos, featured + CTA. Página ~4500px.  
- **Section BG inset 180px.** Properties charcoal **1440**. Neighbourhoods hero **1440**, contenido **72px**.

---

### Minor

- Marketing `header: 0`. Un H1: cumple. Display 84/88.2 ≈ 1.05.  
- Hero Home: blanco sobre cielo.  
- Contact: *“DEMO TEMPLATE — REPLACE THIS NOTE WITH YOUR PRIVACY POLICY BEFORE PUBLISHING.”* Form Name/Email/Property interest/Message con labels.  
- Overlay Mayfair `+44 20 7946 0810`, socials demo. EST. 1999.  
- Neighbourhoods alts genéricos (“Neighbourhood territory photograph”). CTAs del directory → `/properties` sin prefiltro AREA.

---

## 6. Lo que está bien

404 custom. Cero overflow. Waiting 200 + cuerpo. Featured Home 01–03 + VIEW. Coords/rooms únicos. Heroes Cheyne/Bibury. Form Contact. OG. Overlay contact data. Neighbourhoods con stock honesto. Full-bleed de Properties alineado a Home.

---

## 7. Punch list

1. Quitar `/neighbourhoods/chelsea` del Home.  
2. Notes 01–07; bind número del journal Home (no `[ ]`).  
3. `lang=en`, favicon, alts de properties restantes.  
4. Hover/pressed; Phone sin hover.  
5. `header` tags; scrim hero; quitar leftover Privacy.  
6. (Opcional) AREA preseleccionada desde Neighbourhoods CTA.  
7. Performance panel + Lighthouse (humano).

---

## 8. Evidencia

`screenshots/`: home 1440/768/390, `neighbourhoods-desktop` (directory mid-scroll), tablet/mobile, properties, Cheyne/Bibury, nav overlay, waiting, 404, `neighbourhoods-chelsea-404-desktop`.

Nota: `fullPage` de Framer en Neighbourhoods sale casi vacío (transform); el contenido está — captura a `scrollY ≈ 900`.

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
