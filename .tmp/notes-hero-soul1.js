// SOUL BLOCK 1 — Rebuild hero as editorial two-column masthead
const pagePath = "/notes";

// Flatten current nested structure into a clear 2-col composition
const dsl = `
SET Vq1f2mEkj layout="stack" stackDirection="vertical" stackAlignment="start" gap="0px" padding="0px 0px 120px 0px" width="1fr" height="auto" fill="rgb(231, 223, 206)" borderBottom="1px" borderColor="rgba(28, 27, 22, 0.12)";
SET WvHvZenFI layout="stack" stackDirection="horizontal" stackAlignment="start" stackDistribution="start" gap="72px" width="1fr" height="auto" padding="48px 0px 0px 0px";
SET Rri3D3E4o name="Hero Aside" layout="stack" stackDirection="vertical" stackAlignment="start" gap="20px" width="220px" minWidth="200px" height="auto" padding="8px 0px 0px 0px";
SET sqsFVTzsL textStylePreset="null" fontName="Space Mono" fontStyle="normal" fontWeight="400" fontSize="11px" letterSpacing="0.14em" lineHeight="1.5em" textTransform="uppercase" textColor="rgb(84, 98, 45)" width="1fr" height="auto";
SET v:sqsFVTzsL:0:0 text="( JOURNAL )";
+RichTextNode heroAsideSub parent="Rri3D3E4o" position="1";
SET heroAsideSub text="NOTES FROM ARBOUR" fontName="Space Mono" fontSize="11px" letterSpacing="0.12em" lineHeight="1.5em" textTransform="uppercase" textColor="rgba(28, 27, 22, 0.45)" width="1fr" height="auto" tag="p";
MOVE QWVDJkcsP parent="Rri3D3E4o" position="2";
SET QWVDJkcsP width="32px" height="1px" fill="rgba(28, 27, 22, 0.28)";
MOVE U84Rv97cL parent="Rri3D3E4o" position="3";
SET U84Rv97cL padding="4px 0px 0px 0px" width="1fr";
SET t1K8NQ7z5 textStylePreset="null" fontName="Space Mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase" textColor="rgba(28, 27, 22, 0.55)" width="auto";
SET v:t1K8NQ7z5:0:0 text="[ 07 ENTRIES ]";
`.trim().replace(/\n/g, " ");

const result = await framer.agent.applyChanges(dsl, { pagePath });
console.log(JSON.stringify(result, null, 2));
