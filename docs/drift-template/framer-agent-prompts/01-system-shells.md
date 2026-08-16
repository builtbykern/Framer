# Fase 01 — Sistema visual + shells

**Objetivo:** Color styles, text styles, 3 breakpoints, páginas vacías. Sin copy largo, sin fotos, sin CMS items.

Ficha: [`00-agent-decision.md`](00-agent-decision.md). Datos: [`00-source-of-truth.md`](00-source-of-truth.md).

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
| No usar | Fable, Sol, `/code`, `/cms`, Unsplash, Lummi |

Sonnet: Help — *original design work, layout direction*. Higher: hay que fijar el sistema antes de pintar contenido.

## Prompt (después de constraints)

```
/layout

Create only the design system and empty page shells for the Drift template. Do not add CMS items, photos, forms, or long copy.

1. Color styles (exact names and hex):
   - home-bg #050505
   - paper #F6F3EE
   - ink #111111
   - muted #6B6B6B
   - line #D9D4CC
   Use these styles everywhere. No leftover default blues/purples.

2. Text styles (Framer fonts, exact names):
   - Display = Syne ExtraBold — for series titles later
   - Body = Inter Regular — body copy
   - Label = IBM Plex Mono — nav, meta labels, chips
   Sizes: Display ~68px desktop / ~40px phone, tight tracking. Body 15px, line-height 1.5. Label 11px, uppercase, letter-spacing 0.14em.

3. Breakpoints only: Desktop 1440, Tablet 768, Phone 390. Do not add a fourth.

4. Pages (empty shells, no sections of fake content):
   - Home `/` — fill home-bg, full viewport, no extra blocks
   - Info `/info` — fill paper
   - Contact `/contact` — fill paper
   - 404 — fill paper, custom 404 page (empty except background)
   - A CMS detail page for a collection you may create as an empty shell named Work, path `/work/{slug}`, fill paper. If you cannot create the CMS page without a collection, create the Work collection with Title + Slug only and no items. Do not invent extra fields yet.

5. Do not insert Drift Plane yet. Do not write VALE copy yet. Do not add Index, Privacy, or Journal pages.

Report: style names, page routes, breakpoints.
```

## Definition of done

- 5 color styles y 3 text styles con esos nombres.
- Rutas `/` `/info` `/contact` y 404. Home negro, resto paper.
- Tres breakpoints. Ninguna foto de stock.

## No tocar

Drift Plane (aún no). Los 7 ítems. Form. Lummi.

## Verificación humana

1440 / 768 / 390. Home negro vacío. Otras páginas paper vacías. Styles panel = canon.

## Siguiente

Chat nuevo → fase 02.
