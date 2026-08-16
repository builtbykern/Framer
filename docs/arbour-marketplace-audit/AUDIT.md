# Arbour — auditoría tipo reviewer de Framer Marketplace

**Preview:** [https://arbour.framer.website](https://arbour.framer.website)  
**Fecha:** 16 agosto 2026  
**Alcance:** sitio publicado (no hay archivo `.framer` en este repo; no se pudo editar el proyecto).  
**Método:** checklist oficial de Framer + QA en Chrome (desktop 1440×900, tablet 768×1024, mobile 390×844), crawl de enlaces, overlay de navegación, filtros CMS y revisión visual.

---

## 1. Cómo valora Framer hoy (oficial)

Framer **ya no puntúa ni aprueba templates a mano antes de publicar**. Eso está escrito en la documentación, no es interpretación:

| Pregunta | Respuesta oficial |
|---|---|
| ¿Hay review previo? | **No.** El template se publica al enviar. *“Templates can be published without manual review.”* |
| ¿Hay nota numérica del reviewer? | **No existe.** No hay score 0–100 ni A–D de Framer. |
| ¿Qué sustituye a la review? | **Moderación + ranking.** El equipo pasa de aprobar colas a moderar featured, señales de ranking y calidad. |
| ¿Qué hace que un template “gane”? | Producto pulido + distribución. El ranking **no es un marcador permanente de quién es mejor**. |
| Señales de ranking (no ponderadas en público) | views, comments, likes, remixes, previews, purchases, account health y “otra actividad significativa”. El algoritmo exacto es privado. |
| Qué sí puede tumbar un listing | Copiado, misleading, roto, claramente low-quality. Cualquiera puede reportar; moderación actúa. |

Fuentes oficiales:

- [Template best practices](https://www.framer.com/template-requirements/) (`/template-requirements/` = mismo contenido que Help → Template best practices, actualizado 7 ago 2026)
- [How to publish a template](https://www.framer.com/help/articles/how-to-publish-a-template/)
- [How Marketplace ranking works](https://www.framer.com/help/articles/how-template-ranking-works/)
- [Why Marketplace is becoming part of Community](https://www.framer.com/blog/marketplace-new-framer-community/) — Jorn van Dijk, 16 jun 2026
- [Guide to web accessibility](https://www.framer.com/help/articles/guide-to-web-accessibility-in-framer/)
- [Understanding contrast ratio](https://www.framer.com/help/articles/understanding-contrast-ratio/) — WCAG 2.1 AA: **4.5:1** texto normal, **3:1** texto grande

Checklist oficial (estas son las “valoraciones” que Framer pide auto-aplicar). No son obligatorias, pero son el estándar con el que moderación y compradores juzgan:

1. Originality  
2. Design (incluye 404 custom + text/color styles)  
3. Layout  
4. Text  
5. Responsive  
6. Links (`mailto:` / `tel:`, hover/active, cero rotos)  
7. CMS  
8. Code  
9. Effects  
10. Assets  
11. Tags (semántica, headings, alt)  
12. Accessibility (title/description, contraste, labels)  
13. Performance  
14. Copyright  
15. Community (listing)  
16. Support  

Antes de publicar, Help también exige: testear browsers y tamaños, **arreglar bugs / broken links / performance**, y seguir best practices de layout, tipografía, spacing y responsive.

---

## 2. Qué decían reviewers y foros (histórico, ya no es gate)

Hasta Framer 3.0 la cola de review **rechazaba** por ejecución, no por idea. Los checklists de creadores coinciden entre sí y con el documento oficial actual. No son scoring oficial, pero sí el criterio con el que el equipo reviewaba:

| Fuente | Qué miraban / por qué rechazaban |
|---|---|
| [Tanjim Islam / GR8r](https://www.linkedin.com/posts/tanjim38_are-you-tried-to-get-rejected-or-get-so-much-activity-7286047239351713792-hgxz) | Design+UX = ~80% de la aceptación. 3 breakpoints. 404 obligatorio. CMS con nombres claros. En páginas CMS **no** limitar ítems (sí en home). |
| [Bicky Gurung](https://www.linkedin.com/posts/bickyg_framer-template-approval-doesnt-have-activity-7322660168532447232-PhdB) | 25 puntos: componentes reutilizables, alt text, layers nombrados, CMS único (texto+imagen), 3 breakpoints, contraste, page speed, social image, `lang=en`, metadata, slugs, cero overflow, cero lorem, 404, interacciones también en mobile. |
| [Arvind Singh](https://arvindsiingh.medium.com/comprehensive-checklist-to-get-your-framer-template-approved-902b60dcfb88) | Rechazo más común: responsive. Logo → home. Footer vivo. Semántica `nav/footer/section/h1–h6`. Solo Google/Framer fonts. Favicon + OG. Sin librerías externas para lo nativo. |
| [24 Seven Design checklist](https://www.24seven.design/framer-template-checklist) | Hover + pressed en interactivos; hover **off** en mobile; Lighthouse ≥ 90; ≤10 blurs; 2x images; SVG icons. |
| [Framer Publish Checklist](https://publish-checklist.framer.website/) (community, remixable) | Copy AP-style, orphans, type/color/link styles, CMS mapeado, legal links, QA en desktop/tablet/phone. |

Plugins de creators (GoReview, etc.) venden un **score 0–100 / A–D**. Eso es del plugin, **no de Framer**.

Jorn, en el post de Community: *“Good enough to get accepted” dejará de importar. Importará “good enough that people actually want it”.* El listón de featured sube, no baja.

---

## 3. Veredicto

**No está listo para un listing premium / featured.**  
Estéticamente es fuerte (editorial luxury, Fraunces + Space Mono, fotografía de alto contraste, 404 a medida, cero overflow horizontal en los 3 breakpoints). A nivel de **producto template** falla en Links, CMS, Text, Tags y Accessibility — exactamente las categorías que el checklist oficial marca como confianza del comprador.

Si esto entrara hoy al Marketplace se publicaría (no hay cola). Un reviewer/moderador de 2024–2025 lo habría **devuelto**. El algoritmo no debería featured-arlo mientras el home enlace a un 404 y el CMS mienta.

**Scorecard no oficial** (simulación de reviewer, 0–10 por categoría oficial). 10 = cumple el bullet de Help sin matices.

| Categoría oficial | Nota | Por qué |
|---|---|---|
| Originality | 8.0 | Nicho claro (estate agency discreta, London + Cotswolds). No parece un clone genérico de SaaS. |
| Design | 7.5 | Sistema visual excelente. Favicon default de Framer. Botón CLEAR en lima vs acento oliva. |
| Layout | 7.5 | Ritmo y grid muy buenos. Neighbourhoods no tienen páginas detalle; el layout template de property no está conectado del todo. |
| Text | 3.5 | Copy rota, títulos desparejados, años contradictorios. |
| Responsive | 8.5 | Sin overflow en 1440 / 768 / 390 en home, properties, neighbourhoods, notes, about, contact. |
| Links | 2.5 | 404 en el home. Socials placeholder. Teléfonos distintos. |
| CMS | 3.0 | Slug crudo, campos hardcodeados, copy de habitaciones clonada, coords fijas. |
| Code | n/d | No auditable en el sitio publicado. |
| Effects | 7.5 | Motion contenido en lo visto; no se midió reduced-motion. |
| Assets | 4.5 | Foto de skyline de Manhattan en un piso de Chelsea. Favicon default. Sin OG image. |
| Tags | 3.5 | `lang` vacío. Casi todo el `<img>` con `alt=""`. Pocas `section`. Sin `<header>`/`<main>`. |
| Accessibility | 3.5 | Inputs sin label. 11px body. Contraste de meta sobre cielo claro. |
| Performance | n/d* | No se corrió Lighthouse completo (Framer Performance panel no es accesible desde el preview). |
| Copyright | 5.0 | Stock que no coincide con el brief. Números Ofcom drama mezclados con otros. |
| Community (listing) | n/d | No hay listing de Marketplace en este repo. |
| Support | n/d | No auditable. |
| **Media ponderada (categorías auditables)** | **~5.4 / 10** | **Changes requested. No Featured.** |

\*La guía de publish pide “Framer’s performance checks” y Lighthouse sano. Sin eso, no se puede dar por bueno.

---

## 4. Mapa del sitio (real)

| Ruta | HTTP | Title |
|---|---|---|
| `/` | 200 | Arbour — Independent Estate Agency London |
| `/properties` | 200 | Properties \| Arbour |
| `/properties/{6 slugs}` | 200 | (títulos de cada casa) |
| `/neighbourhoods` | 200 | Neighbourhoods \| Arbour |
| `/notes` | 200 | Notes \| Arbour |
| `/notes/{6 slugs reales}` | 200 | artículos |
| `/notes/:Jd2WAsZn3` | **404** | Page not found \| Arbour |
| `/notes/the-case-for-waiting` | **404** | (el artículo no existe / slug mal) |
| `/about` | 200 | About \| Arbour |
| `/contact` | 200 | Contact \| Arbour |
| `/this-page-does-not-exist-xyz` | 404 + 404 **custom** | Page not found \| Arbour |

No hay páginas CMS de neighbourhood. Los cuatro territories enlazan a `/properties`.

---

## 5. Hallazgos (prioridad de reviewer)

Severidad alineada a cómo rechazaba el equipo: **Blocker** = no se publica / se reporta; **Major** = return; **Minor** = polish antes de featured; **Nit** = craft.

### Blocker

#### B1. Enlace roto en el home (Links + CMS)

Home → journal card `[ 02 ] The case for waiting` apunta a:

`https://arbour.framer.website/notes/:Jd2WAsZn3` → **404**

Eso es un **CMS ID crudo** (`:Jd2WAsZn3`), no un slug. Help: *“Broken or inactive links have been removed.”* Publish: *“Fix any bugs, broken links…”*

El copy de esa card está además **roto**:

> “Market that rewards speed, patience is the rarest luxury. Note on and the right address.”

En `/contact` la misma pieza está bien escrita:

> “A market that rewards speed makes patience the rarest luxury — the right address is worth the wait.”

La card `[ 01 ] On finding quiet in Marylebone` (fecha MAR 2026, categoría NEIGHBOURHOODS) enlaza a `/notes/on-proportion-light-london-row-house`, cuyo artículo real es **“On proportion, light, and the London row house”**, 12 JUN 2026, FIELD NOTES. Overlay de CMS vs campos reales.

**Fix:** conectar las featured notes a ítems CMS reales; slug humano; copy del CMS, no texto estático encima.

#### B2. Tres teléfonos distintos (Links + Text)

| Superficie | Número |
|---|---|
| Overlay del menú | `tel:+442073518800` → **+44 20 7351 8800** |
| Contact · Mayfair | `tel:+442079460810` → **+44 20 7946 0810** (rango Ofcom *drama*: 020 7946 0000–0999) |
| Contact · Cotswolds | `tel:+441608649220` → **+44 1608 649 220** |

Help pide `tel:` (eso sí está). Un comprador ve un template “impecable” que no se pone de acuerdo consigo mismo. Unificar a **un** set de números demo y usar variables / el mismo text style en header y contact.

#### B3. Redes sociales placeholder (Links + Support)

En el overlay, Instagram / LinkedIn / X apuntan **los tres** a:

`https://www.framer.com/@builtbykern/`

Help Support: *“Advertisements and unrelated promotions have been removed.”*  
Esto es promo del creator + enlaces que no hacen lo que el label promete. O `https://instagram.com/...` reales de demo, o quitar los ítems.

---

### Major

#### M1. Cronología de la agencia incoherente (Text + CMS)

- Meta home: *“counsel **since 1999**.”*  
- Meta about: *“Independent estate agency **since 1999**.”*  
- About body: **EST. 2018** (dos veces).  
- Stats: **26 yrs** independent → implicaría ~2000.

Tres orígenes. En un template de lujo esto se lee como archivo sucio, no como “demo”.

#### M2. Conteos y numeración (CMS + Text)

- Home: `[ 03 RESIDENCES — LONDON & COUNTRY ]` y **dos cards con `( 02 )`** (Frognal y Bibury).  
- `/properties`: `06 AVAILABLE`.  
- Notes index: `[ 07 ENTRIES ]` pero la numeración editorial salta el **04** (01, 02, 03, 05, 06, 07).  
- “The case for waiting” **no está** en el index y el home sí la enseña.

O el home es “featured 3” (entonces el label debe decirlo) o el contador sale del CMS (`collection.length`). La numeración `( 01 ) ( 02 ) ( 02 )` es un fail clásico de índice hardcodeado.

#### M3. CMS de properties mal cableado (CMS — el rechazo más típico después de responsive)

En **las 6** fichas:

- Coordenadas del layout: `51.5074° N — 0.1278° W · CHELSEA` (punto de Trafalgar/Charing Cross, no Chelsea). Frognal y Bibury también dicen Chelsea.  
- El bloque **“What the house keeps, day after day”** es **idéntico** (garden court, kitchen, study, baths, terrace, cellar) en Cheyne Walk, Frognal y Bibury. Bicky: *“Use Unique CMS Content (Text + Images).”* Help: *“CMS fields are connected clearly.”*  
- Particulars del footer de ficha sí cambian (bien). El cuerpo “rooms” no.

En `/neighbourhoods`, Chelsea / Notting Hill / Hampstead / Cotswolds **VIEW →** van todos a `/properties`, no a un CMS item. O hay collection Territories con detalle, o el CTA dice “See residences in this area”.

#### M4. Foto vs brief (Assets + Copyright + Originality)

Ficha **Cheyne Walk Riverside Residence** (copy: Thames, Battersea, Chelsea) abre con un interior cuyo skyline es **Manhattan** (One World Trade Center), no el Támesis.  
Bibury Stone Manor (copy: honey-stone, s. XVII, gravel drive) abre con un **garage door** urbano.

Un reviewer lo marca como stock genérico no curado. Cambia las hero images para que coincidan con el copy, o reescribe el copy a lo que se ve.

#### M5. SEO / site settings (Accessibility + Community)

Medido en todas las páginas auditadas:

| Check oficial | Estado |
|---|---|
| Title + description por página | OK (únicos y bien escritos) |
| `html lang` | **vacío** |
| Favicon | **default** `default-favicon-light.v1.png` |
| `og:image` | **ausente** |
| Alt text | mayoría `alt=""`; unos pocos genéricos (“Property detail photograph”) |

Help Accessibility: *“Each page includes a title and description in site settings.”* + language.  
Bicky #13–14: social thumbnail + site language English.  
Arvind: favicon + OG.

#### M6. Formularios y labels (Accessibility + Links)

- Newsletter home: `input type=email` placeholder `your@email.com`, **sin `<label>` ni `aria-label`**. Al submit no hay success/error visible (el body no cambia).  
- Contact **no tiene formulario** de enquiry: solo `mailto:enquiries@arbour.london`. Para un template de agencia, el comprador espera un Form nativo de Framer (nombre, email, mensaje, property interest).  
- Filtros de `/properties` (STATUS, AREA, BUDGET, BEDS): **funcionan** (Chelsea deja Cheyne Walk + Royal Avenue; Under Offer deja vacío; CLEAR restaura). Pero los controles no tienen label asociado — solo placeholder. Help: *“Form fields are clearly labeled.”*

#### M7. Hover / active incompleto (Links)

Help: *“Hover and active states are clearly defined.”*  
En home, sin cambio computado de color/opacity/decoration/transform:

- `EXPLORE →`  
- `VIEW ALL →`  
- `VIEW ALL NOTES →`  
- card Cheyne Walk  
- las dos notes featured  

Algunas cards de property sí cambian. El sistema de interacción no es uniforme. En mobile, 24 Seven pide desactivar hover — no verificado.

---

### Minor

#### m1. Semántica (Tags)

Landmarks típicos en páginas de marketing: `nav: 1`, `footer: 1`, `header: 0`, `main: 0`, `section: 0–2`. Neighbourhoods = **0 sections**. 404 tiene `main` pero pierde nav/footer. Help pide headings lógicos + tags; Academy pide `section` / `header` / `nav`.

H1 único por página: **cumple**.

#### m2. Tipografía (Design + Text + a11y)

Sistema (desktop home):

- Display: **Fraunces Variable**, 84px / line-height **84px** (1.0) / tracking **−2.52px**  
- UI/meta: **Space Mono** 11px / 16.5px / tracking 1.32px  
- Body computed del `body`: 12px sans-serif (el 11px Mono es el primer `p`)

El 1.0 de line-height en display recorta descenders (`Journal`, `judgement`). 11px está por debajo de lo que se considera body legible; WCAG no fija px, pero reviewers y Lighthouse penalizan texto pequeño + tracking alto.

Fraunces + Space Mono son fonts de Framer/Google → cumple *“Framer fonts are used where appropriate.”*

#### m3. Contraste (Accessibility)

Hero/about: labels blancos sobre **cielo claro** de la foto. Help remite a Lighthouse + 4.5:1. Hay que comprobar esos overlays (scrim o mover el meta a zona oscura).  
El botón CLEAR lima sobre cream: verificar 4.5:1 en el label.

#### m4. Legal / footer

Footer: *“© Arbour Estates Ltd. Registered in England & Wales.”* Sin Privacy / Terms / Cookies. Publish Checklist community los pide si hay captura de email. El newsletter los hace pertinentes.

#### m5. CTA inconsistente en cards

Solo la card `( 01 )` del home muestra `VIEW →`. Frognal y Bibury no. Parece variante de componente a medias.

#### m6. Coords bien y mal a la vez

Territories Chelsea usa `51.4875° N — 0.1687° W` (razonable). El hero usa `51.5074° N — 0.1278° W · CHELSEA` (centro de Londres). Dos verdades. Una variable CMS.

---

### Nits / craft

- Accent lima (CLEAR) vs oliva (location labels) vs stone: o se documenta como acento único o se unifica.  
- “Made in Framer” en el preview es normal; documentar cómo se quita.  
- Copy de awards Sunday Times / Country Life / Negotiator / RICS Matrics: está bien como demo, pero hay que dejar claro en el listing que es *placeholder* (copyright de marcas).  
- Testimonial “E. Whitmore” vs principal “Eleanor Whitmore”: o es intencional o parece leftover.  
- H1 84px en tablet/mobile del hero se apila bien (no overflow); vigilar viudas en “Independent estate / agency.”  
- Contact journal cards no son links (en `/contact` las notes del final no tienen `href` en el extracto de texto; en home sí). Misma sección, distinto cableado.

---

## 6. Lo que está bien (no negociar esto a la baja)

- **404 custom** de primer nivel: *“A fine address, quietly misplaced.”* Title/description propios. Cumple el bullet de Design.  
- **Cero overflow** en 6 páginas × 3 viewports.  
- **Filtros de properties** conectados de verdad (STATUS / AREA / CLEAR).  
- **`mailto:` y `tel:`** presentes (aunque los `tel` se contradicen).  
- **Títulos SEO** únicos y tono de listing correcto.  
- **Logo** `aria-label="Arbour home"` → `/`.  
- **Nav overlay** con páginas reales (Properties, Neighbourhoods, Notes, About, Contact).  
- Vocabulario de marca coherente (discretion, never theatre, quiet surfaces).  
- Un H1 por página.  
- Fotografía en general de calidad de print (salvo el mismatch geográfico).  
- Spacing de template editorial: márgenes ~72px desktop, mucho aire, rules 1px — eso **sí** es nivel marketplace alto.

---

## 7. Punch list para el archivo Framer (orden de ataque)

1. Arreglar slug y link de “The case for waiting”; borrar o mapear `:Jd2WAsZn3`.  
2. Featured notes del home = CMS bind (título, fecha, categoría, excerpt, URL).  
3. Un teléfono + un email en overlay, contact y footer (component variables).  
4. Socials reales o fuera.  
5. Contador de residences desde CMS; numeración 01–03 o 01–06, nunca duplicada.  
6. Unificar 1999 / 2018 / 26 yrs.  
7. Layout template de property: coords + neighbourhood desde CMS.  
8. Rooms CMS **únicos** por ítem (o quitar el bloque si no hay campos).  
9. Neighbourhoods: collection + detalle, o CTA honesto a `/properties?area=`.  
10. Hero images que coincidan con el copy (nada de Manhattan en Chelsea).  
11. Site Settings: `lang=en`, favicon, OG por página.  
12. Alt text real en fotos no decorativas; `alt=""` solo en decorativas de verdad.  
13. Labels en newsletter + filtros; success/error del form.  
14. Formulario de enquiry en Contact (Framer Form).  
15. Hover/pressed en todos los `a` / buttons; off en breakpoint phone.  
16. Tags: `header`, `main`, `section` por bloque.  
17. Line-height display ≥ 1.05; body ≥ 14–16px o contrastar el 11px como *caption only*.  
18. Privacy si se captura email.  
19. Correr **Framer performance checks** + Lighthouse mobile.  
20. Recorrer el archivo: layers, unused CMS, unused styles (no visible en el preview).

---

## 8. Evidencia

Screenshots en `screenshots/`:

| Archivo | Qué demuestra |
|---|---|
| `home-desktop.png` / `home-tablet.png` / `home-mobile.png` | Hero, type, spacing, responsive |
| `nav-open-desktop.png` | Overlay, socials, teléfono 7351 8800 |
| `properties-desktop.png` | Filtros, CLEAR lima, “06 AVAILABLE” |
| `properties-cheyne-walk-riverside-residence-desktop.png` | Hero vs copy Chelsea |
| `properties-bibury-stone-manor-desktop.png` | Hero vs copy Cotswolds |
| `contact-desktop.png` | mailto, Ofcom 7946 0810 |
| `this-page-does-not-exist-xyz-desktop.png` | 404 custom (bien) |
| `notes-Jd2WAsZn3-desktop.png` | 404 desde el home (mal) |

Crawl técnico: Chrome 1440/768/390, `networkidle` no forzado (domcontentloaded + 1.2s). Unico interno ≠ 200: `/notes/:Jd2WAsZn3`.

---

## 9. Límites de esta auditoría

No se puede certificar desde el preview:

- nombres de layers / components / CMS fields  
- text styles y color styles compartidos (se *infieren* por consistencia visual)  
- unused assets, code files, breakpoints extra en el canvas  
- reduced motion en Site Settings  
- Lighthouse / Framer performance panel  
- listing (byline, precio, categorías, screenshots de Marketplace)

Eso es trabajo **dentro** del proyecto Framer, no del `.framer.website`.

---

## Fuentes

**Oficiales**

1. https://www.framer.com/template-requirements/  
2. https://www.framer.com/help/articles/template-best-practices/  
3. https://www.framer.com/help/articles/how-to-publish-a-template/  
4. https://www.framer.com/help/articles/how-template-ranking-works/  
5. https://www.framer.com/blog/marketplace-new-framer-community/  
6. https://www.framer.com/help/articles/guide-to-web-accessibility-in-framer/  
7. https://www.framer.com/help/articles/understanding-contrast-ratio/  
8. https://www.framer.com/component-requirements/ (si el producto fuera componente; aquí es template)

**Comunidad / histórico de review**

9. https://www.linkedin.com/posts/bickyg_framer-template-approval-doesnt-have-activity-7322660168532447232-PhdB  
10. https://www.linkedin.com/posts/tanjim38_are-you-tried-to-get-rejected-or-get-so-much-activity-7286047239351713792-hgxz  
11. https://arvindsiingh.medium.com/comprehensive-checklist-to-get-your-framer-template-approved-902b60dcfb88  
12. https://www.24seven.design/framer-template-checklist  
13. https://publish-checklist.framer.website/  
14. https://www.ofcom.org.uk/phones-and-broadband/phone-numbers/numbers-for-drama/ (rango 020 7946)
