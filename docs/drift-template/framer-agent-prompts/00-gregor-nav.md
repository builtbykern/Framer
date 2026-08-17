# Nav + Settle nativo — gesto Gregor, Open visual Coad

Referencia de **comportamiento** (plus abre overlay, no una ruta): [gregorcollienne.com](https://gregorcollienne.com). Referencia de **estructura Open**: split ~33/67 tipo Ian Coad. No copiar Neue Rational, X, Overview/Work, plus centrado, sidebar negra, ni el velo Gregor a 12px.

Fases: **03** chrome cerrado · **03B** instancias Nav · **03C** Open visual · **03D** Settle nativo (blur 6px + bg baja; inverso al salir).

**Prohibido:** Layout Templates. Hamburger. X. Wipe / Slide / Push (preset). Custom Code. Page Effect Fade.

---

## Nav = componente, una instancia por página

Fixed, top, left 0, right 0, z-index 30. No empuja el contenido. No Layout Template.

| Variant | Instancia | Chrome |
|---|---|---|
| `closedOnDark` | Home | VALE + plus en `paper` |
| `closedOnLight` | Info, Contact, 404, Work detail | VALE + plus en `ink` |
| `open` | transitorio, todas | Split 33/67. Close (palabra) a la derecha |

Cerrado: VALE izquierda. Plus **derecha**. Cero Info/Contact en la barra.

Abierto: mix Coad × overlay. Still a sangre. Close = palabra, no X. Links Info / Contact.

Tap plus → `open`. Tap Close → **previous** (inverso automático).

---

## Motion (sutil, nativo, Safari = Chrome)

No es el frost Gregor (paper 45% + blur 12). Es **Settle**:

| Pieza | Entrar / abrir | Salir / atrás |
|---|---|---|
| Lo que ya está en pantalla | **Scrim** dim: paper 16% + Background Blur **6px** | Scrim clear |
| Superficie que entra (menú 33/67, paper de Work/Info/Contact/404) | **Baja:** y −32 → 0 (phone −20), opacity 0.7 → 1 | **Sube:** y 0 → −32 (el variant Previous del menú; Appear no se invierte sola en páginas — el Scrim se aclara y la nueva superficie baja) |
| Drift Plane | No se traduce. No se recubre con paper opaco | Igual |

Tiempos: menú **0.79s** `cubic-bezier(0.77, 0, 0.175, 1)`. Página **0.49s** `cubic-bezier(0.5, 0, 0.5, 1)`, Appear delay 0.10s. Links de ruta: Scrim dim → Navigate delay **0.35s**.

Still del Open: scale **1.03→1** como máximo, no 1.06.

`prefers-reduced-motion`: Scrim y Y instantáneos.

Page Effect: **Instant o fuera**. Breakpoint fill `paper`. Home: frame interior `home-bg` + Plane.

Legacy (no usar): [`frost-view-transition.html`](frost-view-transition.html).
