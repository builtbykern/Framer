const CINEMATIC =
  'appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="20" appearEffect.enter.scale="1" appearEffect.enter.x="0" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.85s 0s"';
const TITLE =
  'appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="28" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.75s 0.06s"';
const KICKER =
  'appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="12" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.6s 0s"';
const DECK =
  'appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="16" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.7s 0.12s"';

// UI #3 — delete archived Lumena grid (SoftOrb inside)
let r = await framer.agent.applyChanges(`DEL WvHvZenFI;`, { pagePath: "/notes" });
console.log("UI3 DEL", JSON.stringify(r));

// Motion 003 — notes cinematic
r = await framer.agent.applyChanges(
  `
SET ELuMN2aX9 ${CINEMATIC};
SET Y2Bx8WkiS ${KICKER};
SET sqsFVTzsL appearEffect="null";
SET t1K8NQ7z5 appearEffect="null";
SET xEORYedqg ${TITLE};
SET q0U1vQI7K ${DECK};
SET dCYCf8ZZp appearEffect="null";
SET Vq1f2mEkj appearEffect="null";
`,
  { pagePath: "/notes" }
);
console.log("M003 notes", JSON.stringify(r));

// Motion 003 — contact cinematic
r = await framer.agent.applyChanges(
  `
SET jmmPpci8t ${CINEMATIC};
SET TWVNilHRn ${KICKER};
SET R80e8PwNu ${TITLE};
SET AATw4pip9 ${DECK};
`,
  { pagePath: "/contact" }
);
console.log("M003 contact", JSON.stringify(r));
