// Brand reference: home + about opening typography / spacing
async function dumpOpening(pagePath, pageId, label) {
  const page = await framer.agent.getNode({ id: pageId });
  const bp = page.$breakpoints.find((b) => b.name === "Desktop")?.id;
  const tree = await framer.agent.serialize(
    {
      id: bp,
      depth: 5,
      attributeFilter: [
        "name",
        "padding",
        "gap",
        "fontSize",
        "fontName",
        "fontWeight",
        "letterSpacing",
        "lineHeight",
        "textColor",
        "textStylePreset",
        "maxWidth",
      ],
    },
    { pagePath }
  );
  console.log("\n====", label, "====");
  function walk(n, d = 0) {
    if (!n || d > 4) return;
    const a = n.attributes || {};
    const name = n.name || n.type;
    if (
      /hero|opening|territor|masthead|beat 1|paper|journal|display|deck|copy|meta|kicker/i.test(
        name
      ) ||
      (d <= 2 && n.name)
    ) {
      console.log(
        " ".repeat(d) + name,
        a.padding || "",
        a.gap || "",
        a.fontSize || a.textStylePreset || "",
        a.fontName || ""
      );
    }
    for (const c of n.children || []) walk(c, d + 1);
  }
  walk(tree);
}

await dumpOpening("/", "augiA20Il", "HOME");
await dumpOpening("/about", "OdFhPn9yz", "ABOUT");
