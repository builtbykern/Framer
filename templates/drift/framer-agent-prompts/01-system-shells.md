# Fase 01 — Sistema visual + shells

**Objetivo:** Crear **exactamente** los 5 color styles y 5 text styles de [`00-visual-system.md`](00-visual-system.md), más shells vacíos. El Agent no “elige una dirección”.

Ficha: [`00-agent-decision.md`](00-agent-decision.md). Look: [`00-visual-system.md`](00-visual-system.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **Sonnet 5** |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/layout`**. Si no está: **`/style`**. Si ninguna: chat plano |
| @ | Project styles, pages if any exist |
| No usar | Fable, Sol, `/code`, `/cms`, Unsplash, Lummi, Fraunces, Geist, pixel fonts |

Sonnet: Help — *layout direction*. Higher: fijar el sistema. Si empieza a “mejorar” la paleta: Stop.

## Prompt (después de constraints)

```
/layout

Create only the Drift design system and empty page shells. Follow the numbers. Do not invent a sixth color, a fourth font family, or “a nicer accent”.

1. Color styles (exact names and hex — five only):
   - home-bg #050505
   - paper #F6F3EE
   - ink #111111
   - muted #6B6B6B
   - line #D9D4CC
   Never use #FFFFFF or #000000. Never add shadow styles.

2. Text styles (exact names, Framer fonts, sizes). Create all five:

   Mark — Syne ExtraBold. Desktop/Tablet 15px / line 1.0 / tracking 0.06em. Phone 14 / 1.0 / 0.05em. Use later for VALE.

   Display — Syne ExtraBold. Desktop 68px / 0.90 / -0.04em. Tablet 52 / 0.90 / -0.03em. Phone 40 / 0.92 / -0.03em. Project titles only.

   Lead — Inter Regular. Desktop 22 / 1.35 / 0. Tablet 20 / 1.35. Phone 18 / 1.4. Info/Contact/404 leads.

   Body — Inter Regular. All breakpoints 15px / 1.55 / 0.01em.

   Label — IBM Plex Mono Medium. Desktop/Tablet 11 / 1.2 / 0.14em. Phone 10 / 1.2 / 0.12em. Set text transform Uppercase on this style if Framer allows.

3. Defaults: radius 0 everywhere. 1px borders use `line`. No drop shadows. No blur.

4. Breakpoints only: Desktop 1440, Tablet 768, Phone 390.

5. Empty shells, no photos, no long copy:
   - Home `/` — fill home-bg, full viewport
   - Info `/info` — fill paper
   - Contact `/contact` — fill paper
   - 404 — fill paper
   - Work CMS detail `/work/{slug}` — fill paper. If you need a collection to create the page, Title + Slug only, no items yet.

6. Do not insert Drift Plane. Do not add Index, Privacy, Journal.

Report: every style name + font + desktop size, page routes, breakpoints.
```

## Definition of done

- 5 colors + 5 text styles con esos nombres y números.
- Home `home-bg`, resto `paper`. Radio 0. Tres breakpoints.

## No tocar

Drift Plane. Los 7 ítems. Lummi.

## Verificación humana

Styles panel = canon de `00-visual-system.md` (Display 68, Body 15, Label 11, Syne/Inter/Plex). Ningún azul default.

## Siguiente

Chat nuevo → fase 02.
