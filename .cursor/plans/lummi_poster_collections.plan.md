# Lummi: 6 series de pósters (Vitrine)

Un diseñador. Seis colecciones. Mismo papel, distinto tema.  
IP inventada: no Odyssey, no Godfather, no Curry, no NBA, no IMAX.

## Volumen

- **6 series × 8 hojas = 48 covers**
- **48 stills** (la misma hoja: recorte de tipo, sangrado, o muro)
- **96 archivos** en total
- Séptima serie **Ciudad**: no arrancar hasta que las 48 existan

Empieza por 4 de Cartel. Si el piloto no es SOTD, para. No dispares las 96 de golpe.

## ADN de estudio (todas las hojas)

- Formato **2:3** vertical. Cover = el cartel entero. Sin mockup, sin iMac, sin manos.
- Papel crema, margen fino, se ve impreso (grano / dither / tinta).
- El tipo va **dentro** del cartel.
- Una imagen hero. Paleta corta (2–3 tintas por hoja).
- Refs de estilo: los ejemplos que enviaste. Refs de contenido: nunca el filme/atleta real.

Archivos: `{serie}-{nn}-cover.png` y `{serie}-{nn}-still.png`  
`nn` = `01`…`08`

---

## 1. Cartel (cine) — 8 hojas

Dos recetas, 4+4. Misma familia de tipo.

**A. Prestige dither** (refs Odyssey)  
Dither/halftone, 2 tintas (teal-navy + crema o similar), tipo pixel o caps chicos, borde de papel, escala épica, figura pequeña vs masa grande.

**B. Noir gráfico** (refs Godfather)  
Silueta o cenital, mucho vacío, una tinta saturada (rojo oxblood / negro), serif o grotesk centrado, sin caras famosas.

Títulos inventados (usar estos, no otros):  
North Fold · Salt Harbor · The Late Room · Winter Ledger · Red Cloth · Night Clerk · Glass Pier · Second Witness

Prompt base A:  
`printed movie poster, 2:3, cream paper margin, heavy dither or halftone, two-ink palette, small pixel or caps title, invented film title "{TITLE}", no real actors, no studio logos, no IMAX`

Prompt base B:  
`printed movie poster, 2:3, cream paper margin, graphic noir, silhouette or overhead table, deep red or black field, centered serif title "{TITLE}", no real actors, no trademarks`

Stills: recorte del título o del margen de papel de esa misma hoja.

---

## 2. Cancha (deporte) — 8 hojas

Refs Curry: contrapicado + cielo; figura sola + grano 35mm; atmósfera, no action shot de stock.

Atletas y clubes inventados:  
Rook Vale · Iona Park · Dell Marsh · N. Kade · Solent · Harbor Five · East Wick · M. Voss

Prompt:  
`printed sports poster, 2:3, analog 35mm grain, low angle or lone athlete, teal night sky, invented player "{NAME}", invented team, no NBA, no NFL, no jersey of a living player, cream paper margin, type on the poster`

4 contrapicado / cielo. 4 figura contemplativa o cancha vacía + tipo.  
Stills: dorsal inventado, balón, o grano del cielo de esa hoja.

---

## 3. Mito (épica) — 8 hojas

Ref guerrero impasto: una figura, oro/crema, halo o explosión de pintura, sin marcas de armadura.

Nombres:  
Ash Veil · The Ninth Gate of Salt · Bronze Mouth · Quiet Spear · Red Harvest · Ion Crown · Low Fire · The Unnamed Horse

Prompt:  
`printed myth poster, 2:3, thick impasto paint, one figure, gold and cream, invented epithet "{TITLE}", no copyrighted armor, no film still, cream paper margin, title on the poster`

Stills: empaste, filo, o halo recortado de la misma hoja.

---

## 4. Escena (música en vivo) — 8 hojas

Misma imprenta. Overprint, una tinta extra (rojo o azul), tipo grande. Sin bandas reales.

Noches inventadas:  
Wire Room · Late Beacon · Dual Coil · North Amp · Soft Voltage · Ribbon Set · Hollow Date · Second Sound

Prompt:  
`printed gig poster, 2:3, overprint ink, large type, one extra ink, cream paper, invented act "{TITLE}", no real band names, no venue logos, grain, not a photo of a crowd`

Stills: tipo gigante recortado o capa de overprint.

---

## 5. Sala (teatro / danza) — 8 hojas

Silueta o foco, mucho vacío, un título. Más quieto que Cartel B.

Obras:  
The Empty Chair · Left Wing · Dust Interval · Third Call · Pale Hands · Gallery Night · Slow Exit · Understudy

Prompt:  
`printed theatre poster, 2:3, large negative space, single silhouette or spotlight, cream paper, invented play "{TITLE}", small caps credits, no real theatres, no photos of dancers`

Stills: foco, silueta, o bloque de créditos de esa hoja.

---

## 6. Muro (exposición) — 8 hojas

Cartel de sala: tipo + fechas inventadas + una imagen quieta. No look de Behance.

Muestras:  
Plaster Hours · Dry Pigment · The Long Shelf · Quiet Clay · Offset Study · North Wall · Paper Cut · Late Vitrine

Prompt:  
`printed exhibition poster, 2:3, typographic, invented show "{TITLE}", invented dates, one still image of object or wall, cream paper, museum quiet, no real museum names, no QR, no Instagram`

Stills: bloque de fechas o el objeto recortado.

---

## Orden en Lummi

1. Cartel-01 Cover receta A + Still. Parar si no es SOTD.
2. Cartel 02–04 (A) con ese par como referencia de shoot.
3. Cartel 05–08 receta B, mismo papel/margen que A.
4. Cancha 01–08
5. Mito 01–08
6. Escena → Sala → Muro

No mezcles recetas en un mismo shoot. Un shoot = una serie.

## Checklist por hoja

- [ ] 2:3, margen de papel visible
- [ ] Título inventado, legible en el cartel
- [ ] No logos reales, no caras famosas
- [ ] Still es la misma hoja
- [ ] Nombre de archivo correcto

## Después (Framer, no ahora)

Campo CMS **Series**: Cartel / Cancha / Mito / Escena / Sala / Muro.  
12 featured en Home; las 48 en índice. Cover + Still por pieza.
