// Responsive spacing coherence — tablet/phone
// Canon (from Home):
//   Tablet: inset 40 · section 96
//   Phone:  inset 16 · section 64
// Home is LEFT UNTOUCHED (reference).

function set(prefix, id, attrs) {
  return `SET ${prefix}${id} ${attrs};`;
}

// ========== NOTES ==========
const notesTab = "LptqEiXVp";
const notesPhone = "INUKgvAna";
const notesDsl = [
  set(notesTab, "wY1tfyIdc", `padding="96px 40px 0px 40px"`),
  set(notesTab, "Vq1f2mEkj", `padding="0px 0px 48px 0px"`),
  set(notesTab, "DvVH5Z6Ey", `padding="40px 0px 28px 0px"`),
  set(notesTab, "tkmiXlLFw", `padding="0px 0px 96px 0px" gap="64px"`),
  set(notesTab, "p7CGH_nWX", `padding="96px 40px 96px 40px" gap="0px"`),
  set(notesTab, "DZBrgFJEu", `gap="64px"`),
  set(notesTab, "w_sfcNcLz", `gap="32px"`),
  set(notesPhone, "wY1tfyIdc", `padding="64px 16px 0px 16px"`),
  set(notesPhone, "Vq1f2mEkj", `padding="0px 0px 40px 0px"`),
  set(notesPhone, "WvHvZenFI", `gap="20px"`),
  set(notesPhone, "DvVH5Z6Ey", `padding="32px 0px 24px 0px"`),
  set(notesPhone, "tkmiXlLFw", `padding="0px 0px 64px 0px" gap="48px"`),
  set(notesPhone, "CQ4yjyjd6", `layout="stack" stackDirection="vertical" gap="48px"`),
  set(notesPhone, "xXBNtWQZx", `layout="stack" stackDirection="vertical" gap="48px"`),
  set(notesPhone, "PsOvI9WEM", `layout="stack" stackDirection="vertical" gap="48px"`),
  set(notesPhone, "vpN9Iggce", `padding="0px"`),
  set(notesPhone, "H_B_4TceZ", `padding="0px"`),
  set(notesPhone, "bm1LjtVcB", `padding="0px"`),
  set(notesPhone, "p7CGH_nWX", `padding="64px 16px 64px 16px"`),
  set(notesPhone, "DZBrgFJEu", `layout="stack" stackDirection="vertical" gap="32px"`),
  set(notesPhone, "w_sfcNcLz", `gap="24px" maxWidth="100%"`),
].join(" ");

await framer.agent.applyChanges(notesDsl, { pagePath: "/notes" });
console.log("notes ok");

// ========== NOTES ARTICLE ==========
const artTab = "gZUAlaJJ1";
const artPhone = "EavJve6uG";
const articleDsl = [
  set(artTab, "TYvLnLN5L", `padding="96px 40px 0px 40px"`),
  set(artTab, "R_5Trg0eT", `padding="0px 0px 48px 0px" gap="24px"`),
  set(artTab, "rZDvGuaZD", `padding="40px 40px 0px 40px"`),
  set(artTab, "F88MmOdES", `padding="48px 40px 96px 40px"`),
  set(artTab, "cIncylbTv", `padding="96px 40px 96px 40px" gap="32px"`),
  set(artPhone, "TYvLnLN5L", `padding="64px 16px 0px 16px"`),
  set(artPhone, "R_5Trg0eT", `padding="0px 0px 40px 0px" gap="20px"`),
  set(artPhone, "rZDvGuaZD", `padding="32px 16px 0px 16px"`),
  set(artPhone, "F88MmOdES", `padding="40px 16px 64px 16px"`),
  set(artPhone, "cIncylbTv", `padding="64px 16px 64px 16px" gap="28px"`),
].join(" ");

await framer.agent.applyChanges(articleDsl, { pagePath: "/notes/:Journal" });
console.log("article ok");

