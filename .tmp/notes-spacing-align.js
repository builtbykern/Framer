// Align /notes + /notes/:Journal spacing to Arbour site rhythm
// Reference: Properties (Market 120/48, grid 88/24/120) · Home sections 128/48 · About manifesto gap 96

const pagePath = "/notes";

const notesDsl = `
SET wY1tfyIdc padding="128px 48px 0px 48px" gap="0px" maxWidth="1200px" width="1fr";
SET Vq1f2mEkj padding="0px 0px 56px 0px" gap="0px" width="1fr";
SET WvHvZenFI layout="stack" stackDirection="vertical" gap="24px" width="1fr";
SET U84Rv97cL padding="32px 0px 0px 0px" width="1fr";
SET FV6VScRZS padding="0px" gap="0px" width="1fr";
SET DvVH5Z6Ey padding="48px 0px 32px 0px" layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="end" width="1fr";
SET tkmiXlLFw padding="0px 0px 120px 0px" gap="88px" width="1fr";
SET CQ4yjyjd6 gap="24px";
SET xXBNtWQZx gap="24px";
SET PsOvI9WEM gap="24px";
SET p7CGH_nWX padding="120px 48px 120px 48px" gap="0px" width="1fr" maxWidth="null";
SET DZBrgFJEu layout="stack" stackDirection="horizontal" stackAlignment="start" gap="96px" width="1fr" maxWidth="1200px";
SET Nt5U3O4oM padding="0px" gap="24px" width="280px";
SET aC1PQKkHw padding="4px 0px 0px 0px" gap="10px";
SET w_sfcNcLz gap="32px" width="1fr" maxWidth="720px";
SET RK5P7rAc9 padding="8px 0px 0px 0px" gap="8px";
`.trim().replace(/\n/g, " ");

const notesResult = await framer.agent.applyChanges(notesDsl, { pagePath });
console.log("notes", JSON.stringify(notesResult));

// Tablet / phone — keep horizontal 32/24 like other pages, section vertical scaled
const notesResponsive = `
SET LptqEiXVpwY1tfyIdc padding="112px 32px 0px 32px";
SET LptqEiXVpVq1f2mEkj padding="0px 0px 48px 0px";
SET LptqEiXVptkmiXlLFw padding="0px 0px 96px 0px" gap="64px";
SET LptqEiXVpp7CGH_nWX padding="96px 32px 96px 32px";
SET LptqEiXVpDZBrgFJEu gap="64px";
SET INUKgvAnawY1tfyIdc padding="88px 24px 0px 24px";
SET INUKgvAnaVq1f2mEkj padding="0px 0px 40px 0px";
SET INUKgvAnaWvHvZenFI gap="20px";
SET INUKgvAnaDvVH5Z6Ey padding="40px 0px 24px 0px";
SET INUKgvAnatkmiXlLFw padding="0px 0px 80px 0px" gap="48px";
SET INUKgvAnap7CGH_nWX padding="80px 24px 80px 24px";
SET INUKgvAnaDZBrgFJEu gap="40px";
SET INUKgvAnaw_sfcNcLz gap="24px" maxWidth="100%";
`.trim().replace(/\n/g, " ");

await framer.agent.applyChanges(notesResponsive, { pagePath });

const articlePath = "/notes/:Journal";
const articleDsl = `
SET TYvLnLN5L padding="128px 48px 0px 48px" gap="0px" maxWidth="1200px" width="1fr";
SET R_5Trg0eT padding="0px 0px 56px 0px" gap="24px" maxWidth="1200px" width="1fr";
SET rTmLLnGhQ layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" gap="16px" width="1fr";
SET rZDvGuaZD padding="48px 48px 0px 48px" maxWidth="1200px" width="1fr";
SET lNUCFBhko padding="56px 48px 120px 48px" maxWidth="720px" width="1fr";
SET cIncylbTv padding="120px 48px 120px 48px" gap="40px" maxWidth="1200px" width="1fr";
SET OiPBCB4m7 gap="40px" maxWidth="1200px" width="1fr";
SET gZUAlaJJ1TYvLnLN5L padding="96px 32px 0px 32px";
SET gZUAlaJJ1R_5Trg0eT padding="0px 0px 48px 0px";
SET gZUAlaJJ1rZDvGuaZD padding="40px 32px 0px 32px";
SET gZUAlaJJ1lNUCFBhko padding="48px 32px 96px 32px" maxWidth="100%";
SET gZUAlaJJ1cIncylbTv padding="96px 32px 96px 32px" gap="32px";
SET EavJve6uGTYvLnLN5L padding="88px 24px 0px 24px";
SET EavJve6uGR_5Trg0eT padding="0px 0px 40px 0px" gap="20px";
SET EavJve6uGrZDvGuaZD padding="32px 24px 0px 24px";
SET EavJve6uGlNUCFBhko padding="40px 24px 80px 24px" maxWidth="100%";
SET EavJve6uGcIncylbTv padding="80px 24px 80px 24px" gap="28px";
`.trim().replace(/\n/g, " ");

const articleResult = await framer.agent.applyChanges(articleDsl, { pagePath: articlePath });
console.log("article", JSON.stringify(articleResult));

// Verify key values
const checks = [
  ["wY1tfyIdc", pagePath],
  ["tkmiXlLFw", pagePath],
  ["p7CGH_nWX", pagePath],
  ["DZBrgFJEu", pagePath],
  ["Nt5U3O4oM", pagePath],
  ["w_sfcNcLz", pagePath],
  ["cIncylbTv", articlePath],
  ["lNUCFBhko", articlePath],
];
for (const [id, path] of checks) {
  const n = await framer.agent.getNode({ id }, { pagePath: path });
  console.log(id, n?.attributes?.padding || "-", n?.attributes?.gap || "-");
}

const shot = await framer.agent.readProject([{ type: "screenshot", id: "s8RpZIiJ8" }], { pagePath });
console.log("SHOT", shot.results[0].image_url);
