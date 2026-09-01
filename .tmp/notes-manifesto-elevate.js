const pagePath = "/notes";

const dsl = `
SET vYHE4PmG6 layout="stack" stackDirection="vertical" stackAlignment="center" stackDistribution="start" gap="0px" padding="128px 0px 144px 0px" margin="96px 0px 0px 0px" width="1fr" height="auto" fill="rgb(21, 43, 30)" borderTop="1px" borderColor="rgba(252, 250, 244, 0.14)";
+FrameNode manifestoRow parent="vYHE4PmG6" position="0";
SET manifestoRow name="Manifesto Row" layout="stack" stackDirection="horizontal" stackAlignment="start" stackDistribution="start" gap="96px" width="1fr" maxWidth="1200px" height="auto";
+FrameNode manifestoAside parent="manifestoRow" position="0";
SET manifestoAside name="Manifesto Aside" layout="stack" stackDirection="vertical" stackAlignment="start" gap="28px" width="280px" minWidth="240px" height="auto" padding="12px 0px 0px 0px";
MOVE xp08ethBv parent="manifestoAside" position="0";
SET xp08ethBv text="[ EDITORIAL NOTE ]" textStylePreset="null" fontName="Space Mono" fontSize="11px" letterSpacing="0.14em" lineHeight="1.5em" textTransform="uppercase" textColor="rgba(242, 237, 231, 0.55)" tag="p" width="1fr" height="auto";
+RichTextNode manifestoCount parent="manifestoAside" position="1";
SET manifestoCount text="07 ENTRIES" textStylePreset="null" fontName="Space Mono" fontSize="11px" letterSpacing="0.14em" lineHeight="1.5em" textTransform="uppercase" textColor="rgb(132, 148, 95)" tag="p" width="1fr" height="auto";
+FrameNode manifestoThemes parent="manifestoAside" position="2";
SET manifestoThemes layout="stack" stackDirection="vertical" stackAlignment="start" gap="10px" width="1fr" height="auto" padding="8px 0px 0px 0px";
+RichTextNode manifestoTheme1 parent="manifestoThemes" position="0";
SET manifestoTheme1 text="FIELD NOTES" fontName="Space Mono" fontSize="11px" letterSpacing="0.12em" lineHeight="1.4em" textTransform="uppercase" textColor="rgba(242, 237, 231, 0.42)" tag="p" width="1fr" height="auto";
+RichTextNode manifestoTheme2 parent="manifestoThemes" position="1";
SET manifestoTheme2 text="NEIGHBOURHOODS" fontName="Space Mono" fontSize="11px" letterSpacing="0.12em" lineHeight="1.4em" textTransform="uppercase" textColor="rgba(242, 237, 231, 0.42)" tag="p" width="1fr" height="auto";
+RichTextNode manifestoTheme3 parent="manifestoThemes" position="2";
SET manifestoTheme3 text="BUYING" fontName="Space Mono" fontSize="11px" letterSpacing="0.12em" lineHeight="1.4em" textTransform="uppercase" textColor="rgba(242, 237, 231, 0.42)" tag="p" width="1fr" height="auto";
+FrameNode manifestoRule parent="manifestoAside" position="3";
SET manifestoRule layout="stack" width="48px" height="1px" fill="rgba(242, 237, 231, 0.28)" padding="0px" margin="8px 0px 0px 0px";
MOVE g6I2qFEQk parent="manifestoRow" position="1";
SET g6I2qFEQk name="Manifesto Copy" layout="stack" stackDirection="vertical" stackAlignment="start" gap="28px" width="1fr" maxWidth="none" height="auto" padding="0px";
SET UKwhh8hrl text="Property begins as a reading." fontName="Fraunces" fontStyle="normal" fontWeight="340" fontVariationAxes.wght="340" fontSize="72px" letterSpacing="-0.04em" lineHeight="0.98em" textColor="rgb(252, 250, 244)" textWrapBalance="true" tag="h2" width="1fr" height="auto" maxWidth="100%";
+RichTextNode manifestoDeck parent="g6I2qFEQk" position="1";
SET manifestoDeck text="Before a residence is listed, it is observed — in its light, its street, and the patience required to see clearly." textStylePreset="null" fontName="Fraunces" fontStyle="italic" fontWeight="300" fontVariationAxes.wght="300" fontSize="22px" letterSpacing="-0.03em" lineHeight="1.45em" textColor="rgba(242, 237, 231, 0.78)" maxWidth="620px" width="1fr" height="auto" tag="p";
MOVE kRwh9BL9R parent="g6I2qFEQk" position="2";
SET kRwh9BL9R text="Arbour Journal is not a feed. It is a slower record of place — field notes on architecture and ownership, walks through neighbourhoods we know by pavement, and the discipline of buying well." fontName="Inter" fontStyle="normal" fontWeight="400" fontSize="17px" letterSpacing="-0.02em" lineHeight="1.7em" textColor="rgba(242, 237, 231, 0.62)" maxWidth="520px" width="1fr" height="auto" tag="p";
+FrameNode manifestoDivider parent="g6I2qFEQk" position="3";
SET manifestoDivider layout="stack" width="1fr" height="1px" fill="rgba(242, 237, 231, 0.16)" padding="0px" margin="12px 0px 0px 0px";
MOVE wF9VwnUUR parent="g6I2qFEQk" position="4";
SET wF9VwnUUR padding="20px 0px 0px 0px" gap="8px" width="auto" height="auto" link.href="/about" cursor="pointer";
SET GPwHXXG2R text="THE ARBOUR STORY →" fontName="Space Mono" fontSize="11px" letterSpacing="0.14em" lineHeight="1.4em" textTransform="uppercase" textColor="rgb(180, 194, 140)" tag="p" width="auto" height="auto";
`.trim().replace(/\n/g, " ");

const result = await framer.agent.applyChanges(dsl, { pagePath });
console.log(JSON.stringify(result, null, 2));

const rowId = result.renamedIds?.manifestoRow ?? "manifestoRow";
const deckId = result.renamedIds?.manifestoDeck ?? "manifestoDeck";

const tablet = `
SET LptqEiXVpvYHE4PmG6 padding="104px 0px 120px 0px" margin="72px 0px 0px 0px";
SET LptqEiXVp${rowId} gap="64px" maxWidth="100%" width="1fr";
SET LptqEiXVpUKwhh8hrl fontSize="56px" lineHeight="1.02em";
SET LptqEiXVp${deckId} fontSize="20px" maxWidth="100%" width="1fr";
`.trim().replace(/\n/g, " ");

const phone = `
SET INUKgvAnavYHE4PmG6 padding="80px 0px 96px 0px" margin="56px 0px 0px 0px";
SET INUKgvAna${rowId} layout="stack" stackDirection="vertical" gap="40px" maxWidth="100%" width="1fr";
SET INUKgvAnaUKwhh8hrl fontSize="40px" lineHeight="1.04em" letterSpacing="-0.03em" width="1fr";
SET INUKgvAna${deckId} fontSize="18px" lineHeight="1.5em" maxWidth="100%" width="1fr";
SET INUKgvAnakRwh9BL9R fontSize="16px" lineHeight="1.65em" maxWidth="100%" width="1fr";
`.trim().replace(/\n/g, " ");

await framer.agent.applyChanges(tablet, { pagePath });
await framer.agent.applyChanges(phone, { pagePath });

const shot = await framer.agent.readProject(
  [{ type: "screenshot", id: "s8RpZIiJ8" }],
  { pagePath }
);
console.log("SHOT", shot.results[0].image_url);
