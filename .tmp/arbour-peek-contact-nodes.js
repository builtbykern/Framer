// Peek contact Direct Enquiry + Email Arbour + Nav social text
async function peek(id, label) {
  try {
    const t = await framer.agent.serialize({ id, depth: 4 }, {})
    const slim = (n, d = 0) => {
      if (!n || d > 4) return null
      return {
        id: n.id,
        name: n.name,
        type: n.type,
        href: n.attributes?.link?.href,
        controlLink: n.attributes?.["$control__link"],
        controlLabel: n.attributes?.["$control__label"] ?? n.attributes?.["$control__text"],
        text: n.attributes?.text?.slice?.(0, 80) ?? (typeof n.attributes?.text === "string" ? n.attributes.text : undefined),
        children: (n.children || []).map((c) => slim(c, d + 1)).filter(Boolean),
      }
    }
    return { label, tree: slim(t) }
  } catch (e) {
    return { label, error: String(e.message || e) }
  }
}

const out = []
for (const [id, label] of [
  ["uONXSHosa", "Direct Enquiry"],
  ["BMhLvwqld", "UL"],
  ["jFTgrH9Eq", "text parent?"],
  ["qB71RMXEV", "Email Arbour"],
  ["WDu0pxZr4", "Opening RT"],
  ["czYnPBVB2", "IG RT"],
  ["EHoSN46Wx", "LI RT"],
  ["CQFoFPqQb", "X RT"],
  ["CHYXZMgW2", "Nav mailto RT"],
]) {
  out.push(await peek(id, label))
}
console.log(JSON.stringify(out, null, 2))
