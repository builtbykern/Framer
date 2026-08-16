# Fase 13B — Template Agent Instructions

**Objetivo:** Instrucciones para el Agent del **comprador**. No cambiar el look.

Help: [AI-ready template](https://www.framer.com/help/articles/build-ai-ready-template/).

Ficha: [`00-agent-decision.md`](00-agent-decision.md).

## Configuración

| Control | Valor |
|---|---|
| Chat | **New Chat** (no reciclar 13A) |
| Branch | `template-build` |
| Modelo | **Sonnet 5** |
| Reasoning | **Light** |
| Fast Mode | **Off** |
| Skill | **Ninguna** |
| @ | Site Settings / Template Agent instructions |
| No usar | Fable, Sol, `/cms`, `/code`, cambios de look |

## Prompt (después de constraints)

```
Do not edit the canvas look. Write Template Agent Instructions for buyers of Drift (Help: AI-ready template).

Tell future in-canvas Agents:
- Preserve Drift Plane as the only Home content (plus Nav + hint). Do not add a second hero, a work grid on Home, video, lightbox, or overlay viewer
- Preserve the visual system: five colors (home-bg #050505, paper #F6F3EE, ink #111111, muted #6B6B6B, line #D9D4CC); five text styles Mark/Display/Lead/Body/Label (Syne ExtraBold, Inter Regular, IBM Plex Mono Medium). Radius 0 (chips 2px). No shadows, no accent, no pixel fonts, no #FFF/#000
- Preserve the Work detail split (sticky ~33% info / ~67% stacked uncropped gallery) on paper/ink. Home stays home-bg. Do not invert that. Gallery gap 0
- Exactly 3 breakpoints. No Index, Privacy, or Journal unless the buyer explicitly asks
- Stills: cinematic muted photoreal (Lummi OK). No Unsplash, no illustration, no video, no lightbox
- Work CMS: one item = one series. Click from the Plane Array (image, title, link) must keep matching Cover + slug. When the buyer changes Cover, update the Plane card too
- Credit1–3 labels are remappable (photographer: camera/format; designer: studio/role; DP: director/producer/awards)
- Prefer native Form, CMS Gallery stack, and Nav variants over code
- Edit Nav variables for email and Instagram

Paste those instructions into the template’s custom Agent instructions field if it exists; otherwise output them in chat for me to paste.

Finally list remaining manual checks: Performance panel, Desktop/Tablet/Phone, form submit, 7 Work slugs from the plane, Info list, 404, Lummi alts.

Do not publish.
```

## Definition of done

- Instructions pegadas o listadas en el chat.
- Canvas no se rediseñó.

## Verificación humana

Leer las instructions. ¿Prohiben Index/vídeo/Fable-comportamiento? Sí.

## Siguiente

Review Changes en el branch `template-build`. Aplicar a main cuando el humano esté listo. No publicar desde el Agent.
