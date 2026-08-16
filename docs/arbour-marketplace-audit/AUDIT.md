# Arbour — auditoría tipo reviewer de Framer Marketplace

**Preview:** [https://arbour.framer.website](https://arbour.framer.website)  
**Corrección en Framer:** prompts en [framer-agent-prompts/](framer-agent-prompts/) · restante [REMAINING.md](framer-agent-prompts/REMAINING.md)  
**Esta pasada:** 16 agosto 2026, verificación ~20:42 UTC sobre el mismo HTML (`Last-Modified` Home: `Sun, 16 Aug 2026 20:30:42 GMT`)  
**Pasada anterior:** misma fecha, crawl ~20:30 UTC  
**Método:** checklist oficial Framer (Help 7 ago 2026) + Chrome 148 (1440 / 768 / 390), crawl HTTP, overlay, DOM, anchos de `section` vs viewport, revisión visual.

---

## 0. Corrección vs crawl 20:30

El preview **no se republicó** (mismo `Last-Modified` 20:30:42). El crawl midió mal el hero: el H1 sigue cream, pero **sí hay scrim**.

| Ítem que el 20:30 marcó abierto | Live 20:42 |
|---|---|
| Scrim hero | **Cerrado.** Layers `Hero Bottom Gradient` (`transparent` 40% → black 50%), `Meta Contrast Scrim`, `Vignette` |
| Notes `[ 05 ]` / Home waiting `[ ]` | **Sigue abierto.** Featured façade sin número; lista 06, 01, 02, 04, 03, 07. Home: `[ ] — 09 MAY 2026 — … The case for waiting.` Artículo = **04** |
| Hover `EXPLORE →` | **Sigue abierto en el publicado.** Con `:hover` true, opacity/decoration/transform no cambian. Hay un span hijo `opacity 0.35` + `scaleX 0` (underline preparado) que **no** pasa a 1 |
| Favicon default | **Igual** |

**Scorecard ~8.8.** Scrim contaba. **Fuera de alcance (decisión de producto):** favicon custom, numeración Notes 01–07 consecutiva. El único Agent job que sigue siendo Marketplace (Links / hover) está en [REMAINING.md](framer-agent-prompts/REMAINING.md).

---

## 1. Cómo valora Framer hoy (oficial)

Framer **no puntúa ni aprueba templates a mano**. *“Templates can be published without manual review.”* Ranking + moderación (views, likes, remixes, previews, purchases, account health). Checklist: Originality, Design, Layout, Text, Responsive, Links, CMS, Code, Effects, Assets, Tags, Accessibility, Performance, Copyright, Community, Support.

Fuentes: [template-requirements](https://www.framer.com/template-requirements/), [publish](https://www.framer.com/help/articles/how-to-publish-a-template/), [ranking](https://www.framer.com/help/articles/how-template-ranking-works/), [a11y](https://www.framer.com/help/articles/guide-to-web-accessibility-in-framer/). Contraste AA **4.5:1**.

---

## 2. Histórico de review (ya no es gate)

Hasta Framer 3.0: 3 breakpoints, 404, CMS único, cero overflow, `lang`, favicon, OG, hover, semántica. Plugins 0–100 **no son Framer**.

---

## 3. Veredicto

**Casi listo.** Ya no hay 404 enlazado. Favicon default y huecos 01–07 **no son gate** (ver §5). El hueco que sí entra en el checklist oficial de Links es el hover publicado.

| Categoría | 20:42 | Ajuste | Por qué |
|---|---|---|---|
| Originality | 8.0 | 8.0 | |
| Design | 8.0 | **8.5** | Favicon default = polish, no requirement 2026 |
| Layout | 8.0 | 8.0 | |
| Text | 7.5 | **8.5** | Números = labels editoriales (stats, process, journal). No hace falta 01–07 corrido |
| Responsive | 8.5 | 8.5 | |
| Links | 7.5 | 7.5 | Hover publicado sin cambio visual |
| CMS | 8.0 | **8.5** | Contenido único. Índice Notes no es un serial obligatorio |
| Effects | 7.5 | 7.5 | |
| Assets | 8.5 | 8.5 | |
| Tags | 8.0 | 8.0 | |
| Accessibility | 7.5 | 7.5 | |
| Copyright | 6.5 | 6.5 | |
| **Media auditables** | **~8.8** | **~9.0 / 10** | Hover publicado. Favicon/serial Notes fuera. |

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

Notes: façade featured sin número; lista 06 / 01 / 02 / 04 / 03 / 07 — **labels, no serial.**

---

## 5. Hallazgos

### Blocker

Ninguno. El 404 enlazado de Home está cerrado.

---

### Major (abiertos)

#### M1. Hover publicado

`EXPLORE →` (con `:hover` true): opacity/decoration/transform no cambian. Span hijo `opacity 0.35` + `scaleX 0` no pasa a 1. Checklist Links: hover/active definidos.

---

### Fuera de alcance (no Agent)

- **Favicon.** Help enseña cómo ponerlo; [template-requirements](https://www.framer.com/template-requirements/) 2026 **no** lo exige. Era gate del review Framer 3.0. Default = polish de tab, no ranking.
- **Notes 01–07 corrido.** Los números del template son labels editoriales (`01 SOLD`, process 01–04, `[ 07 ENTRIES ]`, featured 01–03). Un featured sin índice y una lista 06/01/02/04/03/07 no es un fail. **No** gastar `/cms` en rellenar el 05.
- Home `[ ]` en waiting: si el slot de número se queda, se lee vacío. No hace falta alinear con 04. Ocultar el número si está vacío es opcional, no un serial.

---

### Cerrados esta verificación

- **Scrim Home:** `Hero Bottom Gradient`, `Meta Contrast Scrim`, `Vignette`.

Cerrados antes: `header` marketing, Home 404 enlazado, `lang=en`, 4 alts, leftover Privacy, Neighbourhoods fill, full-bleed.

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

404 custom. Cero overflow. Waiting 200 + cuerpo. Featured Home 01–03 + VIEW. Coords/rooms únicos. Heroes + alts. Form Contact. OG. `lang=en`. Overlay contact data. Neighbourhoods honesto. Full-bleed. Marketing `header`. **Scrim hero.** Cero links a `/neighbourhoods/{slug}`. Mews unpublished.

---

## 7. Punch list

1. Hover/pressed en `EXPLORE →` / `VIEW ALL →` / `VIEW ALL NOTES →` (span underline en `scaleX 0`).  
2. (Opcional) Ocultar el número del card Home si renderiza `[ ]`. No rellenar 01–07.  
3. (Opcional) Favicon custom — no es requirement.  
4. Performance panel + Lighthouse (humano).

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
