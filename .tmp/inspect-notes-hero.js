const pagePath = "/notes";

// Hero-only: Notes Masthead tree
const masthead = await framer.agent.serialize(
  { id: "Vq1f2mEkj", depth: 5 },
  { pagePath }
);
console.log("=== NOTES MASTHEAD ===");
console.log(JSON.stringify(masthead, null, 2));

const journal = await framer.agent.serialize(
  {
    id: "wY1tfyIdc",
    depth: 2,
    attributeFilter: ["name", "padding", "gap", "fill", "maxWidth"],
  },
  { pagePath }
);
console.log("=== JOURNAL WRAPPER ===");
console.log(JSON.stringify(journal, null, 2));

const shot = await framer.agent.readProject(
  [{ type: "screenshot", id: "s8RpZIiJ8" }],
  { pagePath }
);
console.log("SHOT", shot.results?.[0]?.image_url);
