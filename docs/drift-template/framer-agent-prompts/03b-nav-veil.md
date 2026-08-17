# Fase 03B — Nav closed + instancias

**Prerrequisito:** Nav componente con VALE + plus, instancia en Home (`closedOnDark`).

**Objetivo:** Plus a la **derecha**. Instancias en todas las páginas. Open stub. El Settle de página (blur 6px + bg baja) es **03D**. No Page Effect.

Canon: [`00-gregor-nav.md`](00-gregor-nav.md). Cero Layout Templates.

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
| No usar | Fable, Sol, `/code`, Layout Template, hamburger, X, Wipe/Slide/Push, Custom Code |

## Prompt (después de constraints)

```
/component

Do one job: finish closed Nav + instances on every page. Do not create a Layout Template. Do not add Custom Code. Do not restyle type or colors. Do not rewrite Drift Plane. Do not design the visual Open split (03C). Do not build the Scrim / PageSurface settle (03D). Do not add a Page Effect (it has no blur and does not run in Safari — 03D replaces it with a native layer).

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
   - Info and Contact = page Links for now (03D will add Scrim delay)

5. Component transition: 0.79s, cubic-bezier(0.77, 0, 0.175, 1). Plus and Close share the top-right slot: closed plus opacity 1 / Close 0; open reverse. Skip rotateX unless it already works.

6. Place a Nav instance on every page. Fixed, top, left 0, right 0, z 30.
   - Home → closedOnDark
   - Info, Contact, 404, Work detail → closedOnLight
   Duplicate the instance. Do not wrap pages in a Layout Template.

7. Breakpoint fill: every page including Home = paper #F6F3EE. Home keeps an inner viewport frame filled home-bg for the Drift Plane. Do not add a Page Effect.

Preview: plus (right) opens a stub overlay with Close (the word). Phone 390: same plus, no hamburger.

Report: variant names, which pages have a Nav instance, confirm no Layout Template and no Page Effect added. Do not start the still split or Scrim settle in this chat.
```

## Definition of done

- Cero Layout Template. Plus **derecha** en cada página. Open stub + Close (palabra) + Info/Contact.
- Cero Page Effect (Settle nativo es 03D; si queda Fade, Instant).

## Verificación humana

1440 y 390: abrir/cerrar. ¿Plus al centro? Mal. ¿Hamburger? Mal.

## Siguiente

Chat nuevo → **03C** (Open visual), luego **03D** (Settle nativo).
