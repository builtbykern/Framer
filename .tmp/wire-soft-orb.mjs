const fs = require("fs");

const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_SoftOrb.tsx",
  "utf8"
);

const files = await framer.getCodeFiles();
const existing = files.find((f) => f.name === "Arbour_SoftOrb.tsx");
const file = await existing.setFileContent(code);
console.log(JSON.stringify({ action: "updated", id: file.id, exports: file.exports?.map((e) => e.name) }));

const pagePath = "/notes";
const dsl = [
  // SoftOrb fills the existing stone circle; hide static grain/ring (motion lives in SoftOrb)
  `SET nkv74ljWk visible=false`,
  `SET XXmHuk4bk visible=false`,
  `SET nFKDQqLI4 backgroundColor="transparent" overflow="visible" layout="stack" stackDirection="vertical" stackAlignment="center"`,
  `+ComponentInstanceNode softOrbLive component="codeFile/gx1HpUq:default" parent="nFKDQqLI4" position=0`,
  `SET softOrbLive width="1fr" height="1fr" name="Soft Orb Live"`,
  // Entrance choreography (~1.4s) — Lumena timing language, Arbour easing
  `SET xEORYedqg appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="28" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.75s 0s"`,
  `SET nFKDQqLI4 appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="12" appearEffect.enter.scale="0.9" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.95s 0.12s"`,
  `SET xYe7GXRsi appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="16" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.7s 0.32s"`,
  `SET VkIpld688 appearEffect.trigger="onMount" appearEffect.threshold="0" appearEffect.replay=false appearEffect.enter.opacity="0" appearEffect.enter.y="16" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.22,1,0.36,1 0.7s 0.45s"`,
  `SET dCYCf8ZZp appearEffect="null"`,
].join(";\n");

const result = await framer.agent.applyChanges(dsl, { pagePath });
console.log(JSON.stringify(result, null, 2));
