const fs = require("node:fs");
const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_StatsBand.tsx",
  "utf8"
);
const file = await framer.getCodeFile("Arbour_StatsBand.tsx");
const updated = await file.setFileContent(code);
const errors = await updated.typecheck();
console.log(
  JSON.stringify(
    {
      ok: true,
      typeErrors: errors,
      hasSettle: updated.content.includes("countSettleControls"),
      hasMarkerChrome: updated.content.includes("markerChromeVisible"),
      hasScalePulse: updated.content.includes("scale: [1.015, 1]"),
    },
    null,
    2
  )
);
