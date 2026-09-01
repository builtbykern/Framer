/* Batch D — hard Ink RGB → tokens */
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)";
const INK_SOFT = "var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)";
const INK_60 = "var(--token-cf5bf9af-72f6-4da6-ad12-b9daaa07387b)";

const pages = {
  "/": "augiA20Il",
  "/properties-2": "uBAGmujMa",
  "/properties-2/:Properties": "OhRUQROL4",
  "/notes/:Journal": "YPPO8pJ92",
  "/contact": "c7qpzB7hR",
};

function mapColor(tc) {
  if (typeof tc !== "string") return null;
  if (tc.includes("--token-")) return null;
  const m = tc.match(
    /rgba?\(\s*28\s*,\s*27\s*,\s*22\s*(?:,\s*([0-9.]+)\s*)?\)/
  );
  if (!m) return null;
  if (m[1] === undefined) return INK;
  const a = parseFloat(m[1]);
  if (a >= 0.57) return INK_60;
  if (a >= 0.45) return INK_SOFT;
  return INK_60; // 0.35 and similar
}

const summary = {};

for (const [pagePath, rootId] of Object.entries(pages)) {
  const tree = await framer.agent.serialize(
    { id: rootId, depth: 16, attributeFilter: ["textColor", "name"] },
    { pagePath }
  );
  const updates = [];
  function walk(n) {
    if (!n) return;
    const tc = n.attributes?.textColor;
    const next = mapColor(tc);
    if (next) updates.push({ id: n.id, from: tc, to: next });
    for (const c of n.children || []) walk(c);
  }
  walk(Array.isArray(tree) ? tree[0] : tree);

  // apply in chunks of 40
  let applied = 0;
  for (let i = 0; i < updates.length; i += 40) {
    const chunk = updates.slice(i, i + 40);
    const dsl = chunk
      .map((u) => `SET ${u.id} textColor="${u.to}";`)
      .join("\n");
    await framer.agent.applyChanges(dsl, { pagePath });
    applied += chunk.length;
  }
  summary[pagePath] = { found: updates.length, applied };
}

console.log(JSON.stringify(summary, null, 2));
state.inkTokenFix = summary;
