# Arbour — auditoría tipo reviewer de Framer Marketplace

**Preview:** [https://arbour.framer.website](https://arbour.framer.website)  
**Corrección en Framer:** prompts del Agent interno en [framer-agent-prompts/](framer-agent-prompts/)  
**Esta pasada:** 16 agosto 2026, ~16:30–16:37 UTC (`Last-Modified` del HTML)  
**Pasada anterior:** misma fecha, ~15:27 UTC  
**Método:** checklist oficial Framer (Help 7 ago 2026) + Chrome 148 (1440 / 768 / 390), crawl HTTP, overlay, DOM (lang, favicon, OG, alts, tags), anchos de `section` vs viewport, revisión visual.

---

## 0. Delta vs ~15:27 UTC

| Hallazgo ~15:27 | Ahora (~16:30) |
|---|---|
| Home featured `( 01 ) ( 02 ) ( 02 )`; solo Cheyne tenía VIEW → | **`( 01 ) ( 02 ) ( 03 )`**. Las tres cards tienen VIEW → |
| Waiting sin cuerpo | **Cuerpo real** (3 párrafos). Detail number **`[ 04 ]`** |
| Contact: Marylebone estático sin link | Cards CMS: row-house `[ 02 ]` + waiting `[ 04 ]`, con href |
| Coords `51.5074 · CHELSEA` en las 6 fichas | **Únicas:** Cheyne Chelsea `51.4876`, Frognal Hampstead `51.5587`, Bibury Cotswolds `51.7590`, Ladbroke/Colville Notting Hill, Royal Avenue Chelsea |
| Cheyne = vestíbulo de mármol; Bibury = georgiano blanco | Cheyne = **Támesis / St Paul’s**; Bibury = **honey-stone**. Alts específicos en esos dos |
| Home territories → `/properties` | Home “SEE RESIDENCES IN THIS AREA” → **`/neighbourhoods/chelsea` → 404** (nuevo blocker) |
| Neighbourhoods index: 4 blurbs | Sigue siendo **poco denso** vs Home. Desktop: directory con hueco. Mobile: 4 fotos. Conteos mienten (`5 PROPERTIES` / `001 PROPERTIES`) |
| Home sections full-bleed 1440 | **Properties / Neighbourhoods** inset **180px** (secciones 1080). Stats oscuras de Properties a **1200** (gutters 120px) |

**Scorecard ~7.0 → ~7.6 / 10** si no fuera por el 404 nuevo. Con el 404 de Home, **Links baja otra vez**. Sigue sin Featured.

---

## 1. Cómo valora Framer hoy (oficial)

Framer **ya no puntúa ni aprueba templates a mano antes de publicar**.

| Pregunta | Respuesta oficial |
|---|---|
| ¿Hay review previo? | **No.** *“Templates can be published without manual review.”* |
| ¿Hay nota numérica? | **No existe.** |
| Qué sustituye | Moderación + ranking (views, comments, likes, remixes, previews, purchases, account health). Algoritmo privado. |
| Qué tumba un listing | Copiado, misleading, roto, low-quality. |

Checklist oficial: Originality, Design, Layout, Text, Responsive, Links, CMS, Code, Effects, Assets, Tags, Accessibility, Performance, Copyright, Community, Support.

Fuentes: [template-requirements](https://www.framer.com/template-requirements/), [publish a template](https://www.framer.com/help/articles/how-to-publish-a-template/), [ranking](https://www.framer.com/help/articles/how-template-ranking-works/), [a11y](https://www.framer.com/help/articles/guide-to-web-accessibility-in-framer/), contraste WCAG AA **4.5:1** / **3:1** grande.

---

## 2. Histórico de review (ya no es gate)

Hasta Framer 3.0 rechazaban por ejecución: 3 breakpoints, 404, CMS único, cero overflow, `lang`, favicon, OG, hover/pressed, semántica. Plugins 0–100 **no son Framer**.

---

## 3. Veredicto

**No Featured.** El pack anterior cerró CMS gordo (waiting, coords, heroes, featured 01–03). Esta pasada introduce un **404 en Home** y deja dos fallos de layout que el comprador ve al instante: **Neighbourhoods vacío/estrecho** y **fondos de sección que no llegan al borde** en Properties / Neighbourhoods (Home sí).

Si se publicara hoy: pasa la cola (no hay cola). Un reviewer lo devolvería por el enlace roto y por el índice de territories como página “a medias”.

| Categoría | ~15:27 | Ahora | Por qué |
|---|---|---|---|
| Originality | 8.0 | 8.0 | Nicho intacto |
| Design | 8.0 | 8.0 | Favicon default. 404 custom bien |
| Layout | 8.0 | **6.5** | Neighbourhoods/Properties inset 180px; directory flaco; Home sí full-bleed |
| Text | 6.5 | **7.5** | Featured 01–03 OK. Notes salta **05**. Privacy leftover. Conteos de territories mienten |
| Responsive | 8.5 | 8.5 | Cero overflow 6×3 |
| Links | 7.5 | **5.5** | **Home → `/neighbourhoods/chelsea` 404**. Hover sigue muerto |
| CMS | 6.5 | **8.0** | Coords/rooms/waiting body. Numeración Notes incompleta |
| Effects | 7.5 | 7.5 | |
| Assets | 6.0 | **7.5** | Cheyne/Bibury coinciden. Resto de alts genéricos |
| Tags | 6.0 | 6.0 | `lang` vacío. `header: 0` en marketing |
| Accessibility | 6.0 | 6.0 | Form labels. Lang/contraste hero |
| Copyright | 5.5 | 6.5 | Heroes más honestos |
| Performance / listing / support | n/d | n/d | |
| **Media auditables** | **~7.0** | **~7.6*** | \*sin el 404 sería ~8.0. **Con el 404: no Featured** |

---

## 4. Mapa del sitio

| Ruta | HTTP | Nota |
|---|---|---|
| `/` | 200 | CTA territories → `/neighbourhoods/chelsea` **404** |
| `/properties` + 6 slugs | 200 | Coords por ítem |
| `/neighbourhoods` | 200 | 4 cards → `/properties`. Página corta |
| `/neighbourhoods/chelsea` (y notting-hill, hampstead, cotswolds) | **404** | Ruta anunciada, página no existe |
| `/notes` + 7 slugs reales | 200 | Waiting tiene cuerpo |
| `/notes/:Jd2WAsZn3`, mews | 404 custom | Correcto |
| `/about` `/contact` | 200 | |
| `/this-page-does-not-exist-xyz` | 404 custom | *A fine address, quietly misplaced.* |

Notes published (7): façade featured; `[01]` second viewing; `[02]` row house; `[03]` Notting Hill rain; `[04]` waiting; **falta `[05]`**; `[06]` instructing; `[07]` Colville. Home journal waiting **sigue `[06]`** (desfasado del detail `[04]`).

---

## 5. Hallazgos

### Blocker

#### B1. Home enlaza a un neighbourhood que no existe

Home → Territories → **SEE RESIDENCES IN THIS AREA** → `https://arbour.framer.website/neighbourhoods/chelsea` → **404 custom**.

Help: *“Broken or inactive links have been removed.”*

No hay collection/detail de territories. El índice `/neighbourhoods` sí existe y sus 4 cards van a `/properties`.

**Fix:** no crear 4 páginas nuevas. Retarget ese CTA a `/neighbourhoods` (ancla al directory) o a `/properties` con AREA Chelsea si el filtro lo permite. Cero href a `/neighbourhoods/{slug}`.

---

### Major

#### M1. Neighbourhoods se siente vacío (Layout + Text + CMS)

Vs Home (territories + 3 featured + process + stats + awards + testimonials + journal), `/neighbourhoods` es: hero + 4 blurbs + un párrafo “How we read a place.” + dos CTAs.

Desktop: label **THE DIRECTORY** y un hueco grande; las 4 cards están en el DOM (alto ~611px) pero el ritmo no llena el canvas. Mobile sí enseña foto + título + párrafo.

Copy de conteo **falsa**: pill “5 PROPERTIES AVAILABLE” en Chelsea (hay **2** en stock: Cheyne Walk + Royal Avenue). Labels `001 PROPERTIES IN THIS AREA` son índices, no counts.

**Fix (en la página existente, sin rutas nuevas):** cuatro módulos densos al ancho de Home — foto full-bleed del módulo, coords reales, 2–3 frases de calle, **conteo honesto** (Chelsea 2, Notting Hill 2, Hampstead 1, Cotswolds 1), una residencia destacada de esa área, CTA “See residences in this area” → `/properties`. Añadir un bloque de método más corto o un street-note por territorio para que la página no muera a los dos scrolls.

#### M2. Fondos de sección no ocupan el ancho de la web (Layout)

Medido a 1440:

| Página | Ancho de `section` con fondo | Gutters |
|---|---|---|
| Home | **1440** full-bleed | 0. Contenido ~72px |
| About, Contact, Notes (bloques tintados) | 1440 | 0 |
| **Neighbourhoods** | **1080** | **180 + 180** |
| **Properties** | **1080** (stats oscuras **1200**) | **180** / **120** |

En Home el charcoal/cream llega al borde. En Properties el bloque stats `rgb(28, 27, 22)` deja **rieles cream** a los lados. Neighbourhoods es una columna estrecha sobre el mismo cream — se lee “página a medias”.

Help Layout: stacks/grids flexibles; evitar que el layout se desordene al cambiar contenido. El inner measure debe ser **el mismo en todas las páginas** (~72px desktop como Home), y el **background de cada section Fill / 100% del canvas**. No 180px de padding en el frame que pinta el color.

#### M3. Numeración Notes (CMS + Text)

`[ 07 ENTRIES ]` pero cards **01, 02, 03, 04, 06, 07** — salta **05**. Home waiting aún muestra `[ 06 ]` mientras el artículo es `[ 04 ]`.

#### M4. SEO settings

`html lang` **vacío**. Favicon **default-favicon-light.v1.png**. OG **sí**. Alts: Cheyne/Bibury bien; el resto de properties sigue “Property hero photograph”.

#### M5. Hover

`EXPLORE →` / `VIEW ALL →` / `VIEW ALL NOTES →`: color/opacity/decoration/transform **sin cambio** al hover. `rgb(84, 98, 45)` estático.

---

### Minor

- Marketing pages `header: 0` (Notes CMS `header: 1`). Un H1 por página: cumple.  
- Display 84 / 88.2 ≈ 1.05. Space Mono 11px en meta.  
- Hero Home: blanco sobre cielo; scrim pendiente.  
- Contact: *“DEMO TEMPLATE — REPLACE THIS NOTE WITH YOUR PRIVACY POLICY BEFORE PUBLISHING.”* (ya no es el TODO anterior, sigue siendo leftover). Sin ruta `/privacy`.  
- Form Contact presente (Name/Email/Property interest/Message + labels). Success/error no verificados al submit.  
- Overlay: Mayfair `+44 20 7946 0810`, socials demo. Sin `@builtbykern`. EST. 1999.

---

## 6. Lo que está bien

- 404 custom. Cero overflow 1440/768/390.  
- Waiting 200 con artículo. Mews unpublished.  
- Featured Home 01–03 + VIEW en las tres.  
- Coords y rooms únicos. Heroes Cheyne/Bibury alineados al brief.  
- Form + overlay contact data. OG por página. Fraunces + Space Mono, cream, overlay.

---

## 7. Punch list (esta pasada)

1. Quitar `/neighbourhoods/chelsea` del Home (404).  
2. Llenar `/neighbourhoods` en la página existente (módulos densos, counts honestos).  
3. Section BG **siempre 100% del viewport**; contenido inner **igual que Home (~72px)** en Properties, Neighbourhoods, Notes, About, Contact.  
4. Notes 01–07 sin hueco; Home journal number = CMS.  
5. `lang=en`, favicon, alts de properties.  
6. Hover/pressed; Phone sin hover.  
7. `header` tags; scrim hero; quitar leftover Privacy.  
8. Performance panel + Lighthouse (humano).

---

## 8. Evidencia

`screenshots/` de esta pasada: `home-desktop|tablet|mobile`, `neighbourhoods-desktop|tablet|mobile`, `properties-desktop`, Cheyne/Bibury, `nav-open-desktop`, waiting, 404, `neighbourhoods-chelsea-404-desktop`.

---

## 9. Límites

Canvas (layers, styles, reduced-motion, Lighthouse, listing) no se certifica desde `.framer.website`. Filtro AREA: el custom select de Framer no se cerró en el harness.

---

## Fuentes

1. https://www.framer.com/template-requirements/  
2. https://www.framer.com/help/articles/how-to-publish-a-template/  
3. https://www.framer.com/help/articles/how-template-ranking-works/  
4. https://www.framer.com/help/articles/guide-to-web-accessibility-in-framer/  
5. https://www.framer.com/help/articles/understanding-contrast-ratio/  
