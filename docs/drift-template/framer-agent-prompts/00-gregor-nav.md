# Nav + Page Effect — gesto Gregor, Open visual Coad

Referencia de **comportamiento** (overlay desde un plus, no una ruta): [gregorcollienne.com](https://gregorcollienne.com). Referencia de **estructura Open**: split ~33/67 tipo Ian Coad (la foto manda). No copiar Neue Rational, la X, Overview/Work, plus centrado, sidebar negra, ni copyright.

Fases: **03** chrome cerrado · **03B** instancias + Page Effect Fade · **03C** Open visual · **03D humano** pega frost CSS (Page Effect no tiene Blur; el Agent no edita Custom Code).

**Prohibido:** Layout Templates. Un layer “Veil”. Hamburger. Icono X. Wipe / Slide / Push.

---

## Nav = componente, una instancia por página

No vive en un template. Se **crea una vez** y se **coloca a mano** en Home, Info, Contact, 404 y Work detail.

Fixed, top, left 0, right 0, z-index 30. No empuja el contenido.

| Variant | Instancia | Chrome |
|---|---|---|
| `closedOnDark` | Home | VALE + plus en `paper` |
| `closedOnLight` | Info, Contact, 404, Work detail | VALE + plus en `ink` |
| `open` | transitorio, todas | Split 33/67: tipo paper izquierda, still a sangre derecha. Close (palabra) a la derecha |

Cerrado: **no es Gregor**. VALE a la izquierda (Mark). Plus a la **derecha** (no al centro). Cero Info/Contact en la barra.

Abierto: **muy visual**. Mix Coad × overlay:
- Desktop/Tablet: split **33 / 67**. Izquierda paper + tipo. Derecha still a sangre (Cover de Salt Light o variable `menuStill`).
- Phone: still ~50vh arriba a sangre, tipo debajo.
- Close = palabra **Close** (Label), mismo slot derecho que el plus. No X.
- Links Display: Info, Contact. Lead de una línea. Email / Instagram Label abajo a la izquierda.
- El still entra scale 1.06→1 + opacity, 0.79s. El tipo entra después (delay 0.12s).

No clonar Overview/Work, bio larga, plus centrado, ni sidebar negra.

Tap plus → variant `open`. Tap Close → **previous variant**. Links Info/Contact = Link normal (dispara el Page Effect).

---

## Cambio de página = Page Effect nativo

No hay layer velo. No hay layout template.

1. Pages → **Home**.
2. Seleccionar el breakpoint **Desktop 1440** (la página, no un frame interior).
3. Right sidebar → **Effects** → **+** → **Page Effect**.
4. Target: **All Pages**.
5. Preset: **Fade** (o Crossfade). Nunca Wipe, Slide, Push, Blinds, Circular, Zigzag, Inset.
6. Exit: duration **0.49s**, easing `cubic-bezier(0.5, 0, 0.5, 1)`, offset **0**.
7. Enter: delay **0.10s**, duration **0.49s**, misma curva, offset **0**.
8. **Frost Gregor = Custom Code, no el Agent.** Page Effect no expone Blur (solo opacity, transform, mask). Site Settings → Custom Code no es editable por el Agent.
   - Humano pega [`frost-view-transition.html`](frost-view-transition.html) en Site Settings → General → Custom Code → End of `<head>`.
   - Preview en Chrome. Si no gana, mismo bloque en End of `<body>`.
   - Nunca un layer Veil. Nunca pidas al Agent “añade blur al Page Effect”.
9. Nav **sin** Page Effect Exclude.

El color que se ve **entre** páginas es el **fill del breakpoint**, no el del canvas interior.

- Breakpoint de **todas** las páginas (Home incluida): fill **`paper` `#F6F3EE`**.
- Home: un frame interior a viewport fill **`home-bg`**, con el Drift Plane dentro. Así el corte es escarcha paper, no negro.

`prefers-reduced-motion`: Page Effect off o Instant (sin blur).
