// SOUL BLOCK 2 — Display scale, deck rule, atmosphere, fix main width
const pagePath = "/notes";

const dsl = `
SET LHPv9w2hx layout="stack" stackDirection="vertical" stackAlignment="start" gap="0px" width="1fr" height="auto";
SET xEORYedqg fontName="Fraunces" fontStyle="normal" fontWeight="340" fontVariationAxes.wght="340" fontSize="120px" letterSpacing="-0.05em" lineHeight="0.9em" textColor="rgb(28, 27, 22)" textWrapBalance="true" tag="h1" width="1fr" height="auto";
+FrameNode heroDeckRule parent="LHPv9w2hx" position="1";
SET heroDeckRule name="Hero Deck Rule" layout="stack" stackDirection="horizontal" stackAlignment="start" gap="24px" width="1fr" height="auto" padding="36px 0px 0px 0px";
+FrameNode heroDeckBar parent="heroDeckRule" position="0";
SET heroDeckBar name="Deck Accent" width="2px" height="1fr" minHeight="72px" fill="rgb(84, 98, 45)";
MOVE dCYCf8ZZp parent="heroDeckRule" position="1";
SET dCYCf8ZZp fontName="Fraunces" fontStyle="italic" fontWeight="300" fontVariationAxes.wght="300" fontSize="26px" letterSpacing="-0.03em" lineHeight="1.4em" textColor="rgba(28, 27, 22, 0.7)" maxWidth="520px" width="1fr" height="auto" tag="p";
SET Vq1f2mEkj fill="rgb(231, 223, 206)" padding="56px 0px 120px 0px" width="1fr" overflow="hidden";
SET WvHvZenFI gap="96px" padding="0px" width="1fr";
+ComponentInstanceNode heroGrain parent="Vq1f2mEkj" position="1" component="codeFile/IwchU7y:default";
SET heroGrain name="Hero Grain" position="absolute" inset="0px" width="1fr" height="1fr" pointerEvents="none" $control__grainStrength="0.035" $control__animateGrain="false" $control__blendMode="soft-light" $control__patternSize="280";
SET xEORYedqg appearEffect.trigger="onInView" appearEffect.threshold="0.2" appearEffect.enter.opacity="0" appearEffect.enter.y="28" appearEffect.enter.transition="tween 0.36,0,0.64,1 1.1s 0s";
SET dCYCf8ZZp appearEffect.trigger="onInView" appearEffect.threshold="0.2" appearEffect.enter.opacity="0" appearEffect.enter.y="16" appearEffect.enter.transition="tween 0.36,0,0.64,1 0.9s 0.15s";
`.trim().replace(/\n/g, " ");

const result = await framer.agent.applyChanges(dsl, { pagePath });
console.log(JSON.stringify(result, null, 2));

const n = await framer.agent.getNode({ id: "xEORYedqg" }, { pagePath });
const main = await framer.agent.getNode({ id: "LHPv9w2hx" }, { pagePath });
const mast = await framer.agent.getNode({ id: "Vq1f2mEkj" }, { pagePath });
console.log("title", n?.attributes?.fontSize, "mainW", main?.attributes?.width, "fill", mast?.attributes?.fill, "pad", mast?.attributes?.padding);
