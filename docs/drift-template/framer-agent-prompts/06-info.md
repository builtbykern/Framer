# Fase 06 — Info

**Objetivo:** Bio + lista de títulos CMS que enlazan al detail. No es un Index `/work`.

Ficha: [`00-agent-decision.md`](00-agent-decision.md). Copy: [`00-source-of-truth.md`](00-source-of-truth.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **Sonnet 5** |
| Reasoning | **Light** |
| Fast Mode | **Off** |
| Skill | **Ninguna** (copy + una lista). Si hace falta lista CMS: `/cms` solo si Sonnet no puede crear el Collection List |
| @ | `@Info`, Work collection |
| No usar | Fable, Sol, `/code`, ruta `/work` índice, fotos |

## Prompt (después de constraints)

```
Build Info `/info` only. Paper background, Nav onLight. Do not change Home or the Work detail.

Copy verbatim:
- Kicker (Label): Info
- Lead (larger Body or Display at small size): Vale is a visual director working in stills. Selected work is published as series — not as a dump of single frames.
- Body: Available for a small number of commissions each year. The plane on the home is the archive. This page is for when you already know the title.

Below, a Collection List of Work, all 7, sorted by Year descending:
- Each row is the Title (Display or strong Body) linking to that item’s CMS detail page
- Optional muted Year on the same row
- No thumbnails, no hover image, no grid of covers
- This is not a page at `/work`. Do not create `/work`.

Keep the page narrow (~640–720px content). Generous top padding under Nav.

Report: routes you touched, how the list binds.
```

## Definition of done

- `/info` con el copy canon.
- 7 títulos clicables → details reales.
- No existe `/work` índice.

## No tocar

Home plane. Detail split. Contact form. Lummi.

## Verificación humana

1440 y 390. Cada título abre el slug correcto.

## Siguiente

Chat nuevo → fase 07.
