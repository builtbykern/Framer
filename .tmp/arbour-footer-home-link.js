/**
 * Footer: link ARBOUR wordmark frame → /
 */
const dsl = [
  `SET ybimMi00F link.href="/" cursor="pointer"`,
  `SET AWGNXf96_ybimMi00F link.href="/" cursor="pointer"`,
  `SET IitvyCHtzybimMi00F link.href="/" cursor="pointer"`,
  // RichText wordmark if it accepts link independently
  `SET fAzfyleWg link.href="/"`,
  `SET AWGNXf96_fAzfyleWg link.href="/"`,
  `SET IitvyCHtzfAzfyleWg link.href="/"`,
].join(";\n")

const res = await framer.agent.applyChanges(dsl, { pagePath: "/" })

// Verify
const foot = await framer.agent.serialize({ id: "pXUahiblU", depth: 10 }, {})
const check = []
function walk(n) {
  if (!n || typeof n !== "object") return
  if (
    [
      "ybimMi00F",
      "fAzfyleWg",
      "AWGNXf96_ybimMi00F",
      "IitvyCHtzybimMi00F",
      "AWGNXf96_fAzfyleWg",
      "IitvyCHtzfAzfyleWg",
    ].includes(n.id) ||
    n.name === "Arbour Introduction"
  ) {
    check.push({
      id: n.id,
      name: n.name,
      href: n.attributes?.link?.href ?? null,
      cursor: n.attributes?.cursor ?? null,
    })
  }
  for (const c of n.children || []) walk(c)
  for (const b of n.$breakpoints || []) walk(b)
}
walk(foot)

console.log(JSON.stringify({ res, check }, null, 2))
