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
      id: updated.id,
      bytes: updated.content.length,
      hasInsetControl: updated.content.includes("phoneTimelineInset"),
      ddFixed: updated.content.includes(
        "paddingLeft: isPhone ? phoneContentInset : termValueGap"
      ),
      noZeroDd: !updated.content.includes("paddingLeft: isPhone ? 0 : termValueGap"),
      typeErrors: errors,
    },
    null,
    2
  )
);
