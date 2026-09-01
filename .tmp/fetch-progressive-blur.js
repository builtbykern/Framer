const fs = require("node:fs");
const f = await framer.getCodeFile("Arbour_ProgressiveBlur.tsx");
fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/Arbour_ProgressiveBlur.tsx", f.content);
console.log("lines", f.content.split("\n").length);
