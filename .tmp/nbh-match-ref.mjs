const fs = require("fs");
const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_LondonMap.tsx",
  "utf8"
);
const file = (await framer.getCodeFiles()).find(
  (f) => f.name === "Arbour_LondonMap.tsx"
);
await file.setFileContent(code);
console.log("map updated");

const pagePath = "/neighbourhoods";
const CREAM = "rgb(252, 250, 244)";
const INK = "rgb(28, 27, 22)";
const INK_DIM = "rgba(28, 27, 22, 0.55)";
const OLIVE = "rgb(84, 98, 45)";
const FOREST = "rgb(28, 36, 22)";
const STONE = "rgb(214, 208, 194)";

// Match reference: dark field → rounded cream panel → square info|photo pairs
const r = await framer.agent.applyChanges(
  `
SET NrbMmTnFX name="Territory Grid Section" layout="stack" stackDirection="vertical" stackAlignment="center" stackDistribution="start" gap="32px" padding="80px 48px 96px 48px" width="1fr" height="auto" fill="${FOREST}";

SET Dsp5KQS9c text="THE DIRECTORY" fontName="Space Mono" fontSize="11px" textColor="rgba(252, 250, 244, 0.55)" width="1fr" height="auto" maxWidth="1200px";

+FrameNode nbhPanel parent="NrbMmTnFX" position="1";
SET nbhPanel name="Directory Panel" layout="stack" stackDirection="vertical" stackAlignment="center" gap="0px" padding="20px" width="1fr" height="auto" maxWidth="1200px" fill="${CREAM}" borderRadius="20px";

MOVE km7dUqZI9 parent="nbhPanel" position="0";

SET km7dUqZI9 name="Territory Checkerboard" layout="grid" gridColumnCount="2" gridColumnMinWidth="280px" gridAlignment="center" gap="10px" width="1fr" height="auto" maxWidth="null" padding="0px";

SET t8SpOTSDb name="Territory Pair" layout="stack" stackDirection="horizontal" stackAlignment="stretch" stackDistribution="start" gap="10px" width="1fr" height="auto" overflow="visible" cursor="pointer" fill="null";

SET OGGeEjtus name="Info Card" layout="stack" stackDirection="vertical" stackDistribution="space-between" stackAlignment="start" gap="16px" padding="22px 20px 22px 20px" width="1fr" height="auto" aspectRatio="1" minHeight="null" fill="${CREAM}" borderRadius="10px" borderWidth="1px" borderColor="rgba(28, 27, 22, 0.08)";

SET LZhvtq3pr name="Info Top" layout="stack" stackDirection="vertical" gap="0px" width="1fr" height="1fr" stackDistribution="start";

SET k58mukSj1 name="Title Row" layout="stack" stackDirection="horizontal" stackAlignment="start" stackDistribution="space-between" gap="8px" width="1fr" height="auto";

SET WJ2oP3wg8 text="var(--variable-tBUaKupCV)" textStylePreset="Arbour/Heading" textColor="${INK}" width="1fr" height="auto" fontSize="26px";

SET A7DVbO4ux text="↗" fontName="Inter" fontSize="16px" textColor="${OLIVE}" width="auto" height="auto";

+FrameNode nbMapWrap parent="LZhvtq3pr" position="1";
SET nbMapWrap name="Map Stage" layout="stack" stackDirection="vertical" stackAlignment="center" stackDistribution="center" width="1fr" height="1fr" padding="8px 4px";

MOVE qutSkEzGj parent="nbMapWrap" position="0";
SET qutSkEzGj name="London Map" width="100%" height="100%" maxHeight="160px" $control__zone="var(--variable-tBUaKupCV)" $control__city="${STONE}" $control__accent="${OLIVE}" $control__showLabel="false";

SET PRI3SSvbZ name="Info Bottom" layout="stack" stackDirection="vertical" gap="0px" width="1fr" height="auto";

SET ClU1r2Bz7 text="var(--variable-mNRagFPfJ)" fontName="Inter" fontSize="13px" fontWeight="400" textColor="${INK_DIM}" width="1fr" height="auto";

SET GrxXcke3R visible=false;

SET XzTsEtIxm name="Photo Card" layout="stack" width="1fr" height="auto" aspectRatio="1" minHeight="null" overflow="clip" borderRadius="10px" fill="var(--variable-dM8yn13g7)" hoverEffect.scale="1.02" hoverEffect.transition="spring-duration 0.45s 0.25 0s";
`,
  { pagePath }
);
console.log(JSON.stringify(r));
