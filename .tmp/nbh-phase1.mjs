const pagePath = "/neighbourhoods";

const CREAM = "rgb(252, 250, 244)";
const INK = "rgb(28, 27, 22)";
const OLIVE = "rgb(84, 98, 45)";
const STONE = "rgb(231, 223, 206)";
const ACCENT = "rgb(214, 224, 74)";
const SCRIM = "var(--token-9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04)";
const IMG =
  "https://framerusercontent.com/images/rOIRMIaf6SStQx5iI01lIa7bzK0.png";

// Phase 1: page chrome + cinematic hero
const r1 = await framer.agent.applyChanges(
  `
SET H1kR5JcFp name="Neighbourhoods Content" layout="stack" stackDirection="vertical" stackAlignment="center" stackDistribution="start" gap="0px" padding="0px" width="1fr" height="auto";

SET xEPtGXzxi visible=false name="Legacy Header (archived)";

+FrameNode nbhHero parent="H1kR5JcFp" position="0";
SET nbhHero name="Neighbourhoods Hero" layout="stack" stackDirection="vertical" stackDistribution="end" stackAlignment="start" gap="0px" padding="0px" width="1fr" height="680px" maxWidth="1440px" overflow="clip" position="relative" fill="rgb(28, 27, 22)";

+ComponentInstanceNode nbhInertia component="codeFile/zQElsPn:default" parent="nbhHero" position="0";
+FrameNode nbhOverlay parent="nbhHero" position="1";
`,
  { pagePath }
);
console.log("r1", JSON.stringify(r1));
