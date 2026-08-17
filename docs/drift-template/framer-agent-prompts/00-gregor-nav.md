# Nav — BrandRoll VALE (auto-roll), Open visual Coad

Referencia de **comportamiento** (un control abre overlay, no una ruta): [gregorcollienne.com](https://gregorcollienne.com). Referencia de **estructura Open**: split ~33/67 tipo Ian Coad. Referencia de **roll** (gesto, no el componente): LetterRollMenu dual-layer vertical swap **en loop**, sin hover. No insertar LetterRollMenu (es un menú de 3–5 filas). No copiar Neue Rational, X, Overview/Work, plus, sidebar negra, ni el velo Gregor a 12px.

Fases: **03** chrome cerrado · **03B** instancias Nav · **03C** Open visual · **03D** Settle nativo (blur 6px + bg baja; inverso al salir).

**Prohibido:** Layout Templates. Hamburger. Plus. X. Palabra Close. Palabra MENU. Wipe / Slide / Push (preset). Custom Code. Page Effect Fade. Insertar LetterRollMenu. Hover como trigger del roll.

---

## Nav = componente, una instancia por página

Fixed, top, left 0, right 0, z-index 30. No empuja el contenido. No Layout Template.

Un solo control en la barra: **BrandRoll**, centrado. Un solo texto: **VALE**. Cero plus. Cero Close. Cero Info/Contact en la barra.

| Variant | Instancia | Chrome |
|---|---|---|
| `closedOnDark` | Home | BrandRoll **VALE**, color `paper`, auto-roll |
| `closedOnLight` | Info, Contact, 404, Work detail | BrandRoll **VALE**, color `ink`, auto-roll |
| `open` | transitorio, todas | Split 33/67. BrandRoll **VALE** (mismo texto), color `paper` (sobre el still), auto-roll |

**BrandRoll**

- Style **Mark**, uppercase. **Una palabra: VALE.** No MENU. No lista.
- Dual-layer de las mismas 4 letras (overflow hidden). Loop automático: roll ~0.45s, stagger 0.03s desde el centro, pausa 2.0s, repetir. Si no hay stagger por letra: dos capas VALE, Y loop de la palabra.
- **Trigger = Loop / animación que se repite.** No While Hovering. El tap abre/cierra el overlay; no dispara el roll. También en Phone.
- No es un link a `/`. Tap closed → `open`. Tap `open` → **Previous**.
- Hit ≥ 44×32. `aria-label` “Open menu” / “Close menu”.
- `prefers-reduced-motion`: VALE estático, loop off.

Abierto: mix Coad × overlay. Still a sangre. Links Info / Contact en la columna paper. VALE en esa columna sí va a `/` (ese VALE no rueda).

---

## Motion (sutil, nativo, Safari = Chrome)

No es el frost Gregor (paper 45% + blur 12). Es **Settle**:

| Pieza | Entrar / abrir | Salir / atrás |
|---|---|---|
| Lo que ya está en pantalla | **Scrim** dim: paper 16% + Background Blur **6px** | Scrim clear |
| Superficie que entra (menú 33/67, paper de Work/Info/Contact/404) | **Baja:** y −32 → 0 (phone −20), opacity 0.7 → 1 | **Sube:** y 0 → −32 (variant Previous del menú; Appear no se invierte sola en páginas — el Scrim se aclara y la nueva superficie baja) |
| Drift Plane | No se traduce. No se recubre con paper opaco | Igual |
| BrandRoll | Sigue **VALE**, loop auto | Igual |

Tiempos: menú **0.79s** `cubic-bezier(0.77, 0, 0.175, 1)`. Roll **~0.45s** + rest **2.0s**. Página **0.49s** `cubic-bezier(0.5, 0, 0.5, 1)`, Appear delay 0.10s. Links de ruta: Scrim dim → Navigate delay **0.35s**.

Still del Open: scale **1.03→1** como máximo, no 1.06.

`prefers-reduced-motion`: Scrim, Y y BrandRoll instantáneos / loop off.

Page Effect: **Instant o fuera**. Breakpoint fill `paper`. Home: frame interior `home-bg` + Plane.

Legacy (no usar): [`frost-view-transition.html`](frost-view-transition.html).
