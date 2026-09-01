const pageIds = {
  "/": "augiA20Il",
  "/properties-2": "uBAGmujMa",
  "/neighbourhoods": "dZfxmFpqB",
  "/notes": "s8RpZIiJ8",
  "/about": "OdFhPn9yz",
  "/contact": "c7qpzB7hR",
  "/404": "ojmcAsLyM",
};

async function topOrphans(pagePath, pageId) {
  // navigate by serializing page root
  const ser = await framer.agent.serialize(
    {
      id: pageId,
      depth: 1,
      attributeFilter: [
        "name",
        "width",
        "height",
        "x",
        "y",
        "componentIdentifier",
        "$componentDisplayName",
        "visible",
      ],
    },
    { pagePath }
  );
  const kids = ser.children || [];
  const orphans = [];
  for (const k of kids) {
    const name = String(k.name || k.attributes?.name || "");
    if (/^(Desktop|Tablet|Phone)$/i.test(name)) continue;
    orphans.push({
      id: k.id,
      name,
      ci: k.attributes?.componentIdentifier || k.componentIdentifier,
      dn: k.attributes?.$componentDisplayName || k.$componentDisplayName,
      w: k.attributes?.width,
      h: k.attributes?.height,
    });
  }
  return orphans;
}

for (const [path, id] of Object.entries(pageIds)) {
  try {
    const o = await topOrphans(path, id);
    if (o.length) console.log(path, JSON.stringify(o));
    else console.log(path, "none");
  } catch (e) {
    console.log(path, "ERR", String(e.message || e).slice(0, 100));
  }
}

// Deep serialize the 4 home orphans
const homeOrphans = [
  "FhovjwkxY",
  "goQ9bQ5F4",
  "QggTnA4Sg",
  "PZhHMbEGh",
];
for (const id of homeOrphans) {
  const s = await framer.agent.serialize({ id, depth: 1 }, { pagePath: "/" });
  const attrs = s.attributes || {};
  const controlKeys = Object.keys(attrs)
    .filter((k) => k.startsWith("$control") || k.startsWith("control"))
    .sort();
  console.log("\n====", s.name, id);
  console.log("ci", attrs.componentIdentifier || s.componentIdentifier);
  console.log("size", attrs.width, attrs.height);
  console.log("controls", controlKeys.length);
  for (const k of controlKeys) {
    let v = attrs[k];
    if (typeof v === "object") v = JSON.stringify(v);
    console.log(" ", k, String(v).slice(0, 220));
  }
}
