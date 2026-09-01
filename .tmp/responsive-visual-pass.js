const fixes = [];

await framer.agent.applyChanges(
  [
    'SET EavJve6uGQPghii7Fh fontSize="18px" lineHeight="1.5em" maxWidth="100%" width="1fr"',
    'SET gZUAlaJJ1QPghii7Fh fontSize="20px" maxWidth="100%" width="1fr"',
  ].join("; "),
  { pagePath: "/notes/:Journal" }
);
fixes.push("article deck T/P");

await framer.agent.applyChanges(
  [
    'SET LptqEiXVpFe5WKPsRA fontSize="56px" lineHeight="1.05em"',
    'SET INUKgvAnaFe5WKPsRA fontSize="40px" lineHeight="1.08em" width="1fr"',
  ].join("; "),
  { pagePath: "/notes" }
);
fixes.push("notes manifesto title T/P");

// Properties phone: reset irregular slot offsets
const propTree = await framer.agent.serialize(
  { id: "obfRB9jeb", depth: 6, attributeFilter: ["name", "padding"] },
  { pagePath: "/properties-2" }
);
const slotPads = [];
function walk(n) {
  if (!n) return;
  if (
    n.name &&
    /Property Slot/.test(n.name) &&
    n.attributes?.padding &&
    n.attributes.padding !== "0px"
  ) {
    slotPads.push({ id: n.id, name: n.name, pad: n.attributes.padding });
  }
  for (const c of n.children || []) walk(c);
}
walk(propTree);
console.log("slots with pad", JSON.stringify(slotPads));
if (slotPads.length) {
  const dsl = slotPads
    .map((s) => `SET EK6d5SyWL${s.id} padding="0px"`)
    .join("; ");
  await framer.agent.applyChanges(dsl, { pagePath: "/properties-2" });
  fixes.push("props phone slot offsets reset");
}

console.log("fixes", fixes);

// Verify article deck
for (const id of ["QPghii7Fh", "gZUAlaJJ1QPghii7Fh", "EavJve6uGQPghii7Fh"]) {
  const n = await framer.agent.getNode(
    { id },
    { pagePath: "/notes/:Journal" }
  );
  console.log("deck", id, n?.attributes?.fontSize);
}

// Final scorecard
const scorecard = [
  ["/notes", "Journal T", "LptqEiXVpwY1tfyIdc"],
  ["/notes", "Journal P", "INUKgvAnawY1tfyIdc"],
  ["/notes", "Manifesto T", "LptqEiXVpp7CGH_nWX"],
  ["/notes", "Manifesto P", "INUKgvAnap7CGH_nWX"],
  ["/notes/:Journal", "Header P", "EavJve6uGTYvLnLN5L"],
  ["/notes/:Journal", "More P", "EavJve6uGcIncylbTv"],
  ["/properties-2", "Grid P", "EK6d5SyWLvqeLjQDAp"],
  ["/properties-2", "Enquiry P", "EK6d5SyWLcFtWJlabj"],
  ["/about", "Manifesto T", "xvqDXw58em1IuCE2Ht"],
  ["/about", "Enquiry P", "CYNrpU04tOIVgjc19d"],
  ["/contact", "Opening T", "qjv2S9Wpavv0Vi0hbh"],
  ["/contact", "Opening P", "jEM0wBo2vvv0Vi0hbh"],
  ["/neighbourhoods", "Hero T", "aJLpuUP0qH1kR5JcFp"],
  ["/neighbourhoods", "Hero P", "Qonafp_oDH1kR5JcFp"],
  ["/properties-2/:Properties", "Setting P", "MrTKJzwELuZ8oOXu4y"],
  ["/", "Territories P", "pmAxXUJ0oCXKn_oqE0"],
];

console.log("\n=== SCORECARD ===");
for (const [path, label, id] of scorecard) {
  const n = await framer.agent.getNode({ id }, { pagePath: path });
  const pad = n?.attributes?.padding || n?.attributes?.fontSize || "MISSING";
  console.log(label.padEnd(14), path.padEnd(28), pad);
}
