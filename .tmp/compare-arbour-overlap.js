// Summarize existing Arbour comps that overlap with the orphan marketplace ones
const names = [
  "Arbour_NoiseEffect.tsx",
  "Arbour_ProgressiveBlur.tsx",
  "Arbour_LoadingScreen.tsx",
  "Arbour_SoftOrb.tsx",
  "Arbour_ScrollCue.tsx",
];
for (const name of names) {
  const f = await framer.getCodeFile(name);
  if (!f) {
    console.log(name, "MISSING");
    continue;
  }
  const c = f.content;
  // property control titles
  const titles = [...c.matchAll(/title:\s*"([^"]+)"/g)].map((m) => m[1]);
  const hasNoise = /noise|grain|film/i.test(c);
  const hasBlur = /blur|progressive/i.test(c);
  const hasPreload = /preload|loading|progress/i.test(c);
  console.log(
    JSON.stringify({
      name,
      lines: c.split("\n").length,
      sampleTitles: titles.slice(0, 18),
      flags: { hasNoise, hasBlur, hasPreload },
      head: c.slice(0, 280).replace(/\n/g, " "),
    })
  );
}
