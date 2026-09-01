const pagePath = "/neighbourhoods";

const CREAM = "rgb(252, 250, 244)";
const INK = "rgb(28, 27, 22)";
const INK_DIM = "rgba(28, 27, 22, 0.62)";
const OLIVE = "rgb(84, 98, 45)";
const STONE = "rgb(231, 223, 206)";

// Section shell around existing CMS list
const r3 = await framer.agent.applyChanges(
  `
+FrameNode nbhGridSection parent="H1kR5JcFp" position="1";
SET nbhGridSection name="Territory Grid Section" layout="stack" stackDirection="vertical" stackAlignment="center" gap="48px" padding="96px 48px 96px 48px" width="1fr" height="auto" fill="${CREAM}";

MOVE km7dUqZI9 parent="nbhGridSection" position="0";

SET km7dUqZI9 name="Territory Checkerboard" layout="grid" gridColumnCount="2" gridColumnMinWidth="320px" gridAlignment="center" gap="16px" width="1fr" height="auto" maxWidth="1280px" padding="0px" position="relative" left="null" top="null";

+RichTextNode nbhGridKicker parent="nbhGridSection" position="0";
SET nbhGridKicker text="THE DIRECTORY" fontName="Space Mono" fontSize="11px" fontWeight="400" textColor="${OLIVE}" width="1fr" height="auto" maxWidth="1280px";
`,
  { pagePath }
);
console.log("r3", JSON.stringify(r3));
