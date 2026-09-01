const fs = require("node:fs");
const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_ScrollBlur.tsx",
  "utf8"
);
const existing = await framer.getCodeFile("Arbour_ScrollBlur.tsx");
const file = await existing.setFileContent(code);
const errors = await file.typecheck();
console.log(JSON.stringify({ ok: errors.length === 0, typeErrors: errors }, null, 2));
