// BLOCK 1 — Hero rhythm & intentional whitespace (notes masthead only)
const pagePath = "/notes";

const dsl = `
SET Vq1f2mEkj padding="0px 0px 88px 0px" gap="0px" width="1fr" borderBottom="1px" borderColor="rgba(28, 27, 22, 0.12)";
SET WvHvZenFI layout="stack" stackDirection="vertical" stackAlignment="start" gap="0px" width="1fr";
SET sqsFVTzsL width="1fr" height="auto";
SET xEORYedqg width="1fr" height="auto" margin="20px 0px 0px 0px";
SET dCYCf8ZZp width="1fr" height="auto" maxWidth="560px" margin="28px 0px 0px 0px";
SET U84Rv97cL padding="40px 0px 0px 0px" margin="0px" width="1fr" gap="0px";
`.trim().replace(/\n/g, " ");

const result = await framer.agent.applyChanges(dsl, { pagePath });
console.log(JSON.stringify(result));
