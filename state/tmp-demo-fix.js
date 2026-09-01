const pagePath = "/"

const r1 = await framer.agent.applyChanges(
    [
        `DEL MhE8QBvVD`,
        `+FrameNode pageNav parent="WQLkyLRf1" position="0"`,
        `SET pageNav name="Nav" layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" width="100%" height="auto" padding="28px 40px 28px 40px" position="absolute" top="0px" left="0px" right="0px" zIndex="3"`,
        `+RichTextNode navBrand parent="pageNav" position="0"`,
        `SET navBrand width="auto" height="auto" fontSize="13px" fontWeight="500" letterSpacing="0.28em" textColor="#B8954A" text="KERN"`,
        `+RichTextNode navMeta parent="pageNav" position="1"`,
        `SET navMeta width="auto" height="auto" fontSize="12px" letterSpacing="0.12em" textTransform="uppercase" textColor="rgba(243, 238, 228, 0.4)" text="Estimate"`,
    ].join("; ") + ";",
    { pagePath }
)

const navId = r1.renamedIds?.pageNav || "pageNav"
const brandId = r1.renamedIds?.navBrand || "navBrand"
const metaId = r1.renamedIds?.navMeta || "navMeta"

const r2 = await framer.agent.applyChanges(
    [
        `DEL gS6fuEYOC`,
        `+ComponentInstanceNode quoteInst parent="hvoU9CXen" position="0" component="codeFile/NRC55li:default"`,
        `SET quoteInst width="100%" height="auto" name="Kern QuoteIntake"`,
    ].join("; ") + ";",
    { pagePath }
)

const instId = r2.renamedIds?.quoteInst || "quoteInst"

const r3 = await framer.agent.applyChanges(
    [
        `SET m6PSt7imq left="1600px" top="0px" width="810px"`,
        `SET clHXwtN7l left="2520px" top="0px" width="390px"`,
        `SET m6PSt7imqhvoU9CXen padding="56px 0px 48px 0px"`,
        `SET clHXwtN7lhvoU9CXen padding="48px 0px 40px 0px"`,
        `SET m6PSt7imqfdVHCo4if padding="16px 28px 16px 28px"`,
        `SET clHXwtN7lfdVHCo4if padding="14px 20px 14px 20px"`,
    ].join("; ") + ";",
    { pagePath }
)

const nav = await framer.agent.serialize({ id: navId, depth: 4 }, { pagePath })
const inst = await framer.agent.serialize(
    { id: instId, depth: 1, attributeFilter: ["$control__narrative", "width", "name"] },
    { pagePath }
)

console.log(
    JSON.stringify(
        {
            r1Status: r1.status,
            r1Errors: r1.errors,
            r2Status: r2.status,
            r2Errors: r2.errors,
            r3,
            ids: { navId, brandId, metaId, instId },
            navText: JSON.stringify(nav).match(/"text":"[^"]+"/g),
            narrative: inst?.attributes?.$control__narrative,
        },
        null,
        2
    )
)
