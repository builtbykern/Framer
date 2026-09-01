/* Home-only template-audit scan — all breakpoints — READ ONLY */
const HOME = "augiA20Il"
const pagePath = "/"

const preview = await framer.agent.publish({ action: "preview" })
const publishInfo = await framer.getPublishInfo()

const tree = await framer.agent.serialize(
  {
    id: HOME,
    depth: 18,
    attributeFilter: [
      "name",
      "link",
      "href",
      "text",
      "textColor",
      "fill",
      "padding",
      "gap",
      "width",
      "height",
      "component",
      "componentIdentifier",
      "visible",
      "$control__decorative",
      "$control__link",
      "$control__label",
      "$mediaQuery",
    ],
  },
  { pagePath }
)

const root = Array.isArray(tree) ? tree[0] : tree

function linkInfo(n) {
  const a = n.attributes || {}
  if (a.link != null && a.link !== false && a.link !== "") {
    if (typeof a.link === "object")
      return { href: a.link.href ?? JSON.stringify(a.link).slice(0, 80), raw: a.link }
    return { href: String(a.link), raw: a.link }
  }
  return null
}

const breakpoints = new Map() // name -> stats
const sections = []
const nestedLinks = []
const hardInk = []
const hardOlive = []
const truncatedInk = []
const ashcombe = []
const freehandArrows = []
const underlineInLinked = []
const instancesByBp = {}
const mediaQueries = new Set()

function bpOf(n, inherited) {
  const mq = n.$mediaQuery?.name || n.attributes?.$mediaQuery?.name
  if (mq) return mq
  // replica id prefixes often encode breakpoint variant of parent page
  return inherited || "Primary/Desktop"
}

function walk(n, linkStack, bp, path) {
  if (!n) return
  const thisBp = bpOf(n, bp)
  mediaQueries.add(thisBp)
  if (!breakpoints.has(thisBp)) {
    breakpoints.set(thisBp, {
      nodes: 0,
      links: 0,
      instances: 0,
      hardInk: 0,
      hardOlive: 0,
      nested: 0,
      underlineInLinked: 0,
    })
  }
  const st = breakpoints.get(thisBp)
  st.nodes++

  const attrs = n.attributes || {}
  const blob = JSON.stringify(attrs) + " " + (n.name || "")
  if (/ashcombe|ashcombevane/i.test(blob)) {
    ashcombe.push({ id: n.id, name: n.name, bp: thisBp })
  }
  if (typeof attrs.textColor === "string") {
    if (/28\s*,\s*27\s*,\s*22/.test(attrs.textColor)) {
      hardInk.push({ id: n.id, name: n.name, bp: thisBp, textColor: attrs.textColor })
      st.hardInk++
    }
    if (/84\s*,\s*98\s*,\s*45/.test(attrs.textColor)) {
      hardOlive.push({ id: n.id, name: n.name, bp: thisBp, textColor: attrs.textColor })
      st.hardOlive++
    }
    if (/token-e2f9a9eb-0000-0000-0000-000000000000/.test(attrs.textColor)) {
      truncatedInk.push({ id: n.id, name: n.name, bp: thisBp })
    }
  }
  if (typeof attrs.text === "string" && /→/.test(attrs.text) && !/RETURN/i.test(attrs.text)) {
    // freehand arrow in rich text — may be intentional in UnderlineLink labels via control
    if (!String(n.$componentDisplayName || "").includes("Underline")) {
      freehandArrows.push({ id: n.id, name: n.name, bp: thisBp, text: String(attrs.text).slice(0, 60) })
    }
  }

  const li = linkInfo(n)
  const nextStack = li
    ? [...linkStack, { id: n.id, name: n.name, type: n.type, href: li.href, bp: thisBp }]
    : linkStack
  if (li) st.links++

  const isUL =
    n.component === "codeFile/zCa0pzg:default" ||
    n.$componentDisplayName === "Arbour_UnderlineLink" ||
    /UnderlineLink/i.test(n.name || "")
  if (isUL && nextStack.length > (li ? 1 : 0) && linkStack.length > 0) {
    const decorative = attrs.$control__decorative
    underlineInLinked.push({
      id: n.id,
      name: n.name,
      bp: thisBp,
      decorative,
      label: attrs.$control__label,
      link: attrs.$control__link,
      outer: linkStack[linkStack.length - 1],
    })
    st.underlineInLinked++
    if (decorative === "false" || decorative === false || decorative == null) {
      nestedLinks.push({
        bp: thisBp,
        outer: linkStack[linkStack.length - 1],
        inner: { id: n.id, label: attrs.$control__label, link: attrs.$control__link, decorative },
      })
      st.nested++
    }
  }

  if (
    n.type === "ComponentInstanceNode" ||
    String(n.type || "").includes("ComponentInstance")
  ) {
    st.instances++
    const key = n.$componentDisplayName || n.name || n.component || "unknown"
    if (!instancesByBp[thisBp]) instancesByBp[thisBp] = {}
    instancesByBp[thisBp][key] = (instancesByBp[thisBp][key] || 0) + 1
  }

  // top-level section names under page / primary breakpoint frames
  if (path.length <= 2 && n.name && n.type === "FrameNode") {
    sections.push({
      id: n.id,
      name: n.name,
      bp: thisBp,
      childCount: (n.children || []).length,
      hasLink: !!li,
    })
  }

  for (const c of n.children || []) {
    walk(c, nextStack, thisBp, path.concat(n.name || n.id))
  }
}

walk(root, [], "Primary/Desktop", [])

const meta = root?.attributes?.metadata || null

// Breakpoint variant roots if present as siblings under page
const topChildren = (root.children || []).map((c) => ({
  id: c.id,
  name: c.name,
  type: c.type,
  mq: c.$mediaQuery || null,
  width: c.attributes?.width,
  link: linkInfo(c)?.href || null,
}))

console.log(
  JSON.stringify(
    {
      collectedAt: new Date().toISOString(),
      pagePath,
      homeId: HOME,
      meta,
      preview: {
        changesCount: preview?.changesCount ?? null,
        errors: preview?.errors ?? null,
        warnings: preview?.warnings ?? null,
        changes: preview?.changes ?? null,
        status: preview?.status ?? null,
      },
      publishInfo,
      mediaQueries: [...mediaQueries],
      breakpointStats: Object.fromEntries(breakpoints),
      topChildren,
      sections: sections.slice(0, 80),
      nestedLinks,
      underlineInLinked,
      counts: {
        ashcombe: ashcombe.length,
        hardInk: hardInk.length,
        hardOlive: hardOlive.length,
        truncatedInk: truncatedInk.length,
        freehandArrows: freehandArrows.length,
        nestedNonDecorative: nestedLinks.length,
      },
      ashcombe: ashcombe.slice(0, 10),
      hardInk: hardInk.slice(0, 15),
      hardOlive: hardOlive.slice(0, 10),
      freehandArrows: freehandArrows.slice(0, 15),
      instancesByBp,
    },
    null,
    2
  )
)
