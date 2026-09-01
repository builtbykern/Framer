/* Phase 1 — locate Zoom Image Intro / Preloader instances on Home */
const tree = await framer.agent.serialize(
  {
    id: "augiA20Il",
    depth: 20,
    attributeFilter: [
      "name",
      "component",
      "componentIdentifier",
      "left",
      "top",
      "width",
      "height",
      "visible",
      "opacity",
    ],
  },
  { pagePath: "/" }
);

const hits = [];
function walk(n, depth = 0) {
  if (!n) return;
  const a = n.attributes || {};
  const blob = JSON.stringify({
    type: n.type,
    name: n.name,
    component: a.component,
    componentIdentifier: a.componentIdentifier,
  });
  if (
    /Zoom|Preload|Intro|y6dMmEF|aNCXc66|codeFile/i.test(blob) ||
    String(n.type || "").includes("ComponentInstance")
  ) {
    hits.push({
      id: n.id,
      type: n.type,
      name: n.name,
      depth,
      component: a.component,
      componentIdentifier: a.componentIdentifier,
      left: a.left,
      top: a.top,
      width: a.width,
      height: a.height,
      visible: a.visible,
    });
  }
  for (const c of n.children || []) walk(c, depth + 1);
}
walk(Array.isArray(tree) ? tree[0] : tree);

console.log("HIT_COUNT", hits.length);
console.log(JSON.stringify(hits, null, 2));

const files = await framer.getCodeFiles();
console.log(
  "CODE",
  files.map((f) => ({
    name: f.name,
    id: f.id,
    exports: f.exports,
  }))
);

state.phase1Hits = hits;
