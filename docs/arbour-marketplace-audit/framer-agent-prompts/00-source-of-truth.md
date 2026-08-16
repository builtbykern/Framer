# Source of truth — Arbour (demo)

Edita este archivo si quieres otros valores. Todos los prompts de fase asumen esto.

## Brand

| Campo | Valor canónico |
|---|---|
| Name | Arbour |
| Tagline | Fine homes, quietly sold. |
| Voice | British English. Quiet luxury. Discretion, never theatre. |
| Founded | **1999** |
| Independence stat | **26 yrs** |
| Prohibido | EST. 2018 (contradice meta y stats) |

## Contact

| Campo | Valor | Link |
|---|---|---|
| Email | enquiries@arbour.london | `mailto:enquiries@arbour.london` |
| Mayfair | +44 20 7946 0810 | `tel:+442079460810` |
| Cotswolds | +44 1608 649 220 | `tel:+441608649220` |
| Overlay / header phone | Mayfair (no +44 20 7351 8800) | same tel |
| Address Mayfair | 14 Mount Street, London W1K | |
| Address Cotswolds | Market Place, Chipping Norton | |

## Social (demo, no el perfil del creator)

| Label | URL |
|---|---|
| Instagram | https://www.instagram.com/arbour.london |
| LinkedIn | https://www.linkedin.com/company/arbour-london |
| X (Twitter) | https://x.com/arbourlondon |

Prohibido: `https://www.framer.com/@builtbykern/`

## Content rules

- Home featured residences: **3**, label explícito tipo `03 FEATURED — LONDON & COUNTRY`. Numeración `( 01 ) ( 02 ) ( 03 )`.
- `/properties` lista **todas** las CMS items (hoy 6). Sin limit en el índice (criterio histórico GR8r).
- Notes: **7** ítems, slugs humanos, números 01–07 sin huecos. Incluir **The case for waiting** como ítem real. Nunca slug `:Jd2WAsZn3`.
- Neighbourhoods: Chelsea, Notting Hill, Hampstead, The Cotswolds on the **existing** index. VIEW → `/properties` (AREA filter if possible). **No detail pages.**
- Coords: cada property/territory usa las suyas. No hardcodear `51.5074° N · CHELSEA` en el layout template.
- Rooms en property detail: **únicos por ítem**, no el mismo garden court/kitchen en las 6.

## Visual lock (no negociable)

Fraunces (display) + Space Mono (meta/UI). Cream canvas **`#F9F8F3`**. ~72px side padding desktop. 1px rules. Hamburger overlay. Custom 404 copy: “A fine address, quietly misplaced.” Tono: quiet luxury / never theatre.
