
const n = await framer.getNode("D86aoiS2J");
const attrs = n?.attributes || {};
const controls = attrs.controls || n?.controls;
let plain = {};
try {
  plain = {
    id: n.id,
    name: n.name,
    visible: n.visible,
    opacity: n.opacity,
    width: n.width,
    height: n.height,
    // common control keys
    keys: Object.keys(n).filter(k => !k.startsWith('_')).slice(0, 40),
  };
  if (typeof n.getAttributes === 'function') {
    plain.attributes = await n.getAttributes();
  }
} catch(e) { plain.err = String(e); }
console.log(JSON.stringify(plain, null, 2));
