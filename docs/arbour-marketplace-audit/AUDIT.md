# Arbour — auditoría tipo reviewer de Framer Marketplace

**Preview:** [https://arbour.framer.website](https://arbour.framer.website)  
**Corrección en Framer:** prompts del Agent interno (modelo + reasoning + `/` skills) en [framer-agent-prompts/](framer-agent-prompts/)  
**Fecha de esta pasada:** 16 agosto 2026, ~15:27–15:32 UTC (`Last-Modified` del HTML publicado)  
**Pasada anterior:** misma fecha, preview previo al republish  
**Alcance:** sitio publicado (no hay archivo `.framer` en este repo; no se pudo editar el proyecto).  
**Método:** checklist oficial de Framer (Help actualizado 7 ago 2026) + Chrome 148 headless (desktop 1440×900, tablet 768×1024, mobile 390×844), crawl HTTP de 23 rutas, overlay de navegación, filtros CMS, DOM (lang, favicon, OG, alts, tags, forms) y revisión visual.

---

## 0. Delta vs la pasada anterior

El preview se republicó mientras se auditaba (`Last-Modified: Sun, 16 Aug 2026 15:27:52 GMT`). Varias fases del pack **ya están aplicadas en el sitio vivo**.

| Hallazgo anterior | Ahora |
|---|---|
| Home journal `[02] The case for waiting` → `/notes/:Jd2WAsZn3` **404** | **200** en `/notes/the-case-for-waiting`. Slug humano. El id crudo `:Jd2WAsZn3` sigue 404 (correcto). |
| Excerpt de waiting roto en Home | Copy canónica: *“A market that rewards speed makes patience the rarest luxury — the right address is worth the wait.”* |
| Home card 01 “On finding quiet in Marylebone” sobre el artículo row-house | Card 01 muestra el título real **On proportion, light, and the London row house** y enlaza al slug correcto |
| Mews *Why mews houses…* publicado | **404** (`/notes/mews-houses-second-visit`). Hueco usado por waiting. Siguen **7** published |
| Overlay `tel:+442073518800` | Overlay unificado a **+44 20 7946 0810** (`tel:+442079460810`) |
| Socials → `framer.com/@builtbykern/` | Instagram / LinkedIn / X de demo (`arbour.london`) |
| About **EST. 2018** | **EST. 1999** (dos veces). Meta “since 1999” y stats **26 yrs** alineados |
| Home label `03 RESIDENCES` | `[ 03 FEATURED — LONDON & COUNTRY ]` |
| Properties `06 AVAILABLE` | `[ 06 RESIDENCES — LONDON & COUNTRY ]` |
| Neighbourhoods CTA `VIEW` genérico | **See residences in this area** → `/properties` |
| Rooms clonados en las 6 fichas | Rooms **únicos** por ítem (Riverside Reception, Georgian Drawing Room, Flagstone Hall, etc.) |
| `og:image` ausente | Presente en las 23 rutas medidas |
| `<main>` / `section` casi 0 | Home: `main` 1, `section` 8. Notes CMS: también `header` |
| Contact sin Form | Form nativo: Name, Email, Property Interest, Message + labels visibles |
| CLEAR lima | CLEAR oliva oscuro, `aria-label="Clear property filters"` |
| Display line-height 1.0 (84/84) | **88.2 / 84 ≈ 1.05** |
| Alt casi todo vacío | Notes: alts descriptivos. Properties: genéricos (“Property hero photograph”) |

**Scorecard anterior ~5.4 / 10 → esta pasada ~7.0 / 10.** Los tres blockers (404 del journal, tres teléfonos, promo del creator) están **cerrados**. No está Featured: quedan CMS layout, numeración, cuerpo vacío de waiting, leftover Marylebone, `lang`/favicon, hover y mismatch foto/copy.

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

**Más cerca, todavía no Featured.**  
El preview ya no miente en el journal ni promociona al creator. El look (Fraunces + Space Mono, cream `#F9F8F3`, overlay, 404 custom) se conserva. Lo que queda es lo que un comprador de template nota al remixar: layout CMS con coords fijas, numeración editorial rota, un artículo sin cuerpo, leftover de copy en Contact, Site Settings incompletos (`lang`, favicon) y hover irregular.

Si esto se publicara hoy en Marketplace, **pasaría** (no hay cola). Un moderador de 2024–2025 ya no lo devolvería por 404; sí lo marcaría por CMS a medias y leftovers de “DEMO TEMPLATE”. El algoritmo no debería featured-arlo mientras Home numera dos cards `( 02 )` y waiting no tiene artículo.

**Scorecard no oficial** (simulación de reviewer, 0–10 por categoría oficial). 10 = cumple el bullet de Help sin matices.

| Categoría oficial | Antes | Ahora | Por qué |
|---|---|---|---|
| Originality | 8.0 | 8.0 | Nicho claro (estate agency discreta, London + Cotswolds). |
| Design | 7.5 | 8.0 | Sistema visual excelente. 404 custom. Favicon default. CLEAR ahora oliva. |
| Layout | 7.5 | 8.0 | Ritmo y grid altos. Neighbourhoods CTA honesto. Property layout: coords aún hardcodeadas. |
| Text | 3.5 | 6.5 | 1999 unificado. Waiting excerpt OK. Marylebone leftover. Placeholder de Privacy. Skip 04. Waiting sin cuerpo. |
| Responsive | 8.5 | 8.5 | Cero overflow en 6 páginas × 3 viewports. |
| Links | 2.5 | 7.5 | 404 del journal cerrado. Socials reales. Overlay = Mayfair. Hover débil. Cards de Contact no son links. |
| CMS | 3.0 | 6.5 | 7 ítems, slug waiting, rooms únicos. Coords de template. Numeración. Cuerpo vacío. |
| Code | n/d | n/d | No auditable en el publicado. |
| Effects | 7.5 | 7.5 | Motion contenido; no se midió reduced-motion. |
| Assets | 4.5 | 6.0 | Ya no es Manhattan / garage. Heroes aún no coinciden del todo con el brief. OG sí. Favicon no. |
| Tags | 3.5 | 6.0 | `main`/`section` presentes. `lang` vacío. Alts buenos en Notes, genéricos en Properties. |
| Accessibility | 3.5 | 6.0 | Form labels. `lang` vacío. Meta 11px. Contraste del hero sobre cielo. |
| Performance | n/d* | n/d* | Sin Lighthouse / Framer Performance panel. |
| Copyright | 5.0 | 5.5 | Stock más creíble, aún genérico vs copy. |
| Community (listing) | n/d | n/d | No hay listing en este repo. |
| Support | n/d | n/d | No auditable. |
| **Media ponderada (auditables)** | **~5.4** | **~7.0 / 10** | **Changes requested. No Featured.** |

\*La guía de publish pide “Framer’s performance checks” y Lighthouse sano. Sin eso, no se puede dar por bueno.

---

## 4. Mapa del sitio (real, esta pasada)

| Ruta | HTTP | Title |
|---|---|---|
| `/` | 200 | Arbour — Independent Estate Agency London |
| `/properties` | 200 | Properties \| Arbour |
| `/properties/{6 slugs}` | 200 | títulos de cada casa |
| `/neighbourhoods` | 200 | Neighbourhoods \| Arbour |
| `/notes` | 200 | Notes \| Arbour |
| `/notes/the-case-for-waiting` | **200** | The case for waiting. \| Arbour |
| `/notes/on-proportion-light-london-row-house` | 200 | On proportion, light, and the London row house. \| Arbour |
| `/notes/what-a-second-viewing-is-really-for` | 200 | What a second viewing is really for. \| Arbour |
| `/notes/on-instructing-an-agent-without-losing-your-nerve` | 200 | On instructing an agent without losing your nerve. \| Arbour |
| `/notes/reading-a-facade-as-ledger` | 200 | Reading a façade as a ledger of ownership. \| Arbour |
| `/notes/notting-hill-after-the-rain` | 200 | Notting Hill after the rain. \| Arbour |
| `/notes/colville-terrace-field-notes` | 200 | Field notes from the Colville terrace. \| Arbour |
| `/notes/:Jd2WAsZn3` | **404** custom | Page not found \| Arbour |
| `/notes/mews-houses-second-visit` | **404** custom | (unpublished, correcto) |
| `/notes/on-finding-quiet-in-marylebone` | **404** custom | (no existe como ítem, correcto) |
| `/about` | 200 | About \| Arbour |
| `/contact` | 200 | Contact \| Arbour |
| `/privacy` | **404** | no hay página legal |
| `/this-page-does-not-exist-xyz` | 404 + 404 **custom** | Page not found \| Arbour |

No hay páginas CMS de neighbourhood. Los cuatro territories enlazan a `/properties` (sin query `?area=`).

**Notes published (7), slugs humanos:**

1. What a second viewing is really for — `[ 01 ]` BUYING  
2. On proportion, light, and the London row house — `[ 02 ]` FIELD NOTES  
3. Notting Hill after the rain — `[ 03 ]` NEIGHBOURHOODS  
4. *(hueco `[ 04 ]`)*  
5. On instructing an agent without losing your nerve — `[ 05 ]` BUYING  
6. The case for waiting — `[ 06 ]` FIELD NOTES  
7. Field notes from the Colville terrace — `[ 07 ]` NEIGHBOURHOODS  
+ featured “Reading a façade as a ledger of ownership” (sin número en la lista; es el séptimo ítem real)

Server-timing de waiting: `var.Jd2WAsZn3=the-case-for-waiting` — el ítem roto se re-slugeó; no se creó un octavo.

---

## 5. Hallazgos (prioridad de reviewer)

Severidad: **Blocker** = no se publica / se reporta; **Major** = return; **Minor** = polish antes de featured; **Nit** = craft.

### Blockers de la pasada anterior — cerrados

- **B1** Home → `/notes/:Jd2WAsZn3`. Ahora Home card 02 → `/notes/the-case-for-waiting` 200. Ningún `href` interno con `:Jd2WAsZn3`.  
- **B2** Tres teléfonos. Overlay y Contact Mayfair = `+44 20 7946 0810`. Cotswolds sigue como segundo office (`+44 1608 649 220`) — coherente. El 7351 8800 **ya no aparece**.  
- **B3** Socials a `framer.com/@builtbykern/`. Ahora `instagram.com/arbour.london`, `linkedin.com/company/arbour-london`, `x.com/arbourlondon`.

No hay blockers nuevos de enlace roto en el grafo interno descubierto.

---

### Major (abiertos)

#### M1. Numeración editorial (CMS + Text)

- Home featured: Cheyne Walk `( 01 )`, Frognal `( 02 )`, Bibury **`( 02 )` otra vez**. El label ahora dice `03 FEATURED` (bien) pero los índices de card siguen duplicados.  
- Notes index: `[ 07 ENTRIES ]` y 7 links reales, pero los números de card son **01, 02, 03, 05, 06, 07** — sigue faltando **04**. Waiting heredó el `[ 06 ]` del mews unpublished.  
- Home journal cards usan `[ 02 ]` (row house) y `[ 06 ]` (waiting): son IDs de colección, no “featured 1–2”.

**Fix:** numerar featured 01–03 desde el índice del list; en `/notes` 01–07 sin huecos (waiting puede ser 04).

#### M2. “The case for waiting” no tiene cuerpo (CMS + Text)

La página 200 existe: H1, excerpt, categoría FIELD NOTES, fecha 09 MAY 2026. Tras `( ARTICLE )` no hay párrafos — salta a “Continue reading.” Las otras seis notas sí tienen artículo.

Help: *“Empty and unused CMS entries have been removed.”* / *“CMS fields are connected clearly.”* Un comprador abre el featured del home y encuentra una ficha hueca.

**Fix:** pegar 2–4 párrafos British English en el campo body, o no featured-arla hasta que tenga copy.

#### M3. Layout template de properties: coords fijas (CMS)

En **las 6** fichas el hero/meta dice:

`51.5074° N — 0.1278° W · CHELSEA`

Eso es Trafalgar/Charing Cross, no Chelsea, y menos Hampstead o Bibury. El bloque Territories de Home usa `51.4875° N — 0.1687° W` (Chelsea razonable). Dos verdades.

Los **rooms ahora sí son únicos** (cerrado el clone garden-court). Particulars también cambian.

**Fix:** bind lat/long + neighbourhood desde CMS en el layout template. Frognal → Hampstead; Bibury → Cotswolds; Colville/Ladbroke → Notting Hill.

#### M4. Foto vs brief (Assets + Copyright)

Mejor que la pasada (ya no hay skyline de Manhattan ni garage door), pero el match copy/foto sigue flojo:

| Ítem | Copy | Hero medido |
|---|---|---|
| Cheyne Walk Riverside | Thames, Battersea, Chelsea, brick façade | Vestíbulo de mármol / puertas de ascensor |
| Bibury Stone Manor | Honey-stone, s. XVII, gravel drive, Cotswolds | Mansión georgiana **blanca** iluminada de noche |

Un reviewer lo marca como stock no curado. Cambia heroes o reescribe el copy a lo que se ve.

Alts de property: `"Property hero photograph"` / `"Property gallery photograph"` — mejor que `alt=""`, peor que un alt por casa.

#### M5. SEO / site settings (Accessibility + Community)

| Check oficial | Estado |
|---|---|
| Title + description por página | **OK** (únicos, bien escritos; waiting tiene description propia) |
| `html lang` | **vacío** en las 23 rutas |
| Favicon | **default** `default-favicon-light.v1.png` |
| `og:image` | **presente** (home y CMS usan assets distintos) |
| Alt text | Notes: descriptivos. Properties: genéricos. Decorativas aún `alt=""` |

Help Accessibility: title/description **cumple**; language **no**. Bicky #13–14: social thumbnail **cumple**; site language English **no**.

#### M6. Leftovers de demo en Contact (Text + Support)

- Journal de Contact sigue mostrando **“On finding quiet in Marylebone.”** (MAR 2026, NEIGHBOURHOODS) **sin `href`**. Waiting en esa misma franja **tampoco es link**. En Home esas cards sí enlazan.  
- Newsletter: *“DEMO TEMPLATE — REPLACE WITH YOUR OWN PRIVACY POLICY BEFORE PUBLISHING.”* Copy de instrucciones, no de agencia. `/privacy` es 404. El pack pide **no** crear página Privacy; entonces quitar esa frase o sustituirla por una línea de demo que no parezca TODO del creator.

Form de enquiry: **sí está** (Name / Email / Property Interest optional / Message, labels `NAME` `EMAIL`…). Cumple el espíritu de Help *“Form fields are clearly labeled.”* (label wrapping, sin `for=`/id — aceptable en Framer). Honeypots en el DOM; no aparecen como copy visible.

#### M7. Hover / active incompleto (Links)

Help: *“Hover and active states are clearly defined.”*  
En Home, `EXPLORE →`, `VIEW ALL →`, `VIEW ALL NOTES →` **no cambian** color, opacity, decoration ni transform al hover (medido). Overlay links no se midieron aparte. En mobile, 24 Seven pide hover off — no verificado.

---

### Minor

#### m1. Semántica (Tags)

Marketing pages: `nav: 1`, `footer: 1`, `main: 1`, `section: 2–8`, **`header: 0`**. Notes CMS detail: `header: 1`. 404: `main` sí, **sin** nav/footer. Un H1 por página: **cumple**. Properties detail usa `article: 1` (bien).

#### m2. Tipografía (Design + Text + a11y)

Desktop home:

- Display: **Fraunces Variable** 84px / line-height **88.2px** (~1.05) / tracking −2.52px  
- UI/meta: **Space Mono** 11px / 16.5px / tracking 1.32px  

El 1.05 ya no recorta tanto los descenders. 11px sigue siendo caption, no body; reviewers/Lighthouse lo penalizan si se usa como párrafo.

Fraunces + Space Mono = fonts de Framer/Google → cumple *“Framer fonts are used where appropriate.”*

#### m3. Contraste (Accessibility)

Hero: H1 blanco `rgb(252, 250, 244)` sobre foto de atardecer/cielo. Help remite a Lighthouse + 4.5:1. Scrim o meta en zona oscura. CLEAR oliva + blanco: mejor que el lima anterior; verificar 4.5:1 en el panel de Framer.

#### m4. Legal / footer

Footer: *“© Arbour Estates Ltd. Registered in England & Wales.”* Sin Privacy/Terms. No hay ruta `/privacy`. El newsletter hace pertinente **o** una frase de demo discreta **o** quitar captura de email — no un TODO en mayúsculas.

#### m5. CTA inconsistente en cards

Solo la card `( 01 )` del home muestra `VIEW →`. Frognal y Bibury no. Variante de componente a medias.

#### m6. Neighbourhoods → `/properties` sin filtro

El CTA ahora es honesto (“See residences in this area”). Los cuatro cards van al índice completo, no a Chelsea/Notting Hill/Hampstead/Cotswolds filtrado. Si el filtro AREA funciona (el control existe: All / Chelsea / Notting Hill / Hampstead / The Cotswolds), el VIEW debería preseleccionarlo.

Filtros en `/properties`: STATUS, AREA, BUDGET FROM/TO, BEDS, CLEAR con `aria-label`. Selects envueltos en `label`. El click sintético a Chelsea **no** redujo las 6 cards en este harness (posible overlay de custom select); no se marca como roto — verificar a mano.

---

### Nits / craft

- Accent: CLEAR oliva vs labels oliva `rgb(84, 98, 45)` vs stone: más unificado que el lima.  
- “Made in Framer” en el preview es normal; documentar cómo se quita.  
- Awards Sunday Times / Country Life / Negotiator / RICS Matrics: demo; dejarlo claro en el listing.  
- Testimonial “E. Whitmore” vs principal “Eleanor Whitmore”: o es intencional o leftover.  
- Overlay: “Now accepting viewings — London” + featured Cheyne Walk. Bien.  
- Contact form: segundo form (newsletter) + honeypots; confirmar success/error nativo al submit.  
- Waiting category en Home es FIELD NOTES; en Contact leftover era COUNSEL. Unificar.

---

## 6. Lo que está bien (no negociar esto a la baja)

- **404 custom** de primer nivel: *“A fine address, quietly misplaced.”* Title/description propios.  
- **Cero overflow** en 6 páginas × 3 viewports.  
- **Journal 404 cerrado.** Slug humano. Siete published. Mews unpublished.  
- **Socials y teléfono del overlay** alineados al source of truth.  
- **`mailto:enquiries@arbour.london`** y `tel:` reales.  
- **EST. 1999** + meta since 1999 + 26 yrs.  
- **Rooms únicos** por property.  
- **Form nativo en Contact** con labels.  
- **OG images** por página.  
- **Títulos SEO** únicos y tono de listing.  
- **Logo** `aria-label="Arbour home"` → `/`.  
- **Nav overlay** con páginas reales + featured property.  
- Vocabulario de marca (discretion, never theatre, quiet surfaces).  
- Un H1 por página.  
- Spacing editorial: ~72px desktop, 1px rules — nivel marketplace alto.  
- Neighbourhoods copy larga y útil (Chelsea / Notting Hill / Hampstead / Cotswolds).

---

## 7. Punch list que queda (orden de ataque)

Mapeo a fases del pack que **aún aplican** en el canvas:

1. **01 leftover:** Renumber Notes 01–07; body de waiting; Contact journal = CMS bind (o quitar Marylebone).  
2. Home featured cards `( 01 ) ( 02 ) ( 03 )` — no dos `( 02 )`.  
3. **04:** coords + neighbourhood desde CMS en el property layout.  
4. **05 leftover:** VIEW de Neighbourhoods → `/properties` con AREA preseleccionada si el filtro lo permite.  
5. **06 leftover:** heroes Cheyne (río/Chelsea) y Bibury (honey-stone). Alts por ítem.  
6. **07:** `lang=en`, favicon custom, alts de property. OG ya está.  
7. **09:** hover/pressed en `EXPLORE` / `VIEW ALL` / cards; off en Phone.  
8. **10 leftover:** `header` en marketing pages; 404 con nav o un back path más rico (ya tiene RETURN).  
9. **11 leftover:** scrim del hero; quitar “DEMO TEMPLATE — REPLACE WITH YOUR OWN PRIVACY POLICY…”.  
10. **08 leftover:** success/error del Form + newsletter.  
11. Correr **Framer performance checks** + Lighthouse mobile.  
12. Recorrer el archivo: layers, unused CMS (mews unpublished), unused styles.

---

## 8. Evidencia

Screenshots en `screenshots/` (reemplazados en esta pasada):

| Archivo | Qué demuestra |
|---|---|
| `home-desktop.png` / `home-tablet.png` / `home-mobile.png` | Hero, type 1.05, spacing, responsive |
| `nav-open-desktop.png` | Overlay: socials reales, Mayfair 7946 0810, nav Properties…Contact |
| `properties-desktop.png` | Filtros, CLEAR oliva, `06 RESIDENCES` |
| `properties-cheyne-walk-riverside-residence-desktop.png` | Hero vestíbulo (no Thames) |
| `properties-bibury-stone-manor-desktop.png` | Hero georgiano blanco (no honey-stone) |
| `contact-desktop.png` | mailto, dos offices |
| `this-page-does-not-exist-xyz-desktop.png` | 404 custom (bien) |
| `notes-the-case-for-waiting-desktop.png` | 200, título correcto, poco cuerpo |
| `notes-Jd2WAsZn3-desktop.png` | El id crudo ahora 404 custom (bien) |

Crawl: Chrome 148, `domcontentloaded` + espera. Internos ≠ 200 solo los 404 esperados (`:Jd2WAsZn3`, mews, marylebone, `/privacy`, 404 de prueba).

---

## 9. Límites de esta auditoría

No se puede certificar desde el preview:

- nombres de layers / components / CMS fields  
- text styles y color styles compartidos (se *infieren* por consistencia visual)  
- unused assets, code files, breakpoints extra en el canvas  
- reduced motion en Site Settings  
- Lighthouse / Framer performance panel  
- listing (byline, precio, categorías, screenshots de Marketplace)  
- submit real del Form (success/error)  
- filtro AREA con el custom select de Framer (el harness no lo cerró)

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
