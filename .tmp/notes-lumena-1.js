// Lumena layout pattern → Arbour brand (cream paper, Fraunces, Space Mono, olive)
// NEVER Lumena visual style (black grotesk, particle torus)
const pagePath = "/notes";

// Clear old hero internals into Lumena 2×2 staggered grid
const r1 = await framer.agent.applyChanges(
  `
SET Vq1f2mEkj name="Notes Masthead" layout="stack" stackDirection="vertical" stackAlignment="start" stackDistribution="start" gap="0px" padding="96px 0px 80px 0px" width="1fr" height="auto" minHeight="640px" fill="rgb(252, 250, 244)" borderBottom="1px" borderColor="rgba(28, 27, 22, 0.12)" overflow="hidden" margin="0px";
SET WvHvZenFI name="Hero Grid" layout="stack" stackDirection="vertical" stackAlignment="start" gap="0px" width="1fr" height="auto";
DEL e2nOB7PCD;
  `.trim().replace(/\n/g, " "),
  { pagePath }
);
console.log("clear", JSON.stringify(r1));

// Build top row: title | orb
const r2 = await framer.agent.applyChanges(
  `
+FrameNode heroTopRow parent="WvHvZenFI" position="0";
SET heroTopRow name="Hero Top Row" layout="stack" stackDirection="horizontal" stackAlignment="start" stackDistribution="space-between" gap="48px" width="1fr" height="auto";
+FrameNode heroTitleCol parent="heroTopRow" position="0";
SET heroTitleCol name="Hero Title Col" layout="stack" stackDirection="vertical" gap="0px" width="1fr" maxWidth="640px" height="auto";
MOVE xEORYedqg parent="heroTitleCol" position="0";
SET xEORYedqg fontName="Fraunces" fontStyle="normal" fontWeight="340" fontVariationAxes.wght="340" fontSize="96px" letterSpacing="-0.045em" lineHeight="0.92em" textColor="rgb(28, 27, 22)" textWrapBalance="true" tag="h1" width="1fr";
+FrameNode heroOrbCol parent="heroTopRow" position="1";
SET heroOrbCol name="Hero Orb Col" layout="stack" stackDirection="vertical" stackAlignment="center" stackDistribution="center" width="380px" minWidth="280px" height="auto" padding="8px 0px 0px 0px";
+FrameNode heroOrb parent="heroOrbCol" position="0";
SET heroOrb name="Hero Orb" layout="stack" stackDirection="vertical" stackAlignment="center" stackDistribution="center" width="320px" height="320px" overflow="hidden" radius="160px" fill="rgb(231, 223, 206)" position="relative";
+ComponentInstanceNode heroOrbGrain parent="heroOrb" position="0" component="codeFile/IwchU7y:default";
SET heroOrbGrain name="Orb Grain" position="absolute" inset="0px" width="1fr" height="1fr" pointerEvents="none" $control__grainStrength="0.055" $control__animateGrain="true" $control__blendMode="multiply" $control__patternSize="220" $control__refreshRate="4";
+FrameNode heroOrbRing parent="heroOrb" position="1";
SET heroOrbRing name="Orb Ring" position="absolute" width="200px" height="200px" radius="100px" border="1px" borderColor="rgba(84, 98, 45, 0.35)" borderStyle="solid" centerAnchorX="50%" centerAnchorY="50%" left="50%" top="50%" ;
  `.trim().replace(/\n/g, " "),
  { pagePath }
);
console.log("top", JSON.stringify(r2));
