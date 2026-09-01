// Find component instances / frames sitting on Home (and other pages)
// outside typical breakpoint roots.
const pages = await framer.getPages();
const pageList = (pages || []).map((p) => ({
  id: p.id,
  path: p.path,
  name: p.name,
}));
console.log("PAGES", JSON.stringify(pageList, null, 2));

// Get canvas roots - try web pages collection
for (const p of pageList.slice(0, 12)) {
  const path = p.path || "/";
  try {
    const roots = await framer.agent.getDescendantsOfTypes(
      { id: p.id, types: ["BreakpointNode", "FrameNode", "ComponentInstanceNode"] },
      { pagePath: path, depth: 2 }
    );
    // shallow: look at top-level children of page
    const ser = await framer.agent.serialize(
      { id: p.id, depth: 2, attributeFilter: ["name", "width", "height", "x", "y", "$componentDisplayName", "componentIdentifier", "visible"] },
      { pagePath: path }
    );
    const kids = ser.children || [];
    console.log("\n===", path, p.name, "topKids", kids.length);
    for (const k of kids) {
      const dn = k.$componentDisplayName || k.attributes?.$componentDisplayName;
      const ci = k.componentIdentifier || k.attributes?.componentIdentifier;
      console.log(
        "-",
        k.type || "?",
        k.id,
        k.name || k.attributes?.name,
        "xy",
        k.attributes?.x,
        k.attributes?.y,
        "wh",
        k.attributes?.width,
        k.attributes?.height,
        dn ? `[${dn}]` : "",
        ci ? ci.slice(0, 40) : ""
      );
    }
  } catch (e) {
    console.log("ERR", path, String(e.message || e).slice(0, 120));
  }
}
