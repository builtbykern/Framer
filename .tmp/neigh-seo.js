const col = await framer.getCollection("U0QLvHg7O");
const items = await col.getItems();
const fields = await col.getFields();
console.log(
  "fields",
  fields.map((f) => ({ id: f.id, name: f.name, type: f.type }))
);
for (const it of items || []) {
  // try getData or attributes
  const data = it.getData ? await it.getData() : it.fieldData;
  console.log(it.slug, JSON.stringify(data)?.slice(0, 500));
}
