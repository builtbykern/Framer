const h1 = await framer.getNode("R80e8PwNu")
const html = await h1.getHTML()
const text = await h1.getText()
console.log("text:", text)
console.log("html:", html)
console.log("font:", JSON.stringify(h1.font))
console.log("inlineTextStyle:", JSON.stringify(h1.inlineTextStyle))
console.log("textColor:", JSON.stringify(h1.textColor))
// dump color-related attrs
for (const k of Object.keys(h1)) {
  if (/color|font|size|style|appear|effect/i.test(k)) {
    try {
      console.log(k, JSON.stringify(h1[k]).slice(0, 200))
    } catch {}
  }
}

const wrap = await framer.getNode("DpN8zutuL")
const copy = await framer.getNode("AATw4pip9")
const native = await framer.getNode("qxIyvg6PE")
console.log("wrap children", (await wrap.getChildren?.())?.map?.(c => c.id + " " + c.name) || "n/a")
console.log("native children", (await native.getChildren?.())?.map?.(c => c.id + " " + c.name) || "n/a")
console.log("copy children", (await copy.getChildren?.())?.map?.(c => c.id + " " + c.name) || "n/a")
