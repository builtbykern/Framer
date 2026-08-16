# Restante — Agent tab (post 16:30 UTC)

Un **New Chat** por bloque. Branch `marketplace-qa`. Fast Mode Off. Constraints de `00-constraints.md` antes. Nunca Fable 5, Sol, `/code`. **No crear páginas/rutas nuevas** (el 404 de Chelsea salió de un href huérfano).

Pack: **~350–560 créditos**.

---

## 01 — 404 Home Chelsea

| | |
|---|---|
| **Modelo** | GPT 5.6 Luna |
| **Reasoning** | Light |
| **Skill** | `/component` |
| **Esfuerzo** | ~20 |

```
/component

Do not create pages or CMS collections.

Home Territories “SEE RESIDENCES IN THIS AREA” links to /neighbourhoods/chelsea and 404s. That route does not exist.

Retarget it to the existing /neighbourhoods page (preferred) or /properties. Scan the project: zero hrefs to /neighbourhoods/chelsea, /neighbourhoods/notting-hill, /neighbourhoods/hampstead, /neighbourhoods/the-cotswolds, or /neighbourhoods/cotswolds.

Keep the Home look. List remaining neighbourhood hrefs.
```

---

## 02 — Neighbourhoods: llenar la página existente

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Reasoning** | Higher |
| **Skill** | `/layout` si está en `/`; si no, `/component` |
| **Esfuerzo** | ~60–90 |

```
/layout

Existing /neighbourhoods page only. Do not create territory detail pages or new routes.

The page feels empty next to Home. Desktop shows a large gap under THE DIRECTORY; mobile already has four photo+copy cards. Fill the index to Home density without new URLs.

For Chelsea, Notting Hill, Hampstead, The Cotswolds, each module needs:
- Photograph (keep current if decent)
- Title + 2–3 British-English street sentences (existing blurbs can stay, tighten orphans)
- Honest stock count from Properties CMS (Chelsea 2, Notting Hill 2, Hampstead 1, Cotswolds 1). Remove “5 PROPERTIES AVAILABLE” and fake “001 PROPERTIES IN THIS AREA” indexes used as counts.
- Optional: coords already used on Home for Chelsea (51.4875° N — 0.1687° W) and one featured residence name linking to that property
- CTA “See residences in this area” → /properties (AREA filter if possible without a new page)

Keep METHOD / “How we read a place.” Add one short extra block if the page still dies after two scrolls (e.g. four one-line street notes). Same type: Fraunces + Space Mono, cream #F9F8F3, ~72px-class side padding like Home — not a 1080px-centered column with 180px rails.

Three breakpoints. No overflow. No lorem. Report modules and counts.
```

---

## 03 — Section BG full-bleed + measure único

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Reasoning** | Higher |
| **Skill** | `/layout` si está en `/`; si no, `/component` |
| **Esfuerzo** | ~60–90 |

```
/layout

Do not redesign. Do not add breakpoints.

Home sections with fill colors are 1440px (full viewport) with ~72px content inset. Properties and Neighbourhoods paint section backgrounds at 1080px (180px gutters). Properties stats bar is 1200px charcoal with 120px cream rails.

Rule for every page (Home, Properties, Neighbourhoods, Notes, About, Contact, property/note details):
- Section / stack that has a background color or image: width Fill, left 0, so the bg is the full site width.
- Inner content (text, grids, cards): same measure as Home (~72px desktop side padding, consistent tablet/phone). Do not wrap the colored frame in a max-width 1080/1200 stack.

Check dark/cream bands especially: Home process/stats, Properties stats and enquiry, Notes editorial, Contact journal, property rooms/particulars.

No horizontal overflow. Desktop 1440, Tablet 768, Phone 390.

Report each section that was inset and the new widths.
```

---

## 04 — Notes 01–07

| | |
|---|---|
| **Modelo** | GPT 5.6 Luna |
| **Reasoning** | Higher |
| **Skill** | `/cms` |
| **Esfuerzo** | ~20–40 |

```
/cms

Do not add/unpublish notes. Keep 7 published. Waiting already has a body.

Renumber 01–07 with no gaps (today 01,02,03,04, skip 05, 06, 07). Home journal card for waiting still shows [ 06 ] while the article is [ 04 ] — bind the number from CMS.

Report the 7 numbers and Home card numbers.
```

---

## 05 — lang / favicon / alts

| | |
|---|---|
| **Modelo** | GPT 5.6 Terra |
| **Reasoning** | Higher |
| **Skill** | `/seo` si está en `/`; si no, ninguna |
| **Esfuerzo** | ~40–60 |

```
SEO/settings only. OG images already exist — do not replace unless blank.

html lang=en. Replace default-favicon-light.v1.png with a simple Arbour mark. Property images still titled “Property hero photograph” / “Property gallery photograph”: write specific alts. Cheyne/Bibury alts already good — leave them.

Report lang, favicon, alts filled.
```

---

## 06 — Hover

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Reasoning** | Light |
| **Skill** | `/component` |
| **Esfuerzo** | ~30–60 |

```
/component

Hover + Pressed on clickable text links, text buttons, linked cards. Resting state unchanged.

Home still dead: EXPLORE →, VIEW ALL →, VIEW ALL NOTES →, featured cards, journal cards. Overlay + footer too.

Opacity, underline, or olive/charcoal only. Phone: no hover. Cursor pointer.
```

---

## 07 — Tags + scrim + leftover Privacy

| | |
|---|---|
| **Modelo** | Sonnet 5 |
| **Reasoning** | Light |
| **Skill** | `/component` |
| **Esfuerzo** | ~30–50 |

```
/component

Existing pages only. No new routes. Line-height already ~1.05 — do not retune type. CLEAR is already olive — do not retint.

1. Semantic header on marketing pages (header 0 today). Keep one H1.
2. Home/About hero: scrim or move small white meta onto dark sky (4.5:1). Do not flatten photos.
3. Replace leftover “DEMO TEMPLATE — REPLACE THIS NOTE WITH YOUR PRIVACY POLICY BEFORE PUBLISHING.” with one quiet demo line in existing type, or remove it. No /privacy page.

List changes. List no new pages.
```
