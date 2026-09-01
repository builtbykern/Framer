# Fase 05 — Bind Work detail

**Objetivo:** Split bound a **Work + Credits + Tags**. Gallery stack. Sin rediseñar.

Schema: [`00-cms.md`](00-cms.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **GPT 5.6 Luna** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/cms`** |
| @ | Work, Credits, Tags, Work detail |
| Context | Sidebar + Gallery |
| No usar | Fable, Sol, `/code`, Credit1Label, Tag1 como texto |

## Prompt (después de constraints)

```
/cms

Bind the Work detail page. Do not change layout, type, or colors.

- Display H1 → Work.Title
- Year row: Label “year” + Work.Year
- Description → Work.Description
- Credits block: a Collection List of Credits filtered where Credits.Work = current Work item, sort by Order. Each row: Label (Label style, muted) + Value (Body, ink). Show the row even if Value is "—"
- Chips: a Collection List of Work.Tags. Each chip shows Tags.Title. 1px line, radius 2px
- Gallery stack → Work.Gallery. Vertical stack, gap 0, width 100%, height auto, do not crop
- Previous / Next → CMS pagination of Work

Do not bind leftover Credit1 / Tag1 fields — those must not exist.

Verify /work/salt-light (director Mira Lang, chips short + narrative) and /work/after-the-sitting (producer —).

Report: each layer → collection.field. Credit list count on salt-light (3).
```

## Definition of done

- Salt Light: 3 credits, 2 chips, título correcto.
- Gallery stack, no grid.

## Verificación humana

2–3 slugs. Chips vienen de Tags. Credits cambian por ítem.

## Siguiente

Chat nuevo → fase 06.
