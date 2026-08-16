# Fuente de verdad — Drift

Datos únicos. Si el canvas contradice este archivo, gana este archivo.

## Identidad

| Campo | Valor |
|---|---|
| Template | Drift |
| Chrome / marca demo | VALE |
| Oficio | Visual director (stills). Sirve a fotógrafo, DP y diseñador cambiando labels de credits |
| Idioma | English |
| Email | studio@vale.work · `mailto:studio@vale.work` |
| Instagram | https://www.instagram.com/vale.work |
| Hint Home | Pan the plane · click a series |

## Rutas permitidas

| Ruta | Página |
|---|---|
| `/` | Home (Drift Plane a viewport) |
| `/work/{slug}` | CMS Work detail |
| `/info` | Info |
| `/contact` | Contact |
| 404 | Custom |

Prohibido: `/work` índice, `/privacy`, `/journal`, `/blog`, cualquier otra ruta.

## Look

Canon de color, tipo, spacing, motion e imagen: [`00-visual-system.md`](00-visual-system.md). No hay un sexto color. No hay cuarta familia. Fase 01 crea exactamente esos styles.

## CMS

Canon de schema e ítems: [`00-cms.md`](00-cms.md). CSV: [`cms/`](../cms/). Tres collections. No aplastar credits ni tags en campos sueltos de Work.

| Collection | Detail | Qué es |
|---|---|---|
| `Tags` | No | Chips. 7 ítems (short, narrative, commission, people, still, place, identity) |
| `Work` | `/work/{slug}` | 7 series. Cover, Gallery, Year, Description, Tags (multi-ref), Featured |
| `Credits` | No | 21 filas. Label + Value + ref Work + Order. Siempre 3 por serie, aunque Value sea `—` |

Work no tiene `Credit*` ni `Tag1`/`Tag2`. Placeholders de Cover/Gallery hasta la fase 12: fill sólido `ink` o `muted`. Cero Unsplash/Lummi hasta el prompt 12.

## Siete series (todos published, Featured = true)

### 1. Salt Light

- Slug: `salt-light`
- Year: 2024
- Credits: director **Mira Lang** · producer **Owen Hale** · awards **YDA Nominee**
- Tags: `short` / `narrative`
- Description: A coastal hour cut as rooms of weather. Still frames from a day that never quite becomes night.

### 2. The Waiting Room

- Slug: `the-waiting-room`
- Year: 2023
- Credits: director **C. Romer** · producer **Nia Voss** · awards **—**
- Tags: `short` / `narrative`
- Description: Two people in a municipal lobby after closing. The work is the fluorescent bank, the chairs, the clock that is wrong.

### 3. Glass Hours

- Slug: `glass-hours`
- Year: 2025
- Credits: director **Vale** · producer **Atelier Norte** · awards **—**
- Tags: `commission` / `narrative`
- Description: An architecture brief shot as weather. Interiors of a house that is mostly sky, stills only.

### 4. Inland Signal

- Slug: `inland-signal`
- Year: 2024
- Credits: director **Vale** · producer **Elena Ruiz** · awards **Festival of the Image, selected**
- Tags: `short` / `place`
- Description: A week away from the water. Heat, distance, and a road that reads longer than it is.

### 5. After the Sitting

- Slug: `after-the-sitting`
- Year: 2023
- Credits: director **Vale** · producer **—** · awards **—**
- Tags: `people` / `still`
- Description: Portraits made after the formal sitting ends. Hands, windows, the clothes people chose when they thought the work was over. (Reads as photography; keep the same credit fields.)

### 6. Red Room Brief

- Slug: `red-room-brief`
- Year: 2025
- Credits: director **Vale** · producer **Vestis Almanac** · awards **—**
- Tags: `commission` / `identity`
- Description: A clothing brief as a private afternoon. Fabric against a rented interior, no set beyond the room and the street below. (Reads as identity/fashion stills.)

### 7. Night Atlas

- Slug: `night-atlas`
- Year: 2022
- Credits: director **Gabe Caste** · producer **Lauren Altieri** · awards **Santa Barbara, 2023**
- Tags: `short` / `narrative`
- Description: Fog on a closed café and the road that serves it. Still frames from a night that arrives faster than the last cars leaving.

## Copy de páginas estáticas

**Info — kicker:** Info

**Info — lead:** Vale is a visual director working in stills. Selected work is published as series — not as a dump of single frames.

**Info — body:** Available for a small number of commissions each year. The plane on the home is the archive. This page is for when you already know the title.

**Contact — kicker:** Contact

**Contact — lead:** Enquiries: studio@vale.work

**404 — kicker:** Missing

**404 — lead:** This series is not on the plane.

**Form fields:** Name, Email, Inquiry (People / Place / Commission / Other), Message. Submit: Send. Success: Received. Vale will write back from the studio address.

## Nav

Componente `Nav` con variants:

- `onDark` — Home. Marca y links en paper/blanco.
- `onLight` — Info, Contact, 404, Work detail. Marca y links en ink.

Links: VALE → `/` · Info → `/info` · Contact → `/contact`

Variables: `email`, `instagram`.

## Drift Plane

- Code component ya existente. No regenerar la física.
- Home: fullscreen, único contenido aparte del Nav y el hint.
- Datos: property control Array (image, title, link) → 7 ítems Featured, link = CMS detail.
- Click (sin drag) = navegar a `/work/{slug}`.
- Phone: un eje + snap (`layout: snap`). Desktop/tablet: `layout: plane`.
- `prefers-reduced-motion`: sin idle drift.

## Detail (Work)

Desktop/tablet: grid 33% / 67%. Izquierda sticky, paper, padding del visual system. Derecha: Gallery stack, gap 0, width 100%, height auto, **sin crop**. Radio 0. Chips 2px.

Orden izquierda: Display title → fila year → Collection List Credits (filtro Work actual, sort Order) → description → Collection List Tags (chips) → pager Previous / Next.

Phone: una columna, meta arriba, gallery abajo.

## Veto

Index `/work`, Privacy, Journal, vídeo, lightbox, Unsplash, Fable 5, Sol, cuarto breakpoint, publicar main, `/code` fuera de 09B.
