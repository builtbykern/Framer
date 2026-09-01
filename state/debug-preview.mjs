
const info = await framer.getProjectInfo();
const pub = await framer.getPublishInfo();
const page = (await framer.getNodesWithType("WebPageNode"))[0];
await framer.setActivePage?.(page?.id);
const frames = await framer.getNodesWithType("FrameNode");
const texts = await framer.getNodesWithType("TextNode");
const comps = await framer.getNodesWithType("ComponentNode");
// dig children of Desktop
async function dump(node, depth=0) {
  if (!node || depth > 4) return null;
  const kids = typeof node.getChildren === "function" ? await node.getChildren() : (node.children || []);
  const out = {
    id: node.id,
    name: node.name,
    type: node.__class || node.type,
    w: node.width ?? node.rect?.width,
    h: node.height ?? node.rect?.height,
    visible: node.visible,
    opacity: node.opacity,
  };
  if (kids?.length) {
    out.children = [];
    for (const k of kids) out.children.push(await dump(k, depth+1));
  }
  // component instance?
  if (node.componentIdentifier || node.componentId || node.inheritsFromComponentId) {
    out.componentIdentifier = node.componentIdentifier || node.componentId || node.inheritsFromComponentId;
  }
  return out;
}
const desktop = frames.find(f => f.name === "Desktop") || frames[0];
const tree = desktop ? await dump(desktop) : null;
console.log(JSON.stringify({
  project: info.name,
  pub,
  page: page && {id: page.id, path: page.path},
  frameCount: frames.length,
  textCount: texts.length,
  componentNodeCount: comps.length,
  texts: texts.map(t => ({id:t.id, name:t.name})),
  tree,
}, null, 2));
