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
const INK_DIM = "rgba(28, 27, 22, 0.7)";
const OLIVE = "rgb(84, 98, 45)";
const ACCENT = "rgb(214, 224, 74)";
const FOREST = "rgb(28, 36, 22)";

const r5 = await framer.agent.applyChanges(
  `
SET OBnhHSQMP visible=false;
SET ZpI0rC_2D visible=false;
SET qutSkEzGj $control__zone="var(--variable-tBUaKupCV)" $control__showLabel="true" $control__label="" height="168px";
SET XzTsEtIxm fill="var(--variable-dM8yn13g7)" minHeight="420px" height="1fr" borderRadius="12px" overflow="clip";
SET OGGeEjtus minHeight="420px" height="1fr";
SET WJ2oP3wg8 textColor="rgb(28, 27, 22)";

+FrameNode nbhEditorial parent="H1kR5JcFp" position="2";
SET nbhEditorial name="How We Read A Place" layout="stack" stackDirection="horizontal" stackAlignment="start" stackDistribution="start" gap="64px" padding="120px 48px 120px 48px" width="1fr" height="auto" fill="${FOREST}" maxWidth="1440px";

+FrameNode nbhEdMeta parent="nbhEditorial" position="0";
SET nbhEdMeta name="Editorial Meta" layout="stack" stackDirection="vertical" gap="16px" width="240px" height="auto";

+RichTextNode nbhEdKicker parent="nbhEdMeta" position="0";
SET nbhEdKicker text="METHOD" fontName="Space Mono" fontSize="11px" textColor="${ACCENT}" width="auto" height="auto";

+RichTextNode nbhEdIndex parent="nbhEdMeta" position="1";
SET nbhEdIndex text="Street first.\\nFacade second.\\nTitle last." fontName="Space Mono" fontSize="12px" textColor="rgba(252, 250, 244, 0.55)" width="1fr" height="auto";

+FrameNode nbhEdCopy parent="nbhEditorial" position="1";
SET nbhEdCopy name="Editorial Copy" layout="stack" stackDirection="vertical" gap="28px" width="1fr" height="auto" maxWidth="720px";

+RichTextNode nbhEdTitle parent="nbhEdCopy" position="0";
SET nbhEdTitle text="How we read a place." fontName="Fraunces" fontSize="56px" textColor="${CREAM}" width="1fr" height="auto" textWrapBalance=true;

+RichTextNode nbhEdBody parent="nbhEdCopy" position="1";
SET nbhEdBody text="Each territory on this page is a working knowledge — of light on brick, of quiet streets behind known avenues, of what a long ownership looks like from the pavement. We do not collect postcodes. We collect readings." fontName="Inter" fontSize="17px" textColor="rgba(252, 250, 244, 0.72)" width="1fr" height="auto";

+RichTextNode nbhEdCta parent="nbhEdCopy" position="2";
SET nbhEdCta text="START A CONVERSATION →" fontName="Space Mono" fontSize="12px" textColor="${ACCENT}" width="auto" height="auto" link="/contact";
`,
  { pagePath }
);
console.log("r5", JSON.stringify(r5));
