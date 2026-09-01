
const info = await framer.getProjectInfo();
const cf = await framer.getCodeFile("WaveDotLink.tsx");
const pub = await framer.getPublishInfo();
const pages = await framer.getNodesWithType("WebPageNode");
console.log(JSON.stringify({
  project: info.name,
  pub,
  pages: pages.map(p => ({id:p.id, path:p.path})),
  file: cf ? { id: cf.id, name: cf.name, lines: cf.content.split("\n").length } : null,
}, null, 2));
console.log("===CODE_START===");
console.log(cf.content);
console.log("===CODE_END===");
