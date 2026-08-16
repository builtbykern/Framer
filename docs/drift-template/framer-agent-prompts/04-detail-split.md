# Fase 04 — Work detail: split paper / ink

**Objetivo:** Una CMS detail page con la estructura de la captura (1/3 sticky + 2/3 media) y paleta Gregor (paper, no negro).

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

Design the Work CMS detail page only. Do not change Home.

Desktop / Tablet:
- Two columns: left ~33% (minmax 280px), right ~67%
- Left is position sticky, top 0, height 100vh, overflow auto, fill paper, padding ~96px 36px 40px (clear the Nav)
- Right is a vertical stack of images, width 100%, gap 0 (full-bleed in the column). Insert the CMS Gallery field from Insert → Fields. Change its layout from grid to a vertical stack. If Gallery is empty, keep the stack ready.

Left column, top to bottom (bind later in phase 05; use sample layers named to match fields):
- Title — Display style, ink
- Definition list of credits: three rows Label (muted) + value (Body/ink): Credit1, Credit2, Credit3
- Description — Body, max ~36ch
- Two chips: 1px line border, Label style, Tag1 and Tag2
- Pager: Previous · Next in Label style (use Framer CMS pagination / previous-next if available; otherwise placeholder text links)

Phone 390:
- Single column. Info stack first, gallery below. No sticky split.

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
