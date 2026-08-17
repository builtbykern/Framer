# Fase 03C — Nav Open visual (especializado)

**Prerrequisito:** Nav con tres variants, plus a la **derecha**, instancia en cada página. Si Open es paper vacío con dos palabras, este chat lo sustituye. Settle (blur 6 + bg baja) es **03D**.

**Objetivo:** `open` es una **página visual**. El still manda (~67%). El tipo es columna editorial (~33%), paper, no sidebar negra. Mix **Coad split × overlay Gregor**. No clonar ninguno.

Canon: [`00-gregor-nav.md`](00-gregor-nav.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **Opus 5** (fallback 4.8 → 4.7) |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/component`** |
| @ | Nav (selecciona el componente). Si hace falta: Home |
| No usar | Fable, Sol, `/code`, Layout Template, layer Veil, hamburger, X, Wipe, Unsplash, segundo still, bio |

Este chat **no** toca Drift Plane ni añade Page Effect. Solo variant `open` (+ plus a la derecha si aún está al centro).

## Prompt (después de constraints)

```
/component

ONE JOB: redesign Nav variant `open` so the menu is a visual page. The still is the menu. Type is a caption column.

This is not a clone.
- From Gregor: only the overlay *behavior* — plus opens a full-viewport layer; it is not a route. Do not copy centered plus, X, Overview/Work, long bio, Neue Rational, or empty paper with two words.
- From Ian Coad (structure only): ~33 / 67 split, photograph dominates, type sits in a quiet editorial column. Do not copy the black sidebar or pixel font.
- Drift: paper #F6F3EE + ink #111111. Mark / Display / Lead / Label only. Radius 0.

Do not restyle closed variants except: plus must sit TOP-RIGHT on both closedOnDark and closedOnLight (not center). Empty center. VALE stays left.
Do not touch Drift Plane, CMS, Info/Contact/404 page layouts. If a Scrim already exists inside Nav, leave it. Do not add a Page Effect Fade.
Do not create a Layout Template. Do not use Unsplash.

FAIL if any of these are true when you finish:
- Open is two Display words on empty paper
- The still is a thumbnail, card, inset, or less than ~60% of the desktop width
- Close is an X, a hamburger, or sits in the center
- Plus is still centered when closed
- Overlay lists Overview, Work, Journal, or a biography paragraph
- A dim/gradient covers the whole still (a tiny top-right scrim for Close is OK)
- Ken burns loop, glass, drop shadow, or radius on the still

DESKTOP 1440 / TABLET 768 — variant open

1. Full viewport (100vw × 100vh). Grid two columns, gap 0, no outer padding:
   - LEFT ~33% (minmax 280px): fill paper #F6F3EE
   - RIGHT ~67% (1fr): the still, nothing else

2. LEFT column — same editorial stack as the Work-detail sidebar, not a nav bar:
   Padding 96 36 40. Column. Justify space-between. Ink on paper.
   - Top: VALE in Mark → `/`
   - Middle: Info → /info then Contact → /contact, Display, stacked, gap 8, ink. Under them one Lead line only: “Selected work is published as series.” No second paragraph.
   - Bottom: Label muted, uppercase: studio@vale.work (mailto:studio@vale.work) and vale.work (https://www.instagram.com/vale.work), gap 18, row or wrap.
   - sr-only heading “Menu”. No visible H1 besides the Display links.

3. RIGHT column — the visual:
   - One image, width 100%, height 100vh, object-fit cover, object-position center, overflow hidden, radius 0, no border, no caption, no credit on the photo.
   - Component variable `menuStill` (Image). Until Lummi exists: solid fill ink #111111 (not a stock photo).
   - This crop is allowed (menu still ≠ detail gallery). Do not letterbox. Do not put two images.

4. Close — same TOP-RIGHT slot as the plus (not center):
   - The word Close in Label (IBM Plex Mono, uppercase). Never an X glyph. Never “MENU”.
   - Color paper #F6F3EE so it reads on the still. Hit 32×32 minimum. aria-label “Close menu”.
   - If the placeholder is ink, paper Close is enough. If a future light still kills contrast, add only an 88px-tall scrim in the top-right corner (home-bg 40% → transparent). Never dim the whole photograph.

PHONE 390 — variant open

5. Column, still first (this must still feel like a photo page):
   - Still: width 100%, height 50vh, cover, full bleed, radius 0.
   - Then paper: VALE, Info, Contact, Lead, email / Instagram. Pad 40 20 32.
   - Close top-right OVER the still, color paper.

MOTION (component variants only)

6. Keep existing Tap wiring. If missing:
   - Plus (both closed) → Set Variant open
   - Close → Set Variant Previous
   - Info and Contact = page Links for now (03D adds Scrim delay). Not Set Variant.

7. Transition 0.79s, cubic-bezier(0.77, 0, 0.175, 1):
   - Still: opacity 0→1 and scale 1.03→1 (transform origin center). Y of the 33/67 block is phase 03D (MenuSurface).
   - Left type: opacity 0→1, delay 0.12s. No stagger per line.
   - Plus and Close share the top-right slot: closed plus opacity 1 / Close 0; open reverse. Skip rotateX unless it already works.
   - prefers-reduced-motion: instant, scale 1.

8. Variables on the component: `email`, `instagram`, `menuStill`. Do not hardcode a second address.

Preview at 1440: plus (right) → a photograph fills two-thirds; type lives in a paper column; Close is a word on the still. At 390: still on top, type below. Then close. Home must still be the Drift Plane.

Report: open layout (column widths or phone stack), menuStill variable, Close treatment, whether plus moved to the right.
```

## Definition of done

- Open ≠ Gregor (no plus centro, no X, no Overview/Work).
- Open ≠ paper vacío. Still ≥ ~67% desktop, cover, a sangre.
- Close = palabra, slot derecho. Plus cerrado a la derecha.
- Cero Layout Template. Settle (Scrim + Y) es 03D.

## Verificación humana

1440: ¿el still es la página? Si ves dos palabras en paper, repetir este chat. 390: still arriba. Plus nunca al centro.

## Siguiente

Chat nuevo → fase **03D** (Settle: blur 6px + bg baja). Si Lummi ya existe, `menuStill` en fase 12.
