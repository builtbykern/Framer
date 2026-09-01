// Resolve module / any accessible source for ScrollBlurEssential
const s = await framer.agent.serialize({ id: "FhovjwkxY", depth: 3 }, { pagePath: "/" });
console.log(JSON.stringify(s, null, 2).slice(0, 6000));

// Try getCodeFiles for anything similar
const files = await framer.getCodeFiles();
console.log(
  "codeFiles",
  files.map((f) => f.name).filter((n) => /blur|scroll/i.test(n))
);

// Component identifier from earlier: module:g0EEw2HBNmjjK4UxgXhQ/8wGq4HgGH68xYmMACpNs/ScrollBlurEssential.js:default
const node = await framer.getNode("FhovjwkxY");
console.log("node keys", Object.keys(node || {}));
console.log("ci", node?.componentIdentifier);
console.log("attrs sample", JSON.stringify(node, null, 2).slice(0, 3000));
