# Fase 03 — Home: Drift Plane + BrandRoll

**Prerrequisito humano:** el code component **Drift Plane** está en el proyecto (Assets / Insert). El Agent no lo genera.

**Objetivo:** Home = plane a viewport + chrome mínimo: **BrandRoll** centrado (VALE ↔ MENU). Mark según [`00-visual-system.md`](00-visual-system.md). Gesto: [`00-gregor-nav.md`](00-gregor-nav.md). Ningún otro hero.

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
| @ | `@Home`, Drift Plane component, styles |
| Context | Selecciona el layer Home |
| No usar | Fable, Sol, `/code`, Unsplash, LetterRollMenu, plus, Close, hamburger |

Opus: Help — *visual judgment, nuanced multi-step*. Higher: colocar el componente sin inventar un landing.

## Prompt (después de constraints)

```
/component

Build Home `/` only. Home is the Drift Plane. Nothing else except chrome.

1. Insert the existing Drift Plane code component so it fills the viewport (width 100%, height 100vh / 100dvh). Pin it. Do not recreate it in native stacks. Do not wrap it in a marketing hero (no headline, no reel, no grid of projects besides the plane).

2. Create a Nav component and place it on Home. Structure only in this chat — instances on other pages are 03B; visual Open (still split) is 03C; Settle (small blur + bg lowers) is 03D. Follow 00-gregor-nav.md.

   Closed bar (variant closedOnDark):
   - Height ~56px, width 100%. ONE control only: BrandRoll, dead-center (horizontal + vertical). Empty left. Empty right.
   - Do NOT put VALE on the left. Do NOT add a plus, hamburger, X, or the word Close. Do NOT put Info or Contact in the bar.
   - Do NOT insert the LetterRollMenu code component (that is a 3–5 row menu). Steal only the dual-layer vertical roll.

   BrandRoll (Mark style, uppercase, paper color on home-bg — not #FFF):
   - Idle: VALE. Hover Desktop + later variant open: rolls to MENU.
   - Both words are 4 letters. Overflow hidden. Dual-layer Y swap (LetterRollMenu “Roll” idea). Prefer 4 letter cells: V/M, A/E, L/N, E/U, stagger 0.03s from center, ~0.45s. If per-letter fails: whole-word Y −100%. Width = wider word (MENU) so the mark does not jump.
   - Not a link to `/`. Tap → Set Variant open. Hit 44×32 minimum. aria-label “Open menu”.
   - Phone: no hover. Tap still opens.
   - Optional 88px-tall scrim behind the bar: home-bg 70% to transparent. No other gradient.

   - Position: top, overlay, does not push the plane down. Nav pad 22×28 desktop, 16×20 phone
   - Same chrome on Phone (BrandRoll stays centered). No drawer
   - Component variables: email studio@vale.work, instagram https://www.instagram.com/vale.work
   - Stub variant closedOnLight (ink BrandRoll) for later pages
   - Stub variant open: full-viewport paper, Info / Contact in Display, BrandRoll shows MENU and tap → Previous — wiring in 03B, visual still-split in 03C

3. Hint, Label style, muted, bottom 24 left 28, pointer-events none:
   “Pan the plane · click a series”

4. One H1 “VALE” visually hidden (sr-only / 1px clip) for semantics. No visible H1 on Home.

5. Create Nav as a Component. Place one instance on Home only (fixed top). Do not create a Layout Template. Other pages get their instance in phase 03B.

6. Do not fill the Plane array with CMS links yet (phase 09A). Placeholder cards already on the component are OK. Do not add Index, footer, or extra sections.

Report: how Drift Plane is placed, Nav variant names (must include closedOnDark), confirm BrandRoll is centered VALE↔MENU, confirm no plus and no LetterRollMenu, confirm no Layout Template.
```

## Definition of done

- Home negro, plane fullscreen, Nav = BrandRoll centrado (sin plus, sin Close, sin links en la barra), hint visible.
- Cero bloques tipo “featured work” aparte del plane.

## No tocar

CMS fields. Detail layout. Lummi. `/code`.

## Verificación humana

1440: plane + VALE al centro; hover → MENU. 390: tap abre, plane sigue siendo el fondo (snap viene en 09B).

## Siguiente

Chat nuevo → fase 03B (instancias Nav), luego 03C (Open visual), luego 03D (Settle).
