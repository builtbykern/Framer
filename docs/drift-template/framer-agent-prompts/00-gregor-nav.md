# Nav + velo — lectura de Gregor, canon Drift

Referencia de **comportamiento**, no de copia: [gregorcollienne.com](https://gregorcollienne.com) (WordPress, tema `fstheme`, Tostaky). Drift no usa su tipo (Neue Rational), su X, Overview/Work, ni el copyright.

Si el canvas improvisa un hamburger o un fade genérico, gana este archivo.

---

## Qué hace Gregor (hechos)

Chrome cerrado: un **+** fijo arriba al centro (dos barras de 3px). No hay hamburger, no dice MENU, no hay links a la vista. El nombre vive en el canvas, no en el header.

Chrome abierto: el mismo hit-target hace **flip 3D en X** (`perspective: 700px`, `rotateX`, `0.79s`, `cubic-bezier(.77, 0, .175, 1)`) y el + se convierte en **X** (las mismas barras a 45°). Debajo, pantalla completa del color light `#f5f3f0`. Links enormes (Overview, Work) entran con `translateY + rotateX(-40deg)` → identidad, stagger 60ms. El fondo se **blurea 12px** y se cubre de light.

Cambio de página (no es Barba ni GSAP): interceptan el click, `html.js-transition--start`, un `::before` a viewport (`backdrop-filter: blur(12px)` + fill light opaco, `0.49s`, `cubic-bezier(.5, 0, .5, 1)`), swap del `main`, quitan la clase, el velo se levanta. Si el menú estaba abierto, lo cierran en el mismo gesto.

Móvil: el mismo +, el mismo overlay. No hay patrón distinto.

---

## Qué toma Drift

| Gregor | Drift |
|---|---|
| + centrado | **+ centrado** (dos barras 2px, 20×20 / hit 32px) |
| Flip 3D `rotateX` 0.79s | **El mismo flip** |
| Close = X | Close = la palabra **Close** (Label). No X, no hamburger, no “Menu” |
| Overlay light `#f5f3f0` | Overlay **`paper` `#F6F3EE`** (también sobre Home negro) |
| Overview / Work | **Info**, **Contact**. Cero índice `/work` |
| Bio en el overlay | No. La bio vive en `/info` |
| Nombre en el canvas | **VALE** a la izquierda (Mark). El plane no lleva título gigante |
| Velo blur 12px + fill light 0.49s | **Veil** `paper` + blur 12px, 0.49s, cada navegación interna |

---

## Componente `Nav` (3 variants)

| Variant | Dónde | Color chrome |
|---|---|---|
| `closedOnDark` | Home, menú cerrado | VALE + plus en `paper` |
| `closedOnLight` | Info, Contact, 404, Work detail, menú cerrado | VALE + plus en `ink` |
| `open` | Cualquier página, menú abierto | Overlay `paper` a viewport. VALE + **Close** + links en `ink` |

`open` es uno solo: al abrir en Home el chrome pasa a ink sobre paper (si VALE siguiera `paper` sobre paper, desaparece).

**Cerrado (todas las breakpoints, 1440 / 768 / 390):**

- Fijo, no empuja el plane. Pad 22×28 desktop / 16×20 phone.
- Izquierda: VALE → `/`
- Centro: plus. `aria-label="Open menu"`. Cursor pointer.
- Nada a la derecha. Cero Info/Contact en la barra.

**Plus:** dos rectángulos 20×2px, `paper` o `ink` según variant, cruzados (0° y 90°). Radio 0. No es un carácter “+” de Syne.

**Abierto:**

- Overlay `paper`, z-index bajo el chrome (VALE y el trigger quedan encima).
- El plus hace flip `rotateX` 0.79s (`cubic-bezier(0.77, 0, 0.175, 1)`) y sale. Entra **Close** (Label, uppercase) con el mismo flip. `aria-label="Close menu"`. Misma posición central. **No dibujar una X.**
- Centro vertical: links **Info** → `/info`, **Contact** → `/contact`. Style **Display**, ink, stacked, gap ~12. Excepción: Display aquí no es H1 de serie; el H1 de la overlay es sr-only “Menu”.
- Abajo: Label `studio@vale.work` (mailto) a la izquierda · Instagram `vale.work` a la derecha. Sin copyright, sin FB/LI.
- Links de overlay: entrada `opacity 0` + ligero `rotateX(-40deg)` → identidad, 0.79s, stagger 60ms (Info luego Contact). Si Framer no hace 3D fiable: opacity + translateY 8px, misma curva y tiempo.
- Fondo detrás (plane o página): blur 12px mientras `open`.
- Escape y click en Close cierran. Click Info/Contact navega y deja `open` → closed del destino (el Veil cubre el corte).

---

## Veil (animación de página)

Layer del **layout template**, viewport, `paper` fill + blur 12px, z-index **bajo** el Nav (el plus/VALE se leen durante el velo).

Cada carga de página interna (Home, Info, Contact, 404, `/work/{slug}` — también el click del plane):

1. Veil visible (paper opaco, blur 12px)
2. A los ~100ms, 0.49s `cubic-bezier(0.5, 0, 0.5, 1)`: blur → 0, opacity → 0, `pointer-events: none`
3. En Framer: Appear en el layer Veil, “play on page appear / every time”

No es un wipe de color de marca, no es un fade a negro, no es un slide horizontal. Es **escarcha paper**.

`prefers-reduced-motion`: sin flip, sin blur, overlay instantánea, Veil off.

---

## Qué no copiar

Neue Rational. X. Hamburger. Palabra MENU. Overview/Work. Grid/List. Copyright. Bio en el overlay. `#FFF` / `#000`. Cuarto text style. `/code` para el velo (Appear + variants).
