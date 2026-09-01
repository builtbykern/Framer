const fs = require("node:fs");
const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_ScrollBlur.tsx",
  "utf8"
);
const file = await framer.getCodeFile("BuiltByKern_ScrollBlur.tsx");
const updated = await file.setFileContent(code);
const errors = await updated.typecheck();
console.log(
  JSON.stringify(
    {
      ok: errors.length === 0,
      typeErrors: errors,
      hasShape: updated.content.includes('options: ["edge", "u", "soft"]'),
      hasUMask: updated.content.includes("radial-gradient"),
    },
    null,
    2
  )
);
