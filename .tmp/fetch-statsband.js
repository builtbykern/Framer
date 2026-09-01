const fs = require("node:fs");
const file = await framer.getCodeFile("Arbour_StatsBand.tsx");
fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/Arbour_StatsBand.tsx", file.content);
console.log(JSON.stringify({ id: file.id, bytes: file.content.length, lines: file.content.split("\n").length }));
