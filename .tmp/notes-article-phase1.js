const pagePath = "/notes/:Journal";

const cardBindings = `
$control__layout="editorial"
$control__image="var(--variable-UuvdpyCxL)"
$control__category="var(--variable-Ht2pNTkTm)"
$control__title="var(--variable-nheUxuW0y)"
$control__date="var(--variable-rZBsxUFGd)"
$control__excerpt="var(--variable-lIhfcSEN0)"
$control__scale="card"
$control__index="var(--variable-gVQCAVyS2)"
$control__newTab="false"
$control__title1="rgb(28, 27, 22)"
$control__meta="rgba(28, 27, 22, 0.55)"
$control__kicker="rgb(84, 98, 45)"
cursor="pointer"
width="1fr"
height="auto"
`.trim().replace(/\n/g, " ");

const dsl = `
SET HR7GLyyBT visible="false";
SET TYvLnLN5L maxWidth="1200px" width="1fr" padding="128px 48px 0px 48px" gap="0px";
SET R_5Trg0eT maxWidth="1200px" width="1fr" padding="0px 0px 48px 0px" gap="24px" borderBottom="1px" borderColor="rgba(28,27,22,0.12)";
SET v:bk4wPgyNv:0:0 text="← BACK TO JOURNAL";
SET rTmLLnGhQ layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" gap="16px" width="1fr" height="auto";
SET ZiTC3Ghmc textStylePreset="null" fontName="Fraunces" fontStyle="normal" fontWeight="340" fontVariationAxes.wght="340" fontSize="84px" letterSpacing="-0.03em" lineHeight="1em" textColor="rgb(28, 27, 22)" textWrapBalance="true" textAlignment="start" width="1fr" height="auto" tag="h1";
SET QPghii7Fh textStylePreset="null" fontName="Fraunces" fontStyle="italic" fontWeight="300" fontVariationAxes.wght="300" fontSize="21px" letterSpacing="-0.04em" lineHeight="1.4em" textColor="rgba(28, 27, 22, 0.65)" maxWidth="600px" width="1fr" height="auto" tag="h3";
SET rZDvGuaZD width="1fr" maxWidth="1200px" height="auto" layout="stack" overflow="clip" padding="48px 48px 0px 48px" position="relative" left="null" top="null" bottom="null" right="null";
SET lNUCFBhko maxWidth="680px" width="1fr" padding="48px 48px 80px 48px" position="relative" left="null" top="null" bottom="null" right="null";
SET cIncylbTv visible="true" fill="rgb(231, 223, 206)" gap="40px" padding="96px 48px 120px 48px" width="1fr" maxWidth="1200px";
SET xdJnss3VP textStylePreset="Arbour/Meta" textColor="rgb(84, 98, 45)" tag="p";
SET eOV768cPJ textStylePreset="Arbour/Subhead" textColor="rgb(28, 27, 22)" tag="h3" width="1fr";
SET OiPBCB4m7 layout="stack" stackDirection="vertical" gap="48px" width="1fr";
DEL x0E50sqPp;
+ComponentInstanceNode journalRelatedCard parent="OiPBCB4m7" position="0" component="codeFile/emg8ovC:default";
SET journalRelatedCard name="Related Note Card" ${cardBindings};
SET OiPBCB4m7 collectionList.collection="Journal" collectionList.repeatedDescendantId="journalRelatedCard" collectionList.limit="3" collectionList.sorting.0.variable="rZBsxUFGd" collectionList.sorting.0.direction="desc";
`.trim().replace(/\n/g, " ");

const result = await framer.agent.applyChanges(dsl, { pagePath });
console.log(JSON.stringify(result, null, 2));
const review = await framer.agent.reviewChanges();
console.log("errors", JSON.stringify(review.errors || {}, null, 2).slice(0, 500));
const shot = await framer.agent.readProject(
  [{ type: "screenshot", id: "YPPO8pJ92" }],
  { pagePath }
);
console.log("SHOT", shot.results[0].image_url);
