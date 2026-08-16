# Remaining prompts — credit-tight (18:17 live)

Live: https://arbour.framer.website · score **~8.0**. Still not Featured.

## Cómo no quemar créditos

1. **New Chat** cada bloque. Fast Mode **Off**. Reasoning **Light** (nunca Higher).
2. Pega **solo** el bloque entre `---`. **No** pegues `00-constraints.md`. **No** pegues esta guía.
3. **Antes** de enviar: `@` la página y **selecciona el layer** que dice el picker. El Agent sin layer rastrea el proyecto entero.
4. Si acaba el job, **para**. No “y también revisa el resto”.
5. **No** crear páginas. **No** `/code`. **No** Fable 5 / GPT 5.6 Sol.

Modelos baratos: **Luna 0.4×** · **Sonnet 5 0.6×**. Si no hay Luna → Sonnet 5 Light (no GPT 5.5).

Cerrado (no re-correr): Neighbourhoods lleno, full-bleed 1440, coords/rooms, waiting con cuerpo.

---

## 01 — Un href (blocker)

**Picker:** GPT 5.6 Luna · Light · sin skill · Fast Off  
**@** `Home` · selecciona el botón **SEE RESIDENCES IN THIS AREA** (Territories)  
**Esfuerzo:** 0.4×

---

On Home, the selected button "SEE RESIDENCES IN THIS AREA" has href `/neighbourhoods/chelsea`. Change that href to `/neighbourhoods`. Do not create pages. Do not edit copy. Stop.

---

## 02 — Número 05 + bind Home

**Picker:** GPT 5.6 Luna · Light · `/cms` · Fast Off  
**@** collection **Notes** + lista journal de `Home`  
**Esfuerzo:** 0.4×

---

/cms
1. Notes item "Reading a façade as a ledger of ownership." — set its number/index field to 05. It currently has none.
2. Home journal card "The case for waiting." shows "[ ]". Bind that number to the same Notes number field used on /notes. That item is 04.
Do not add, delete, unpublish, or rename notes. Do not retitle. Stop.

---

## 03 — lang=en

**Picker:** GPT 5.6 Luna · Light · `/seo` solo si está en el menú `/` · Fast Off  
**@** Site Settings  
**Esfuerzo:** 0.4×

---

Site Settings: set site language to English so html lang is `en`. Change nothing else. Stop.

---

## 04 — Cuatro alts

**Picker:** GPT 5.6 Luna · Light · `/cms` · Fast Off  
**@** estos 4 items Properties (hero image)  
**Esfuerzo:** 0.4×

---

/cms
Replace alt "Property hero photograph" on these four property heroes only:
- Frognal Georgian Villa → "Brick Georgian villa on Frognal, Hampstead, with garden"
- Ladbroke Grove Garden House → "Notting Hill townhouse on Ladbroke Grove with garden front"
- Royal Avenue Lateral Apartment → "Lateral apartment façade on Royal Avenue, Chelsea"
- Colville Mews House → "Brick mews house on Colville Terrace, Notting Hill"
Do not change photos. Stop.

---

## 05 — Hover en 3 links de Home

**Picker:** Sonnet 5 · Light · `/component` · Fast Off  
**@** `Home` · selecciona `EXPLORE →`, `VIEW ALL →`, `VIEW ALL NOTES →`  
**Esfuerzo:** 0.6×

---

/component
On the three selected Home links (EXPLORE →, VIEW ALL →, VIEW ALL NOTES →): add Hover opacity 0.55 (180ms) and Pressed opacity 0.4. If they share one component, edit it once. Do not change color, type, size, or any other layer. Stop.

---

## 06 — Tag header (un componente)

**Picker:** Sonnet 5 · Light · `/layout` solo si está en el menú `/` · Fast Off  
**@** el componente nav / top bar compartido · selecciona su frame raíz  
**Esfuerzo:** 0.6×

---

Set the selected shared top-bar component root to HTML tag `header`. Do not duplicate it. Do not edit other pages. Stop.

---

## 07 — Scrim solo Home hero

**Picker:** Sonnet 5 · Light · sin skill · Fast Off  
**@** `Home` · selecciona el hero (foto + título blanco)  
**Esfuerzo:** 0.6×

---

On the selected Home hero only: add a bottom gradient overlay, black 50% at the bottom to transparent at ~40% height, so the white title stays readable. Do not change the photo, type, or other pages. Stop.

---

## 08 — Una frase en Contact

**Picker:** GPT 5.6 Luna · Light · sin skill · Fast Off  
**@** `Contact` · selecciona el texto junto a SUBSCRIBE  
**Esfuerzo:** 0.4×

---

On Contact, delete the text layer that says exactly: DEMO TEMPLATE — REPLACE THIS NOTE WITH YOUR PRIVACY POLICY BEFORE PUBLISHING. Do not create a /privacy page. Do not edit the form. Stop.

---

## Fuera del Agent

- Favicon: si no hay un mark cuadrado ya en Assets, **no** pidas uno al Agent (diseña/sube tú). El default `default-favicon-light.v1.png` es humano.
- Neighbourhoods CTA → prefiltro AREA: no. El 404 se cierra en **01**.
- Lighthouse / Performance panel: humano.

**Total Agent si Luna está:** ~3.6× un GPT 5.5. Antes: 5 chats Higher (varios a 1×) + constraints + “scan the whole project”.
