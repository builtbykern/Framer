const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)";
const RACING_DEEP = "var(--token-9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04)";

// Plan 1 — dark token fills
const r1 = await framer.agent.applyChanges(
  `
SET Vq1f2mEkj fill="${INK}";
`,
  { pagePath: "/notes" }
);
console.log("notes hero", JSON.stringify(r1));

const r2 = await framer.agent.applyChanges(
  `
SET ycUqIc8V3 fill="${INK}";
SET NrbMmTnFX fill="${RACING_DEEP}";
SET KraraKF0A fill="${RACING_DEEP}";
SET aJLpuUP0qycUqIc8V3 fill="${INK}";
SET aJLpuUP0qNrbMmTnFX fill="${RACING_DEEP}";
SET aJLpuUP0qKraraKF0A fill="${RACING_DEEP}";
SET Qonafp_oDycUqIc8V3 fill="${INK}";
SET Qonafp_oDNrbMmTnFX fill="${RACING_DEEP}";
SET Qonafp_oDKraraKF0A fill="${RACING_DEEP}";
`,
  { pagePath: "/neighbourhoods" }
);
console.log("nbh dark", JSON.stringify(r2));

// Plan 2 — directory measure 1200
const r3 = await framer.agent.applyChanges(
  `
SET q3QLrEX8k maxWidth="1200px";
SET Dsp5KQS9c maxWidth="1200px";
SET km7dUqZI9 maxWidth="null" width="1fr";
SET aJLpuUP0qq3QLrEX8k maxWidth="1200px";
SET Qonafp_oDq3QLrEX8k maxWidth="1200px";
`,
  { pagePath: "/neighbourhoods" }
);
console.log("measure", JSON.stringify(r3));

// Read back
for (const [path, id] of [
  ["/notes", "Vq1f2mEkj"],
  ["/neighbourhoods", "ycUqIc8V3"],
  ["/neighbourhoods", "NrbMmTnFX"],
  ["/neighbourhoods", "KraraKF0A"],
  ["/neighbourhoods", "q3QLrEX8k"],
  ["/neighbourhoods", "Dsp5KQS9c"],
]) {
  const n = await framer.agent.getNode({ id }, { pagePath: path });
  console.log(
    JSON.stringify({
      path,
      name: n?.name,
      fill: n?.attributes?.fill,
      maxW: n?.attributes?.maxWidth,
    })
  );
}
