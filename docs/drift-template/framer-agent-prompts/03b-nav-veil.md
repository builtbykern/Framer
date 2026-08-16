# Fase 03B — Nav closed + Page Effect

**Prerrequisito:** Nav componente con VALE + plus, instancia en Home (`closedOnDark`).

**Objetivo:** Plus a la **derecha**. Instancias en todas las páginas. Cambio de página con **Page Effect Fade** nativo. Open puede quedar en stub; el Open **visual** es la fase **03C**.

Canon: [`00-gregor-nav.md`](00-gregor-nav.md). Cero Layout Templates. Cero layer Veil.

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

Do two jobs only: (A) finish closed Nav + instances, (B) add a native Framer Page Effect. Do not create a Layout Template. Do not add a Veil layer. Do not restyle type or colors. Do not rewrite Drift Plane. Do not design the visual Open split — that is the next chat (03C). A working stub for variant open is enough.

A. NAV COMPONENT

1. Open the Nav component. Exactly three variants: closedOnDark, closedOnLight, open.

2. Closed variants (both):
   - Height ~56px, width 100%. VALE (Mark) left → `/`. Plus on the RIGHT (not center — that is Gregor). Empty center.
   - Plus = two rectangles 20×2px, 0° and 90°, not a “+” glyph. Hit 32×32. aria-label “Open menu”.
   - closedOnDark: VALE + plus color paper. closedOnLight: ink.
   - Remove any Info/Contact links from the bar.

3. Variant open — stub only (03C replaces this with a still split):
   - Full-viewport paper. VALE left. The word Close (Label, not an X) top-right, same slot as the plus.
   - Info → /info and Contact → /contact in Display, stacked. No Overview, no Work, no bio, no hamburger.

4. Interactions (Tap, not Hover):
   - Plus on closedOnDark → Set Variant open
   - Plus on closedOnLight → Set Variant open
   - Close on open → Set Variant Previous
   - Info and Contact = normal page Links (so the Page Effect runs)

5. Component transition: 0.79s, cubic-bezier(0.77, 0, 0.175, 1). Plus and Close share the top-right slot: closed plus opacity 1 / Close 0; open reverse. Skip rotateX unless it already works.

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

Preview: plus (right) opens a stub overlay with Close (the word). Home → Info fades through paper. A plane card → /work/salt-light uses the same Fade. Phone 390: same plus, no hamburger.

Report: variant names, which pages have a Nav instance, Page Effect target + preset + duration, breakpoint fill hex per page, whether Exclude existed. Do not start the still split in this chat.
```

## Definition of done

- Cero Layout Template. Cero layer Veil.
- Plus **derecha** en cada página. Open stub + Close (palabra) + Info/Contact.
- Page Effect Fade / All Pages / 0.49s. Corte paper, no negro.

## Verificación humana

1440 y 390: abrir/cerrar. Home → Info. Plane → salt-light. ¿Wipe? Mal. ¿Negro entre páginas? Mal (breakpoint fill no es paper). ¿Plus al centro? Mal (eso es Gregor).

## Siguiente

Chat nuevo → fase **03C** (Open visual).
