# CMS — collections Drift

Tres collections. No aplastar credits ni tags en campos sueltos de Work. Canon de ítems: si el canvas discrepa, gana este archivo.

Detail: `/work/{slug}`. Placeholders de imagen hasta fase 12: fill `ink` o `muted`, cero Unsplash/Lummi.

---

## Collection `Tags`

No tiene detail page. Sirve chips.

| Campo | Tipo |
|---|---|
| Title | Title |
| Slug | Slug |

Ítems (published):

| Title | Slug |
|---|---|
| short | short |
| narrative | narrative |
| commission | commission |
| people | people |
| still | still |
| place | place |
| identity | identity |

---

## Collection `Work`

Un ítem = una serie. Detail page **sí**. Slug pattern `/work/{slug}`.

| Campo | Tipo | Uso |
|---|---|---|
| Title | Title | H1 Display |
| Slug | Slug | `/work/{slug}` |
| Cover | Image | Plane + OG. Placeholder sólido hasta 12 |
| Gallery | Gallery | Stack vertical a sangre, **5 stills** en fase 12 |
| Year | Number | Fila meta “year” |
| Description | Plain text | 2–4 frases, Body |
| Tags | Multi-reference → Tags | Chips. Demo: exactamente 2 |
| Featured | Boolean | Plane. Los 7 = true |

Sin campos Credit* ni Tag1/Tag2 en Work.

---

## Collection `Credits`

No tiene detail page. Se lista en el sidebar del Work actual.

| Campo | Tipo |
|---|---|
| Label | Plain text | `director` / `producer` / `awards` en el demo; el comprador remapea |
| Value | Plain text | Nombre o `—` |
| Work | Reference → Work | El ítem padre |
| Order | Number | 1, 2, 3 |

Tres filas por serie, siempre, aunque Value sea `—`.

---

## Siete Work + credits + tags

### 1. Salt Light

- Slug: `salt-light`
- Year: 2024
- Featured: true
- Tags: short, narrative
- Description: A coastal hour cut as rooms of weather. Still frames from a day that never quite becomes night.
- Credits: director **Mira Lang** · producer **Owen Hale** · awards **YDA Nominee**

### 2. The Waiting Room

- Slug: `the-waiting-room`
- Year: 2023
- Tags: short, narrative
- Description: Two people in a municipal lobby after closing. The work is the fluorescent bank, the chairs, the clock that is wrong.
- Credits: director **C. Romer** · producer **Nia Voss** · awards **—**

### 3. Glass Hours

- Slug: `glass-hours`
- Year: 2025
- Tags: commission, narrative
- Description: An architecture brief shot as weather. Interiors of a house that is mostly sky, stills only.
- Credits: director **Vale** · producer **Atelier Norte** · awards **—**

### 4. Inland Signal

- Slug: `inland-signal`
- Year: 2024
- Tags: short, place
- Description: A week away from the water. Heat, distance, and a road that reads longer than it is.
- Credits: director **Vale** · producer **Elena Ruiz** · awards **Festival of the Image, selected**

### 5. After the Sitting

- Slug: `after-the-sitting`
- Year: 2023
- Tags: people, still
- Description: Portraits made after the formal sitting ends. Hands, windows, the clothes people chose when they thought the work was over.
- Credits: director **Vale** · producer **—** · awards **—**

### 6. Red Room Brief

- Slug: `red-room-brief`
- Year: 2025
- Tags: commission, identity
- Description: A clothing brief as a private afternoon. Fabric against a rented interior, no set beyond the room and the street below.
- Credits: director **Vale** · producer **Vestis Almanac** · awards **—**

### 7. Night Atlas

- Slug: `night-atlas`
- Year: 2022
- Tags: short, narrative
- Description: Fog on a closed café and the road that serves it. Still frames from a night that arrives faster than the last cars leaving.
- Credits: director **Gabe Caste** · producer **Lauren Altieri** · awards **Santa Barbara, 2023**

Todos Featured true.

---

## Bind en el detail (fase 05)

- Title → Display H1
- Year → fila Label `year` + Body
- Description → Body
- Gallery → stack gap 0, height auto, sin crop
- Credits: Collection List filtrada `Work = current item`, sort Order ascending. Label style + Body. Mostrar también si Value es `—`
- Tags: Collection List de la multi-reference, cada ítem un chip (Title del Tag)
- Prev/Next: paginación CMS de Work

CSV semilla (opcional, adjuntar al chat 02): [`../cms/`](../cms/).

| Archivo | Collection | Notas |
|---|---|---|
| `tags.csv` | Tags | `title,slug` |
| `work.csv` | Work | `tags` = slugs de Tags separados por `;` |
| `credits.csv` | Credits | `work_slug` = Work.Slug. 21 filas |
