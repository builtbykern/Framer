# Sistema visual — Drift

Canon de look. Si el Agent improvisa tipo, color, radio o “un acento”, gana este archivo.

Referencias de estructura, no de copia: Drift Plane (home = canvas), Gregor Collienne (la foto manda, UI quieta, paper), Gionatan Nese (el home es la experiencia), captura Ian Coad (split 33/67, título display, meta en bloques, chips, stills apilados). **No** copiar la sidebar negra de Coad ni el pixel font.

---

## 1. Temperatura

Dos superficies, nunca un toggle dark/light.

| Superficie | Fondo | Texto | Qué es |
|---|---|---|---|
| **Home** | `home-bg` | `paper` | El plane. UI casi invisible. |
| **Resto** | `paper` | `ink` | Info, Contact, 404, Work detail. Editorial. |

La foto (cuando exista) va **a sangre en su columna**, sin marco, sin overlay de gradiente, sin caption encima.

---

## 2. Color styles (exactos, 5, no más)

| Style | Hex | RGB | Uso |
|---|---|---|---|
| `home-bg` | `#050505` | 5 5 5 | Home, plane, scrim del Nav en Home |
| `paper` | `#F6F3EE` | 246 243 238 | Páginas editoriales, overlay Nav, fill del breakpoint (Page Effect) |
| `ink` | `#111111` | 17 17 17 | Texto sobre paper, chrome closedOnLight y open |
| `muted` | `#6B6B6B` | 107 107 107 | Labels, hint, dt, placeholders |
| `line` | `#D9D4CC` | 217 212 204 | Rules 1px, chips, underline de inputs |

Prohibido: acento (naranja, azul Framer, verde), blanco puro `#FFF` (usar `paper`), negro puro `#000` (usar `home-bg`), sombras, blurs > 8px, glass, gradientes de marca. El único degradado permitido: Nav Home, `home-bg` 70% → transparente en ~88px de alto, para leer VALE sobre las fotos.

Contraste: `ink` sobre `paper` y `paper` sobre `home-bg` pasan AA para Body y Label.

---

## 3. Tipografía (Framer fonts, 5 text styles)

Familias: **Syne** (marca y títulos de serie), **Inter** (lectura), **IBM Plex Mono** (meta). No sustituir por Fraunces, Geist, Space Grotesk ni pixel fonts.

Optical: títulos con leading apretado; meta en caja, tracking abierto, never italic en Label.

### Styles a crear en fase 01

Nombres exactos. Tamaños en px. Line-height en decimal.

**Mark** — Syne ExtraBold  
Home y Nav. La palabra VALE.

| BP | Size | Line | Tracking |
|---|---|---|---|
| Desktop 1440 | 15 | 1.0 | 0.06em |
| Tablet 768 | 15 | 1.0 | 0.06em |
| Phone 390 | 14 | 1.0 | 0.05em |

**Display** — Syne ExtraBold  
H1 del Work detail (título de serie). También los dos links del overlay Nav (Info, Contact). No usar en Home visible.

| BP | Size | Line | Tracking |
|---|---|---|---|
| Desktop 1440 | 68 | 0.90 | -0.04em |
| Tablet 768 | 52 | 0.90 | -0.03em |
| Phone 390 | 40 | 0.92 | -0.03em |

**Lead** — Inter Regular  
Lead de Info / Contact / 404. Máximo ~28ch–40ch.

| BP | Size | Line | Tracking |
|---|---|---|---|
| Desktop 1440 | 22 | 1.35 | 0 |
| Tablet 768 | 20 | 1.35 | 0 |
| Phone 390 | 18 | 1.4 | 0 |

**Body** — Inter Regular  
Descripción de serie, bio, valores de credits, inputs.

| BP | Size | Line | Tracking |
|---|---|---|---|
| Desktop 1440 | 15 | 1.55 | 0.01em |
| Tablet 768 | 15 | 1.55 | 0.01em |
| Phone 390 | 15 | 1.55 | 0.01em |

**Label** — IBM Plex Mono Medium  
Nav overlay Close, hint, kicker, dt de credits, chips, pager, botones de form. Siempre **uppercase**, color `muted` salvo estado activo (`paper` en closedOnDark, `ink` en closedOnLight y open).

| BP | Size | Line | Tracking |
|---|---|---|---|
| Desktop 1440 | 11 | 1.2 | 0.14em |
| Tablet 768 | 11 | 1.2 | 0.14em |
| Phone 390 | 10 | 1.2 | 0.12em |

Weights: no Regular en Syne para títulos; no Bold en Inter (el énfasis es tamaño o Syne). Un H1 por página: Home = Mark sr-only “VALE”; Info/Contact/404 = kicker como heading o un H1 Label; detail = Display.

---

## 4. Layout, spacing, cromo

**Breakpoints:** 1440 / 768 / 390. Nada más.

**Espaciado (múltiplos de 4/8):**

