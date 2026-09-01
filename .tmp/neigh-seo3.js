const col = await framer.getCollection("U0QLvHg7O");
const items = await col.getItems();
const it = items[0];
console.log("keys", Object.keys(it));
console.log("sample", JSON.stringify(it, null, 2).slice(0, 2500));
