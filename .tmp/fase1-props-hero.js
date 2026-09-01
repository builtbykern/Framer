const PAGE = "/properties-2";
const OLIVE = "var(--token-a16d0333-6bd5-4d60-aa00-fac26447145d)";
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)";
const INK_SOFT = "var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)";

const dsl = `
SET H0pCvPI36 textStylePreset="Arbour/Meta" textColor="${OLIVE}";
SET WQob20jtV textStylePreset="Arbour/Display" textColor="${INK}" fontName="null" fontSize="null";
SET eeii639K0 textStylePreset="Arbour/Subhead" textColor="${INK_SOFT}" fontName="null" fontSize="null";
SET cR5cTWroe textStylePreset="Arbour/Meta" textColor="${INK_SOFT}";
`.trim();

const result = await framer.agent.applyChanges(dsl, { pagePath: PAGE });
console.log(JSON.stringify(result, null, 2));

const verify = await framer.agent.serializeNodes(
  {
    ids: ["H0pCvPI36", "WQob20jtV", "eeii639K0", "cR5cTWroe"],
    depth: 0,
    attributeFilter: ["textStylePreset", "fontName", "fontSize", "textColor"],
  },
  { pagePath: PAGE }
);
console.log("verify", JSON.stringify(verify, null, 2));
