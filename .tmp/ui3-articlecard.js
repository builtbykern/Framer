const f = await framer.getCodeFile("emg8ovC");
let c = f.content;

// Title fonts: Inter → Fraunces for display titles (keep Inter for editorial body lines)
const before = c;

// Common title fontFamily blocks that use Inter for titles
c = c.replace(
  /fontFamily:\s*\n?\s*"Inter", "SF Pro Display", "Helvetica Neue", Arial, sans-serif"/g,
  'fontFamily:\n                \'"Fraunces", Georgia, serif\''
);

// Also single-line variants
c = c.replace(
  /"Inter", "SF Pro Display", "Helvetica Neue", Arial, sans-serif"/g,
  '"Fraunces", Georgia, serif"'
);

// Ensure ink default already patched; olive kicker already rgb(84,98,45) — leave
if (c === before) {
  // try reading around title styles
  const idx = c.indexOf("SF Pro Display");
  console.log("no replace; sample around Display:", c.slice(Math.max(0, idx - 80), idx + 120));
} else {
  await f.setFileContent(c);
  console.log("ArticleCard patched Inter Display → Fraunces");
}

// verify remaining Inter Display
const f2 = await framer.getCodeFile("emg8ovC");
console.log("SF Pro Display left:", f2.content.includes("SF Pro Display"));
console.log("Fraunces title refs:", (f2.content.match(/Fraunces/g) || []).length);
