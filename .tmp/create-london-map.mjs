const fs = require("fs");
const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_LondonMap.tsx",
  "utf8"
);
const files = await framer.getCodeFiles();
const existing = files.find((f) => f.name === "Arbour_LondonMap.tsx");
let file;
if (existing) {
  file = await existing.setFileContent(code);
  console.log(JSON.stringify({ action: "updated", id: file.id }));
} else {
  file = await framer.createCodeFile("Arbour_LondonMap.tsx", code);
  console.log(JSON.stringify({ action: "created", id: file.id }));
}
console.log(
  JSON.stringify({
    exports: file.exports?.map((e) => ({
      name: e.name,
      componentId: e.componentId,
    })),
  })
);