// ========== PROPERTIES INDEX ==========
const propTab = "SScKalu3B";
const propPhone = "EK6d5SyWL";
const propsDsl = [
  set(propTab, "L9uNRqah7", `padding="72px 40px 56px 40px" gap="24px"`),
  set(propTab, "Ox1AZj6Eq", `padding="32px 40px 32px 40px" gap="32px"`),
  set(propTab, "vqeLjQDAp", `padding="64px 40px 96px 40px" gap="64px"`),
  set(propTab, "APChY780b", `padding="96px 40px 96px 40px" gap="40px"`),
  set(propTab, "tYkbJMsxD", `padding="40px 40px 20px 40px"`),
  set(propTab, "pC9Un5Mw5", `padding="96px 40px 96px 40px" gap="48px"`),
  set(propTab, "ivqFzeVAZ", `padding="96px 40px 96px 40px" gap="32px"`),
  set(propTab, "cFtWJlabj", `padding="88px 40px 88px 40px" gap="24px"`),
  set(propPhone, "L9uNRqah7", `padding="64px 16px 40px 16px" gap="20px"`),
  set(propPhone, "Ox1AZj6Eq", `padding="32px 16px 32px 16px" gap="20px"`),
  set(propPhone, "vqeLjQDAp", `padding="48px 16px 64px 16px" gap="48px"`),
  set(propPhone, "APChY780b", `padding="64px 16px 64px 16px" gap="32px"`),
  set(propPhone, "tYkbJMsxD", `padding="32px 16px 16px 16px"`),
  set(propPhone, "pC9Un5Mw5", `padding="64px 16px 64px 16px" gap="40px"`),
  set(propPhone, "ivqFzeVAZ", `padding="64px 16px 64px 16px" gap="24px"`),
  set(propPhone, "cFtWJlabj", `padding="64px 16px 64px 16px" gap="20px"`),
].join(" ");

await framer.agent.applyChanges(propsDsl, { pagePath: "/properties-2" });
console.log("properties ok");

// ========== ABOUT ==========
const aboutTab = "xvqDXw58e";
const aboutPhone = "CYNrpU04t";
const aboutDsl = [
  set(aboutTab, "QjoW3yYRJ", `padding="96px 40px 40px 40px" gap="40px"`),
  set(aboutTab, "m1IuCE2Ht", `padding="96px 40px 96px 40px" gap="48px"`),
  set(aboutTab, "WZkTO3vdm", `padding="64px 40px 32px 40px" gap="32px"`),
  set(aboutTab, "AiolEHPNd", `padding="96px 40px 96px 40px" gap="64px"`),
  set(aboutTab, "sx_GA8kBh", `padding="96px 40px 96px 40px" gap="48px"`),
  set(aboutTab, "OIVgjc19d", `padding="88px 40px 88px 40px" gap="24px"`),
  set(aboutPhone, "QjoW3yYRJ", `padding="64px 16px 40px 16px" gap="32px"`),
  set(aboutPhone, "m1IuCE2Ht", `padding="64px 16px 64px 16px" gap="40px"`),
  set(aboutPhone, "WZkTO3vdm", `padding="48px 16px 32px 16px" gap="24px"`),
  set(aboutPhone, "AiolEHPNd", `padding="64px 16px 64px 16px" gap="48px"`),
  set(aboutPhone, "sx_GA8kBh", `padding="64px 16px 64px 16px" gap="40px"`),
  set(aboutPhone, "OIVgjc19d", `padding="64px 16px 64px 16px" gap="20px"`),
].join(" ");

await framer.agent.applyChanges(aboutDsl, { pagePath: "/about" });
console.log("about ok");

// ========== CONTACT ==========
const contactTab = "qjv2S9Wpa";
const contactPhone = "jEM0wBo2v";
const contactDsl = [
  set(contactTab, "AATw4pip9", `padding="56px 40px 32px 40px" gap="32px"`),
  set(contactTab, "vv0Vi0hbh", `padding="96px 40px 96px 40px"`),
  set(contactTab, "R3nS8tMqV", `padding="96px 40px 96px 40px" gap="40px"`),
  set(contactPhone, "AATw4pip9", `padding="48px 16px 24px 16px" gap="24px"`),
  set(contactPhone, "vv0Vi0hbh", `padding="64px 16px 64px 16px"`),
  set(contactPhone, "R3nS8tMqV", `padding="64px 16px 64px 16px" gap="32px"`),
].join(" ");

