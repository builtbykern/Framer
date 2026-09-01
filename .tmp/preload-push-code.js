const fs = require("fs");
const files = await framer.getCodeFiles();
const intro = files.find((f) => f.name === "ZoomImageIntro.tsx");
const legacy = files.find((f) => f.name === "ZoomImagesPreloader.tsx");
const introSrc = fs.readFileSync(".tmp/preload-ZoomImageIntro.tsx", "utf8");
const legacySrc = fs.readFileSync(
  ".tmp/preload-ZoomImagesPreloader.tsx",
  "utf8"
);
await intro.setFileContent(introSrc);
await legacy.setFileContent(legacySrc);

const files2 = await framer.getCodeFiles();
const i2 = files2.find((f) => f.name === "ZoomImageIntro.tsx");
const l2 = files2.find((f) => f.name === "ZoomImagesPreloader.tsx");
console.log(
  JSON.stringify({
    introLines: i2.content.split("\n").length,
    introPartial: /Partial<ZoomImageIntroProps>/.test(i2.content),
    legacyLines: l2.content.split("\n").length,
    legacyRM: /useReducedMotion/.test(l2.content),
    legacyLegacy: /Legacy/.test(l2.content),
  })
);
