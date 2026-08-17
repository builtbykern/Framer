# Fase 03D — Settle nativo (blur suave + bg baja)

**Prerrequisito:** Nav en cada página. Open visual (03C) preferible; si Open es stub, igual se cablea.

**Objetivo:** Transición **sutilmente distinta** a Gregor. No un velo a pantalla completa.

1. **Blur pequeño** (~6px) sobre lo que ya está en pantalla.
2. El **fondo de la superficie que entra** (Work paper, Info, menú 33/67) **baja a su sitio** (Y −32 → 0).
3. **Al salir o atrás: lo inverso** (la superficie sube, el blur se aclara).

Capas nativas + variants + Appear. Chrome **y** Safari. Cero Page Effect Fade. Cero Custom Code. Cero Layout Template.

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
| No usar | Fable, Sol, `/code`, Layout Template, Custom Code, Page Effect Fade, Wipe/Slide/Push, Unsplash, Drift Plane |

Si hay CSS/script `frost-view-transition` en Custom Code, el humano lo borra (el Agent no puede). Si no, se apila.

## Prompt (después de constraints)

```
/component

ONE JOB: native settle motion — a SMALL blur on what is already on screen, and the incoming surface’s background lowers into place. Leaving / going back is the exact inverse. Chrome and Safari. Layers + variants + Appear only.

Do not clone Gregor’s full-screen frost. Do not use Custom Code. Do not use Page Effect (no blur, dead in Safari). Do not create a Layout Template. Do not modify Drift Plane physics. Do not restyle type or colors. Do not change Open’s 33/67 structure.

A. SCRIM (tiny blur of what is on screen)

1. Component named Scrim. Variants: clear | dim.
   - Fixed, inset 0, 100vw × 100vh, radius 0, z 35 (above the page, below Open’s still if the still must stay sharp — put Scrim BEHIND the 33/67 surface, above Home/Work content).
   - Fill paper #F6F3EE at 16% opacity (barely there).
   - Background Blur / Backdrop Blur 6px. If that control is missing: Filter Blur 6 on this layer, paper 28%. Do not abort. Do not use 12px.
   - clear: opacity 0, pointer-events none.
   - dim: opacity 1, pointer-events none (it must not block the Open links).
   - Transition 0.49s, cubic-bezier(0.5, 0, 0.5, 1). Reduced motion: instant.

2. Place one Scrim instance inside Nav, full viewport, behind the Open split / chrome, above the page.

B. MENU — surface lowers; close is inverse

3. In variant open, wrap the 33/67 block (paper column + still) in a frame named MenuSurface.
   - closedOnDark / closedOnLight: MenuSurface opacity 0, y -32 (hidden above). Scrim clear.
   - open: MenuSurface opacity 1, y 0. Scrim dim.
   - Same 0.79s cubic-bezier(0.77, 0, 0.175, 1) as plus/Close. Phone y -20.
   - Still may keep a light scale 1.03→1. No 1.06 slam. No rotateX.
   - Close → Set Variant Previous already reverses this. Do not add a second animation.

C. PAPER PAGES — Work / Info / Contact / 404 bg lowers in

4. On Info, Contact, 404, and Work detail: wrap the page content (everything except Nav) in a frame named PageSurface.
   - Fill is the page (paper). Width 100%, height auto / fill.
   - Appear (native): from opacity 0.7, y -32, to opacity 1, y 0. Duration 0.49s, delay 0.10s, easing cubic-bezier(0.5, 0, 0.5, 1). Phone y -20.
   - Do not Appear-blur the gallery stills (no ken burns, no filter on images). The Scrim is the only blur.
   - Home: do NOT wrap or translate the Drift Plane (pan would fight it). Home only uses Scrim.

D. EXIT / BACK

5. VALE, Info, Contact (and any in-page link to `/`, `/info`, `/contact`):
   Tap, in order:
   - Set Variant Scrim → dim
   - Go to Page, delay 0.35s
   The destination PageSurface Appear is the “bg lowers”. Going back to Home: Plane stays put, Scrim goes clear via Appear on the Home Nav instance (Scrim starts dim, Appear → clear). That is the inverse of leaving Home.

6. Work pager Previous/Next if they already exist: same Scrim dim then navigate, delay 0.35s. If pager is not built yet, skip.

E. PAGE EFFECT OFF

7. If Page Effect Fade exists: Instant or remove. Do not add Slide/Push/Wipe.

F. DO NOT

- Full-viewport paper at 45% (that is Gregor frost — too heavy)
- Blur > 6px
- Custom Code
- Layout Template
- Abort

Preview Safari + Chrome: plus opens — page blurs slightly, menu lowers in. Close — menu lifts, blur clears. Home → Info — slight blur, paper surface lowers. Back — inverse.

Report: Scrim px and paper %, MenuSurface y, PageSurface Appear, which links have 0.35s delay, Page Effect Instant/removed.
```

## Definition of done

- Blur **6px**, scrim paper **16%**. No velo 12px.
- Menú y páginas paper: Y −32 → 0 al entrar; Close / atrás es el inverso.
- Home plane sin translate. Safari = Chrome.

## Verificación humana

Safari: plus / Close (¿el menú baja y sube?). Home → Info (¿el paper baja?). Atrás. ¿Slide completo tipo Push? Mal (solo 32px).

## Siguiente

04 si el detail aún no tiene split. No pegar `frost-view-transition.html`.
