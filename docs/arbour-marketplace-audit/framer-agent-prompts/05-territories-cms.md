# Fase 05 — Territories CMS + páginas detalle

Cierra neighbourhoods que hoy mandan VIEW → `/properties`. Help Layout: pages have a clear purpose. Help CMS: repeatable content in CMS. Max quality **sin** cambiar el look del índice.

Dos chats si hace falta: (A) `/cms` schema+items, (B) New Chat `/component` o layout para la detail page. Empieza por A; si el Agent termina A y pide canvas, New Chat para B con Opus.

## Configuración (A — CMS)

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **GPT 5.6 Luna** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/cms`** |
| @ | `@Neighbourhoods`, Properties collection (for references) |

## Configuración (B — página detalle, si hace falta)

| Control | Valor |
|---|---|
| Chat | **New Chat** (no reciclar A) |
| Modelo | **Opus 5** (si no está: **Opus 4.7**) |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/component`** y `/layout` si aparece |
| Context | Property detail layout (como referencia visual, no para copiar Manhattan) |

Opus: Help — *visual judgment, nuanced multi-step*. No Fable: demasiado proactive.

## Prompt A (después de constraints)

```
/cms

Create a Territories (or Neighbourhoods) CMS collection if one does not exist.

Items (4): Chelsea, Notting Hill, Hampstead, The Cotswolds.
Human slugs. Fields at least: Name, Slug, Coordinates, Short intro (the current directory paragraphs), Hero image, Body, optional reference to Properties in that area.

Keep the existing Neighbourhoods index look. Change only the destination of VIEW → so each card goes to its CMS detail page, not to /properties.

Do not invent a fifth territory.
```

## Prompt B (New Chat, después de constraints)

```
/component

Build a Territories CMS detail layout that feels like the existing Arbour property detail (split editorial, cream, Fraunces + Space Mono, 1px rules, same header/footer) but for a neighbourhood — not a house.

Include: bound name, coordinates, intro, body, and a CMS list of properties filtered by that territory. CTA “START A CONVERSATION” still goes to Contact.

Match spacing and type styles already in the project. No new palette, no extra breakpoint, no code component.

Then connect the four index cards on @Neighbourhoods.
```

## Definition of done

- Chelsea VIEW → `/neighbourhoods/chelsea` (o slug humano), no `/properties`.
- Detalle lista solo casas de esa área.
- Índice visualmente igual.

## Siguiente

Chat nuevo → fase 06.
