const PAGE = "/404";
const IMG =
  "https://framerusercontent.com/images/ropphMdSjiFSRjWmC1VWaMwyrhI.png";

// Restore desktop shell + section chrome
const dsl = [
  `DEL XXEHxdtUf`,
  `DEL sffyiC_yP`,
  `SET P6DmPd7JZ fill="${IMG}"`,
  `SET fajgZq_WS fill="${IMG}"`,
  `SET TmwJ7gTG4 fill="${IMG}"`,
  `SET j4N1jForf name="404 — Lost Address" fill="rgba(28, 27, 22, 0.9)" padding="32px 40px 32px 40px" gap="0px" height="400%" maxWidth="null" width="1fr"`,
  `SET fajgZq_WSj4N1jForf name="404 — Lost Address" fill="rgba(28, 27, 22, 0.9)" padding="40px" height="100vh"`,
  `SET TmwJ7gTG4j4N1jForf name="404 — Lost Address" fill="rgba(28, 27, 22, 0.9)" padding="40px 16px 40px 16px" height="100vh"`,
  // Desktop type (original freehand)
  `SET syKmEViQZ textStylePreset="null" fontName="Space Mono" fontSize="12px" letterSpacing="0.12em" textColor="rgb(252, 250, 244)"`,
  `SET mgkoCUdZt textStylePreset="null" fontName="Space Mono" fontSize="10px" letterSpacing="0.12em" textColor="rgba(239, 233, 219, 0.55)"`,
  `SET ghdyof0u1 textStylePreset="null" fontName="Fraunces" fontSize="420px" letterSpacing="-0.04em" lineHeight="0.85em" textColor="rgba(252, 250, 244, 0.22)"`,
  `SET V7kO2l0VX textStylePreset="null" fontName="Space Mono" fontSize="11px" letterSpacing="0.12em" textColor="rgb(214, 224, 74)"`,
  `SET ZodqIH8_r textStylePreset="null" fontName="Fraunces" fontSize="72px" letterSpacing="-0.03em" lineHeight="1em" textColor="rgb(252, 250, 244)"`,
  `SET X1y97oCSA textStylePreset="null" fontName="Inter" fontSize="16px" letterSpacing="-0.02em" lineHeight="1.65em" textColor="rgba(239, 233, 219, 0.72)"`,
  `SET qhl2thyrV textStylePreset="null" fontName="Space Mono" fontSize="10px" letterSpacing="0.12em" textColor="rgba(239, 233, 219, 0.55)"`,
  `SET iM2KoEHTV textStylePreset="null" fontName="Space Mono" fontSize="10px" letterSpacing="0.12em" textColor="rgba(239, 233, 219, 0.55)"`,
].join(";\n") + ";";

const r = await framer.agent.applyChanges(dsl, { pagePath: PAGE });
console.log("shell", JSON.stringify(r));

// Return Home label if present
const rich = await framer.agent.getDescendantsOfTypes(
  { id: "j4N1jForf", types: ["RichTextNode"] },
  { pagePath: PAGE }
);
const ids = (rich || []).map((n) => n.id);
const nodes = await framer.agent.serializeNodes(
  {
    ids,
    depth: 0,
    attributeFilter: ["name", "textStylePreset", "fontName", "fontSize", "textColor"],
  },
  { pagePath: PAGE }
);
const list = Array.isArray(nodes) ? nodes : [];
const extra = [];
for (const n of list) {
  const a = n.attributes || {};
  // any remaining Arbour presets or Ink tokens on 404
  if (
    a.textStylePreset ||
    String(a.textColor || "").includes("token-e2f9a9eb") ||
    String(a.textColor || "").includes("token-a16d0333") ||
    String(a.textColor || "").includes("token-0bc68d0d")
  ) {
    if (["syKmEViQZ", "mgkoCUdZt", "ghdyof0u1", "V7kO2l0VX", "ZodqIH8_r", "X1y97oCSA", "qhl2thyrV", "iM2KoEHTV"].includes(n.id))
      continue;
    console.log("extra text", n.id, a.name, a.textStylePreset, a.fontSize, a.textColor);
    extra.push(
      `SET ${n.id} textStylePreset="null" fontName="Space Mono" fontSize="11px" letterSpacing="0.12em" textColor="rgb(252, 250, 244)"`
    );
  }
}

// Tablet/phone size overrides for giant 404 + heading
const bp = [
  `SET fajgZq_WSghdyof0u1 fontSize="280px" textColor="rgba(252, 250, 244, 0.2)"`,
  `SET fajgZq_WSZodqIH8_r fontSize="52px" textColor="rgb(252, 250, 244)"`,
  `SET fajgZq_WSX1y97oCSA fontSize="15px" textColor="rgba(239, 233, 219, 0.72)"`,
  `SET TmwJ7gTG4ghdyof0u1 fontSize="136px" textColor="rgba(252, 250, 244, 0.2)" height="200px"`,
  `SET TmwJ7gTG4ZodqIH8_r fontSize="34px" textColor="rgb(252, 250, 244)"`,
  `SET TmwJ7gTG4X1y97oCSA fontSize="14px" textColor="rgba(239, 233, 219, 0.72)"`,
];
const r2 = await framer.agent.applyChanges(
  [...extra, ...bp].join(";\n") + ";",
  { pagePath: PAGE }
);
console.log("type/bp", JSON.stringify(r2));

const verify = await framer.agent.serialize(
  {
    id: "P6DmPd7JZ",
    depth: 2,
    attributeFilter: ["name", "fill", "padding", "height", "component"],
  },
  { pagePath: PAGE }
);
console.log(
  JSON.stringify(
    {
      fill: verify.attributes?.fill?.slice?.(0, 60),
      kids: (verify.children || []).map((c) => ({
        id: c.id,
        name: c.name,
        comp: c.$componentDisplayName,
        fill: String(c.attributes?.fill || "").slice(0, 40),
        pad: c.attributes?.padding,
        h: c.attributes?.height,
      })),
    },
    null,
    2
  )
);
