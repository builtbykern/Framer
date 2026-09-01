# Fase 09B — Home Phone: una fila por serie

**Sustituye el snap del Plane.** En Phone 390 el Home **no** es el Drift Plane. Es un archivo vertical: **una fila (bloque) por Work**, stills en grid 2 col, `home-bg`, tipo quieto. Desktop y Tablet siguen siendo el Plane.

No clonar la captura de referencia: no `#000`/`#FFF`, no radios 8–12px, no fechas como título de columna, no links Work/Devlogs/Gallery, no iconos. Estructura sí: filas, meta pequeña, stills agrupados, mucho aire entre series.

Canon: [`00-visual-system.md`](00-visual-system.md) · CMS: [`00-cms.md`](00-cms.md).

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **Opus 5** (fallback 4.8 → 4.7) |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/layout`** |
| @ | `@Home`, Work collection, Nav |
| No usar | Fable, Sol, `/code`, Unsplash, Index `/work`, lightbox, radios, Plane snap |

Opus: juicio visual del archivo phone. **Cero `/code`.**

## Prompt (después de constraints)

```
/layout

ONE JOB: Phone 390 Home only. Desktop 1440 and Tablet 768 stay the Drift Plane. Do not rewrite pan physics. Do not add a /work index route.

A. BREAKPOINT SPLIT

1. Home, Phone 390:
   - Hide the Drift Plane instance (visible false). Do not delete it.
   - Hide the hint “Pan the plane · click a series”.
   - Page scrolls. Fill home-bg #050505. Nav stays BrandRoll (closedOnDark, paper VALE, auto-roll).

2. Home, Desktop and Tablet:
   - Plane stays fullscreen. Do not add the phone list here. Do not add a second hero.

B. PHONE LIST — one row per series

3. On Home Phone, a Collection List of Work, Featured = true, all 7. Sort Year descending. Gap 56 between items. Padding 72 20 48 (clear the Nav). Width 100%.

4. Each item is one vertical block (not a card, no fill, no shadow, no radius):
   - Row of meta, gap 12, margin bottom 14:
     - Title: Mark, paper, 14px. Link to that item’s CMS detail.
     - Year: Label, muted, uppercase.
     - Optional Label muted: “5 stills” (or gallery count). No calendar date as the title.
   - Then a 2-column grid of that item’s Gallery stills. Gap 8. Each cell: width 1fr, aspect-ratio 1/1, object-fit cover, radius 0, overflow hidden. Placeholders ink/muted are fine until Lummi.
   - If Gallery is empty, show Cover in the same 2-col grid (repeat Cover up to 4 cells) — do not fetch Unsplash.
   - The whole block (title + grid) links to /work/{slug}. No lightbox. No overlay viewer.

5. FAIL if:
   - This list is visible at 1440 or 768
   - Images have radius > 0
   - Background is #000 or text is #FFF
   - You added Work / Devlogs / Gallery links in the bar
   - You created /work index
   - You used /code or edited Drift Plane physics
   - Masonry / irregular collage / ken burns

Preview 390: scroll seven dark rows, each a title + tight still grid; tap opens the series. Preview 1440: still only the Plane.

Report: Collection List filters, how Plane is hidden on Phone, grid gap, confirm radius 0 and no /code.
```

## Definition of done

- 1440 / 768: Drift Plane. 390: 7 filas CMS, grid 2 col, `home-bg`, radio 0.
- Cero snap `/code`. Cero Index.

## No tocar

Física del Plane. Detail split. Form. Lummi (fase 12 bindea Gallery).

## Verificación humana

390: scroll, 7 series, tap → slug. 1440: plane intacto. ¿Radios / blanco puro / nav extra? Mal.

## Siguiente

Chat nuevo → fase 10A. **No** correr el antiguo snap `/code`.
