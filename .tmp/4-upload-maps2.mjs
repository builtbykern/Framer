const fs = require("fs");

const ASSETS = "/Users/noel/Desktop/Framer/.tmp/maps";

const maps = [
  {
    file: "stylized-city-map-ek06o-428e24b3-b570-4997-865b-a04440a36d1b.png",
    name: "Map Hampstead",
    itemId: "h6Uk_Pbg1",
    slug: "hampstead",
  },
  {
    file: "highlighted-city-map-uj-nt-c898ec80-60bc-40c1-97ca-fabe67938592.png",
    name: "Map Notting Hill",
    itemId: "Jfbalm8Q5",
    slug: "notting-hill",
  },
  {
    file: "minimal-city-map-jwl6q-6bbe325e-9e9d-40f6-958a-f82588990367.png",
    name: "Map Chelsea",
    itemId: "wQIxxNoGu",
    slug: "chelsea",
  },
  {
    file: "stylized-city-map-rddfp-69309178-73ec-476c-bef8-c659aa31897c.png",
    name: "Map Cotswolds",
    itemId: "jU2rRJwn9",
    slug: "the-cotswolds",
  },
];

const col = (await framer.getCollections()).find((c) => c.name === "Neighbourhoods");
const fields = await col.getFields();
const mapField = fields.find((f) => f.name === "Map" || f.id === "ppzgDk7Mi");
if (!mapField) throw new Error("Map field missing");
console.log("mapField", mapField.id);

const uploaded = {};
for (const m of maps) {
  const bytes = new Uint8Array(fs.readFileSync(`${ASSETS}/${m.file}`));
  const asset = await framer.uploadImage({
    image: { bytes, mimeType: "image/png" },
    name: m.name,
    altText: `Territory map — ${m.slug}`,
  });
  uploaded[m.itemId] = { url: asset.url, alt: asset.altText || m.name };
  console.log("uploaded", m.slug, asset.url);
}

const items = await col.getItems();
for (const m of maps) {
  const item = items.find((i) => i.id === m.itemId);
  const u = uploaded[m.itemId];
  await item.setAttributes({
    fieldData: {
      [mapField.id]: { type: "image", value: u.url, alt: u.alt },
    },
  });
  console.log("bound", m.slug);
}

state.mapFieldId = mapField.id;
console.log("OK", mapField.id);
