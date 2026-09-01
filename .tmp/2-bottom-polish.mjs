const pagePath = "/"
const desktopId = "WQLkyLRf1"
const blurId = "lpuQSsTX0"
const contentId = "gs5goAnoX"

// Dark editorial stage: bottom Soft veil over full-bleed photography.
// Spacing rhythm: 12 / 24 / 48. One accent (stone text). No purple, no glow.
const dsl = [
  // Shell
  `SET ${desktopId} name="Desktop" fill="rgb(18, 18, 17)" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="0px" overflow="clip" width="1200px" height="auto"`,

  // Top chrome — quiet, fixed
  `+FrameNode nav parent="${desktopId}" position="0"`,
  `SET nav name="Nav" position="fixed" left="0px" right="0px" top="0px" width="100%" height="60px" zIndex="5" fill="rgb(18, 18, 17)" layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" padding="0px 40px" borderBottom="1px solid rgb(38, 38, 36)"`,
  `+RichTextNode navBrand parent="nav" position="0"`,
  `SET navBrand text="Scroll Blur" tag="p" font="Clash Grotesk" fontSize="15px" fontWeight="500" color="rgb(245, 245, 244)" width="auto" height="auto"`,
  `+FrameNode navLinks parent="nav" position="1"`,
  `SET navLinks layout="stack" stackDirection="horizontal" stackAlignment="center" gap="28px" width="auto" height="auto"`,
  `+RichTextNode navA parent="navLinks" position="0"`,
  `SET navA text="Work" tag="p" font="Clash Grotesk" fontSize="13px" fontWeight="400" color="rgb(168, 162, 158)" width="auto" height="auto"`,
  `+RichTextNode navB parent="navLinks" position="1"`,
  `SET navB text="Studio" tag="p" font="Clash Grotesk" fontSize="13px" fontWeight="400" color="rgb(168, 162, 158)" width="auto" height="auto"`,
  `+RichTextNode navC parent="navLinks" position="2"`,
  `SET navC text="Contact" tag="p" font="Clash Grotesk" fontSize="13px" fontWeight="400" color="rgb(168, 162, 158)" width="auto" height="auto"`,

  // Scroll Blur — bottom Soft veil
  `SET ${blurId} name="Scroll Blur" position="fixed" left="0px" right="0px" top="null" bottom="0px" width="100%" height="220px" zIndex="4" $control__shape="soft" $control__position="bottom" $control__blur="18"`,

  // Content — full-bleed photography under the veil
  `SET ${contentId} name="Content" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="12px" padding="60px 0px 48px 0px" width="1fr" height="auto"`,

  // Hero full bleed
  `SET IqkAsAQ8x name="Hero" width="1fr" height="820px" overflow="clip" radius="0px" fill="https://framerusercontent.com/images/HDUMcXuln281FyQNRgyuMOT7zhY.jpg"`,

  // Gallery 3 — tight editorial grid, inset
  `SET KABeTivYs name="Gallery" layout="grid" gridAlignment="center" gridColumnCount="3" gridColumnMinWidth="200px" gridRowHeightType="fixed" gridRowHeight="300px" gap="12px" width="1fr" height="auto" padding="0px 40px"`,
  `SET dGGpJGXKt width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/DS6z3TfvONE7UyJGwD5VFHpj7A0.jpg"`,
  `SET DOrgq4XwV width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/CPNGiVHiKfZ1cdFpCczUfZ8A.jpg"`,
  // Replace purple tile with warm stone/plant photo
  `SET jxJCbtg87 width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg"`,
  `SET cwuWibJKh width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg"`,
  `SET Bgck_SHmU width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg"`,
  `SET UhPyvszvO width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg"`,

  // Mid full bleed — feeds the bottom veil
  `SET YLwGf0zVk name="Mid" width="1fr" height="640px" overflow="clip" fill="https://framerusercontent.com/images/CPNGiVHiKfZ1cdFpCczUfZ8A.jpg"`,

  // Closing pair — sits in the Soft falloff
  `SET UofI3ufxO name="Gallery 2" layout="grid" gridAlignment="center" gridColumnCount="2" gridColumnMinWidth="280px" gridRowHeightType="fixed" gridRowHeight="420px" gap="12px" width="1fr" height="auto" padding="0px 40px"`,
  `SET jbQyaF5qX width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/HDUMcXuln281FyQNRgyuMOT7zhY.jpg"`,
  `SET y48hWlHKu width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/DS6z3TfvONE7UyJGwD5VFHpj7A0.jpg"`,
].join("; ")

const result = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify(result, null, 2).slice(0, 5000))
state.bottomDemo = true
