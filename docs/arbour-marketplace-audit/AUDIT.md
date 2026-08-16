# Arbour — auditoría tipo reviewer de Framer Marketplace

**Preview:** [https://arbour.framer.website](https://arbour.framer.website)  
**Corrección en Framer:** prompts en [framer-agent-prompts/](framer-agent-prompts/) · restante [REMAINING.md](framer-agent-prompts/REMAINING.md)  
**Esta pasada:** 16 agosto 2026, ~20:30–20:33 UTC (`Last-Modified` Home: `Sun, 16 Aug 2026 20:30:42 GMT`)  
**Pasada anterior:** misma fecha, ~20:18 UTC  
**Método:** checklist oficial Framer (Help 7 ago 2026) + Chrome 148 (1440 / 768 / 390), crawl HTTP, overlay, DOM, anchos de `section` vs viewport, revisión visual.

---

## 0. Delta vs ~20:18 UTC

| Hallazgo 20:18 | Ahora (~20:30) |
|---|---|
| Marketing `header: 0` (`nav: 1`) | **Cerrado.** Home / Properties / Neighbourhoods / Notes index / About / Contact / property details: **`header: 1`**. Notes detail: `header: 2`. 404 sigue sin header (aceptable). `nav: 0` en reposo (el overlay no cuenta cerrado) |
| Notes salta `[ 05 ]`; Home waiting `[ ]`; artículo **04** | **Igual** |
| Hover muerto; favicon default; scrim hero (H1 `rgb(252, 250, 244)`) | **Igual** |
| Home CTA → `/properties`; `lang=en`; 4 alts; Privacy fuera; directory 2/2/1/1 | Igual (bien) |

**Scorecard ~8.5 → ~8.7 / 10.** Landmark de marketing cerrado. Sigue sin Featured: CMS number, hover, favicon, contraste del hero.

---

## 1. Cómo valora Framer hoy (oficial)

Framer **no puntúa ni aprueba templates a mano**. *“Templates can be published without manual review.”* Ranking + moderación (views, likes, remixes, previews, purchases, account health). Checklist: Originality, Design, Layout, Text, Responsive, Links, CMS, Code, Effects, Assets, Tags, Accessibility, Performance, Copyright, Community, Support.

Fuentes: [template-requirements](https://www.framer.com/template-requirements/), [publish](https://www.framer.com/help/articles/how-to-publish-a-template/), [ranking](https://www.framer.com/help/articles/how-template-ranking-works/), [a11y](https://www.framer.com/help/articles/guide-to-web-accessibility-in-framer/). Contraste AA **4.5:1**.

---

## 2. Histórico de review (ya no es gate)

Hasta Framer 3.0: 3 breakpoints, 404, CMS único, cero overflow, `lang`, favicon, OG, hover, semántica. Plugins 0–100 **no son Framer**.

---

## 3. Veredicto

**No Featured.** Ya no hay un 404 enlazado. El hueco es calidad de listing (CMS number, hover, favicon, scrim).

| Categoría | 20:18 | Ahora | Por qué |
|---|---|---|---|
| Originality | 8.0 | 8.0 | |
| Design | 8.0 | 8.0 | 404 custom bien. Favicon default |
| Layout | 8.0 | 8.0 | Full-bleed y directory se mantienen |
| Text | 7.5 | 7.5 | Home journal `[ ]`. Notes salta 05 |
| Responsive | 8.5 | 8.5 | Cero overflow 6×3 |
| Links | 7.5 | 7.5 | 404 enlazado cerrado. Hover sigue sin cambio |
| CMS | 8.0 | 8.0 | Número Home no bindea. Façade sin 05 |
| Effects | 7.5 | 7.5 | |
| Assets | 8.5 | 8.5 | Cuatro héroes con alt específico |
| Tags | 7.0 | **8.0** | `lang=en`. Marketing `header: 1` |
| Accessibility | 6.5 | 6.5 | Form labels. Scrim hero pendiente |
| Copyright | 6.5 | 6.5 | |
| **Media auditables** | **~8.5** | **~8.7 / 10** | **Changes requested. No Featured.** |

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

#### M3. Favicon + scrim

Favicon `default-favicon-light.v1.png`. H1 Home blanco `rgb(252, 250, 244)` sobre cielo — scrim no aplicado.

---

### Cerrados esta pasada

- Marketing **`header: 1`** (Home, Properties, Neighbourhoods, Notes index, About, Contact, property details).

Cerrados antes: Home 404 enlazado, `lang=en`, 4 alts, leftover Privacy, Neighbourhoods fill, full-bleed.

---

### Minor

- Notes detail ahora `header: 2` (duplicado de landmark). 404 sin header.
- `nav: 0` con el overlay cerrado.
- Neighbourhoods alts genéricos (“Neighbourhood territory photograph” / “Territory”). CTAs del directory → `/properties` sin prefiltro AREA.
- Display 84 / 88.2 ≈ 1.05.
- Overlay Mayfair `+44 20 7946 0810`, socials demo. EST. 1999.
- Home: 4 `alt` vacíos (decorativos posibles).

---

## 6. Lo que está bien

404 custom. Cero overflow. Waiting 200 + cuerpo. Featured Home 01–03 + VIEW. Coords/rooms únicos. Heroes + alts. Form Contact. OG. `lang=en`. Overlay contact data. Neighbourhoods honesto. Full-bleed. Marketing `header`. Cero links a `/neighbourhoods/{slug}`. Mews unpublished.

---

## 7. Punch list

1. Notes: façade = **05**; bind número del journal Home (no `[ ]`).  
2. Hover/pressed en `EXPLORE →` / `VIEW ALL →` / `VIEW ALL NOTES →`.  
3. Scrim solo en hero de Home.  
4. Favicon: humano (no pedir un mark al Agent).  
5. (Opcional) AREA preseleccionada; alts de territories.  
6. Performance panel + Lighthouse (humano).

---

## 8. Evidencia

`screenshots/`: home 1440/768/390, `neighbourhoods-desktop` (directory `scrollY ≈ 900`), tablet/mobile, properties, Cheyne/Bibury, nav overlay, waiting, 404, `neighbourhoods-chelsea-404-desktop`.

Crawl: `/tmp/arbour-audit/reaudit-2030.json`.

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
