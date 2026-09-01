const fs = require("fs");
const path = require("path");

const code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_SoftOrb.tsx",
  "utf8"
);

const files = await framer.getCodeFiles();
const existing = files.find((f) => f.name === "Arbour_SoftOrb.tsx");

let file;
if (existing) {
  file = await existing.setFileContent(code);
  console.log(JSON.stringify({ action: "updated", id: file.id, name: file.name }));
} else {
  file = await framer.createCodeFile("Arbour_SoftOrb.tsx", code);
  console.log(JSON.stringify({ action: "created", id: file.id, name: file.name }));
}

console.log(
  JSON.stringify({
    exports: (file.exports || []).map((e) => ({
      name: e.name,
      type: e.type,
      componentId: e.componentId,
      id: e.id,
    })),
  })
);
