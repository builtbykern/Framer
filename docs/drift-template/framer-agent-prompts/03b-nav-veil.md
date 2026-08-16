# Fase 03B — Overlay Nav + Veil

**Prerrequisito:** fase 03 hecha (plane + Nav `closedOnDark` con VALE + plus).

**Objetivo:** El gesto de [gregorcollienne.com](https://gregorcollienne.com): overlay paper a viewport, plus que hace flip a **Close** (no X), velo paper+blur en cada navegación. Canon: [`00-gregor-nav.md`](00-gregor-nav.md).

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
| @ | Nav, layout template, Home, Info, Contact, 404, Work detail |
| No usar | Fable, Sol, `/code`, Unsplash, hamburger, icono X, Barba, GSAP, Neue Rational |

Opus: juicio del flip y del velo. Higher: variants antes de animar.

## Prompt (después de constraints)

```
/component

Finish Drift Nav motion. Follow 00-gregor-nav.md. Do not copy gregorcollienne.com type, X icon, Overview/Work, or copyright.

1. Nav variants (exactly three):
   - closedOnDark — Home. VALE (Mark) left + plus center, color paper. No Info/Contact in the bar.
   - closedOnLight — Info, Contact, 404, Work detail. Same layout, color ink.
   - open — full-viewport paper overlay. Chrome ink. Used on every page when the menu is open (including Home).

2. Plus: two 20×2px bars (not a text glyph), crossed 0° / 90°, hit area 32px. aria-label “Open menu”.
   Open state: the plus flips out on rotateX (perspective ~700, 0.79s, cubic-bezier(0.77, 0, 0.175, 1)). The Label word “Close” (uppercase, IBM Plex Mono / Label style) flips in at the same center. aria-label “Close menu”. Do NOT draw an X. Do NOT use a hamburger.

3. Overlay content (only in variant open):
   - Paper fill, viewport, under the chrome
   - Center: Info → /info and Contact → /contact in Display style, stacked, ink. sr-only H1 “Menu”
   - Bottom: Label mailto studio@vale.work left, Instagram vale.work right
   - No bio paragraph, no Work index, no copyright, no extra routes
   - Links enter 0.79s with opacity + rotateX(-40deg) → rest, stagger 60ms. If 3D is unreliable: opacity + 8px Y, same timing
   - While open, blur the page behind 12px

4. Page Veil (layout template, all pages):
   - Full viewport paper fill + blur 12px, z-index below Nav
   - On every page appear (Home, Info, Contact, 404, Work detail): start visible, after ~100ms animate 0.49s cubic-bezier(0.5, 0, 0.5, 1) to opacity 0 and blur 0, pointer-events none
   - This is the page transition. Not a black fade, not a side wipe, not a slide of the plane.

5. Wire pages: Home uses closedOnDark. Paper pages use closedOnLight. Clicking plus → open. Close / Escape / choosing a link → destination’s closed variant. Plane card clicks keep going to /work/{slug}; the Veil must play there too.

6. prefers-reduced-motion: instant overlay, no flip, no blur, Veil hidden.

Do not restyle type or colors. Do not add Index.

Report: variant names, how the plus/Close flip is built, how the Veil Appear is set, reduced-motion.
```

## Definition of done

- Plus en todas las páginas. Open = paper + Info/Contact. Close es la palabra, no una X.
- Click Info desde Home: velo paper, llega `/info`.
- Click de una carta del plane: velo, llega el detail.

## No tocar

CMS copy. Split del detail. Form. Lummi. Física del plane.

## Verificación humana

1440 y 390: abrir/cerrar. Home → Info. Plane → salt-light. `prefers-reduced-motion`: sin blur.

## Siguiente

Chat nuevo → fase 04.
