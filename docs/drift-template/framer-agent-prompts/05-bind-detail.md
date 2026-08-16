# Fase 05 — Bind Work detail

**Objetivo:** Cada layer del split lee CMS. Gallery stack bound. Sin rediseñar.

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
| @ | Work collection, Work detail |
| Context | Left column layers + Gallery |
| No usar | Fable, Sol, `/code`, cambiar el split |

Luna: binds. Higher: no dejar títulos hardcoded encima del ítem.

## Prompt (después de constraints)

```
/cms

Bind the Work detail page to the Work collection. Do not change layout, type, or colors.

Bind:
- Display title → Title
- Year if you added a year layer → Year (if there is no year layer, add a small Label+value row “year” / Year under the credits, still paper/ink)
- Credit1Label / Credit1Value, Credit2Label / Credit2Value, Credit3Label / Credit3Value
- Description → Description
- Chips → Tag1, Tag2. Hide a chip if its field is empty (conditional visible)
- Gallery stack → Gallery field. Keep vertical stack, gap 0, image width 100%, height auto
- Previous / Next → CMS previous/next of Work, linking to that item’s detail. Labels can be “Previous” and “Next” or the adjacent titles — pick one and use it on all items
- Optional: a quiet “VALE” or back control already in Nav is enough; do not add an Index route

If a credit value is “—”, still show the row.

Open /work/salt-light and /work/after-the-sitting to verify different titles and tags.

Report: each layer → field. Any leftover static dummy text.
```

## Definition of done

- `/work/salt-light` muestra Salt Light y credits Mira Lang.
- `/work/red-room-brief` muestra tags commission / identity.
- Gallery stack, no grid.

## No tocar

Home. Nav links. Lummi (placeholders OK).

## Verificación humana

Click 2–3 slugs. Sidebar sticky sigue. Phone stack.

## Siguiente

Chat nuevo → fase 06.
