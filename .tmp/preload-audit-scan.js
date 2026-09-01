const fs = require("fs");
const files = await framer.getCodeFiles();
console.log(
  "FILES",
  files.map((f) => ({
    name: f.name,
    id: f.id,
    lines: (f.content || "").split("\n").length,
  }))
);
for (const f of files) {
  fs.writeFileSync(".tmp/preload-" + f.name, f.content || "");
  const c = f.content || "";
  console.log(
    JSON.stringify({
      name: f.name,
      hasDefault: /export default function/.test(c),
      layoutAnn: /@framerSupportedLayoutWidth/.test(c),
      fixedRoot: /position:\s*["']fixed["']/.test(c),
      window: /\bwindow\b/.test(c),
      typeofWindow: /typeof window/.test(c),
      hasControls: /addPropertyControls/.test(c),
      motion: /framer-motion|from "motion/.test(c),
      reduced: /useReducedMotion|prefers-reduced-motion/.test(c),
      displayName: /displayName/.test(c),
    })
  );
}
const pub = await framer.getPublishInfo();
console.log("PUBLISH", JSON.stringify(pub));

const tree = await framer.agent.serialize(
  { id: "augiA20Il", depth: 8, attributeFilter: ["name", "metadata", "path"] },
  { pagePath: "/" }
);
const root = Array.isArray(tree) ? tree[0] : tree;
console.log(
  "PAGE",
  JSON.stringify({
    name: root?.name,
    metadata: root?.attributes?.metadata,
    path: root?.attributes?.path,
    descendants: root?.$descendantCount,
  })
);

function walk(n, acc) {
  if (!n) return;
  const name = n.name || "";
  if (/Zoom|Preload|Intro|Loader/i.test(name)) {
    acc.push({ id: n.id, name, type: n.type });
  }
  for (const c of n.children || []) walk(c, acc);
}
const hits = [];
walk(root, hits);
console.log("INSTANCES", JSON.stringify(hits));

try {
  const preview = await framer.agent.publish({ action: "preview" });
  console.log(
    "PREVIEW",
    JSON.stringify({
      changesCount: preview.changesCount,
      errors: preview.errors,
      warnings: preview.warnings,
      urls: preview.urls,
      message: preview.message,
    }).slice(0, 1000)
  );
} catch (e) {
  console.log("preview err", e.message);
}
