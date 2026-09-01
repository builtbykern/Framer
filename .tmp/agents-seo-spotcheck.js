// Spot-check prior HIGH candidates still open
const agents = await framer.getCollection("CGTgzrUNU");
const items = await agents.getItems();
for (const it of items || []) {
  const fields = it.fieldData || it;
  // try common shapes
  const email =
    it.email ||
    fields?.Email?.value ||
    fields?.email?.value ||
    JSON.stringify(fields).match(/[a-z0-9._%+-]+@[a-z0-9.-]+/gi)?.[0];
  console.log("agent", it.slug || it.id, email);
}
const neigh = await framer.getCollection("U0QLvHg7O");
const nItems = await neigh.getItems();
for (const it of (nItems || []).slice(0, 4)) {
  const fd = it.fieldData || {};
  const seo = fd["SEO Title"]?.value || fd.seoTitle?.value;
  console.log("neigh", it.slug || it.id, "seoTitle", seo);
}
