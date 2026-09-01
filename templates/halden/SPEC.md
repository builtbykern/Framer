# Halden Photographer

Live Framer Marketplace template ($29). Portafolio de fotografía editorial. No reutiliza otras templates.

## Tema

**Mira Halden** — fotógrafa editorial en Lisboa. El trabajo se publica en series, no como fotos sueltas.

Tres carriles:

- **People** — retratos y ensayos de figura
- **Place** — paisaje y territorio
- **Commission** — encargos

Home: Drift Plane como archivo que se recorre. Click en una carta: página de esa serie.

Contraste: descubrimiento en el plane, contemplación en el proyecto.

Cromo: negro, texto blanco, fotos en color. Sin lorem.

## Sitemap

- `/` Home — Drift Plane a viewport, covers CMS
- `/work` Index — lista título / año / tipo (SEO, teclado, móvil)
- `/work/{slug}` Proyecto — una página CMS por serie
- `/info` Bio
- `/contact` Formulario + email
- `/privacy` Legal mínimo
- 404 custom

## CMS `Work`

Un ítem = una serie.

| Campo | Uso |
| --- | --- |
| Title | Título de la serie |
| Slug | `/work/{slug}` |
| Cover | Carta en el plane |
| CoverFormat | portrait / landscape / square |
| Gallery | Columna de media del detalle |
| Year | Meta |
| Location | Meta |
| Type | people / place / commission (chips) |
| Client | Opcional; vacío en series personales |
| Description | 2–4 frases |
| Credits | Pares label / value (camera, format, etc.) |
| Featured | Si entra en el plane del home |

## Página de proyecto

Split, no lightbox:

- Izquierda ~33%, sticky, fondo negro: título display, location / year / client / credits, descripción, chips
- Derecha ~67%: imágenes a ancho de columna, apiladas, sin UI encima
- Phone: meta arriba, galería abajo

## Drift Plane

- Cartas = covers de ítems Featured
- Click (sin drag) → `/work/{slug}`
- Pan + idle drift; `prefers-reduced-motion` desactiva el drift
