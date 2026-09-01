const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)";
const CINEMATIC =
  'appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="20" appearEffect.enter.scale="1" appearEffect.enter.x="0" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.85s 0s"';
const TITLE =
  'appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="28" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.75s 0.06s"';
const KICKER =
  'appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="12" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.6s 0s"';
const DECK =
  'appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="16" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.7s 0.12s"';

// ——— UI #2 Paper token ———
let r = await framer.agent.applyChanges(
  `
SET q3QLrEX8k fill="${PAPER}";
SET aJLpuUP0qq3QLrEX8k fill="${PAPER}";
SET Qonafp_oDq3QLrEX8k fill="${PAPER}";
`,
  { pagePath: "/neighbourhoods" }
);
console.log("UI2 paper", JSON.stringify(r));

// ——— Motion 001 + 002 on neighbourhoods ———
r = await framer.agent.applyChanges(
  `
SET t8SpOTSDb appearEffect.replay=false;
SET km7dUqZI9 appearEffect.replay=false;
SET aJLpuUP0qt8SpOTSDb appearEffect.replay=false;
SET Qonafp_oDt8SpOTSDb appearEffect.replay=false;
SET XzTsEtIxm hoverEffect.scale="1.03" hoverEffect.transition="tween 0.23,1,0.32,1 0.18s 0s";
SET aJLpuUP0qXzTsEtIxm hoverEffect.scale="1.03" hoverEffect.transition="tween 0.23,1,0.32,1 0.18s 0s";
SET Qonafp_oDXzTsEtIxm hoverEffect.scale="1.03" hoverEffect.transition="tween 0.23,1,0.32,1 0.18s 0s";
`,
  { pagePath: "/neighbourhoods" }
);
console.log("M001-002", JSON.stringify(r));

// ——— Motion 003 neighbourhoods cinematic ———
r = await framer.agent.applyChanges(
  `
SET ycUqIc8V3 ${CINEMATIC};
SET G6gOIL1iW appearEffect="null";
SET mGNFNlJAN ${KICKER};
SET n9ay7tOtM ${TITLE};
SET rWmr0qn1F ${DECK};
SET KgtJlnIFG ${DECK};
`,
  { pagePath: "/neighbourhoods" }
);
console.log("M003 nbh", JSON.stringify(r));
