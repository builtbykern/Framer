# Fase 05 — Territories CMS + páginas detalle

**Objetivo (Help):** Layout + CMS. Neighbourhoods hoy mandan VIEW → `/properties`. Pages have a clear purpose; repeatable content in CMS. El índice actual se queda.

Dos chats: (A) `/cms` schema+items, (B) New Chat `/component` para la detail page. Empieza por A. Ficha: [`00-agent-decision.md`](00-agent-decision.md).

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
| Modelo | **Opus 5** (si no: **Opus 4.8**, luego **4.7**. Nunca Fable) |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/component`**. Solo si no está: **`/layout`**. Si ninguna: chat plano + Opus |
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

## No tocar

Look del índice Neighbourhoods. Paleta, typefaces, 404, extra breakpoint, `/code`, quinto territory. Publicar main.

## Verificación humana

Desktop 1440 · Tablet 768 · Phone 390. Chelsea VIEW → detalle de territorio, no `/properties`. Índice se ve igual.

## Siguiente

Chat nuevo → fase 06.
