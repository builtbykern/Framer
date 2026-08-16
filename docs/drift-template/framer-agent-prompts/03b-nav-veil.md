# Fase 03B — Nav motion + Page Effect

**Prerrequisito:** Nav componente con VALE + plus, instancia en Home (`closedOnDark`).

**Objetivo:** Overlay paper (plus → palabra Close). Cambio de página con **Page Effect Fade** nativo. Cero Layout Templates. Cero layer Veil.

Canon: [`00-gregor-nav.md`](00-gregor-nav.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **Opus 5** (fallback 4.8 → 4.7) |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/component`** |
| @ | Nav, Home, Info, Contact, 404, Work detail |
| No usar | Fable, Sol, `/code`, Layout Template, layer Veil, hamburger, X, Wipe/Slide/Push |

## Prompt (después de constraints)

```
/component

Do two jobs only: (A) finish the Nav component, (B) add a native Framer Page Effect. Do not create a Layout Template. Do not add a Veil layer. Do not restyle type or colors. Do not rewrite Drift Plane.

A. NAV COMPONENT

1. Open the Nav component. Exactly three variants: closedOnDark, closedOnLight, open.

2. Closed variants (both):
   - Height ~56px, width 100%. VALE (Mark) left → `/`. Plus center. Empty right.
   - Plus = two rectangles 20×2px, 0° and 90°, not a “+” glyph. Hit 32×32. aria-label “Open menu”.
   - closedOnDark: VALE + plus color paper. closedOnLight: ink.
   - Remove any Info/Contact links from the bar.

3. Variant open:
   - A paper #F6F3EE frame, position absolute / fixed, inset 0, width 100vw, height 100vh, under the chrome.
   - Same VALE left. Center: the word Close in Label (uppercase IBM Plex Mono). aria-label “Close menu”. Do NOT draw an X. Do NOT use a hamburger.
   - Middle of the overlay: Info → /info and Contact → /contact, Display style, ink, stacked, gap 12. sr-only heading “Menu”.
   - Bottom: Label studio@vale.work (mailto) left, Instagram vale.work right.
   - No bio, no Work index, no copyright.

4. Interactions (Tap, not Hover):
   - Plus on closedOnDark → Set Variant open
   - Plus on closedOnLight → Set Variant open
   - Close on open → Set Variant Previous (must return to the closed variant this instance came from)
   - Info and Contact = normal page Links (so the Page Effect runs)

5. Component transition between variants: 0.79s, cubic-bezier(0.77, 0, 0.175, 1).
   Plus vs Close in the same center slot: closed = plus opacity 1 / Close opacity 0; open = reverse. If rotateX exists on the layer, plus rotateX 0→90 and Close 90→0. If 3D fails, opacity only, same 0.79s.

6. Place a Nav instance on every page. Fixed, top, left 0, right 0, z 30.
   - Home → closedOnDark
   - Info, Contact, 404, Work detail → closedOnLight
   Duplicate the instance. Do not wrap pages in a Layout Template.

B. PAGE EFFECT (native, once)

7. Pages panel → Home. Select the Desktop 1440 breakpoint (the page itself, not a child frame).

8. Right sidebar → Effects → + → Page Effect (not Appear).

9. Target: All Pages.

10. Preset: Fade (Crossfade if that is the name). Forbidden: Wipe, Slide, Push, Blinds, Circular, Zigzag, Inset.

11. Exit: duration 0.49s, easing cubic-bezier(0.5, 0, 0.5, 1), offset 0, no mask.
    Enter: delay 0.10s, duration 0.49s, same easing, offset 0, no mask.
    If Blur/Filter exists: Exit 0→12px, Enter 12→0px. If it does not exist, skip blur.

12. Breakpoint fill (the color BETWEEN pages):
    - Every page including Home: Desktop breakpoint fill = paper #F6F3EE
    - Home only: keep a child frame pinned to viewport filled home-bg #050505 that contains the Drift Plane
    - Do not set Home’s breakpoint fill to home-bg (that flashes black)

13. If a Nav instance has Page Effect → Exclude, turn it on. If that control does not exist, leave it. Do not create a Layout Template to get Exclude.

14. prefers-reduced-motion: Page Effect Instant or off. Nav variant switch instant.

Preview: plus opens paper overlay with Close (the word). Home → Info fades through paper. A plane card → /work/salt-light uses the same Fade. Phone 390: same plus, no hamburger.

Report: variant names, which pages have a Nav instance, Page Effect target + preset + duration, breakpoint fill hex per page, whether Exclude existed.
```

## Definition of done

- Cero Layout Template. Cero layer Veil.
- Plus en cada página. Open = paper + Close (palabra) + Info/Contact.
- Page Effect Fade / All Pages / 0.49s. Corte paper, no negro.

## Verificación humana

1440 y 390: abrir/cerrar. Home → Info. Plane → salt-light. ¿Wipe? Mal. ¿Negro entre páginas? Mal (breakpoint fill no es paper).

## Siguiente

Chat nuevo → fase 04.
