const SITEMAP = {
  "/": "augiA20Il",
  "/properties-2": "uBAGmujMa",
  "/neighbourhoods": "dZfxmFpqB",
  "/notes": "s8RpZIiJ8",
  "/about": "OdFhPn9yz",
  "/contact": "c7qpzB7hR",
  "/properties-2/:Properties": "OhRUQROL4",
  "/notes/:Journal": "YPPO8pJ92",
  "/404": "ojmcAsLyM",
};

const ATTRS = [
  "name",
  "text",
  "textStylePreset",
  "fontName",
  "fontSize",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "textColor",
  "fill",
  "gap",
  "padding",
  "maxWidth",
  "width",
  "height",
  "component",
];

const TOKEN_RE = /var\(--token-/;
const RGB_RE = /rgb\(|rgba\(|#[0-9a-fA-F]{3,8}\b/;

function textSnippet(t) {
  if (typeof t !== "string") return undefined;
  return t.replace(/\s+/g, " ").trim().slice(0, 80);
}

function flatten(node, out = []) {
  if (!node) return out;
  out.push(node);
  for (const c of node.children || []) flatten(c, out);
  return out;
}

async function serializeBatch(ids, pagePath, attrs) {
  const out = [];
  for (let i = 0; i < ids.length; i += 35) {
    const batch = ids.slice(i, i + 35);
    const nodes = await framer.agent.serializeNodes(
      { ids: batch, depth: 0, attributeFilter: attrs },
      { pagePath }
    );
    const list = Array.isArray(nodes) ? nodes : nodes?.nodes || [];
    out.push(...list);
  }
  return out;
}

const report = {
  pages: {},
  cross: {
    titleRows: [],
    chrome: [],
    pageFills: [],
    heroGaps: [],
  },
};

for (const [pagePath, pageId] of Object.entries(SITEMAP)) {
  const skeleton = await framer.agent.serialize(
    {
      id: pageId,
      depth: 3,
      attributeFilter: ["name", "component", "fill", "gap", "padding", "maxWidth", "width", "height"],
    },
    { pagePath }
  );

  const rich = await framer.agent.getDescendantsOfTypes(
    { id: pageId, types: ["RichTextNode"] },
    { pagePath }
  );
  const comps = await framer.agent.getDescendantsOfTypes(
    { id: pageId, types: ["ComponentInstanceNode"] },
    { pagePath }
  );
  const frames = await framer.agent.getDescendantsOfTypes(
    { id: pageId, types: ["FrameNode"] },
    { pagePath }
  );

  const richIds = (rich || []).map((n) => n.id).filter(Boolean);
  const compIds = (comps || []).map((n) => n.id).filter(Boolean);

  // Prefer primary breakpoint: Desktop or first child
  const breakpoints = (skeleton.children || []).map((bp) => ({
    id: bp.id,
    name: bp.name,
    childCount: (bp.children || []).length,
    fill: bp.attributes?.fill || bp.fill,
    sections: (bp.children || []).map((c) => ({
      id: c.id,
      name: c.name || c.attributes?.name,
      type: c.type,
      component: c.component || c.$componentDisplayName,
      fill: c.attributes?.fill || c.fill,
      gap: c.attributes?.gap || c.gap,
      padding: c.attributes?.padding || c.padding,
      maxWidth: c.attributes?.maxWidth || c.maxWidth,
    })),
  }));

  const desktop =
    breakpoints.find((b) => /desktop/i.test(b.name || "")) || breakpoints[0];

  // Serialize only rich texts under desktop if possible
  let scopedRichIds = richIds;
  if (desktop?.id) {
    const deskRich = await framer.agent.getDescendantsOfTypes(
      { id: desktop.id, types: ["RichTextNode"] },
      { pagePath }
    );
    if (deskRich?.length) scopedRichIds = deskRich.map((n) => n.id);
  }

  // Cap serialize to avoid explosion — prioritize by sampling first 80 + any with Display/Heading later via skeleton walk
  const sampleIds = scopedRichIds.slice(0, 100);
  const richAttrs = await serializeBatch(sampleIds, pagePath, ATTRS);
  const compAttrs = await serializeBatch(compIds.slice(0, 80), pagePath, [
    "name",
    "component",
  ]);

  const presetCounts = {};
  const titles = [];
  const rawFonts = [];
  const rawColors = [];
  const letterSpacing = [];
  const noPreset = [];

  for (const n of richAttrs) {
    const a = n.attributes || n;
    const preset = a.textStylePreset || null;
    const key = preset || "(none)";
    presetCounts[key] = (presetCounts[key] || 0) + 1;
    const entry = {
      id: n.id,
      name: a.name || n.name,
      text: textSnippet(a.text),
      preset,
      fontName: a.fontName || null,
      fontSize: a.fontSize || null,
      letterSpacing: a.letterSpacing || null,
      textColor: a.textColor || null,
    };
    if (!preset) noPreset.push(entry);
    if (preset && /Display|Heading|Subhead/i.test(preset)) titles.push(entry);
    if (a.fontName && /Inter|Roboto|Arial|Helvetica/i.test(String(a.fontName))) {
      rawFonts.push(entry);
    }
    if (a.textColor && RGB_RE.test(String(a.textColor)) && !TOKEN_RE.test(String(a.textColor))) {
      rawColors.push(entry);
    }
    if (
      a.letterSpacing != null &&
      a.letterSpacing !== "" &&
      a.letterSpacing !== "0" &&
      a.letterSpacing !== "0px"
    ) {
      letterSpacing.push(entry);
    }
  }

  // Also pull title-like nodes by walking all rich with only name from list, then fetch Display/Heading by scanning frame names
  // Find hero/section headline frames by name patterns in desktop sections
  const headlineCandidates = [];
  for (const sec of desktop?.sections || []) {
    if (!sec.id) continue;
    const secRich = await framer.agent.getDescendantsOfTypes(
      { id: sec.id, types: ["RichTextNode"] },
      { pagePath }
    );
    const ids = (secRich || []).slice(0, 12).map((n) => n.id);
    if (!ids.length) continue;
    const nodes = await serializeBatch(ids, pagePath, ATTRS);
    for (const n of nodes) {
      const a = n.attributes || n;
      const preset = a.textStylePreset;
      if (preset && /Display|Heading|Subhead|Meta|Tags/i.test(String(preset))) {
        headlineCandidates.push({
          section: sec.name,
          id: n.id,
          name: a.name || n.name,
          text: textSnippet(a.text),
          preset,
          fontName: a.fontName,
          fontSize: a.fontSize,
          textColor: a.textColor,
          letterSpacing: a.letterSpacing,
        });
      } else if (!preset && a.fontSize) {
        headlineCandidates.push({
          section: sec.name,
          id: n.id,
          name: a.name || n.name,
          text: textSnippet(a.text),
          preset: "(none)",
          fontName: a.fontName,
          fontSize: a.fontSize,
          textColor: a.textColor,
          letterSpacing: a.letterSpacing,
          flag: "no-preset",
        });
      }
    }
  }

  const hasNav = (comps || []).some(
    (c) =>
      c.component === "ynpqYJGOd" ||
      c.$componentDisplayName === "Nav" ||
      /nav/i.test(c.name || "")
  ) || compAttrs.some(
    (c) =>
      c.component === "ynpqYJGOd" ||
      c.$componentDisplayName === "Nav" ||
      /nav/i.test(c.name || "")
  );

  // Also check skeleton sections for Nav
  const navInSkeleton = (desktop?.sections || []).some(
    (s) => s.component === "ynpqYJGOd" || /nav/i.test(s.name || "") || /nav/i.test(s.component || "")
  );
  const footerInSkeleton = (desktop?.sections || []).some(
    (s) => /footer/i.test(s.name || "") || /footer/i.test(s.component || "")
  );

  // Component names from descendants (cheap fields)
  const compNames = [
    ...new Set(
      (comps || [])
        .map((c) => c.$componentDisplayName || c.name || c.component)
        .filter(Boolean)
    ),
  ];

  const pageFill = desktop?.fill;
  report.cross.pageFills.push({ pagePath, fill: pageFill, breakpoint: desktop?.name });
  report.cross.chrome.push({
    pagePath,
    hasNav: hasNav || navInSkeleton,
    hasFooter: footerInSkeleton || compNames.some((n) => /footer/i.test(n)),
    sectionNames: (desktop?.sections || []).map((s) => s.name),
  });

  for (const h of headlineCandidates.filter((h) => /Display|Heading/i.test(String(h.preset)))) {
    report.cross.titleRows.push({ pagePath, ...h });
  }

  // raw fills among top sections
  const sectionRawFills = (desktop?.sections || [])
    .filter((s) => s.fill && RGB_RE.test(String(s.fill)) && !TOKEN_RE.test(String(s.fill)))
    .map((s) => ({ name: s.name, fill: s.fill }));

  report.pages[pagePath] = {
    pageId,
    richCount: richIds.length,
    desktopRichSampled: sampleIds.length,
    frameCount: (frames || []).length,
    componentCount: (comps || []).length,
    breakpoints: breakpoints.map((b) => ({ name: b.name, sections: b.sections.length, fill: b.fill })),
    desktop: desktop?.name,
    sections: desktop?.sections || [],
    hasNav: hasNav || navInSkeleton,
    hasFooter: footerInSkeleton || compNames.some((n) => /footer/i.test(n)),
    components: compNames.slice(0, 35),
    presetCounts,
    titles: titles.slice(0, 15),
    headlinesBySection: headlineCandidates.slice(0, 40),
    rawFonts: rawFonts.slice(0, 20),
    rawColors: rawColors.slice(0, 20),
    letterSpacing: letterSpacing.slice(0, 15),
    noPresetCount: noPreset.length,
    sectionRawFills,
  };
}

console.log(JSON.stringify(report, null, 2));
