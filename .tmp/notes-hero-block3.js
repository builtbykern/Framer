// BLOCK 3 — Spacers + separation rule + restrained appear (hero only)
const pagePath = "/notes";

const dsl = `
SET WvHvZenFI layout="stack" stackDirection="vertical" stackAlignment="start" gap="0px" width="1fr";
+FrameNode heroTitleBlock parent="WvHvZenFI" position="1";
SET heroTitleBlock name="Hero Title Block" layout="stack" stackDirection="vertical" stackAlignment="start" gap="16px" width="1fr" height="auto" padding="0px";
MOVE xEORYedqg parent="heroTitleBlock" position="0";
MOVE sqsFVTzsL parent="heroTitleBlock" position="0";
+FrameNode heroDeckSpacer parent="WvHvZenFI" position="2";
SET heroDeckSpacer name="Hero Deck Spacer" width="1fr" height="28px" layout="stack";
MOVE dCYCf8ZZp parent="WvHvZenFI" position="3";
+FrameNode heroMetaRule parent="WvHvZenFI" position="4";
SET heroMetaRule name="Hero Meta Rule" layout="stack" stackDirection="vertical" gap="16px" width="1fr" height="auto" padding="36px 0px 0px 0px";
+FrameNode heroHairline parent="heroMetaRule" position="0";
SET heroHairline name="Hero Hairline" width="40px" height="1px" fill="rgba(28, 27, 22, 0.22)";
MOVE U84Rv97cL parent="heroMetaRule" position="1";
SET U84Rv97cL padding="0px" width="1fr";
SET xEORYedqg appearEffect.trigger="onInView" appearEffect.threshold="0.4" appearEffect.enter.opacity="0" appearEffect.enter.y="18" appearEffect.enter.x="0" appearEffect.enter.scale="1" appearEffect.enter.transition="tween 0.42,0,0.58,1 0.85s 0.05s";
SET dCYCf8ZZp appearEffect.trigger="onInView" appearEffect.threshold="0.4" appearEffect.enter.opacity="0" appearEffect.enter.y="12" appearEffect.enter.transition="tween 0.42,0,0.58,1 0.75s 0.12s";
SET Vq1f2mEkj padding="0px 0px 96px 0px" borderBottom="1px" borderColor="rgba(28, 27, 22, 0.10)";
`.trim().replace(/\n/g, " ");

const result = await framer.agent.applyChanges(dsl, { pagePath });
console.log(JSON.stringify(result, null, 2));

const tree = await framer.agent.serialize(
  { id: "Vq1f2mEkj", depth: 4, attributeFilter: ["name", "padding", "gap", "height", "fontSize"] },
  { pagePath }
);
console.log(JSON.stringify(tree, null, 2));
