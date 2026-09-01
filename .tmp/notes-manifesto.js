const pagePath = "/notes";

const dsl = `
SET UHp6ZaX9O visible="false";
+FrameNode journalManifesto parent="dLwPEOvi7" position="3";
SET journalManifesto name="Journal Manifesto" layout="stack" stackDirection="vertical" stackAlignment="start" stackDistribution="start" gap="32px" padding="96px 0px 120px 0px" margin="64px 0px 0px 0px" width="1fr" height="auto" fill="rgb(231, 223, 206)" borderTop="1px" borderColor="rgba(28, 27, 22, 0.12)";
+FrameNode manifestoCopy parent="journalManifesto" position="0";
SET manifestoCopy layout="stack" stackDirection="vertical" stackAlignment="start" gap="20px" width="1fr" maxWidth="720px" height="auto";
+RichTextNode manifestoKicker parent="manifestoCopy" position="0";
SET manifestoKicker text="( THE JOURNAL )" textStylePreset="Arbour/Meta" textColor="rgb(84, 98, 45)" tag="p" width="1fr" height="auto";
+RichTextNode manifestoTitle parent="manifestoCopy" position="1";
SET manifestoTitle text="We write to slow the search down." textStylePreset="null" fontName="Fraunces" fontStyle="normal" fontWeight="340" fontVariationAxes.wght="340" fontSize="48px" letterSpacing="-0.03em" lineHeight="1.08em" textColor="rgb(28, 27, 22)" textWrapBalance="true" tag="h2" width="1fr" height="auto";
+RichTextNode manifestoBody parent="manifestoCopy" position="2";
SET manifestoBody text="Arbour Journal gathers field notes, neighbourhood walks, and reflections on buying — the thinking behind the residences we represent, and the places they belong to." textStylePreset="null" fontName="Inter" fontStyle="normal" fontWeight="400" fontSize="18px" letterSpacing="-0.02em" lineHeight="1.65em" textColor="rgba(28, 27, 22, 0.72)" maxWidth="640px" width="1fr" height="auto" tag="p";
+FrameNode manifestoLink parent="journalManifesto" position="1";
SET manifestoLink layout="stack" stackDirection="horizontal" stackAlignment="center" gap="8px" width="auto" height="auto" padding="8px 0px 0px 0px" link.href="/about" cursor="pointer";
+RichTextNode manifestoLinkLabel parent="manifestoLink" position="0";
SET manifestoLinkLabel text="ABOUT ARBOUR →" fontName="Space Mono" fontStyle="normal" fontWeight="400" fontSize="11px" letterSpacing="0.12em" lineHeight="1.4em" textTransform="uppercase" textColor="rgb(84, 98, 45)" tag="p" width="auto" height="auto";
`.trim().replace(/\n/g, " ");

const result = await framer.agent.applyChanges(dsl, { pagePath });
console.log(JSON.stringify(result, null, 2));

const bandId = result.renamedIds?.journalManifesto ?? "journalManifesto";
const titleId = result.renamedIds?.manifestoTitle ?? "manifestoTitle";
const bodyId = result.renamedIds?.manifestoBody ?? "manifestoBody";

const responsive = `
SET ${bandId} padding="96px 0px 120px 0px" margin="64px 0px 0px 0px" gap="32px";
SET LptqEiXVp${bandId} padding="80px 0px 96px 0px" margin="56px 0px 0px 0px" gap="28px";
SET INUKgvAna${bandId} padding="64px 0px 80px 0px" margin="48px 0px 0px 0px" gap="24px";
SET LptqEiXVp${titleId} fontSize="40px" lineHeight="1.1em" width="1fr";
SET INUKgvAna${titleId} fontSize="36px" lineHeight="1.1em" width="1fr";
SET INUKgvAna${bodyId} fontSize="16px" lineHeight="1.6em" maxWidth="100%" width="1fr";
`.trim().replace(/\n/g, " ");

await framer.agent.applyChanges(responsive, { pagePath });

const shot = await framer.agent.readProject(
  [{ type: "screenshot", id: "s8RpZIiJ8" }],
  { pagePath }
);
console.log("SHOT", shot.results[0].image_url);