await framer.agent.applyChanges(contactDsl, { pagePath: "/contact" });
console.log("contact ok");

// ========== PROPERTY DETAIL ==========
const pdTab = "IQmBTrFpb";
const pdPhone = "MrTKJzwEL";
const pdDsl = [
  set(pdTab, "lP4ZL6y0c", `padding="0px 40px 96px 40px" gap="40px"`),
  set(pdTab, "xikGIamdr", `padding="96px 0px 40px 0px" gap="0px"`),
  set(pdTab, "uZ8oOXu4y", `padding="96px 40px 96px 40px"`),
  set(pdTab, "vlElPVCV7", `padding="96px 40px 96px 40px"`),
  set(pdTab, "OA3sHhDMv", `padding="96px 40px 96px 40px" gap="32px"`),
  set(pdTab, "Wy9_asNQu", `padding="88px 40px 88px 40px" gap="24px"`),
  set(pdPhone, "lP4ZL6y0c", `padding="0px 16px 64px 16px" gap="32px"`),
  set(pdPhone, "xikGIamdr", `padding="64px 0px 32px 0px" gap="16px"`),
  set(pdPhone, "uZ8oOXu4y", `padding="64px 16px 64px 16px"`),
  set(pdPhone, "vlElPVCV7", `padding="64px 16px 64px 16px"`),
  set(pdPhone, "OA3sHhDMv", `padding="64px 16px 64px 16px" gap="24px"`),
  set(pdPhone, "Wy9_asNQu", `padding="64px 16px 64px 16px" gap="20px"`),
].join(" ");

await framer.agent.applyChanges(pdDsl, { pagePath: "/properties-2/:Properties" });
console.log("property-detail ok");

// ========== NEIGHBOURHOODS — create breakpoints ==========
const nhCreate = await framer.agent.applyChanges(
  `CREATE_VARIANT nhTablet from="LmDrAnCZU"; SET nhTablet name="Tablet" width="810px"; CREATE_VARIANT nhPhone from="LmDrAnCZU"; SET nhPhone name="Phone" width="390px";`,
  { pagePath: "/neighbourhoods" }
);
console.log("nh breakpoints", JSON.stringify(nhCreate));
const nhTab = nhCreate.renamedIds?.nhTablet;
const nhPhone = nhCreate.renamedIds?.nhPhone;
if (nhTab && nhPhone) {
  await framer.agent.applyChanges(
    [
      set(nhTab, "H1kR5JcFp", `padding="96px 40px 96px 40px" gap="48px"`),
      set(nhPhone, "H1kR5JcFp", `padding="64px 16px 64px 16px" gap="40px"`),
    ].join(" "),
    { pagePath: "/neighbourhoods" }
  );
  console.log("neighbourhoods responsive ok", nhTab, nhPhone);
}

// ========== VERIFY ==========
const checks = [
  ["/notes", notesTab + "wY1tfyIdc"],
  ["/notes", notesPhone + "wY1tfyIdc"],
  ["/notes", notesTab + "p7CGH_nWX"],
  ["/notes", notesPhone + "p7CGH_nWX"],
  ["/properties-2", propTab + "Ox1AZj6Eq"],
  ["/properties-2", propPhone + "vqeLjQDAp"],
  ["/properties-2", propPhone + "cFtWJlabj"],
  ["/about", aboutTab + "m1IuCE2Ht"],
  ["/about", aboutPhone + "OIVgjc19d"],
  ["/contact", contactTab + "vv0Vi0hbh"],
  ["/contact", contactPhone + "vv0Vi0hbh"],
  ["/properties-2/:Properties", pdTab + "Wy9_asNQu"],
  ["/properties-2/:Properties", pdPhone + "uZ8oOXu4y"],
];
for (const [pagePath, id] of checks) {
  const n = await framer.agent.getNode({ id }, { pagePath });
  console.log(pagePath, id.slice(-12), n?.attributes?.padding || "MISSING");
}

const nhPage = await framer.agent.getNode({ id: "dZfxmFpqB" });
console.log("neighbourhoods bps", nhPage?.$breakpoints?.map(b => b.name + ":" + b.id));
