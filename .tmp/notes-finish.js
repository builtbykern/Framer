// Finish /notes index + /notes/:Journal — responsive, related grid, polish

const cardBindings = `$control__layout="editorial" $control__image="var(--variable-UuvdpyCxL)" $control__category="var(--variable-Ht2pNTkTm)" $control__title="var(--variable-nheUxuW0y)" $control__date="var(--variable-rZBsxUFGd)" $control__excerpt="var(--variable-lIhfcSEN0)" $control__scale="card" $control__index="var(--variable-gVQCAVyS2)" $control__slug="var(--variable-Jd2WAsZn3)" $control__newTab="false" $control__title1="rgb(28, 27, 22)" $control__meta="rgba(28, 27, 22, 0.55)" $control__kicker="rgb(84, 98, 45)" cursor="pointer" width="1fr" height="auto"`;

// --- Article desktop polish ---
const articleDesktop = `
SET OiPBCB4m7 layout="grid" gridColumnCount="3" gridColumnMinWidth="240px" gap="40px" width="1fr" maxWidth="1200px" height="auto";
SET cIncylbTv layout="stack" stackDirection="vertical" stackAlignment="start" gap="48px" width="1fr" maxWidth="1200px" height="auto";
SET eOV768cPJ maxWidth="640px" width="1fr" tag="h2";
SET lNUCFBhko padding="56px 48px 80px 48px" maxWidth="720px" width="1fr";
SET rTmLLnGhQ layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" width="1fr" gap="16px";
SET R_5Trg0eT gap="20px";
SET t6rKgpguw borderBottom="0px" padding="0px 0px 16px 0px";
`.trim().replace(/\n/g, " ");

await framer.agent.applyChanges(articleDesktop, { pagePath: "/notes/:Journal" });

// --- Article tablet ---
const articleTablet = `
SET ZiTC3Ghmc fontSize="64px" lineHeight="1.02em";
SET TYvLnLN5L padding="96px 32px 0px 32px" maxWidth="100%" width="1fr";
SET R_5Trg0eT maxWidth="100%" width="1fr" padding="0px 0px 40px 0px";
SET QPghii7Fh maxWidth="100%" width="1fr";
SET rZDvGuaZD height="400px" maxWidth="100%" width="1fr" padding="24px 32px 0px 32px";
SET lNUCFBhko padding="40px 32px 64px 32px" maxWidth="100%" width="1fr";
SET cIncylbTv padding="80px 32px 96px 32px" maxWidth="100%" width="1fr";
SET OiPBCB4m7 gridColumnCount="2" gridColumnMinWidth="280px" gap="32px" maxWidth="100%" width="1fr";
`.trim().replace(/\n/g, " ");

await framer.agent.applyChanges(articleTablet, {
  pagePath: "/notes/:Journal",
  breakpointId: "gZUAlaJJ1",
});

// --- Article phone ---
const articlePhone = `
SET ZiTC3Ghmc fontSize="44px" letterSpacing="-0.02em" lineHeight="1.05em" width="1fr";
SET QPghii7Fh fontSize="18px" lineHeight="1.45em" maxWidth="100%" width="1fr";
SET TYvLnLN5L padding="88px 24px 0px 24px" maxWidth="100%" width="1fr";
SET R_5Trg0eT maxWidth="100%" width="1fr" padding="0px 0px 32px 0px" gap="16px";
SET rZDvGuaZD height="280px" maxWidth="100%" width="1fr" padding="16px 24px 0px 24px";
SET lNUCFBhko padding="32px 24px 64px 24px" maxWidth="100%" width="1fr";
SET cIncylbTv padding="64px 24px 80px 24px" maxWidth="100%" width="1fr" gap="32px";
SET OiPBCB4m7 layout="stack" stackDirection="vertical" gap="48px" width="1fr" maxWidth="100%" height="auto";
`.trim().replace(/\n/g, " ");

await framer.agent.applyChanges(articlePhone, {
  pagePath: "/notes/:Journal",
  breakpointId: "EavJve6uG",
});

