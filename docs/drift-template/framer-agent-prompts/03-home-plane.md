# Fase 03 — Home: Drift Plane + Nav plus

**Prerrequisito humano:** el code component **Drift Plane** está en el proyecto (Assets / Insert). El Agent no lo genera.

**Objetivo:** Home = plane a viewport + chrome mínimo (VALE + plus). Mark según [`00-visual-system.md`](00-visual-system.md). Gesto del menú: [`00-gregor-nav.md`](00-gregor-nav.md). Ningún otro hero.

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

2. Create a Nav component and place it on Home. Structure only in this chat — instances on other pages are 03B; visual Open (still split) is 03C; Settle (small blur + bg lowers) is 03D. Follow 00-gregor-nav.md.
   - Variant closedOnDark (this page): Mark style VALE left, color paper (not #FFF) on home-bg. Right: a plus made of two 20×2px bars (not a text glyph), paper color, hit 32px, aria-label “Open menu”. Not centered.
   - Do NOT put Info or Contact in the bar. Do NOT use a hamburger, an X, or the word MENU
   - Optional 88px-tall scrim: home-bg 70% to transparent. No other gradient
   - VALE → `/`
   - Position: top, overlay, does not push the plane down. Nav pad 22×28 desktop, 16×20 phone
   - Same chrome on Phone (plus stays right). No drawer
   - Component variables: email studio@vale.work, instagram https://www.instagram.com/vale.work
   - Stub variant closedOnLight (ink plus + VALE) for later pages; stub variant open as a full-viewport paper layer with Info / Contact in Display and the word Close (Label) instead of the plus — wiring in 03B, visual still-split in 03C

3. Hint, Label style, muted, bottom 24 left 28, pointer-events none:
   “Pan the plane · click a series”

4. One H1 “VALE” visually hidden (sr-only / 1px clip) for semantics. No visible H1 on Home.

5. Create Nav as a Component. Place one instance on Home only (fixed top). Do not create a Layout Template. Other pages get their instance in phase 03B.

6. Do not fill the Plane array with CMS links yet (phase 09A). Placeholder cards already on the component are OK. Do not add Index, footer, or extra sections.

Report: how Drift Plane is placed, Nav variant names (must include closedOnDark), confirm no Layout Template.
```

## Definition of done

- Home negro, plane fullscreen, Nav VALE + plus (sin Info/Contact en la barra), hint visible.
- Cero bloques tipo “featured work” aparte del plane.

## No tocar

CMS fields. Detail layout. Lummi. `/code`.

## Verificación humana

1440: plane + VALE + plus. 390: plus usable, plane sigue siendo el fondo (snap viene en 09B).

## Siguiente

Chat nuevo → fase 03B (instancias Nav), luego 03C (Open visual), luego 03D (Settle).
