# Fase 02 — CMS Work + 7 ítems (sin Lummi)

**Objetivo:** Collection `Work` completa, 7 published, slugs humanos, Covers placeholder sólidos. Cero Unsplash/Lummi.

Ficha: [`00-agent-decision.md`](00-agent-decision.md). Ítems: [`00-source-of-truth.md`](00-source-of-truth.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **GPT 5.6 Luna** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/cms`** |
| @ | Work collection, Work detail page |
| No usar | Fable, Sol, `/code`, plugins de fotos |

Luna: Help — *fastest option for large CMS updates*. Higher: schema antes de crear items.

## Prompt (después de constraints)

```
/cms

Create or finish the Work CMS collection. Exactly 7 published items. No stock photos.

Fields (exact names):
- Title (title)
- Slug (slug)
- Cover (image) — for now a solid ink or muted rectangle, NOT Unsplash/Lummi
- Gallery (gallery) — empty or the same solid placeholder repeated 4 times, no stock
- Year (number)
- Credit1Label, Credit1Value, Credit2Label, Credit2Value, Credit3Label, Credit3Value (plain text)
- Description (plain text)
- Tag1, Tag2 (plain text)
- Featured (boolean) — true on all 7

Detail page slug pattern: /work/{slug}

Create these 7 published items (copy verbatim):

1. Title: Salt Light | slug: salt-light | year: 2024
   Credit1Label director / Mira Lang
   Credit2Label producer / Owen Hale
   Credit3Label awards / YDA Nominee
   Tag1 short | Tag2 narrative
   Description: A coastal hour cut as rooms of weather. Still frames from a day that never quite becomes night.
   Featured: true

2. Title: The Waiting Room | slug: the-waiting-room | year: 2023
   director C. Romer / producer Nia Voss / awards —
   Tag1 short | Tag2 narrative
   Description: Two people in a municipal lobby after closing. The work is the fluorescent bank, the chairs, the clock that is wrong.

3. Title: Glass Hours | slug: glass-hours | year: 2025
   director Vale / producer Atelier Norte / awards —
   Tag1 commission | Tag2 narrative
   Description: An architecture brief shot as weather. Interiors of a house that is mostly sky, stills only.

4. Title: Inland Signal | slug: inland-signal | year: 2024
   director Vale / producer Elena Ruiz / awards Festival of the Image, selected
   Tag1 short | Tag2 place
   Description: A week away from the water. Heat, distance, and a road that reads longer than it is.

5. Title: After the Sitting | slug: after-the-sitting | year: 2023
   director Vale / producer — / awards —
   Tag1 people | Tag2 still
   Description: Portraits made after the formal sitting ends. Hands, windows, the clothes people chose when they thought the work was over.

6. Title: Red Room Brief | slug: red-room-brief | year: 2025
   director Vale / producer Vestis Almanac / awards —
   Tag1 commission | Tag2 identity
   Description: A clothing brief as a private afternoon. Fabric against a rented interior, no set beyond the room and the street below.

7. Title: Night Atlas | slug: night-atlas | year: 2022
   director Gabe Caste / producer Lauren Altieri / awards Santa Barbara, 2023
   Tag1 short | Tag2 narrative
   Description: Fog on a closed café and the road that serves it. Still frames from a night that arrives faster than the last cars leaving.

Do not create an 8th item. Do not add video fields. Do not design the detail layout in this chat.

Report: field list, the 7 slugs, published count.
```

## Definition of done

- 7 ítems, slugs exactos, Featured true.
- Covers no son fotos de stock.
- Collection se llama Work.

## No tocar

Look del Home. Nav. Form. Lummi.

## Verificación humana

CMS grid: 7 rows, slugs legibles, descriptions correctas.

## Siguiente

Insertar a mano Drift Plane en Assets si aún no está. Chat nuevo → fase 03.
