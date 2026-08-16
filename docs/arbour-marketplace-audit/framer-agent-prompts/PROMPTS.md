# Prompts — modelo + skill (Agent tab)

Un **New Chat** por bloque. Branch `marketplace-qa`. **Fast Mode Off.** Nunca Fable 5, GPT 5.6 Sol ni `/code`.

Antes de cada prompt, pega las [constraints](00-constraints.md). Opus: **5** → 4.8 → 4.7. `/seo` `/layout` `/audit` solo si están en el menú `/`; si no, pega el prompt sin el slash.

Fuente de efectos: [Choosing a model](https://www.framer.com/help/articles/choosing-a-model-in-the-framer-agent/) (7 ago 2026), [GPT 5.6](https://www.framer.com/updates/gpt-5-6), [Opus 5](https://www.framer.com/updates/opus-5), [Reasoning](https://www.framer.com/updates/agent-reasoning-and-fast-mode).

## Efecto de cada modelo

Qué hace el modelo **en el canvas** cuando lo eliges. Help: cada uno tiene sesgo de planning, iniciativa creativa, velocidad y créditos.

| Modelo | Efecto oficial (Help / Updates) | Qué produce en Arbour | Créditos / velocidad |
|---|---|---|---|
| **GPT 5.6 Luna** | El más rápido. CMS grande y find-replace cross-site. | Cambia datos, slugs, binds, teléfonos. Casi no rediseña. | 2× más rápido; ~0.4× créditos vs GPT 5.5 |
| **GPT 5.5** | Copy-heavy, otras perspectivas, páginas estructuradas. | Reescribe texto (1999, grammar). No toca layout si se lo prohibes. | Baseline de copy |
| **GPT 5.6 Terra** | Audits grandes, redesigns, pases de consistencia, más barato. | Revisa SEO/alts/hygiene y corrige sin inventar look. | ~0.6× créditos vs GPT 5.5 |
| **Sonnet 5** | Default. Layout, diseño original eficiente, edits cotidianos. | Hover, tags, swap de 6 fotos, instructions. Conservador. | Default del picker |
| **Opus 5** | Plan largo, juicio visual, ejecución multi-paso. Mismo score que Fable en nav, ~0.5× créditos de Fable. | Solo el Form nativo **en Contact existente**. No páginas nuevas. | ~1.2× créditos vs Sol; fallback 4.8 → 4.7 |
| **Fable 5** | El más *proactive*. Va más allá del brief. First drafts, detalles expresivos, sistemas nuevos. | Rediseña. **No usar.** | Más caro que Opus 5 para el mismo score de nav |
| **GPT 5.6 Sol** | Creativo más fuerte, poca guía, diseños “acabados”. | Cambia la esencia. **No usar.** | Baseline creativo GPT 5.6 |

**Reasoning** (picker, 12 ago 2026):

| Valor | Efecto |
|---|---|
| **Light** | Edits rápidos. Empieza a construir ya. Poco plan. |
| **Higher** | Piensa el schema/página **antes** de tocar. Más lento, menos errores de CMS. |

**Fast Mode** (Opus 5): generaciones más rápidas, más tokens. Efecto aquí: peor plan. **Off.**

## Esfuerzo de cada modelo

Framer cobra **AI credits**. Help: el coste no es fijo; *depends on the complexity of the request and how much work the Agent does* ([créditos](https://www.framer.com/help/articles/how-ai-credits-and-agents-pricing-work/)). Blog 16 jun 2026: la base es **GPT 5.5 = 1×**. Ops típicas en esa base: small edit ~50 · large edit ~100 · responsive ~150 · landing ~300.

| Modelo | Esfuerzo (créditos vs GPT 5.5) | Velocidad | Banda | Fuente |
|---|---|---|---|---|
| **GPT 5.6 Luna** | **0.4×** | 2× más rápido que cualquier modelo anterior | Mínimo | [GPT 5.6](https://www.framer.com/updates/gpt-5-6) |
| **Sonnet 5** | **0.6×** | Default, eficiente | Bajo | [Sonnet 5](https://www.framer.com/updates/sonnet-5) |
| **GPT 5.6 Terra** | **0.6×** | ~2× vs GPT 5.5 en tests posteriores | Bajo–medio | [GPT 5.6](https://www.framer.com/updates/gpt-5-6) |
| **GPT 5.5** | **1×** (base) | Media | Medio | [Blog créditos](https://www.framer.com/blog/ai-credits-simpler-plans-and-lower-prices/) |
| **GPT 5.6 Sol** | **1×** (mismo que 5.5) | Media | Medio–alto creativo | [GPT 5.6](https://www.framer.com/updates/gpt-5-6) — **no usar** |
| **Opus 5** | **1.2×** vs Sol (≈ 1.2× la base) | 1.5 min más rápido que Opus 4.8 en nav | Alto | [Opus 5](https://www.framer.com/updates/opus-5) |
| **Opus 4.8** | **1.8×** | Más lento que Opus 5 | Más alto que 5 | Blog 16 jun; solo fallback |
| **Fable 5** | **2×** (≈ 3.3× Sonnet 5) | Proactive, gasta más | Máximo | [Fable 5](https://www.framer.com/updates/fable-5) — **no usar** |

**Reasoning también gasta esfuerzo:** Light = edit corto (~50 en base). Higher = el Agent planea y trabaja más (~100–300 en base). Fast Mode Off: no dispares tokens extra.

Estimación por fase = (tipo de op) × (multiplicador). No es una factura; es el orden de magnitud que publica Framer.

| # | Modelo | Reasoning | Tipo de op (base) | Esfuerzo | ≈ créditos |
|---|---|---|---|---|---|
| 01 | Luna 0.4× | Higher | Large CMS ~100 | Bajo | ~40 |
| 02 | Luna 0.4× | Light | Small/large replace ~50–100 | Mínimo | ~20–40 |
| 03 | GPT 5.5 1× | Light | Small/large copy ~50–100 | Medio | ~50–100 |
| 04 | Luna 0.4× | Higher | Large CMS ~100–150 | Bajo–medio | ~40–60 |
| 05 | Luna 0.4× | Light | Small link/label ~50 | Mínimo | ~20 |
| 06 | Sonnet 5 0.6× | Light | Small edit ~50 | Bajo | ~30 |
| 07 | Terra 0.6× | Higher | Large audit ~100–150 | Medio | ~60–90 |
| 08 | Opus 5 1.2× | Higher | Large form on existing page ~100–200 | Alto | ~120–240 |
| 09 | Sonnet 5 0.6× | Light | Small/large ~50–100 | Bajo | ~30–60 |
| 10 | Sonnet 5 0.6× | Higher | Large site-wide ~100–150 | Medio | ~60–90 |
| 11 | Sonnet 5 0.6× | Light | Small contrast ~50 | Bajo | ~30 |
| 12A | Terra 0.6× | Higher | Large audit ~100–200 | Medio | ~60–120 |
| 12B | Sonnet 5 0.6× | Light | Small edit ~50 | Bajo | ~30 |

Pack completo (13 chats, **sin páginas nuevas**): **aprox. 550–1.000 créditos**. Lo único alto es **08 (Opus 5 + Form en Contact)**. Luna cubre CMS. 05 y 11 ya no son Opus.

| # | Modelo | Efecto en esta fase | Esfuerzo | Skill |
|---|---|---|---|---|
| 01 | Luna | CMS rápido: slugs y binds del 404 | Bajo (~40) | `/cms` |
| 02 | Luna | Find-replace de tels/socials | Mínimo (~20–40) | `/component` |
| 03 | GPT 5.5 | Solo copy; no rediseña | Medio (~50–100) | ninguna |
| 04 | Luna | Schema + bind de 6 properties | Bajo–medio (~40–60) | `/cms` |
| 05 | Luna | VIEW de Neighbourhoods → `/properties` existente | Mínimo (~20) | `/component` |
| 06 | Sonnet 5 | Swap de 2 fotos, sin look nuevo | Bajo (~30) | `/cms` |
| 07 | Terra | Audit SEO/lang/OG/alt | Medio (~60–90) | `/seo` (o ninguna) |
| 08 | Opus 5 | Form nativo **en Contact** (no página nueva) | Alto (~120–240) | `/component` |
| 09 | Sonnet 5 | Variants hover/pressed | Bajo (~30–60) | `/component` |
| 10 | Sonnet 5 | Tags y line-height | Medio (~60–90) | `/layout` (o ninguna) |
| 11 | Sonnet 5 | Contraste + acento, sin Privacy | Bajo (~30) | `/component` |
| 12A | Terra | Audit hygiene site-wide | Medio (~60–120) | `/audit` (o ninguna) |
| 12B | Sonnet 5 | Instructions, sin canvas | Bajo (~30) | ninguna |

---

## 01 — Notes CMS (404)

| | |
|---|---|
| **Modelo** | GPT 5.6 Luna |
| **Efecto** | El más rápido en CMS. Arregla slugs/binds del 404 sin rediseñar. Higher: planea schema antes de borrar el item roto. |
| **Esfuerzo** | Bajo. Luna 0.4× × large CMS ~100 → **~40 créditos**. |
| **Skill** | `/cms` |
| **Reasoning** | Higher |
| **@** | Notes collection, `@Home` `@Notes` `@Contact` |

```
/cms

Inspect the Notes CMS collection and every link to a note on Home, Notes, and Contact.

Problems to fix (do not redesign):
1. Home journal card “The case for waiting” currently links to /notes/:Jd2WAsZn3 (raw CMS id) and 404s. Create or repair a real CMS item titled “The case for waiting.” Human slug: the-case-for-waiting. Category: COUNSEL. Excerpt (British English): “A market that rewards speed makes patience the rarest luxury — the right address is worth the wait.” Bind the Home card title, date, category, excerpt, and URL entirely from CMS — no overlay/static text.
2. Home journal card “On finding quiet in Marylebone” currently points at /notes/on-proportion-light-london-row-house. Do **not** create an eighth item. Retarget that card to the existing item and show that item’s real title, date, and category (“On proportion, light, and the London row house”).
3. Keep exactly **7 published** notes. The Journal already has 7 valid items and none is “The case for waiting.” To make room, **unpublish** (do not delete unless you must) **“Why mews houses reward a slower second visit.”** (`/notes/mews-houses-second-visit`). It duplicates “What a second viewing is really for.”
   Do **not** unpublish: “On instructing an agent without losing your nerve.”; “Field notes from the Colville terrace.”; “Notting Hill after the rain.”
4. Published set after the change (renumber 01–07 with no gaps, no Limit on the Notes index):
   - The case for waiting
   - On proportion, light, and the London row house
   - What a second viewing is really for
   - On instructing an agent without losing your nerve
   - Reading a façade as a ledger of ownership
   - Notting Hill after the rain
   - Field notes from the Colville terrace
5. Delete or unpublish any item whose slug is an id (contains “:” or looks like Jd2WAsZn3).
6. Every featured/index card must be a CMS list or bound fields — no hardcoded titles on top of the wrong item.

Report: collection fields, each of the 7 slugs, which Home cards bind to which items, and any leftover 404 links.
```

---

## 02 — Teléfonos y socials

| | |
|---|---|
| **Modelo** | GPT 5.6 Luna |
| **Efecto** | Find-replace cross-site. Unifica tres tels y socials. Light: no hay schema que planear. |
| **Esfuerzo** | Mínimo. Luna 0.4× × small/large ~50–100 → **~20–40 créditos**. |
| **Skill** | `/component` |
| **Reasoning** | Light |
| **@** | Header overlay, Footer, `@Contact` |

```
/component

Unify contact data across Header overlay, Footer, and Contact. Use component variables (or shared text) so buyers change this once.

Set exactly:
- Email enquiries@arbour.london with mailto:enquiries@arbour.london
- Mayfair +44 20 7946 0810 with tel:+442079460810
- Cotswolds +44 1608 649 220 with tel:+441608649220
- Overlay / header phone = Mayfair only. Remove +44 20 7351 8800 everywhere.
- Overlay labels Instagram, LinkedIn, X (Twitter) must link to:
  https://www.instagram.com/arbour.london
  https://www.linkedin.com/company/arbour-london
  https://x.com/arbourlondon
- Remove every href to https://www.framer.com/@builtbykern/

Do not restyle the overlay. Keep ARBOUR ©, menu items, and layout.
If socials cannot be real demo URLs, remove the three labels rather than pointing at Framer.

Scan the whole project for leftover 7351 8800 and @builtbykern. List remaining tel: and social hrefs.
```

---

## 03 — Copy canon

| | |
|---|---|
| **Modelo** | GPT 5.5 |
| **Efecto** | Copy-heavy: 1999 vs 2018, grammar, numeración. No rediseña si el prompt lo prohíbe. |
| **Esfuerzo** | Medio. GPT 5.5 1× × copy ~50–100 → **~50–100 créditos**. |
| **Skill** | ninguna |
| **Reasoning** | Light |
| **@** | `@Home` `@About` `@Properties` `@Notes` |

```
Copy-only pass. Do not change layout, type sizes, colors, or images.

Canon:
- The agency was founded in 1999.
- The stat “26 yrs” / “INDEPENDENT 26 yrs” stays.
- Replace every “EST. 2018” and “Est. 2018” with “EST. 1999”.
- Site/page descriptions that say “since 1999” are correct; keep them.

Home featured residences:
- If the Home list is limited to 3, the label must say featured (e.g. “03 FEATURED — LONDON & COUNTRY”), not imply the whole stock.
- Card numbers must be ( 01 ) ( 02 ) ( 03 ) — never two cards labelled ( 02 ).
- Each featured card needs the same VIEW → treatment (Cheyne Walk already has it; Frognal and Bibury must match the component).

Fix remaining grammar without rewriting the brand voice. Known broken line on Home journal:
“Market that rewards speed, patience is the rarest luxury. Note on and the right address.”
must become the Contact version:
“A market that rewards speed makes patience the rarest luxury — the right address is worth the wait.”
(If phase 01 already bound this from CMS, verify the CMS excerpt — do not overlay static text.)

British English throughout. No American theater/judgment spelling where the site already uses theatre/judgement.

List every string you changed.
```

---

## 04 — Properties CMS bind

| | |
|---|---|
| **Modelo** | GPT 5.6 Luna |
| **Efecto** | CMS masivo: fields, coords, rooms únicos, contadores. Higher: decide binds antes de editar 6 ítems. |
| **Esfuerzo** | Bajo–medio. Luna 0.4× × large CMS ~100–150 → **~40–60 créditos**. |
| **Skill** | `/cms` |
| **Reasoning** | Higher |
| **@** | Properties collection, property detail template, `@Home` `@Properties` |

```
/cms

Fix the Properties CMS and the property detail layout template. Do not redesign the template.

1. Add or connect CMS fields (clear names) for:
   - Coordinates (or separate lat/long + neighbourhood label)
   - Neighbourhood / area (Chelsea, Notting Hill, Hampstead, The Cotswolds)
   - Six unique “rooms” (title + short paragraph each) OR remove the shared rooms block if you cannot give unique copy per house
2. Stop hardcoding “51.5074° N — 0.1278° W · CHELSEA” on the layout template. Frognal must not say Chelsea. Bibury must not say Chelsea. Bind from the item.
3. The block “What the house keeps, day after day” is currently identical on Cheyne Walk, Frognal, and Bibury (garden court, kitchen, study, baths, terrace, cellar). Write unique rooms that match each house’s story (riverside Chelsea / Georgian Hampstead / Cotswolds manor / etc.).
4. Home featured list: Limit 3 is OK. Properties index: no Limit — show all published items (currently 6). Filters STATUS / AREA / BUDGET / BEDS must keep working.
5. Any on-page count (“06 AVAILABLE”) must come from the collection length, not a static “06”.
6. Particulars line at the bottom of each detail page should already be unique — keep it bound.

Use existing photography; do not swap heroes here (phase 06).

Report fields added, which layout layers are now bound, and a one-line rooms summary per slug.
```

---

## 05 — Neighbourhoods VIEW (páginas existentes)

| | |
|---|---|
| **Modelo** | GPT 5.6 Luna |
| **Efecto** | Find-replace de links/labels. No crea collection ni detail. |
| **Esfuerzo** | Mínimo. Luna 0.4× × small ~50 → **~20 créditos**. |
| **Skill** | `/component` |
| **Reasoning** | Light |
| **@** | `@Neighbourhoods`, `@Properties` |

```
/component

Do not create any new pages, routes, CMS collections, or detail layouts.

Keep the existing Neighbourhoods index look.

Each of the four cards (Chelsea, Notting Hill, Hampstead, The Cotswolds) currently sends VIEW → to /properties with no explanation.

Preferred: point VIEW at the existing /properties page with that AREA filter already applied, if the project can do that without a new page.
If a pre-filtered URL is impossible, keep href=/properties and change the control label to “See residences in this area” (British English, Space Mono, same treatment as other VIEW → links).

Do not add neighbourhood detail pages. Do not add a Territories collection.
```

---

## 06 — Assets vs copy

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Efecto** | Edit cotidiano con criterio visual. Elige foto Chelsea/Cotswolds. Luna iría más rápido y fallaría el match. Opus sobra y toca layout. |
| **Esfuerzo** | Bajo. Sonnet 5 0.6× × small ~50 → **~30 créditos**. |
| **Skill** | `/cms` |
| **Reasoning** | Light |
| **@** | Properties collection (Cheyne Walk, Bibury) |

```
/cms

Replace misleading heroes only. Do not restyle pages.

Cheyne Walk Riverside Residence copy describes Thames / Chelsea / Battersea. The current hero reads as a Manhattan skyline. Swap the hero (and any identical thumbnails) for a licensed image that reads as London riverside or Chelsea interior with river/city-of-London character — not One World Trade Center.

Bibury Stone Manor copy describes honey-stone, seventeenth-century, gravel drive, Cotswolds. The current hero is an urban garage door. Swap for honey-stone manor / Cotswolds vernacular.

If you cannot find an appropriate Unsplash/Framer stock match, leave the slot marked and do not use another US skyline.

Add meaningful alt text on the new images (not empty, not “Property detail photograph”).

List old vs new asset names per slug.
```

---

## 07 — SEO, lang, favicon, OG, alt

| | |
|---|---|
| **Modelo** | GPT 5.6 Terra |
| **Efecto** | Audit + consistency barato. Llena lang/favicon/OG/alt. No reescribe H1 ni el look. |
| **Esfuerzo** | Medio. Terra 0.6× × large audit ~100–150 → **~60–90 créditos**. |
| **Skill** | `/seo` si está en el menú `/`; si no, ninguna |
| **Reasoning** | Higher |
| **@** | Site Settings, todas las páginas |

```
SEO and site settings pass. Do not redesign.

1. Site language = English (html lang en).
2. Replace the default Framer favicon (default-favicon-light.v1.png) with a simple Arbour mark consistent with the wordmark — cream/charcoal, no extra decoration.
3. Every indexed page already has a unique title and description — keep them; fill any blank. Add a unique Open Graph image per main page (Home, Properties, Neighbourhoods, Notes, About, Contact) that actually represents that page. CMS detail pages should use the item image as OG where possible.
4. Images that are content (heroes, property photos, journal photos): write specific alt text. Decorative rules/icons may keep empty alt.
5. Do not stuff keywords. Do not change visible H1s.

Report: lang, favicon path, pages missing OG before/after, count of alts filled.
```

---

## 08 — Forms y labels

| | |
|---|---|
| **Modelo** | Opus 5 |
| **Efecto** | Multi-paso con encaje visual: Form nativo, labels, success/error. `/code` lo haría en React; Opus debe quedarse en canvas. |
| **Esfuerzo** | Alto. Opus 5 1.2× × large/página ~100–200 → **~120–240 créditos**. |
| **Skill** | `/component` |
| **Reasoning** | Higher |
| **@** | `@Contact` `@Home` `@Properties` |

No uses `/code`. Form nativo.

```
/component

Forms and labels only. Use native Framer Form. Do not write a code component. Do not create a new page — edit Home, Properties, and Contact in place.

1. Home newsletter: visible label (or aria-label) for the email field — not placeholder-only. Placeholder may stay “your@email.com”. Submit needs a success state and an error state (invalid/empty). Keep SUBSCRIBE → styling.

2. Properties filters: STATUS, AREA, BUDGET FROM, BUDGET TO, BEDROOMS, CLEAR must have associated labels (the existing small caps labels can be the real labels). Do not break filter logic.

3. Contact page currently has mailto only. Add a native enquiry form in the existing cream editorial language:
   - Name, Email, Message, optional Property interest
   - Labels on every field
   - Submit in existing button style
   - Success + error states
   Keep the mailto / tel blocks. Do not replace the headline “The first conversation stays between us.”

British English. No extra sections, no new colors except existing olive/charcoal/cream/lime if already used.

List components created and which pages they sit on.
```

---

## 09 — Hover / pressed

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Efecto** | Micro-edits: variants Hover/Pressed. Resting igual. Light: no hay página nueva que planear. |
| **Esfuerzo** | Bajo. Sonnet 5 0.6× × small/large ~50–100 → **~30–60 créditos**. |
| **Skill** | `/component` |
| **Reasoning** | Light |
| **@** | Header, Footer, Home, cards Properties/Notes |

```
/component

Add consistent Hover and Pressed (active) states to every clickable text link, text button, and card that already has a link. Do not restyle the resting state.

Known gaps on Home: EXPLORE →, VIEW ALL →, VIEW ALL NOTES →, Cheyne Walk featured card, both journal cards. Overlay nav links and footer links too.

Keep it on-brand: opacity, underline, or olive/charcoal shift — no new colors, no bounce, no scale >1.02.
On Phone breakpoint: disable hover (or use a variant with no hover) so tap does not stick in a hover appearance. Pressed may remain.

Cursor pointer on all of the above.

List components/variants you edited.
```

---

## 10 — Semántica y type

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Efecto** | Layout direction (Help: default). Tags y line-height. Higher: mapea landmarks sin romper stacks. No cambia typeface. |
| **Esfuerzo** | Medio. Sonnet 5 0.6× × large site-wide ~100–150 → **~60–90 créditos**. |
| **Skill** | `/layout` si está en el menú `/`; si no, ninguna |
| **Reasoning** | Higher |
| **@** | Layout templates Header/Footer, text styles |

```
Accessibility tags and type metrics only. Do not change the look except where a 1.0 line-height clips descenders.

1. Assign semantic tags: header (site header), nav (overlay + footer nav), main (page content), footer, section per major block. Keep a single H1 per page. Do not turn every frame into a heading.
2. Display / H1 text style: line-height at least 1.05 (Home H1 is 84px / 84px today — too tight for “Journal” / “judgement”). Keep Fraunces. Keep tracking close to current.
3. Space Mono 11px may stay for coordinates, eyebrows, and captions. Do not use 11px for long body paragraphs — those should use the existing body style (readable, ≥14px if a body style exists; do not invent a new font).
4. 404 page should keep its custom layout but include a way back (already “RETURN TO ARBOUR”) and nav or logo to home.
5. Three breakpoints only. No overflow. If a tag change breaks a stack, fix the stack, don’t add a breakpoint.

Report tag changes per page and the new H1 line-height.
```

---

## 11 — Contraste y acento

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Efecto** | Edit cotidiano: scrim + un acento. Sin páginas legales. |
| **Esfuerzo** | Bajo. Sonnet 5 0.6× × small ~50 → **~30 créditos**. |
| **Skill** | `/component` |
| **Reasoning** | Light |
| **@** | `@Home` `@About`, Properties CLEAR, `@Contact` |

```
/component

Two polish items on existing pages only. Do not create pages. Do not redesign the brand.

1. Contrast: Home and About heroes have small white meta on bright sky. Add a subtle scrim or move meta onto a darker part of the photo so WCAG 4.5:1 holds for that small Space Mono. Do not flatten the photography.
2. CLEAR button on Properties uses lime. Either keep lime as the single accent and use it on primary buttons consistently, or retint CLEAR to olive/charcoal already in the system. Pick one accent. Check 4.5:1 on the label.

Do not add Privacy, Terms, or cookie pages. If the newsletter/contact form needs a legal note, add one short line on the existing Contact or newsletter block: “Demo template — replace with your own privacy policy before publishing.” Same type styles. No new route.

List contrast method used on heroes. List no new pages.
```

---

## 12A — Hygiene audit

| | |
|---|---|
| **Modelo** | GPT 5.6 Terra |
| **Efecto** | Pase de consistencia site-wide: links, layers, styles huérfanos. Corrige hygiene, no el art direction. |
| **Esfuerzo** | Medio. Terra 0.6× × large audit ~100–200 → **~60–120 créditos**. |
| **Skill** | `/audit` si está en el menú `/`; si no, ninguna |
| **Reasoning** | Higher |
| **@** | Proyecto entero |

```
Audit then fix only hygiene. Do not change art direction.

Scan for:
- Broken internal links (none should 404 except the true 404 page)
- Empty CMS items
- Default layer names (Frame 1, Rectangle 2) — rename descriptively
- Unused styles, unused components, unused pages
- More than 3 breakpoints
- Missing reduced-motion respect in Site Settings (enable Framer’s prefers-reduced-motion option)
- Images without alt that are not decorative
- Hardcoded colors that should be color styles
- Creator promo / leftover @builtbykern links
- Performance: oversized uncompressed images, excessive blurs (>10)

Fix what you can without visual change. Do not create new pages. Report what you fixed and what needs a human.

Do not write Template Agent Instructions in this chat. Do not publish.
```

---

## 12B — Instructions del comprador

New Chat. No reciclar 12A.

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Efecto** | Texto estructurado, edit cotidiano. Escribe instructions del comprador. No reabre el canvas. |
| **Esfuerzo** | Bajo. Sonnet 5 0.6× × small ~50 → **~30 créditos**. |
| **Skill** | ninguna |
| **Reasoning** | Light |
| **@** | Site Settings / Template Agent instructions |

```
Do not edit the canvas look. Write Template Agent Instructions for buyers of this template (Help: AI-ready template).

Tell future in-canvas Agents:
- preserve Fraunces + Space Mono, cream, 72px-class padding, hamburger overlay, custom 404
- edit CMS and component variables for contact/socials
- do not add breakpoints, lorem, or new pages
- prefer native Form, CMS, and component variants over code

Paste those instructions into the template’s custom Agent instructions field if it exists; otherwise output them in chat for me to paste.

Finally list remaining manual checks: Framer Performance panel, Desktop/Tablet/Phone walkthrough, form submit, filters, all 7 notes, Neighbourhoods index (4 cards → /properties), 6 properties.

Do not publish.
```
