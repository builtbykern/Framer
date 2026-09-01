// Site-wide spacing coherence pass
// System: horizontal 48 · section vertical 120–128 · Enquiry CTA 120/48 · editorial gaps 24/32

const changes = [];

async function apply(pagePath, dsl, label) {
  const result = await framer.agent.applyChanges(dsl.trim().replace(/\n/g, " "), { pagePath });
  changes.push({ label, pagePath, status: result.status, errors: result.errors });
  console.log(label, result.status, result.errors?.length ? JSON.stringify(result.errors) : "ok");
}

// --- ABOUT ---
await apply(
  "/about",
  `
SET OIVgjc19d padding="120px 48px 120px 48px" gap="24px";
SET m1IuCE2Ht padding="128px 48px 128px 48px" gap="64px";
SET AiolEHPNd padding="128px 48px 128px 48px" gap="96px";
SET sx_GA8kBh padding="128px 48px 128px 48px" gap="72px";
`,
  "about"
);

// --- CONTACT ---
await apply(
  "/contact",
  `
SET vv0Vi0hbh padding="128px 48px 128px 48px" gap="0px";
SET AATw4pip9 padding="72px 48px 32px 48px" gap="32px";
`,
  "contact"
);

// --- NEIGHBOURHOODS ---
await apply(
  "/neighbourhoods",
  `
SET H1kR5JcFp padding="128px 48px 128px 48px" gap="64px" width="1fr" maxWidth="1200px";
`,
  "neighbourhoods"
);

// --- PROPERTIES DETAIL ---
await apply(
  "/properties-2/:Properties",
  `
SET Wy9_asNQu padding="120px 48px 120px 48px" gap="24px";
SET uZ8oOXu4y padding="120px 48px 120px 48px";
SET lP4ZL6y0c padding="0px 48px 120px 48px" gap="48px";
SET xikGIamdr padding="128px 0px 48px 0px" gap="0px";
`,
  "property-detail"
);

// --- NOTES ARTICLE: ensure header stack still coherent ---
await apply(
  "/notes/:Journal",
  `
SET TYvLnLN5L padding="128px 48px 0px 48px" maxWidth="1200px" width="1fr";
SET R_5Trg0eT padding="0px 0px 56px 0px" gap="24px";
SET rZDvGuaZD padding="48px 48px 0px 48px";
SET F88MmOdES padding="56px 48px 120px 48px" maxWidth="1200px" width="1fr";
SET cIncylbTv padding="120px 48px 120px 48px" gap="40px";
`,
  "notes-article"
);

// --- NOTES INDEX: lock current system ---
await apply(
  "/notes",
  `
SET wY1tfyIdc padding="128px 48px 0px 48px";
SET p7CGH_nWX padding="120px 48px 120px 48px";
SET tkmiXlLFw padding="0px 0px 120px 0px" gap="88px";
SET Vq1f2mEkj padding="0px 0px 56px 0px";
SET DvVH5Z6Ey padding="48px 0px 32px 0px";
`,
  "notes-index"
);

// --- PROPERTIES INDEX: Enquiry already 120; Market Context keep; align Stats if needed ---
// Market Context 80/16 is a thin bridge — leave. Grid already canonical.

console.log("\\nDONE", JSON.stringify(changes, null, 2));

// Verification sample
const verify = [
  ["/about", "OIVgjc19d"],
  ["/about", "m1IuCE2Ht"],
  ["/about", "AiolEHPNd"],
  ["/contact", "vv0Vi0hbh"],
  ["/neighbourhoods", "H1kR5JcFp"],
  ["/properties-2/:Properties", "Wy9_asNQu"],
  ["/properties-2/:Properties", "uZ8oOXu4y"],
  ["/properties-2/:Properties", "xikGIamdr"],
  ["/notes", "p7CGH_nWX"],
  ["/notes/:Journal", "cIncylbTv"],
];
for (const [pagePath, id] of verify) {
  const n = await framer.agent.getNode({ id }, { pagePath });
  console.log(pagePath, id, n?.attributes?.padding, "gap", n?.attributes?.gap);
}