| Token | Desktop | Phone | Uso |
|---|---|---|---|
| Page pad X | 36 | 20 | Info, Contact, 404 |
| Nav pad | 22 × 28 | 16 × 20 | Overlay |
| Detail info pad | 96 36 40 | 88 20 32 | Bajo el Nav |
| Detail info gap | 28 | 22 | Entre título / meta / body / chips |
| Measure estrecha | 640–720 | 100% | Info, Contact, 404 |
| Description max | 36ch | 100% | Sidebar |
| Chip pad | 5 × 10 | 5 × 10 | |
| Chip gap | 8 | 8 | |
| Form field gap | 18 | 16 | |
| Gallery gap | **0** | **0** | Stills a sangre, sin filete |

**Radio:** 0 en todo (inputs, botones, imágenes). Chips: **2px** máximo, no pill.

**Bordes:** 1px `line`. Inputs: solo border-bottom, sin caja.

**Sombras:** ninguna.

**Nav:** componente, una instancia por página (no Layout Template). Fixed. Cerrado: VALE izquierda + plus centro. Abierto: variant `open`, overlay paper, plus → palabra **Close**. Cambio de página: Page Effect Fade All Pages. Canon: [`00-gregor-nav.md`](00-gregor-nav.md).

**Hint Home:** Label, `muted`, bottom 24 left 28, `pointer-events: none`.

**Chips:** 1px `line`, Label, `ink` o `muted`. Fondo transparente.

**Pager:** Label, gap 18. Disabled = `muted` al 40%.

**Imágenes detail:** width 100%, height auto, object-fit **none/contain** — **no crop**. El still se ve entero. Plane cards: object-fit **cover** (el componente recorta al marco de la carta).

---

## 5. Motion

| Dónde | Qué |
|---|---|
| Drift Plane desktop | Pan + idle drift (el componente) |
| Drift Plane phone | Un eje + snap |
| Nav plus → Close | Variant `open`. Transition 0.79s, `cubic-bezier(0.77, 0, 0.175, 1)` |
| Nav overlay | Variant del componente. Paper a viewport. No Layout Template |
| Cambio de página | **Page Effect** Fade, Target All Pages, 0.49s, `cubic-bezier(0.5, 0, 0.5, 1)`, delay enter 0.10s. Breakpoint fill = `paper`. Cero Wipe/Slide. Cero layer Veil |
| `prefers-reduced-motion` | Sin idle drift; snap estático; overlay instantánea; Page Effect Instant; sin flip |
| Páginas paper (contenido) | Estáticas. Cero scroll-scrub, ken burns, parallax, stagger de galería |
| Hover Desktop | Opacidad ~0.7 en links. Plane cards: el hover que ya traiga el componente |
| Phone | Hover off |

Nada de Lottie, shaders, Layout Templates, ni layer Veil. Blur solo si el Page Effect lo ofrece (12px). No blur CSS sobre la gallery del detail.

---

## 6. Imagen (Lummi, fase 12)

Hasta la 12: placeholders **sólidos** `ink` o `muted`, no stock.

Cuando existan fotos, son **production stills**, no stock corporate, no ilustración, no 3D toy, no CGI glossy, no neon cyberpunk, no HDR turista.

### Look compartido (las 7 series)

- Color real, un punto apagado (Kodak Vision3 / Cooke S4, no LUT Instagram).
- Luz: ventana, fluorescente, hora azul, tungsteno. Una fuente, no beauty dish.
- Si hay figura: máximo una, no mira a cámara, no sonríe. Varias series van vacías a propósito.
- Cero texto en la imagen, cero logo, cero watermark, cero rebate de película.
- Grain ligero **en la foto**, no overlay CSS en Framer.
- Coherencia de set: misma “película” en las 7. **Todo color**, un poco desaturado. No mezclar B&W.
- Cover: 1 still icónico. **16:9** salvo After the Sitting y Red Room Brief (**4:5**).
- Gallery: **5 stills** por serie (no repetir el cover). Aspectos mezclados (mínimo un portrait y un landscape). ~2400px en el lado largo.

### Vetos de Lummi / plugins

Unsplash, Pexels, Visual Electric “render”. Ilustración flat. 3D clay. Collage. Fake film-perforation frames. Polaroid UI.

### Shot list

No uses un prompt genérico por serie. Canon: [`12-lummi-prompts.md`](12-lummi-prompts.md) — prefijo + look de serie + 1 cover + 5 gallery. Fase que bindea: [`12-lummi.md`](12-lummi.md).

Archivos: `Work/{slug}/{slug}-cover`, `{slug}-01` … `{slug}-05`.

Alts: `Still from {Title}, {one factual noun phrase}.` Nunca “image1”.

---

## 7. Qué no es este look

- Template fotógrafo wedding / masonry / lightbox.
- Portfolio DP con sidebar negra y display pixel (la captura es **estructura**, no paleta).
- Copia de Gregor: no Neue Rational, no X, no Overview/Work. Sí el plus, el overlay paper y el velo blur.
- Agencia con grid de cases y hover de vídeo.
- Dark mode en Info/Contact/detail.
