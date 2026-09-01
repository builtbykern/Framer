const fs = require("fs");
const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_LondonMap.tsx",
  "utf8"
);
const file = (await framer.getCodeFiles()).find(
  (f) => f.name === "Arbour_LondonMap.tsx"
);
await file.setFileContent(code);

const pagePath = "/neighbourhoods";
const WHITE = "rgb(255, 254, 250)";
const CREAM = "rgb(252, 250, 244)";
const FOREST = "rgb(28, 36, 22)";
const INK = "rgb(28, 27, 22)";
const INK_DIM = "rgba(28, 27, 22, 0.5)";
const OLIVE = "rgb(84, 98, 45)";
const CITY = "rgb(205, 200, 188)";

/**
 * Match reference composition:
 * - Dark field + cream rounded panel
 * - Each neighbourhood = ONE flush card (info|photo, gap 0)
 * - Gap only between cards
 * - Squares, map centered in info
 */
const r = await framer.agent.applyChanges(
  `
SET NrbMmTnFX fill="${FOREST}" padding="72px 48px 96px 48px" gap="28px" stackAlignment="center";

SET Dsp5KQS9c text="THE DIRECTORY" fontName="Space Mono" fontSize="11px" textColor="rgba(252, 250, 244, 0.5)" maxWidth="1100px";

SET q3QLrEX8k name="Directory Panel" fill="${CREAM}" padding="16px" borderRadius="20px" maxWidth="1100px" width="1fr" gap="0px";

SET km7dUqZI9 layout="grid" gridColumnCount="2" gridColumnMinWidth="300px" gap="14px" width="1fr" maxWidth="null";

SET t8SpOTSDb name="Territory Pair" layout="stack" stackDirection="horizontal" stackAlignment="stretch" stackDistribution="start" gap="0px" width="1fr" height="auto" overflow="clip" borderRadius="12px" fill="${WHITE}" cursor="pointer";

SET OGGeEjtus name="Info Card" layout="stack" stackDirection="vertical" stackDistribution="space-between" stackAlignment="start" gap="12px" padding="24px 22px 22px 22px" width="1fr" height="auto" aspectRatio=1 minHeight="null" maxHeight="null" fill="${WHITE}" borderRadius="0px" borderWidth="0px";

SET XzTsEtIxm name="Photo Card" layout="stack" width="1fr" height="auto" aspectRatio=1 minHeight="null" maxHeight="null" overflow="clip" borderRadius="0px" fill="var(--variable-dM8yn13g7)" hoverEffect.scale="1.03" hoverEffect.transition="spring-duration 0.45s 0.2 0s";

SET LZhvtq3pr layout="stack" stackDirection="vertical" gap="8px" width="1fr" height="1fr" stackDistribution="start";

SET k58mukSj1 layout="stack" stackDirection="horizontal" stackAlignment="start" stackDistribution="space-between" width="1fr" height="auto" gap="8px";

SET WJ2oP3wg8 text="var(--variable-tBUaKupCV)" textColor="${INK}" fontSize="26px" width="1fr";

SET A7DVbO4ux text="↗" fontSize="15px" textColor="${INK}" width="auto";

SET VIeGty7T6 layout="stack" stackAlignment="center" stackDistribution="center" width="1fr" height="1fr" padding="4px 0px";

SET qutSkEzGj width="100%" height="128px" $control__zone="var(--variable-tBUaKupCV)" $control__city="${CITY}" $control__accent="${OLIVE}";

SET PRI3SSvbZ width="1fr" height="auto";
SET ClU1r2Bz7 text="var(--variable-mNRagFPfJ)" fontName="Inter" fontSize="12px" textColor="${INK_DIM}" width="1fr";
SET GrxXcke3R visible=false;
SET OBnhHSQMP visible=false;
SET ZpI0rC_2D visible=false;
`,
  { pagePath }
);
console.log(JSON.stringify(r));

await framer.setAttributes("OGGeEjtus", { aspectRatio: 1, borderRadius: "0px" });
await framer.setAttributes("XzTsEtIxm", { aspectRatio: 1, borderRadius: "0px" });
await framer.setAttributes("t8SpOTSDb", { borderRadius: "12px" });
await framer.setAttributes("q3QLrEX8k", { borderRadius: "20px" });

const tab = "aJLpuUP0q";
const phone = "Qonafp_oD";
await framer.agent.applyChanges(
  `
SET ${tab}NrbMmTnFX padding="56px 32px 72px 32px";
SET ${tab}q3QLrEX8k padding="12px" borderRadius="16px";
SET ${tab}km7dUqZI9 gridColumnCount="1" gap="12px";
SET ${tab}t8SpOTSDb gap="0px" borderRadius="10px";

SET ${phone}NrbMmTnFX padding="48px 16px 64px 16px";
SET ${phone}q3QLrEX8k padding="10px" borderRadius="14px";
SET ${phone}km7dUqZI9 layout="stack" stackDirection="vertical" gap="12px";
SET ${phone}t8SpOTSDb stackDirection="vertical" gap="0px" borderRadius="10px" height="auto";
SET ${phone}OGGeEjtus aspectRatio="null" height="auto" minHeight="260px";
SET ${phone}XzTsEtIxm aspectRatio="1" height="auto";
`,
  { pagePath }
);
console.log("bp done");
