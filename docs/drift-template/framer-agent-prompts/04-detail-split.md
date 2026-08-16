# Fase 04 — Work detail: split paper / ink

**Objetivo:** Una CMS detail page con la estructura de la captura (1/3 sticky + 2/3 media) y el look de [`00-visual-system.md`](00-visual-system.md) (paper, Display 68, gallery gap 0, sin crop, radio 0).

Ficha: [`00-agent-decision.md`](00-agent-decision.md). Layout: [`00-source-of-truth.md`](00-source-of-truth.md) § Detail.

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **Opus 5** (fallback 4.8 → 4.7) |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/layout`**. Si no está: chat plano + Opus |
| @ | Work detail page, `@Home` only if you need Nav onLight |
| Context | Work detail canvas |
| No usar | Fable, Sol, `/code`, Unsplash, sidebar negra tipo cine |

Opus: juicio visual del split. Higher: planear sticky + stack antes de dibujar.

## Prompt (después de constraints)

```
/layout

Design the Work CMS detail page only. Do not change Home. Follow 00-visual-system: paper/ink, radius 0, chips 2px, no shadows, no black sidebar.

Desktop / Tablet:
- Two columns: left ~33% (minmax 280px), right ~67%
- Left is position sticky, top 0, height 100vh, overflow auto, fill paper, padding 96px 36px 40px, gap 28 between blocks
- Right: CMS Gallery as a **vertical stack**, gap **0**. Each image width 100%, height auto — do **not** crop (no object-fit cover on the detail gallery).

Left column, top to bottom:
- Title — Display style, ink (this is the H1)
- Year row: Label “year” + Body
- Credits: three rows as a list (placeholder copy OK). Each row Label muted + Body ink. Phase 05 replaces this with a Credits Collection List
- Description — Body, max 36ch
- Chip row: two chips, 1px line, radius 2px, pad 5×10, Label. Phase 05 replaces this with a Tags Collection List
- Pager: Previous · Next, Label, gap 18

Phone 390:
- Single column, pad 88 20 32. Info first, gallery below. No sticky split.

Nav on this page: onLight variant (ink on paper). If onLight does not exist yet, add it without restyling Home’s onDark.

No video. No lightbox. No black sidebar. No extra “related work” grid.

Report: column widths, sticky, gallery layout (must be stack not masonry), phone behavior.
```

## Definition of done

- Split 33/67 paper, sticky info, gallery stack.
- Phone apilado. Nav onLight.

## No tocar

Home plane. CMS item copy. Fotos Lummi. Form.

## Verificación humana

1440: sidebar no se va al scrollear la galería. 390: meta arriba. Ningún overlay.

## Siguiente

Chat nuevo → fase 05.
