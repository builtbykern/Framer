# Fase 02 — Collections Tags, Work, Credits

**Objetivo:** Crear las **tres** collections y poblarlas. Cero fotos de stock. Schema: [`00-cms.md`](00-cms.md). CSV: [`cms/`](../cms/).

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **GPT 5.6 Luna** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/cms`** |
| @ | CMS panel |
| Adjuntar | `tags.csv`, `work.csv`, `credits.csv` si el chat acepta archivos |
| No usar | Fable, Sol, `/code`, Unsplash, Lummi, campos Tag1/Credit1 en Work |

Luna: Help — CMS grande. Higher: schema **antes** de los ítems. Orden: Tags → Work → Credits.

## Prompt (después de constraints)

```
/cms

Create three CMS collections for Drift. Do not design pages. No stock photos. Do not put credits or tags as plain fields on Work.

A. Collection Tags (no detail page)
Fields: Title, Slug
Items (published): short, narrative, commission, people, still, place, identity
(slugs = titles)

B. Collection Work (detail page /work/{slug})
Fields:
- Title (title)
- Slug (slug)
- Cover (image) — solid ink or muted rectangle only, NOT Unsplash/Lummi
- Gallery (gallery) — empty or the same solid placeholder ×4, no stock
- Year (number)
- Description (plain text)
- Tags (multi-reference → Tags)
- Featured (boolean)

Exactly 7 published items, Featured true, copy verbatim:

1. Salt Light | salt-light | 2024 | Tags: short, narrative
   Description: A coastal hour cut as rooms of weather. Still frames from a day that never quite becomes night.

2. The Waiting Room | the-waiting-room | 2023 | Tags: short, narrative
   Description: Two people in a municipal lobby after closing. The work is the fluorescent bank, the chairs, the clock that is wrong.

3. Glass Hours | glass-hours | 2025 | Tags: commission, narrative
   Description: An architecture brief shot as weather. Interiors of a house that is mostly sky, stills only.

4. Inland Signal | inland-signal | 2024 | Tags: short, place
   Description: A week away from the water. Heat, distance, and a road that reads longer than it is.

5. After the Sitting | after-the-sitting | 2023 | Tags: people, still
   Description: Portraits made after the formal sitting ends. Hands, windows, the clothes people chose when they thought the work was over.

6. Red Room Brief | red-room-brief | 2025 | Tags: commission, identity
   Description: A clothing brief as a private afternoon. Fabric against a rented interior, no set beyond the room and the street below.

7. Night Atlas | night-atlas | 2022 | Tags: short, narrative
   Description: Fog on a closed café and the road that serves it. Still frames from a night that arrives faster than the last cars leaving.

C. Collection Credits (no detail page)
Fields: Label (plain text), Value (plain text), Work (reference → Work), Order (number)
Exactly 3 credits per Work item (21 rows). Keep rows even when Value is "—".

salt-light: 1 director Mira Lang | 2 producer Owen Hale | 3 awards YDA Nominee
the-waiting-room: 1 director C. Romer | 2 producer Nia Voss | 3 awards —
glass-hours: 1 director Vale | 2 producer Atelier Norte | 3 awards —
inland-signal: 1 director Vale | 2 producer Elena Ruiz | 3 awards Festival of the Image, selected
after-the-sitting: 1 director Vale | 2 producer — | 3 awards —
red-room-brief: 1 director Vale | 2 producer Vestis Almanac | 3 awards —
night-atlas: 1 director Gabe Caste | 2 producer Lauren Altieri | 3 awards Santa Barbara, 2023

If CSV files are attached, map columns to these fields instead of retyping, then verify counts.

Do not create an 8th Work item. Do not add a video field. Do not create Index/Privacy collections.

Report: field lists, 7 Work slugs, tag count, credit count (must be 21).
```

## Definition of done

- Collections `Tags` (7), `Work` (7), `Credits` (21).
- Work.Tags = multi-ref. Credits.Work = ref.
- Covers no son stock.

## No tocar

Home. Nav. Form. Lummi.

## Verificación humana

CMS: 3 collections. Salt Light tiene 2 tags y 3 credits.

## Siguiente

Insertar Drift Plane si falta. Chat nuevo → fase 03.
