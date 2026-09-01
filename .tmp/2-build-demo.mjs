const pagePath = "/"
const desktopId = "WQLkyLRf1"
const blurId = "lpuQSsTX0"

// Marketplace demo stage: nav chrome + one Scroll Blur + photo content beneath.
const dsl = [
  // Page shell
  `SET ${desktopId} name="Desktop" fill="rgb(250, 250, 249)" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="0px" overflow="clip" width="1200px" height="auto"`,

  // Fake nav — sticky chrome
  `+FrameNode nav parent="${desktopId}" position="0"`,
  `SET nav name="Nav" position="fixed" left="0px" right="0px" top="0px" width="100%" height="64px" zIndex="5" fill="rgb(250, 250, 249)" layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" padding="0px 32px"`,
  `+RichTextNode navBrand parent="nav" position="0"`,
  `SET navBrand text="Scroll Blur" width="auto" height="auto"`,
  `+FrameNode navLinks parent="nav" position="1"`,
  `SET navLinks layout="stack" stackDirection="horizontal" stackAlignment="center" gap="24px" width="auto" height="auto"`,
  `+RichTextNode navA parent="navLinks" position="0"`,
  `SET navA text="Work" width="auto" height="auto"`,
  `+RichTextNode navB parent="navLinks" position="1"`,
  `SET navB text="Studio" width="auto" height="auto"`,
  `+RichTextNode navC parent="navLinks" position="2"`,
  `SET navC text="Contact" width="auto" height="auto"`,

  // Existing Scroll Blur — top veil under nav (single instance)
  `SET ${blurId} name="Scroll Blur" position="fixed" left="0px" right="0px" top="64px" bottom="null" width="100%" height="140px" zIndex="4" $control__shape="soft" $control__position="top" $control__blur="12"`,

  // Scrollable content under the veil
  `+FrameNode content parent="${desktopId}" position="1"`,
  `SET content name="Content" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="24px" padding="88px 32px 120px 32px" width="1fr" height="auto"`,

  // Hero image
  `+FrameNode hero parent="content" position="0"`,
  `SET hero name="Hero" width="1fr" height="720px" radius="0px" overflow="clip" fill="https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg"`,

  // Photo grid
  `+FrameNode grid parent="content" position="1"`,
  `SET grid name="Gallery" layout="grid" gridAlignment="center" gridColumnCount="3" gridColumnMinWidth="200px" gridRowHeightType="fixed" gridRowHeight="280px" gap="16px" width="1fr" height="auto"`,
  `+FrameNode g1 parent="grid" position="0"`,
  `SET g1 width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg"`,
  `+FrameNode g2 parent="grid" position="1"`,
  `SET g2 width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg"`,
  `+FrameNode g3 parent="grid" position="2"`,
  `SET g3 width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg"`,
  `+FrameNode g4 parent="grid" position="3"`,
  `SET g4 width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg"`,
  `+FrameNode g5 parent="grid" position="4"`,
  `SET g5 width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg"`,
  `+FrameNode g6 parent="grid" position="5"`,
  `SET g6 width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg"`,

  // Mid band image for scroll length
  `+FrameNode mid parent="content" position="2"`,
  `SET mid name="Mid" width="1fr" height="560px" overflow="clip" fill="https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg"`,

  // Closing grid
  `+FrameNode grid2 parent="content" position="3"`,
  `SET grid2 name="Gallery 2" layout="grid" gridAlignment="center" gridColumnCount="2" gridColumnMinWidth="280px" gridRowHeightType="fixed" gridRowHeight="360px" gap="16px" width="1fr" height="auto"`,
  `+FrameNode g7 parent="grid2" position="0"`,
  `SET g7 width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg"`,
  `+FrameNode g8 parent="grid2" position="1"`,
  `SET g8 width="1fr" height="1fr" overflow="clip" fill="https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg"`,
].join("; ")

const result = await framer.agent.applyChanges(dsl, { pagePath })
console.log(JSON.stringify(result, null, 2).slice(0, 6000))
state.demoApplied = true
