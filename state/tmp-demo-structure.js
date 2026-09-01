const pagePath = "/"

const result = await framer.agent.applyChanges(
    [
        // Full-bleed demo stage — fix the 860px collapse that hid the rail
        `SET WQLkyLRf1 name="Desktop" fill="#050504" padding="0px" gap="0px" stackDirection="vertical" stackDistribution="start" stackAlignment="center" overflow="hidden" width="1440px" height="auto"`,
        `SET hvoU9CXen name="Stage" width="100%" height="auto" overflow="visible" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="0px"`,
        `SET RgnF7Pl9M width="100%" height="auto" rotation="0deg"`,
        // Force rail-friendly layout controls on the instance
        `SET RgnF7Pl9M $control__layout="{\\"borderRadius\\":{\\"type\\":\\"number\\",\\"value\\":0},\\"globalMaxWidth\\":{\\"type\\":\\"number\\",\\"value\\":1600},\\"contentMinWidth\\":{\\"type\\":\\"number\\",\\"value\\":0},\\"contentMaxWidth\\":{\\"type\\":\\"number\\",\\"value\\":720},\\"useRailLayout\\":{\\"type\\":\\"boolean\\",\\"value\\":true},\\"railWidth\\":{\\"type\\":\\"number\\",\\"value\\":560},\\"railGap\\":{\\"type\\":\\"number\\",\\"value\\":0},\\"collapseBreakpoint\\":{\\"type\\":\\"number\\",\\"value\\":900},\\"mobileBreakpoint\\":{\\"type\\":\\"number\\",\\"value\\":480},\\"tabletBreakpoint\\":{\\"type\\":\\"number\\",\\"value\\":810},\\"pagePaddingDesktop\\":{\\"type\\":\\"number\\",\\"value\\":0},\\"pagePaddingTablet\\":{\\"type\\":\\"number\\",\\"value\\":0},\\"pagePaddingMobile\\":{\\"type\\":\\"number\\",\\"value\\":16},\\"cardPaddingDesktop\\":{\\"type\\":\\"number\\",\\"value\\":56},\\"cardPaddingTablet\\":{\\"type\\":\\"number\\",\\"value\\":40},\\"cardPaddingMobile\\":{\\"type\\":\\"number\\",\\"value\\":0},\\"sectionGapDesktop\\":{\\"type\\":\\"number\\",\\"value\\":32},\\"sectionGapTablet\\":{\\"type\\":\\"number\\",\\"value\\":28},\\"sectionGapMobile\\":{\\"type\\":\\"number\\",\\"value\\":22},\\"fieldGapDesktop\\":{\\"type\\":\\"number\\",\\"value\\":16},\\"fieldGapTablet\\":{\\"type\\":\\"number\\",\\"value\\":14},\\"fieldGapMobile\\":{\\"type\\":\\"number\\",\\"value\\":12},\\"buttonHeightDesktop\\":{\\"type\\":\\"number\\",\\"value\\":56},\\"buttonHeightTablet\\":{\\"type\\":\\"number\\",\\"value\\":52},\\"buttonHeightMobile\\":{\\"type\\":\\"number\\",\\"value\\":52}}"`,
        `SET RgnF7Pl9M $control__narrative="{\\"productTitle\\":{\\"type\\":\\"string\\",\\"value\\":\\"Kern\\"},\\"supportingLine\\":{\\"type\\":\\"string\\",\\"value\\":\\"Studio estimate — indicative range in minutes\\"},\\"showStepList\\":{\\"type\\":\\"boolean\\",\\"value\\":true},\\"backButtonLabel\\":{\\"type\\":\\"string\\",\\"value\\":\\"Back\\"},\\"ariaLabel\\":{\\"type\\":\\"string\\",\\"value\\":\\"Kern project estimate\\"}}`,
    ].join("; ") + ";",
    { pagePath }
)

console.log(JSON.stringify(result, null, 2))
