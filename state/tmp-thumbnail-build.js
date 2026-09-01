const pagePath = "/thumbnail"
const desktop = "zmLaYsG3H"

// Resize Desktop to Kern 4:3 thumb canvas
const setup = [
  `SET phWG_0d5v name="Thumbnail";`,
  `SET ${desktop} name="Desktop" width="1600px" height="1200px" fill="#060606" overflow="clip" layout="stack" stackDirection="vertical" stackDistribution="center" stackAlignment="center" padding="64px" gap="0px";`,
].join(" ")

let r = await framer.agent.applyChanges(setup, { pagePath })
console.log("setup", JSON.stringify(r))

// Atmosphere layer (absolute full bleed)
const atmos = [
  `+FrameNode atmRoot parent="${desktop}" position="0";`,
  `SET atmRoot name="Atmosphere" position="absolute" top="0px" left="0px" right="0px" bottom="0px" width="1fr" height="1fr" overflow="clip" pointerEvents="none" zIndex="0";`,
  `+ShaderNode atmShader parent="atmRoot" position="0" shader="liquid-gradient";`,
  `SET atmShader name="Liquid" position="absolute" top="0px" left="0px" width="100%" height="100%" $control__colors.0="#060606" $control__colors.1="#0A1628" $control__colors.2="#0E2A3D" $control__colors.3="#6FD3FF" $control__colors.4="#1A2840" $control__seed="420" $control__speed="0.12" $control__ditherMode="2" $control__dither="0.08" $control__saturation="0.7" $control__exposure="0.9" $control__scale="0.5";`,
  `+FrameNode atmVeil parent="atmRoot" position="1";`,
  `SET atmVeil name="Veil" position="absolute" top="0px" left="0px" width="100%" height="100%" fill="rgba(6,6,6,0.72)" pointerEvents="none";`,
  `+FrameNode atmBloomTR parent="atmRoot" position="2";`,
  `SET atmBloomTR name="Bloom TR" position="absolute" top="-20%" right="-10%" width="70%" height="70%" radius="1000px" fill="radial-gradient(circle at 70% 30%, rgba(111,211,255,0.28) 0%, rgba(111,211,255,0) 70%)" pointerEvents="none";`,
  `+FrameNode atmBloomBL parent="atmRoot" position="3";`,
  `SET atmBloomBL name="Bloom BL" position="absolute" bottom="-25%" left="-15%" width="75%" height="75%" radius="1000px" fill="radial-gradient(circle at 30% 70%, rgba(111,211,255,0.18) 0%, rgba(111,211,255,0) 68%)" pointerEvents="none";`,
  `+FrameNode atmVignette parent="atmRoot" position="4";`,
  `SET atmVignette name="Vignette" position="absolute" top="0px" left="0px" width="100%" height="100%" fill="radial-gradient(circle at 50% 45%, rgba(6,6,6,0) 35%, rgba(6,6,6,0.75) 100%)" pointerEvents="none";`,
].join(" ")

r = await framer.agent.applyChanges(atmos, { pagePath })
console.log("atmos", JSON.stringify(r))

// Stage: eyebrow + component + caption
const stage = [
  `+FrameNode stageRoot parent="${desktop}" position="1";`,
  `SET stageRoot name="Stage" position="relative" layout="stack" stackDirection="vertical" stackDistribution="center" stackAlignment="center" gap="24px" width="auto" height="auto" zIndex="1" padding="0px";`,
  `+RichTextNode eyeBrow parent="stageRoot" position="0";`,
  `SET eyeBrow name="Eyebrow" position="relative" width="auto" height="auto";`,
  `+ComponentInstanceNode gridInst parent="stageRoot" position="1" component="codeFile/oCePVFe:default";`,
  `SET gridInst name="Kern Inertia Grid" position="relative" width="720px" height="auto" $control__preset="repel" $control__amount="85";`,
  `+RichTextNode caption parent="stageRoot" position="2";`,
  `SET caption name="Caption" position="relative" width="auto" height="auto";`,
].join(" ")

r = await framer.agent.applyChanges(stage, { pagePath })
console.log("stage", JSON.stringify(r))
