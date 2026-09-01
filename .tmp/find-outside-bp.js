const root = await framer.getCanvasRoot();
console.log("ROOT", root?.id, root?.name, root?.type, Object.keys(root || {}).slice(0, 20));

const children = await framer.getChildren(root.id);
console.log("CHILD_COUNT", children?.length);

function brief(n) {
  return {
    id: n.id,
    name: n.name,
    type: n.type,
    x: n.x,
    y: n.y,
    width: n.width,
    height: n.height,
    componentIdentifier: n.componentIdentifier,
    // common
  };
}

for (const c of children || []) {
  console.log("TOP", JSON.stringify(brief(c)));
}

// Identify breakpoint-like frames vs orphans
const bpish = [];
const orphans = [];
for (const c of children || []) {
  const name = String(c.name || "");
  const isBp =
    /desktop|tablet|phone|mobile|breakpoint|primary/i.test(name) ||
    c.type === "BreakpointNode";
  if (isBp) bpish.push(c);
  else orphans.push(c);
}
console.log("\nBPISH", bpish.map((c) => `${c.type}:${c.name}:${c.id}`));
console.log("ORPHAN_TOP", orphans.map((c) => `${c.type}:${c.name}:${c.id}`));

// Dig into orphans for component instances
async function walk(node, depth, acc, maxDepth = 4) {
  if (depth > maxDepth) return;
  const kids = await framer.getChildren(node.id);
  for (const k of kids || []) {
    const entry = {
      depth,
      id: k.id,
      name: k.name,
      type: k.type,
      x: k.x,
      y: k.y,
      w: k.width,
      h: k.height,
      ci: k.componentIdentifier,
    };
    if (
      k.type === "ComponentInstanceNode" ||
      k.componentIdentifier ||
      /Component/i.test(k.type || "")
    ) {
      acc.push(entry);
    }
    // also collect frames that look like design components
    if (k.type === "ComponentNode" || k.type === "SmartComponentNode") {
      acc.push({ ...entry, kind: "definition" });
    }
    await walk(k, depth + 1, acc, maxDepth);
  }
}

const found = [];
for (const o of orphans) {
  found.push({
    top: brief(o),
    comps: [],
  });
  await walk(o, 1, found[found.length - 1].comps, 5);
}
console.log("\nORPHAN_DETAIL");
for (const f of found) {
  console.log("---", f.top.name, f.top.type, f.top.id);
  for (const c of f.comps.slice(0, 40)) {
    console.log(" ", JSON.stringify(c));
  }
  if (f.comps.length > 40) console.log("  ...+", f.comps.length - 40);
}
