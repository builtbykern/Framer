# Nav — BrandRoll VALE ↔ MENU, Open visual Coad

Referencia de **comportamiento** (un control abre overlay, no una ruta): [gregorcollienne.com](https://gregorcollienne.com). Referencia de **estructura Open**: split ~33/67 tipo Ian Coad. Referencia de **roll** (gesto, no el componente): LetterRollMenu dual-layer vertical swap. No insertar LetterRollMenu (es un menú de 3–5 filas). No copiar Neue Rational, X, Overview/Work, plus, sidebar negra, ni el velo Gregor a 12px.

Fases: **03** chrome cerrado · **03B** instancias Nav · **03C** Open visual · **03D** Settle nativo (blur 6px + bg baja; inverso al salir).

**Prohibido:** Layout Templates. Hamburger. Plus. X. Palabra Close. Wipe / Slide / Push (preset). Custom Code. Page Effect Fade. Insertar LetterRollMenu.

---

## Nav = componente, una instancia por página

Fixed, top, left 0, right 0, z-index 30. No empuja el contenido. No Layout Template.

Un solo control en la barra: **BrandRoll**, centrado. Cero VALE a la izquierda. Cero plus a la derecha. Cero Info/Contact en la barra.

| Variant | Instancia | Chrome |
|---|---|---|
| `closedOnDark` | Home | BrandRoll **VALE**, color `paper` |
| `closedOnLight` | Info, Contact, 404, Work detail | BrandRoll **VALE**, color `ink` |
| `open` | transitorio, todas | Split 33/67. BrandRoll muestra **MENU**, color `paper` (sobre el still) |

**BrandRoll**

- Style **Mark**, uppercase. Un texto, no una lista.
- Idle / closed: **VALE**. Hover Desktop + variant `open`: rueda a **MENU**.
- VALE y MENU = 4 letras. Dual-layer vertical swap (overflow hidden). Preferible 4 celdas (V/M, A/E, L/N, E/U), stagger 0.03s desde el centro. Si el Agent no puede por letra: roll de la palabra entera (Y −100%). Ancho = la palabra más ancha (MENU) para que no salte.
- No es un link a `/`. Tap closed → `open`. Tap `open` → **Previous** (MENU rueda otra vez a VALE).
- Hit ≥ 44×32. `aria-label` “Open menu” / “Close menu”. Phone: sin hover; el tap abre; `open` muestra MENU.
- `prefers-reduced-motion`: corte instantáneo VALE/MENU, sin Y.

Abierto: mix Coad × overlay. Still a sangre. Links Info / Contact en la columna paper. VALE en esa columna sí va a `/`.

---

## Motion (sutil, nativo, Safari = Chrome)

No es el frost Gregor (paper 45% + blur 12). Es **Settle**:

| Pieza | Entrar / abrir | Salir / atrás |
|---|---|---|
| Lo que ya está en pantalla | **Scrim** dim: paper 16% + Background Blur **6px** | Scrim clear |
| Superficie que entra (menú 33/67, paper de Work/Info/Contact/404) | **Baja:** y −32 → 0 (phone −20), opacity 0.7 → 1 | **Sube:** y 0 → −32 (variant Previous del menú; Appear no se invierte sola en páginas — el Scrim se aclara y la nueva superficie baja) |
| Drift Plane | No se traduce. No se recubre con paper opaco | Igual |
| BrandRoll | VALE → MENU | MENU → VALE |

Tiempos: menú **0.79s** `cubic-bezier(0.77, 0, 0.175, 1)`. Roll de letras **~0.45s**, stagger 0.03s. Página **0.49s** `cubic-bezier(0.5, 0, 0.5, 1)`, Appear delay 0.10s. Links de ruta: Scrim dim → Navigate delay **0.35s**.

Still del Open: scale **1.03→1** como máximo, no 1.06.

`prefers-reduced-motion`: Scrim, Y y BrandRoll instantáneos.

Page Effect: **Instant o fuera**. Breakpoint fill `paper`. Home: frame interior `home-bg` + Plane.

Legacy (no usar): [`frost-view-transition.html`](frost-view-transition.html).
