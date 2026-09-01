const fs = require("node:fs");
let code = fs.readFileSync(
  "/Users/noel/Desktop/Framer/.tmp/Arbour_ScrollBlur.tsx",
  "utf8"
);

code = code
  .replaceAll("Arbour_ScrollBlur", "BuiltByKern_ScrollBlur")
  .replaceAll("--arbour-sb", "--bbk-sb")
  .replace(
    "// BuiltByKern · Arbour — scroll-reactive progressive backdrop blur for editorial bands.",
    "// BuiltByKern — scroll-reactive progressive backdrop blur for editorial layouts."
  )
  .replace(
    " * Arbour_ScrollBlur",
    " * BuiltByKern_ScrollBlur"
  )
  .replace(
    " * Progressive backdrop-blur stack that eases in while the page scrolls and\n * settles out after idle. Place over Ink / Paper edges (nav exit, hero→band).",
    " * Progressive backdrop-blur stack that eases in while the page scrolls and\n * settles out after idle. Place over section edges (nav exit, hero→content)."
  );

fs.writeFileSync(
  "/Users/noel/Desktop/Framer/.tmp/BuiltByKern_ScrollBlur.tsx",
  code
);

const created = await framer.createCodeFile(
  "BuiltByKern_ScrollBlur.tsx",
  code
);
const errors = await created.typecheck();

const old = await framer.getCodeFile("Arbour_ScrollBlur.tsx");
if (old) {
  await old.remove();
  console.log("removed Arbour_ScrollBlur.tsx");
}

console.log(
  JSON.stringify(
    {
      ok: errors.length === 0,
      id: created.id,
      name: created.name,
      exports: created.exports?.map((e) => e.name || e),
      typeErrors: errors,
      hasArbourName: created.content.includes("Arbour_ScrollBlur"),
      hasBbk: created.content.includes("BuiltByKern_ScrollBlur"),
    },
    null,
    2
  )
);
