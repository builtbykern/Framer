# Fase 03B — Nav closed + instancias

**Prerrequisito:** Nav componente con BrandRoll, instancia en Home (`closedOnDark`).

**Objetivo:** BrandRoll centrado en todas las páginas. Open stub. El Settle de página (blur 6px + bg baja) es **03D**. No Page Effect. No plus. No Close.

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
| No usar | Fable, Sol, `/code`, Layout Template, hamburger, plus, X, Close, LetterRollMenu, Wipe/Slide/Push, Custom Code |

## Prompt (después de constraints)

```
/component

Do one job: finish closed Nav + instances on every page. Do not create a Layout Template. Do not add Custom Code. Do not restyle type or colors. Do not rewrite Drift Plane. Do not design the visual Open split (03C). Do not build the Scrim / PageSurface settle (03D). Do not add a Page Effect. Do not insert LetterRollMenu.

A. NAV COMPONENT

1. Open the Nav component. Exactly three variants: closedOnDark, closedOnLight, open.

2. Closed variants (both):
   - Height ~56px, width 100%. ONE control: BrandRoll, dead-center. Empty left. Empty right.
   - Delete any plus, hamburger, X, Close label, or VALE-on-the-left.
   - Delete Info/Contact from the bar if present.
   - BrandRoll: Mark, uppercase. Idle VALE. Hover Desktop rolls to MENU (dual-layer Y, overflow hidden; 4 cells V/M A/E L/N E/U if possible; else whole-word). Width = MENU so it does not jump.
   - closedOnDark: paper. closedOnLight: ink.
   - Tap BrandRoll → Set Variant open. aria-label “Open menu”. Not a link to `/`.

3. Variant open — stub only (03C replaces this with a still split):
   - Full-viewport paper. BrandRoll stays centered, shows MENU, tap → Set Variant Previous. aria-label “Close menu”.
   - Info → /info and Contact → /contact in Display, stacked. No Overview, no Work, no bio, no hamburger, no Close word, no plus.

4. Interactions (Tap, not Hover-to-navigate):
   - BrandRoll on closedOnDark → Set Variant open
   - BrandRoll on closedOnLight → Set Variant open
   - BrandRoll on open → Set Variant Previous
   - Info and Contact = page Links for now (03D will add Scrim delay)

5. Component transition: 0.79s, cubic-bezier(0.77, 0, 0.175, 1). BrandRoll letter roll ~0.45s. Reduced motion: instant VALE/MENU, no Y.

6. Place a Nav instance on every page. Fixed, top, left 0, right 0, z 30.
   - Home → closedOnDark
   - Info, Contact, 404, Work detail → closedOnLight
   Duplicate the instance. Do not wrap pages in a Layout Template.

7. Breakpoint fill: every page including Home = paper #F6F3EE. Home keeps an inner viewport frame filled home-bg for the Drift Plane. Do not add a Page Effect.

Preview: centered VALE; hover (desktop) → MENU; tap opens a stub overlay with MENU still centered. Phone 390: same, no hamburger, no plus.

Report: variant names, which pages have a Nav instance, confirm BrandRoll is the only bar control, confirm no plus / Close / LetterRollMenu / Layout Template / Page Effect. Do not start the still split or Scrim settle in this chat.
```

## Definition of done

- Cero Layout Template. BrandRoll **centrado** en cada página. Open stub + MENU + Info/Contact. Cero plus. Cero Close.

## Verificación humana

1440 y 390: abrir/cerrar desde el centro. ¿Plus? Mal. ¿Hamburger? Mal. ¿VALE a la izquierda? Mal.

## Siguiente

Chat nuevo → **03C** (Open visual), luego **03D** (Settle nativo).
