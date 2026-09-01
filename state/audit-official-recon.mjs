
const info = await framer.getProjectInfo();
const pub = await framer.getPublishInfo();
const pages = await framer.getNodesWithType("WebPageNode");
const frames = await framer.getNodesWithType("FrameNode");
const comps = await framer.getNodesWithType("ComponentNode");
const texts = await framer.getNodesWithType("TextNode");
const files = await framer.getCodeFiles();
console.log(JSON.stringify({
  project: info.name,
  publishUrl: pub?.production?.url,
  pages: pages.map(p => ({id:p.id, path:p.path, name:p.name})),
  frames: frames.slice(0,30).map(f => ({id:f.id, name:f.name, w:f.width, h:f.height})),
  componentNodes: comps.map(c => ({id:c.id, name:c.name})),
  textCount: texts.length,
  code: files.map(f => ({name:f.name, exports: (f.exports||[]).map(e => e.name || e.id || String(e))})),
}, null, 2));
