// BLOCK 2 — Restore rhythm via padding + typographic refinement
const pagePath = "/notes";

const dsl = `
SET sqsFVTzsL textStylePreset="Arbour/Meta" textColor="rgb(84, 98, 45)" textAlignment="start" width="1fr" height="auto" padding="0px";
SET xEORYedqg fontName="Fraunces" fontStyle="normal" fontWeight="340" fontVariationAxes.wght="340" fontSize="84px" letterSpacing="-0.04em" lineHeight="0.96em" textColor="rgb(28, 27, 22)" textWrapBalance="true" tag="h1" width="1fr" height="auto" padding="20px 0px 0px 0px";
SET dCYCf8ZZp fontName="Fraunces" fontStyle="italic" fontWeight="300" fontVariationAxes.wght="300" fontSize="22px" letterSpacing="-0.035em" lineHeight="1.45em" textColor="rgba(28, 27, 22, 0.62)" maxWidth="540px" width="1fr" height="auto" tag="p" padding="28px 0px 0px 0px";
SET U84Rv97cL padding="44px 0px 0px 0px" width="1fr" layout="stack" stackDirection="horizontal" stackAlignment="center" gap="16px";
SET t1K8NQ7z5 textStylePreset="Arbour/Meta" textColor="rgba(28, 27, 22, 0.5)" width="auto" height="auto";
SET v:t1K8NQ7z5:0:0 text="[ 07 ENTRIES ]";
SET Vq1f2mEkj padding="0px 0px 96px 0px" borderBottom="1px" borderColor="rgba(28, 27, 22, 0.10)";
`.trim().replace(/\n/g, " ");

const result = await framer.agent.applyChanges(dsl, { pagePath });
console.log(JSON.stringify(result));

for (const id of ["xEORYedqg", "dCYCf8ZZp", "U84Rv97cL", "Vq1f2mEkj"]) {
  const n = await framer.agent.getNode({ id }, { pagePath });
  console.log(id, n?.attributes?.padding, n?.attributes?.fontSize, n?.attributes?.letterSpacing, n?.attributes?.lineHeight);
}
