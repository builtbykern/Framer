const pagePath = "/"
const desktopId = "WQLkyLRf1"

// Fresh ids — avoid stale session rename map (nav / RoOfpsBVb).
const dsl = [
  `SET ${desktopId} name="Desktop" fill="rgb(18, 18, 17)" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="0px" overflow="clip" width="1200px" height="auto"`,

  `+FrameNode demoNav parent="${desktopId}" position="0"`,
  `SET demoNav name="Nav" position="fixed" left="0px" right="0px" top="0px" width="100%" height="60px" zIndex="5" fill="rgb(18, 18, 17)" layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" padding="0px 40px" borderBottom="1px solid rgb(38, 38, 36)"`,
  `+RichTextNode demoBrand parent="demoNav" position="0"`,
  `SET demoBrand text="Scroll Blur" tag="p" fontName="Clash Grotesk" fontWeight="500" fontSize="15px" textColor="rgb(245, 245, 244)" width="auto" height="auto"`,
  `+FrameNode demoLinks parent="demoNav" position="1"`,
  `SET demoLinks layout="stack" stackDirection="horizontal" stackAlignment="center" gap="28px" width="auto" height="auto"`,
  `+RichTextNode demoWork parent="demoLinks" position="0"`,
  `SET demoWork text="Work" tag="p" fontName="Clash Grotesk" fontWeight="400" fontSize="13px" textColor="rgb(168, 162, 158)" width="auto" height="auto"`,
  `+RichTextNode demoStudio parent="demoLinks" position="1"`,
  `SET demoStudio text="Studio" tag="p" fontName="Clash Grotesk" fontWeight="400" fontSize="13px" textColor="rgb(168, 162, 158)" width="auto" height="auto"`,
  `+RichTextNode demoContact parent="demoLinks" position="2"`,
  `SET demoContact text="Contact" tag="p" fontName="Clash Grotesk" fontWeight="400" fontSize="13px" textColor="rgb(168, 162, 158)" width="auto" height="auto"`,

  // Keep blur pinned bottom under content
  `SET lpuQSsTX0 name="Scroll Blur" position="fixed" left="0px" right="0px" top="null" bottom="0px" width="100%" height="240px" zIndex="4"`,
].join("; ")

const result = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify(result, null, 2).slice(0, 2500))
