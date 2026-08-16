# Nav + Page Effect — Gregor en Drift

Referencia de **comportamiento**: [gregorcollienne.com](https://gregorcollienne.com). No copiar Neue Rational, la X, Overview/Work, ni copyright.

**Prohibido:** Layout Templates. Un layer “Veil”. Hamburger. Icono X. Wipe / Slide / Push.

---

## Nav = componente, una instancia por página

No vive en un template. Se **crea una vez** y se **coloca a mano** en Home, Info, Contact, 404 y Work detail.

Fixed, top, left 0, right 0, z-index 30. No empuja el contenido.

| Variant | Instancia | Chrome |
|---|---|---|
| `closedOnDark` | Home | VALE + plus en `paper` |
| `closedOnLight` | Info, Contact, 404, Work detail | VALE + plus en `ink` |
| `open` | transitorio, todas | Overlay `paper` 100vw/100vh. VALE + **Close** (Label) + Info / Contact en `ink` |

Cerrado: VALE izquierda → `/`. Plus centro (dos barras 20×2px, 0° / 90°, hit 32px). Nada a la derecha.

Abierto: overlay paper dentro del componente (absolute, viewport). Links Display: Info, Contact. Abajo Label: email · Instagram. Close = la palabra, no una X.

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
8. Si el panel tiene Blur/Filter: Exit 0→12, Enter 12→0. Si no existe, Fade + fill paper basta.

El color que se ve **entre** páginas es el **fill del breakpoint**, no el del canvas interior.

- Breakpoint de **todas** las páginas (Home incluida): fill **`paper` `#F6F3EE`**.
- Home: un frame interior a viewport fill **`home-bg`**, con el Drift Plane dentro. Así el corte es escarcha paper, no negro.

Si el Nav tiene control **Page Effect → Exclude**, actívalo. Si no existe, el Nav se funde con la página. **No** crees un Layout Template para conseguir Exclude.

`prefers-reduced-motion`: Page Effect off o Instant.
