const pagePath = "/neighbourhoods";

const CREAM = "rgb(252, 250, 244)";
const INK = "rgb(28, 27, 22)";
const INK_DIM = "rgba(28, 27, 22, 0.62)";
const OLIVE = "rgb(84, 98, 45)";
const STONE = "rgb(231, 223, 206)";

// Rebuild repeated item as info | photo pair
const r4 = await framer.agent.applyChanges(
  `
SET t8SpOTSDb name="Territory Pair" layout="stack" stackDirection="horizontal" stackAlignment="stretch" stackDistribution="start" gap="16px" width="1fr" height="auto" overflow="visible" cursor="pointer" fill="null" hoverEffect.scale="1" hoverEffect.transition="spring-duration 0.4s 0.2 0s";

SET OBnhHSQMP visible=false;

+FrameNode nbInfo parent="t8SpOTSDb" position="0";
SET nbInfo name="Info Card" layout="stack" stackDirection="vertical" stackDistribution="space-between" stackAlignment="start" gap="20px" padding="28px 24px 28px 24px" width="1fr" height="auto" minHeight="420px" fill="${CREAM}" borderRadius="12px" borderWidth="1px" borderColor="rgba(28, 27, 22, 0.08)";

+FrameNode nbInfoTop parent="nbInfo" position="0";
SET nbInfoTop name="Info Top" layout="stack" stackDirection="vertical" gap="20px" width="1fr" height="auto";

+FrameNode nbTitleRow parent="nbInfoTop" position="0";
SET nbTitleRow name="Title Row" layout="stack" stackDirection="horizontal" stackAlignment="start" stackDistribution="space-between" gap="12px" width="1fr" height="auto";

MOVE WJ2oP3wg8 parent="nbTitleRow" position="0";
SET WJ2oP3wg8 text="var(--variable-tBUaKupCV)" textStylePreset="Arbour/Heading" textColor="${INK}" width="1fr" height="auto" fontSize="28px";

+RichTextNode nbArrow parent="nbTitleRow" position="1";
SET nbArrow text="↗" fontName="Inter" fontSize="18px" textColor="${OLIVE}" width="auto" height="auto";

+ComponentInstanceNode nbMap component="codeFile/CkhTb24:default" parent="nbInfoTop" position="1";
SET nbMap name="London Map" width="1fr" height="160px" $control__zone="var(--variable-tBUaKupCV)" $control__city="${STONE}" $control__accent="${OLIVE}" $control__showLabel="true";

+FrameNode nbInfoBottom parent="nbInfo" position="1";
SET nbInfoBottom name="Info Bottom" layout="stack" stackDirection="vertical" gap="12px" width="1fr" height="auto";

MOVE ZpI0rC_2D parent="nbInfoBottom" position="0";
SET ZpI0rC_2D name="Legacy title wrap" visible=false;

+RichTextNode nbIntro parent="nbInfoBottom" position="0";
SET nbIntro text="var(--variable-mNRagFPfJ)" fontName="Inter" fontSize="14px" fontWeight="400" textColor="${INK_DIM}" width="1fr" height="auto";

+RichTextNode nbHighlights parent="nbInfoBottom" position="1";
SET nbHighlights text="var(--variable-ZIEwtEwXa)" fontName="Space Mono" fontSize="11px" fontWeight="400" textColor="${OLIVE}" width="1fr" height="auto";

+FrameNode nbPhoto parent="t8SpOTSDb" position="1";
SET nbPhoto name="Photo Card" layout="stack" stackDirection="vertical" width="1fr" height="auto" minHeight="420px" overflow="clip" borderRadius="12px" fill="var(--variable-dM8yn13g7)" hoverEffect.scale="1.03" hoverEffect.transition="spring-duration 0.5s 0.25 0s";
`,
  { pagePath }
);
console.log("r4", JSON.stringify(r4));
