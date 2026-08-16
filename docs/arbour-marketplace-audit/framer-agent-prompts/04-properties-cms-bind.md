# Fase 04 — Properties CMS bind (coords, rooms, contadores)

Cierra **M3**. Help CMS: repeatable content in CMS; fields connected; clear naming. Histórico Bicky: unique CMS content (text + images). GR8r: no Limit on CMS index pages.

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **GPT 5.6 Luna** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/cms`** |
| @ | Properties collection, Property detail layout template, `@Home` `@Properties` |
| Context | Detail layout (coords row + “What the house keeps” rooms); Home featured list; Properties index list + filters |
| No usar | Fable, Sol, `/code` |

Higher: hay que decidir fields y binds antes de editar 6 ítems.

## Prompt (después de constraints)

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

## Definition of done

- Frognal detail no dice CHELSEA en coords.
- Rooms de Bibury ≠ Cheyne Walk.
- `/properties` sigue filtrando Chelsea → Cheyne Walk + Royal Avenue.

## Siguiente

Chat nuevo → fase 05.
