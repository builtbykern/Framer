// BLOCK 4 — Hero responsive only (tablet/phone replicas)
const pagePath = "/notes";
const tab = "LptqEiXVp";
const phone = "INUKgvAna";

const dsl = [
  // Tablet
  `SET ${tab}Vq1f2mEkj padding="0px 0px 72px 0px"`,
  `SET ${tab}Rri3D3E4o gap="14px"`,
  `SET ${tab}xEORYedqg fontSize="72px" letterSpacing="-0.04em" lineHeight="0.98em"`,
  `SET ${tab}qh0dIy9Nx height="24px"`,
  `SET ${tab}dCYCf8ZZp fontSize="20px" maxWidth="100%" width="1fr"`,
  `SET ${tab}BdsuM6ZWh padding="28px 0px 0px 0px" gap="14px"`,
  // Phone
  `SET ${phone}Vq1f2mEkj padding="0px 0px 56px 0px"`,
  `SET ${phone}Rri3D3E4o gap="12px"`,
  `SET ${phone}xEORYedqg fontSize="56px" letterSpacing="-0.035em" lineHeight="1.02em" width="1fr"`,
  `SET ${phone}qh0dIy9Nx height="20px"`,
  `SET ${phone}dCYCf8ZZp fontSize="18px" lineHeight="1.5em" maxWidth="100%" width="1fr"`,
  `SET ${phone}BdsuM6ZWh padding="24px 0px 0px 0px" gap="12px"`,
].join("; ");

const result = await framer.agent.applyChanges(dsl, { pagePath });
console.log(JSON.stringify(result));

// Desktop sanity
for (const id of ["Vq1f2mEkj", "xEORYedqg", "dCYCf8ZZp"]) {
  const n = await framer.agent.getNode({ id }, { pagePath });
  console.log("D", id, n?.attributes?.padding || n?.attributes?.fontSize);
}
console.log("T title", (await framer.agent.getNode({ id: tab + "xEORYedqg" }, { pagePath }))?.attributes?.fontSize);
console.log("P title", (await framer.agent.getNode({ id: phone + "xEORYedqg" }, { pagePath }))?.attributes?.fontSize);
console.log("T mast", (await framer.agent.getNode({ id: tab + "Vq1f2mEkj" }, { pagePath }))?.attributes?.padding);
console.log("P mast", (await framer.agent.getNode({ id: phone + "Vq1f2mEkj" }, { pagePath }))?.attributes?.padding);
