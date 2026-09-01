const pagePath = "/notes";

const IMG =
  "https://framerusercontent.com/images/5Ytxn8avZFwlwp4Ng3t8PDU56Lk.png";
const ALT = "London terrace at dusk — field notes from Arbour";
const CREAM = "rgb(252, 250, 244)";
const ACCENT = "rgb(214, 224, 74)";
const SCRIM = "var(--token-9d3d6ca5-f3ad-4d88-afc8-fc5bce03bd04)";

// Phase 1 — cinematic shell + hide Lumena orb grid
const r1 = await framer.agent.applyChanges(
  `
SET Vq1f2mEkj name="Notes Masthead" layout="stack" stackDirection="vertical" stackDistribution="end" stackAlignment="start" stackWrapEnabled=false gap="0px" padding="0px" width="1fr" height="720px" maxWidth="1440px" minHeight="null" overflow="clip" position="relative" fill="rgb(28, 27, 22)" borderBottomWidth="0px" margin="0px";
SET WvHvZenFI visible=false name="Hero Grid (archived)";
+ComponentInstanceNode notesCineInertia component="codeFile/zQElsPn:default" parent="Vq1f2mEkj" position="0";
+FrameNode notesCineOverlay parent="Vq1f2mEkj" position="1";
`,
  { pagePath }
);
console.log("r1", JSON.stringify(r1));
