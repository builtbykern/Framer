const INK = "rgb(28, 27, 22)";

async function patchDefaults(id, replacements) {
  const f = await framer.getCodeFile(id);
  let c = f.content;
  let n = 0;
  for (const [from, to] of replacements) {
    if (!c.includes(from)) continue;
    const before = c;
    c = c.split(from).join(to);
    if (c !== before) n += 1;
  }
  if (n === 0) {
    console.log(f.name, "no changes");
    return;
  }
  await f.setFileContent(c);
  console.log(f.name, "patched groups", n);
}

await patchDefaults("emg8ovC", [
  ['title1 = "rgb(0, 0, 0)"', `title1 = "${INK}"`],
  ['defaultValue: "rgb(0, 0, 0)"', `defaultValue: "${INK}"`],
]);

await patchDefaults("rB5gJ0d", [
  ['backgroundColor: "rgb(0, 0, 0)"', `backgroundColor: "${INK}"`],
]);

console.log("fase9 done");
