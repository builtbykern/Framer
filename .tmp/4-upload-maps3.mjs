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
const mapFieldId = "ppzgDk7Mi";
const uploaded = {};

for (const m of maps) {
  const b64 = fs.readFileSync(`${ASSETS}/${m.file}`).toString("base64");
  const asset = await framer.uploadImage({
    image: `data:image/png;base64,${b64}`,
    name: m.name,
    altText: `Territory map — ${m.slug}`,
  });
  uploaded[m.itemId] = asset.url;
  console.log("uploaded", m.slug, asset.url);
}

const items = await col.getItems();
for (const m of maps) {
  const item = items.find((i) => i.id === m.itemId);
  await item.setAttributes({
    fieldData: {
      [mapFieldId]: {
        type: "image",
        value: uploaded[m.itemId],
        alt: `Territory map — ${m.slug}`,
      },
    },
  });
  console.log("bound", m.slug);
}

state.mapFieldId = mapFieldId;
state.mapUploads = uploaded;
console.log("done");
