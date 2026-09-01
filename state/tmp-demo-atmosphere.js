const pagePath = "/"

const result = await framer.agent.applyChanges(
    [
        // Atmosphere: full-bleed warm dark wash (kill teal SaaS glow)
        `SET VD3cBZNuk name="Atmosphere" width="100%" height="100%" top="0px" bottom="0px" left="0px" right="0px" centerAnchorX="null" centerAnchorY="null" constraintsLocked="false" position="absolute" zIndex="0" overflow="hidden" rotation="0deg"`,
        `SET Lcpgey0F7 visible="false"`,
        `SET QakJTwJAg width="100%" height="100%" top="0px" bottom="0px" left="0px" right="0px" centerAnchorX="null" centerAnchorY="null" constraintsLocked="false" position="absolute" zIndex="0" $control__colors='["#050504", "#14110C", "#8A6F35", "#0A0908"]' $control__waveSpeed="0.35" $control__waveFreqX="0.4" $control__waveFreqY="0.8" $control__waveAmplitude="1.2" $control__maskSoftness="1.1" $control__blendAmount="0.35" $control__waveAngle="120"`,
        `SET hvoU9CXen zIndex="1"`,
        // Page chrome — brand signal outside the form
        `+FrameNode pageNav parent="WQLkyLRf1" position="0"`,
        `SET pageNav name="Nav" layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" width="100%" height="auto" padding="28px 40px" position="absolute" top="0px" left="0px" right="0px" zIndex="3"`,
        `+RichTextNode navBrand parent="pageNav" position="0"`,
        `SET navBrand text="KERN" width="auto" height="auto" fontSize="13px" fontWeight="500" letterSpacing="0.28em" textColor="#B8954A"`,
        `+RichTextNode navMeta parent="pageNav" position="1"`,
        `SET navMeta text="Studio estimate" width="auto" height="auto" fontSize="12px" letterSpacing="0.12em" textTransform="uppercase" textColor="rgba(243, 238, 228, 0.4)"`,
        `+FrameNode pageFoot parent="WQLkyLRf1"`,
        `SET pageFoot name="Footer" layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" width="100%" height="auto" padding="20px 40px" position="absolute" bottom="0px" left="0px" right="0px" zIndex="3"`,
        `+RichTextNode footL parent="pageFoot" position="0"`,
        `SET footL text="Indicative only — not a binding quote" width="auto" height="auto" fontSize="11px" letterSpacing="0.06em" textColor="rgba(243, 238, 228, 0.28)"`,
        `+RichTextNode footR parent="pageFoot" position="1"`,
        `SET footR text="© 2026" width="auto" height="auto" fontSize="11px" letterSpacing="0.08em" textColor="rgba(243, 238, 228, 0.28)"`,
        // Soft enter
        `SET hvoU9CXen appearEffect.trigger="onMount" appearEffect.enter.opacity="0" appearEffect.enter.y="12" appearEffect.enter.transition="tween 0.7s 0s ease-out"`,
    ].join("; ") + ";",
    { pagePath }
)

console.log(JSON.stringify(result, null, 2))
