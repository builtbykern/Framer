const fs = require("node:fs");
const f = await framer.getCodeFile("BuiltByKern_ScrollBlur.tsx");
fs.writeFileSync("/Users/noel/Desktop/Framer/.tmp/BuiltByKern_ScrollBlur.tsx", f.content);
const errors = await f.typecheck();
const c = f.content;
const lines = c.split("\n");
console.log(
  JSON.stringify(
    {
      id: f.id,
      lines: lines.length,
      typeErrors: errors,
      hasDefaultExport: /export default function BuiltByKern_ScrollBlur/.test(c),
      namedFunction: /export default function /.test(c),
      hasLayoutWidth: /@framerSupportedLayoutWidth/.test(c),
      hasLayoutHeight: /@framerSupportedLayoutHeight/.test(c),
      hasIntrinsic: /@framerIntrinsicWidth/.test(c),
      annotationBlockAbove:
        c.indexOf("@framerSupportedLayoutWidth") <
          c.indexOf("export default function") &&
        c
          .slice(
            c.lastIndexOf("/**", c.indexOf("export default function")),
            c.indexOf("export default function")
          )
          .includes("@framerSupportedLayoutWidth"),
      positionFixed: /position:\s*["']fixed["']/.test(c),
      rootRelative: /position:\s*["']relative["']/.test(c),
      windowUnguarded: false, // check manually
      hasPropertyControls: /addPropertyControls\(BuiltByKern_ScrollBlur/.test(c),
      imports: [...c.matchAll(/^import .+ from ["']([^"']+)["']/gm)].map(
        (m) => m[1]
      ),
      hasDefaultProps: /BuiltByKern_ScrollBlur\.defaultProps/.test(c),
      hasDisplayName: /displayName/.test(c),
      usesReducedMotion: /useReducedMotion/.test(c),
      usesStatic: /useIsStaticRenderer/.test(c),
      usesCanvas: /useIsOnFramerCanvas/.test(c),
      ariaHidden: /aria-hidden/.test(c),
      shapes: /"edge".*"u".*"soft"/.test(c.replace(/\s/g, "")),
    },
    null,
    2
  )
);

// window/document access lines
lines.forEach((line, i) => {
  if (/\bwindow\b|\bdocument\b/.test(line)) {
    console.log("WIN", i + 1, line.trim());
  }
});
