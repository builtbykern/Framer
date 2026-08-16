# Fase 09B — Plane `layout: plane | snap` (solo si hace falta)

**Saltar esta fase** si en Phone 390 el Drift Plane ya se recorre en **un eje con snap**.

**Objetivo:** Un prop/variant de layout. No reescribir el pan 2D.

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **Opus 5** (fallback 4.8 → 4.7) |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/code`** |
| @ | Drift Plane code component, `@Home` |
| No usar | Fable, Sol, rediseñar Home, tocar Work detail |

Única fase con `/code`. Opus Higher: cambio mínimo y correcto.

## Prompt (después de constraints)

```
/code

Edit the existing Drift Plane code component only. Do not replace it. Do not change the desktop pan physics.

Add a layout mode:
- `plane` (default): current 2D pan + idle drift
- `snap`: one axis (horizontal or vertical — pick the one that already fits the card row), snap to a card, still click-to-open the same links

Expose it as a property control (Enum: plane | snap) and/or follow breakpoints:
- Desktop 1440 and Tablet 768 → plane
- Phone 390 → snap

Respect prefers-reduced-motion: no idle drift in either mode.

Do not add overlay/lightbox. Do not fetch CMS from internals (keep Array + link props). Do not restyle Nav.

Report: the prop name, how Phone switches to snap, files you changed.
```

## Definition of done

- 1440: pan 2D igual que antes.
- 390: un eje + snap, click abre el detail.
- Reduced motion: sin drift.

## No tocar

CMS, split, Form, paleta.

## Verificación humana

Phone: arrastrar una carta a la vez. Click sigue yendo al slug.

## Siguiente

Chat nuevo → fase 10A.
