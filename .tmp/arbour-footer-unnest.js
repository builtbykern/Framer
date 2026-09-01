/**
 * Clear nested links on Footer wordmark RichText; keep frame-level link only.
 */
const dsl = [
  `SET fAzfyleWg link=null`,
  `SET AWGNXf96_fAzfyleWg link=null`,
  `SET IitvyCHtzfAzfyleWg link=null`,
].join(";\n")

const res = await framer.agent.applyChanges(dsl, { pagePath: "/" })

const foot = await framer.agent.serialize({ id: "pXUahiblU", depth: 10 }, {})
const check = []
function walk(n) {
  if (!n || typeof n !== "object") return
  if (
    ["ybimMi00F", "fAzfyleWg", "AWGNXf96_ybimMi00F", "IitvyCHtzybimMi00F", "AWGNXf96_fAzfyleWg", "IitvyCHtzfAzfyleWg"].includes(
      n.id
    ) ||
    n.name === "Arbour Introduction"
  ) {
    check.push({ id: n.id, name: n.name, href: n.attributes?.link?.href ?? null, cursor: n.attributes?.cursor ?? null })
  }
  for (const c of n.children || []) walk(c)
  for (const b of n.$breakpoints || []) walk(b)
}
walk(foot)

console.log(JSON.stringify({ res: { message: res?.message, nestedWarn: res?.linter?.warnings?.["Links cannot be nested. Remove the `link` from either the nested element or the enclosing linked element."] }, check }, null, 2))
