const f = await framer.getCodeFile("emg8ovC");
let c = f.content;

const from = `fontFamily:
            '"Inter", "SF Pro Display", "Helvetica Neue", Arial, sans-serif'`;
const to = `fontFamily:
            '"Fraunces", Georgia, serif'`;

if (!c.includes(from)) {
  console.log("exact block not found");
  // show code points around
  const i = c.indexOf("SF Pro Display");
  console.log(JSON.stringify(c.slice(i - 60, i + 80)));
} else {
  c = c.split(from).join(to);
  await f.setFileContent(c);
  console.log("patched title fontFamily Inter→Fraunces, count", from.length);
}

const f2 = await framer.getCodeFile("emg8ovC");
console.log("SF Pro Display left:", f2.content.includes("SF Pro Display"));
