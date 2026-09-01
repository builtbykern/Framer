const pagePath = "/"

const r = await framer.agent.applyChanges(
    [
        // Nav
        `+FrameNode pageNav parent="WQLkyLRf1" position="0"`,
        `SET pageNav name="Nav" layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" width="100%" height="auto" padding="28px 40px 28px 40px" position="absolute" top="0px" left="0px" right="0px" zIndex="3"`,
        `+RichTextNode navBrand parent="pageNav" position="0"`,
        `SET navBrand width="auto" height="auto" fontSize="13px" fontWeight="500" letterSpacing="0.28em" textColor="#B8954A" text="KERN"`,
        `+RichTextNode navMeta parent="pageNav" position="1"`,
        `SET navMeta width="auto" height="auto" fontSize="12px" letterSpacing="0.12em" textTransform="uppercase" textColor="rgba(243, 238, 228, 0.4)" text="Estimate"`,
        // Stage + instance
        `SET hvoU9CXen padding="64px 0px 56px 0px" zIndex="1" width="100%"`,
        `+ComponentInstanceNode quoteInst parent="hvoU9CXen" position="0" component="codeFile/NRC55li:default"`,
        `SET quoteInst width="100%" height="auto" name="Kern QuoteIntake"`,
        // Footer
        `+FrameNode pageFoot parent="WQLkyLRf1"`,
        `SET pageFoot name="Footer" layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" width="100%" height="auto" padding="20px 40px 20px 40px" position="absolute" bottom="0px" left="0px" right="0px" zIndex="3"`,
        `+RichTextNode footL parent="pageFoot" position="0"`,
        `SET footL width="auto" height="auto" fontSize="11px" letterSpacing="0.06em" textColor="rgba(243, 238, 228, 0.28)" text="Indicative only — not a binding quote"`,
        `+RichTextNode footR parent="pageFoot" position="1"`,
        `SET footR width="auto" height="auto" fontSize="11px" letterSpacing="0.08em" textColor="rgba(243, 238, 228, 0.28)" text="© 2026"`,
        // Breakpoint placement
        `SET m6PSt7imq left="1600px" top="0px" width="810px"`,
        `SET clHXwtN7l left="2520px" top="0px" width="390px"`,
    ].join("; ") + ";",
    { pagePath }
)

console.log(JSON.stringify(r, null, 2))

const desk = await framer.agent.serialize({ id: "WQLkyLRf1", depth: 3, attributeFilter: ["name", "text", "width", "component"] }, { pagePath })
const instId = r.renamedIds?.quoteInst
const inst = instId
    ? await framer.agent.serialize({ id: instId, depth: 1, attributeFilter: ["$control__narrative"] }, { pagePath })
    : null

console.log(
    "kids",
    JSON.stringify(
        (desk.children || []).map((c) => ({
            id: c.id,
            name: c.name,
            type: c.type,
            grand: (c.children || []).map((g) => ({ id: g.id, name: g.name, type: g.type, text: g.attributes?.text })),
        })),
        null,
        2
    )
)
console.log("narrative", inst?.attributes?.$control__narrative)
