const comps = await framer.agent.getDescendantsOfTypes(
  { id: "WQLkyLRf1", types: ["RichTextNode"] },
  { pagePath: "/" }
);
let hard = 0;
const samples = [];
for (const n of comps || []) {
  const a = n.attributes || {};
  const blob = JSON.stringify(a);
  if (blob.includes("28, 27, 22") || blob.includes("28,27,22")) {
    hard++;
    if (samples.length < 8) samples.push(n.name || n.id);
  }
}
console.log({ hard, samples });
