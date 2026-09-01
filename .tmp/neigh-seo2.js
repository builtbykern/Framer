const col = await framer.getCollection("U0QLvHg7O");
const items = await col.getItems();
for (const it of items || []) {
  const data = it.getData ? await it.getData() : null;
  const seoT = data?.c8BGAzFA4?.value;
  const seoD = data?.MSw6_cI4R?.value;
  console.log(it.slug, "|", seoT, "|", String(seoD || "").slice(0, 80));
}
