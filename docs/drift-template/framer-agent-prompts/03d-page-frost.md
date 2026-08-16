# Fase 03D — Page Effect frost (blur Gregor)

**Prerrequisito:** Page Effect Fade All Pages ya existe (03B). Nav no se rediseña.

**Objetivo:** La transición de página es como Gregor: **todo el viewport se va a blur** (escarcha) mientras el Fade corre, sobre fill `paper`. No es un fade seco. No es un layer Veil. No es Wipe.

Canon: [`00-gregor-nav.md`](00-gregor-nav.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** |
| Branch | `template-build` |
| Modelo | **Opus 5** (fallback 4.8 → 4.7) |
| Reasoning | **Higher** |
| Fast Mode | **Off** |
| Skill | **`/layout`** (si no está: chat plano) |
| @ | Home — breakpoint Desktop 1440 (la página, no un frame hijo) |
| No usar | Fable, Sol, `/code` en el Plane, Layout Template, layer Veil, Wipe/Slide/Push, Unsplash |

## Prompt (después de constraints)

```
/layout

ONE JOB: make the page transition Gregor frost. The WHOLE viewport goes to blur while pages change. Do not redesign Nav. Do not touch Drift Plane layout. Do not create a Layout Template. Do not add a Veil layer. Do not use Wipe, Slide, Push, Blinds, Circular, Zigzag, or Inset.

Reference (behavior only): gregorcollienne.com page change — the entire site frosts (blur ~12px) over a light fill, ~0.49s, then the next page sharpens. Drift fill is paper #F6F3EE, not white, not black.

FAIL if preview is only an opacity fade (sharp photos cutting to the next page). FAIL if the flash between pages is black. FAIL if you add an overlay frame named Veil.

A. NATIVE PAGE EFFECT (do this first)

1. Pages panel → Home. Select Desktop 1440 (the page / breakpoint itself).

2. Right sidebar → Effects → the existing Page Effect (add one only if missing).
   - Target: All Pages
   - Preset: Fade / Crossfade
   - Exit: duration 0.49s, easing cubic-bezier(0.5, 0, 0.5, 1), offset 0, no mask
   - Enter: delay 0.10s, duration 0.49s, same easing, offset 0, no mask

3. BLUR IS REQUIRED. On the same Page Effect, add Filter / Blur (look under Exit and Enter: “+”, “Add”, Filter, Blur, Backdrop, Frost — any of those names):
   - Exit: blur 0px → 12px (if 12 is barely visible on the Home plane, use 16px, never above 16)
   - Enter: blur 12px → 0px (same px as Exit)
   - Same duration and easing as the fade. The outgoing page must go soft; the incoming page must start soft and sharpen.

4. Do NOT turn on Page Effect → Exclude on the Nav. Everything including VALE / plus must frost. “Todo” means the whole viewport.

5. Breakpoint fill on every page including Home = paper #F6F3EE. Home keeps an inner viewport frame filled home-bg #050505 for the Drift Plane. That inner frame is what blurs; the paper fill is the frost color between pages.

B. ONLY IF THE PAGE EFFECT PANEL HAS NO BLUR / FILTER CONTROL

6. Keep the Fade Page Effect (it creates the view transition). Then Site Settings → Custom Code → end of <head>, this exact CSS and nothing else (no extra libraries):

<style>
@keyframes drift-frost-out {
  from { filter: blur(0px); }
  to { filter: blur(12px); }
}
@keyframes drift-frost-in {
  from { filter: blur(12px); }
  to { filter: blur(0px); }
}
::view-transition-old(root) {
  animation: drift-frost-out 0.49s cubic-bezier(0.5, 0, 0.5, 1) both;
}
::view-transition-new(root) {
  animation: drift-frost-in 0.49s cubic-bezier(0.5, 0, 0.5, 1) 0.10s both;
}
</style>

Do not add a full-screen overlay frame. Do not edit Drift Plane source.

C. REDUCED MOTION

7. prefers-reduced-motion: Page Effect Instant or off; no blur.

Preview in Chrome (Page Effects are view-transition based): Home → Info, then a plane card → /work/salt-light. The stills must go blurry, then the next page comes out of blur on paper. Phone 390: same frost.

Report: whether blur was set on the Page Effect (property names + px) or via Custom Code; Exclude on Nav (must be off); breakpoint fill hex; confirm no Veil layer.
```

## Definition of done

- Home → Info: el plane se **emborrona**, no un corte seco.
- Fill entre páginas = paper. Cero negro. Cero Wipe. Cero layer Veil.
- Nav no Exclude: el chrome también entra en el frost.

## Verificación humana

Chrome 1440: Home → Info. ¿Las fotos siguen nítidas mientras cambia? Mal — repetir este chat. ¿Flash negro? Mal (fill no es paper).

## Siguiente

Si Open aún es paper vacío → 03C. Si Open visual ya está → fase 04 (o la que toque).
