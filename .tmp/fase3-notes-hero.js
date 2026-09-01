const PAGE = "/notes";
const PAPER = "var(--token-d5b3c09d-0364-4ed0-8804-e56957faa275)";
const INK = "var(--token-e2f9a9eb-668a-4021-80d9-b04413b5f392)";
const OLIVE = "var(--token-a16d0333-6bd5-4d60-aa00-fac26447145d)";
const INK_SOFT = "var(--token-0bc68d0d-4c0b-4126-8cce-9425cb153f4e)";

const dsl = `
DEL ELuMN2aX9;
SET Vq1f2mEkj name="Notes Hero" fill="${PAPER}" height="auto" overflow="visible" maxWidth="1200px";
SET NPRkgYRMH name="Hero Copy" padding="72px 48px 56px 48px" gap="24px" height="auto" width="1fr" maxWidth="1200px";
SET sqsFVTzsL textStylePreset="Arbour/Meta" textColor="${OLIVE}" fontName="null" fontSize="null";
SET t1K8NQ7z5 textStylePreset="Arbour/Meta" textColor="${INK_SOFT}" fontName="null" fontSize="null";
SET xEORYedqg textStylePreset="Arbour/Display" textColor="${INK}" fontName="null" fontSize="null";
SET dCYCf8ZZp textStylePreset="Arbour/Body" textColor="${INK_SOFT}" fontName="null" fontSize="null" maxWidth="600px";
SET yzUPSfS5X textStylePreset="Arbour/Meta" textColor="${OLIVE}" fontName="null" fontSize="null";
`.trim();

const result = await framer.agent.applyChanges(dsl, { pagePath: PAGE });
console.log(JSON.stringify(result, null, 2));

const verify = await framer.agent.serialize(
  {
    id: "Vq1f2mEkj",
    depth: 3,
    attributeFilter: [
      "name",
      "fill",
      "height",
      "padding",
      "gap",
      "textStylePreset",
      "textColor",
      "fontName",
      "component",
    ],
  },
  { pagePath: PAGE }
);
console.log(JSON.stringify(verify, null, 2).slice(0, 4000));
