# Fase 09A — Plane Array → CMS detail

**Objetivo:** Cada carta del Drift Plane enlaza a `/work/{slug}`. Covers = campo Cover (placeholders OK). Sin `/code`.

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **GPT 5.6 Luna** |
| Reasoning | **Light** |
| Fast Mode | **Off** |
| Skill | **`/component`** |
| @ | `@Home`, Drift Plane instance, Work collection |
| No usar | Fable, Sol, **`/code`**, Lummi |

Luna: find-replace / props. Light: no hay schema nuevo.

## Prompt (después de constraints)

```
/component

Wire the existing Drift Plane on Home to the 7 Work items. Do not rewrite the component code.

Code components cannot read CMS collections through internals. Use the Plane’s property controls (Array of image + title + link, or equivalent).

For each Featured Work item (all 7), one card:
- Image = that item’s Cover (placeholder solids are fine)
- Title = Title
- Link = that item’s CMS detail URL (/work/salt-light, /work/the-waiting-room, /work/glass-hours, /work/inland-signal, /work/after-the-sitting, /work/red-room-brief, /work/night-atlas)

Click (not drag) must navigate to the detail page. No project overlay, lightbox, or modal. Do not remove the Nav (BrandRoll VALE↔MENU). The Work PageSurface should lower in (phase 03D).

If the component only has a generic Link per card, set those seven links. If it has a single “open” overlay, turn overlay off.

Do not add new cards beyond the 7. Do not change pan physics.

Report: how many cards, each title → href.
```

## Definition of done

- Click Salt Light (sin drag) → `/work/salt-light`.
- Siete cartas, siete slugs. Cero overlay.

## No tocar

Física del pan. Detail layout. Fotos Lummi.

## Verificación humana

Click vs drag. Los 7 slugs. Phone: si el pan 2D es inutilizable, anota y pasa a 09B.

## Siguiente

Si el plane en Phone ya es un eje + snap: saltar 09B → 10A. Si no: chat nuevo → 09B.
