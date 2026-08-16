# Fase 03D — Frost Gregor (humano, no Agent)

Page Effect **no tiene Blur**. El Agent **no puede** editar Site Settings → Custom Code. Pedirle el frost termina en un rechazo. No corras un chat para esto.

**Tú pegas el CSS.** El Fade nativo (03B) solo enciende View Transitions; el blur vive en Custom Code.

Canon: [`00-gregor-nav.md`](00-gregor-nav.md). Snippet: [`frost-view-transition.html`](frost-view-transition.html).

## Qué hace el humano (obligatorio)

1. Confirma que hay **Page Effect Fade / Crossfade**, Target **All Pages**, 0.49s. Si no existe, corre 03B (solo Fade). No pidas blur al Agent.
2. Nav: **Page Effect → Exclude = off** (si el control existe).
3. Breakpoint fill de todas las páginas = `paper` `#F6F3EE`. Home: frame interior `home-bg` con el Plane.
4. Framer → **Site Settings** (engranaje) → **General** → **Custom Code** → **End of `<head>`**.
5. Pega el bloque de [`frost-view-transition.html`](frost-view-transition.html) (incluye las tags `<style>`).
6. Preview en **Chrome** (no Safari): Home → Info. El plane se emborrona, luego Info sale del blur sobre paper.

Si el CSS no gana al Fade de Framer, prueba el mismo bloque en **End of `<body>`**.

No añadas un frame Veil. No uses Wipe. No toques Drift Plane.

## Si el Fade aún no existe (Agent, opcional)

Solo entonces, New Chat · Opus 5 · Higher · `/layout` · `@` Home Desktop 1440. Constraints + este prompt. **No le pidas blur ni Custom Code.**

```
/layout

ONE JOB: confirm the native Page Effect Fade. You cannot add blur to Page Effects (opacity, transform, mask only). You cannot edit Site Settings Custom Code. Do not refuse this chat. Do not add a Veil layer. Do not use Wipe/Slide/Push. Do not modify Drift Plane. Do not Exclude the Nav.

1. Pages → Home → Desktop 1440 (the page, not a child frame).
2. Effects → Page Effect (create if missing). Target All Pages. Preset Fade/Crossfade.
3. Exit 0.49s cubic-bezier(0.5, 0, 0.5, 1), offset 0, no mask.
   Enter delay 0.10s, duration 0.49s, same easing.
4. Breakpoint fill every page including Home = paper #F6F3EE. Home keeps an inner viewport frame home-bg for the Drift Plane.
5. If Nav has Page Effect Exclude, turn it OFF.

Then STOP. In the report, tell the human: paste frost-view-transition.html into Site Settings → Custom Code → End of <head>. That CSS is the Gregor frost. Do not attempt it yourself.

This chat is complete when Fade All Pages exists. Completing Fade is success. Missing blur in the canvas is expected.
```

## Definition of done

- Custom Code pegado por el humano.
- Chrome: Home → Info emborrona. Cero flash negro. Cero Veil.

## Siguiente

03C (Open visual) o la fase que toque.
