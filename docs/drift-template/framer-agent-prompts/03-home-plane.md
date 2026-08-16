# Fase 03 — Home: Drift Plane + Nav onDark

**Prerrequisito humano:** el code component **Drift Plane** está en el proyecto (Assets / Insert). El Agent no lo genera.

**Objetivo:** Home = plane a viewport + chrome mínimo. Ningún otro hero.

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **Opus 5** (fallback 4.8 → 4.7) |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/component`** |
| @ | `@Home`, Drift Plane component, styles |
| Context | Selecciona el layer Home |
| No usar | Fable, Sol, `/code`, Unsplash, segundo bloque de contenido |

Opus: Help — *visual judgment, nuanced multi-step*. Higher: colocar el componente sin inventar un landing.

## Prompt (después de constraints)

```
/component

Build Home `/` only. Home is the Drift Plane. Nothing else except chrome.

1. Insert the existing Drift Plane code component so it fills the viewport (width 100%, height 100vh / 100dvh). Pin it. Do not recreate it in native stacks. Do not wrap it in a marketing hero (no headline, no reel, no grid of projects besides the plane).

2. Create a Nav component and place it on Home:
   - Variant onDark (this page): mark and links in paper/white on the black home-bg
   - Links: VALE → `/` · Info → `/info` · Contact → `/contact`
   - Position: top, overlay, does not push the plane down
   - Label text style. Quiet. No hamburger unless Phone needs it; on Phone a simple row or wrap is fine
   - Component variables: email studio@vale.work, instagram https://www.instagram.com/vale.work

3. Hint, Label style, muted, bottom-left, pointer-events none:
   “Pan the plane · click a series”

4. One H1 “VALE” visually hidden (sr-only / 1px clip) for semantics. No visible H1 on Home.

5. Put Nav in a layout template so later pages can reuse it (onLight comes in later phases). If layout templates are awkward this chat, at least make Nav a reusable component.

6. Do not fill the Plane array with CMS links yet (phase 09A). Placeholder cards already on the component are OK. Do not add Index, footer, or extra sections.

Report: how Drift Plane is placed, Nav variant names, any leftover extra sections you removed.
```

## Definition of done

- Home negro, plane fullscreen, Nav VALE / Info / Contact, hint visible.
- Cero bloques tipo “featured work” aparte del plane.

## No tocar

CMS fields. Detail layout. Lummi. `/code`.

## Verificación humana

1440: plane + nav. 390: nav usable, plane sigue siendo el fondo (snap viene en 09B). Click Info/Contact no 404.

## Siguiente

Chat nuevo → fase 04.
