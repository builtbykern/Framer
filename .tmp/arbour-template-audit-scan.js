/* Read-only template audit scan — Arbour */
const preview = await framer.agent.publish({ action: "preview" });
console.log(
  "CHANGES",
  JSON.stringify({
    changesCount: preview.changesCount,
    changes: preview.changes,
    warnings: preview.warnings,
    version: preview.version,
  }).slice(0, 3000)
);

const pages = {
  "/": "augiA20Il",
  "/about": "OdFhPn9yz",
  "/notes": "s8RpZIiJ8",
  "/contact": "c7qpzB7hR",
  "/properties-2": "uBAGmujMa",
  "/notes/:Journal": "YPPO8pJ92",
  "/properties-2/:Properties": "OhRUQROL4",
};

const ashcombeHits = [];
const hardInk = [];
const hardOlive = [];
const instances = [];

function walk(n, pagePath) {
  if (!n) return;
  const attrs = n.attributes || {};
  const blob = JSON.stringify(attrs) + " " + (n.name || "");
  if (/ashcombe|vane\.co\.uk/i.test(blob)) {
    ashcombeHits.push({
      pagePath,
      id: n.id,
      name: n.name,
      sample: blob.slice(0, 140),
    });
  }
  if (
    typeof attrs.textColor === "string" &&
    (attrs.textColor.includes("28, 27, 22") ||
      attrs.textColor.includes("28,27,22"))
  ) {
    hardInk.push({
      pagePath,
      id: n.id,
      name: n.name,
      textColor: attrs.textColor,
    });
  }
  if (
    typeof attrs.textColor === "string" &&
    (attrs.textColor.includes("84, 98, 45") ||
      attrs.textColor.includes("84,98,45"))
  ) {
    hardOlive.push({
      pagePath,
      id: n.id,
      name: n.name,
      textColor: attrs.textColor,
    });
  }
  if (
    n.type === "ComponentInstanceNode" ||
    String(n.type || "").includes("ComponentInstance")
  ) {
    instances.push({
      pagePath,
      id: n.id,
      name: n.name,
      component: attrs.component || attrs.componentIdentifier || null,
    });
  }
  for (const c of n.children || []) walk(c, pagePath);
}

for (const [pagePath, id] of Object.entries(pages)) {
  const tree = await framer.agent.serialize(
    {
      id,
      depth: 10,
      attributeFilter: [
        "text",
        "textColor",
        "fill",
        "name",
        "component",
        "componentIdentifier",
        "href",
      ],
    },
    { pagePath }
  );
  walk(Array.isArray(tree) ? tree[0] : tree, pagePath);
}

console.log("ASHCOMBE", ashcombeHits.length, JSON.stringify(ashcombeHits.slice(0, 8)));
console.log("HARD_INK", hardInk.length, JSON.stringify(hardInk.slice(0, 20)));
console.log("HARD_OLIVE", hardOlive.length, JSON.stringify(hardOlive.slice(0, 12)));

const byName = {};
for (const i of instances) {
  const k = i.name || i.component || "unknown";
  byName[k] = (byName[k] || 0) + 1;
}
console.log("INSTANCE_NAMES", JSON.stringify(byName));
const blurLike = instances.filter((i) =>
  /blur|scroll|grain|noise|noiser|film/i.test(
    `${i.name || ""} ${i.component || ""}`
  )
);
console.log("BLUR_LIKE", JSON.stringify(blurLike.slice(0, 30)));
