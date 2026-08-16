# Fase 05 — Neighbourhoods: VIEW en páginas existentes

**Objetivo (Help):** Links + Layout. Hoy las cuatro cards VIEW → `/properties` sin decir que es el índice de casas. **No hay páginas detalle nuevas.** El índice Neighbourhoods se queda.

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `marketplace-qa` |
| Modelo | **GPT 5.6 Luna** |
| Reasoning | **Light** |
| Fast Mode | **Off** |
| Skill | **`/component`** |
| @ | `@Neighbourhoods`, `@Properties` |
| Context | Las cuatro cards VIEW → |
| No usar | Fable, Sol, `/code`, collection nueva, CMS detail pages |

## Prompt (después de constraints)

```
/component

Do not create any new pages, routes, CMS collections, or detail layouts.

Keep the existing Neighbourhoods index look.

Each of the four cards (Chelsea, Notting Hill, Hampstead, The Cotswolds) currently sends VIEW → to /properties with no explanation.

Preferred: point VIEW at the existing /properties page with that AREA filter already applied, if the project can do that without a new page.
If a pre-filtered URL is impossible, keep href=/properties and change the control label to “See residences in this area” (British English, Space Mono, same treatment as other VIEW → links).

Do not add neighbourhood detail pages. Do not add a Territories collection.
```

## Definition of done

- Cero rutas nuevas (`/neighbourhoods/chelsea`, etc.).
- Índice visualmente igual.
- VIEW ya no finge un detalle de territorio.

## No tocar

Look del índice. Paleta, typefaces, 404, extra breakpoint, `/code`. Publicar main.

## Verificación humana

Desktop 1440 · Tablet 768 · Phone 390. VIEW abre `/properties` (filtrado o con el nuevo label). Sitemap sin páginas extra.

## Siguiente

Chat nuevo → fase 06.