// --- Notes index: add tablet + phone breakpoints ---
const addBreakpoints = `
CREATE_VARIANT notesTablet from="T4DtVCP3y";
SET notesTablet name="Tablet" width="810px";
CREATE_VARIANT notesPhone from="T4DtVCP3y";
SET notesPhone name="Phone" width="390px";
`.trim().replace(/\n/g, " ");

const bpResult = await framer.agent.applyChanges(addBreakpoints, {
  pagePath: "/notes",
});
console.log("breakpoints", JSON.stringify(bpResult));

const notesTabletId = bpResult.renamedIds?.notesTablet ?? "notesTablet";
const notesPhoneId = bpResult.renamedIds?.notesPhone ?? "notesPhone";
console.log("tablet id", notesTabletId, "phone id", notesPhoneId);

// --- Notes tablet ---
const notesTabletDsl = `
SET wY1tfyIdc padding="112px 32px 0px 32px" width="1fr";
SET xEORYedqg fontSize="72px";
SET dCYCf8ZZp maxWidth="100%" width="1fr";
SET tkmiXlLFw gap="64px" padding="0px 0px 96px 0px";
SET FV6VScRZS padding="48px 0px 0px 0px";
`.trim().replace(/\n/g, " ");

await framer.agent.applyChanges(notesTabletDsl, {
  pagePath: "/notes",
  breakpointId: notesTabletId,
});

// --- Notes phone ---
const notesPhoneDsl = `
SET wY1tfyIdc padding="88px 24px 0px 24px" width="1fr";
SET WvHvZenFI gap="20px" width="1fr";
SET xEORYedqg fontSize="56px" lineHeight="1.02em" width="1fr";
SET dCYCf8ZZp fontSize="18px" maxWidth="100%" width="1fr";
SET Vq1f2mEkj padding="0px 0px 40px 0px";
SET FV6VScRZS padding="32px 0px 0px 0px";
SET DvVH5Z6Ey padding="40px 0px 20px 0px";
SET tkmiXlLFw gap="48px" padding="0px 0px 80px 0px" width="1fr";
SET CQ4yjyjd6 layout="stack" stackDirection="vertical" gap="48px" width="1fr";
SET xXBNtWQZx layout="stack" stackDirection="vertical" gap="48px" width="1fr";
SET PsOvI9WEM layout="stack" stackDirection="vertical" gap="48px" width="1fr";
SET vpN9Iggce padding="0px" width="1fr";
SET H_B_4TceZ padding="0px" width="1fr";
SET bm1LjtVcB padding="0px" width="1fr";
`.trim().replace(/\n/g, " ");

await framer.agent.applyChanges(notesPhoneDsl, {
  pagePath: "/notes",
  breakpointId: notesPhoneId,
});

// Ensure featured + grid cards use lowercase layout values
const indexFix = `
SET l18JMxH_o $control__layout="featured" $control__scale="hero";
SET YnwtuglR2 $control__layout="editorial" $control__scale="card";
SET L8GOyfVuG $control__layout="editorial" $control__scale="card";
SET SO93hvT3J $control__layout="editorial" $control__scale="card";
SET HYXGZ3oG9 $control__layout="editorial" $control__scale="card";
SET JPtfyZLDE $control__layout="editorial" $control__scale="card";
SET rghwUbUzd $control__layout="editorial" $control__scale="card";
`.trim().replace(/\n/g, " ");

await framer.agent.applyChanges(indexFix, { pagePath: "/notes" });
await framer.agent.applyChanges(
  `SET eGBvqx2ap $control__layout="editorial" $control__scale="card"`,
  { pagePath: "/notes/:Journal" }
);

const shotIndex = await framer.agent.readProject(
  [{ type: "screenshot", id: "s8RpZIiJ8" }],
  { pagePath: "/notes" }
);
const shotArticle = await framer.agent.readProject(
  [{ type: "screenshot", id: "YPPO8pJ92" }],
  { pagePath: "/notes/:Journal" }
);
console.log("INDEX", shotIndex.results[0].image_url);
console.log("ARTICLE", shotArticle.results[0].image_url);

const page = await framer.agent.getNode({ id: "s8RpZIiJ8" });
console.log("notes breakpoints now", page?.$breakpoints?.map((b) => b.name + ":" + b.id));
