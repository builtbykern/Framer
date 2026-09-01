const grain = await framer.agent.applyChanges(
    'SET BNf3pbYg_ opacity="0.05";',
    { pagePath: "/thumbnail" }
)
console.log("grain", JSON.stringify(grain).slice(0, 400))

const home = await framer.agent.applyChanges(
    [
        'SET WQLkyLRf1 fill="#060606" padding="56px" gap="0px" stackDistribution="center" stackAlignment="center";',
        '+FrameNode homeAtm parent="WQLkyLRf1" index="0";',
        'SET homeAtm name="Atmosphere" position="absolute" top="0px" left="0px" right="0px" bottom="0px" overflow="clip" pointerEvents="none" zIndex="0";',
        '+ShaderNode homeLiquid parent="homeAtm" index="0" shader="liquid-gradient";',
        'SET homeLiquid name="Liquid" position="absolute" top="0px" left="0px" right="0px" bottom="0px" $control__colors.0="#060606" $control__colors.1="#0A1628" $control__colors.2="#0E2A3D" $control__colors.3="#6FD3FF" $control__colors.4="#1A2840" $control__seed="420" $control__speed="0.12" $control__ditherMode="2" $control__dither="0.08" $control__saturation="0.7" $control__exposure="0.9" $control__scale="0.5";',
        '+FrameNode homeVeil parent="homeAtm" index="1";',
        'SET homeVeil name="Veil" position="absolute" top="0px" left="0px" right="0px" bottom="0px" fill="rgba(6,6,6,0.72)" pointerEvents="none";',
        '+FrameNode homeBloomTR parent="homeAtm" index="2";',
        'SET homeBloomTR name="Bloom TR" position="absolute" top="-180px" right="-120px" width="840px" height="630px" radius="1000px" fill="radial-gradient(circle at 70% 30%, rgba(111,211,255,0.28) 0%, rgba(111,211,255,0) 70%)" pointerEvents="none";',
        '+FrameNode homeBloomBL parent="homeAtm" index="3";',
        'SET homeBloomBL name="Bloom BL" position="absolute" bottom="-220px" left="-180px" width="900px" height="680px" radius="1000px" fill="radial-gradient(circle at 30% 70%, rgba(111,211,255,0.18) 0%, rgba(111,211,255,0) 68%)" pointerEvents="none";',
        '+FrameNode homeVig parent="homeAtm" index="4";',
        'SET homeVig name="Vignette" position="absolute" top="0px" left="0px" right="0px" bottom="0px" fill="radial-gradient(circle at 50% 45%, rgba(6,6,6,0) 35%, rgba(6,6,6,0.75) 100%)" pointerEvents="none";',
        '+FrameNode homeStage parent="WQLkyLRf1" index="1";',
        'SET homeStage name="Stage" position="relative" layout="stack" stackDirection="vertical" stackDistribution="center" stackAlignment="center" gap="24px" width="auto" height="auto" zIndex="1";',
        '+RichTextNode homeEye parent="homeStage" index="0" text="FRAMER MARKETPLACE" tag="p";',
        'SET homeEye name="Eyebrow" width="auto" height="auto" fontSize="11px" letterSpacing="0.22em" textColor="rgba(111, 211, 255, 0.7)" font="Inter" fontWeight="500";',
        'MOVE qmDll42hM parent="homeStage" index="1";',
        '+RichTextNode homeCap parent="homeStage" index="2" text="The glass follows. Type does not." tag="p";',
        'SET homeCap name="Caption" width="auto" height="auto" fontSize="15px" letterSpacing="0.02em" textColor="rgba(244, 241, 234, 0.42)" font="Inter" fontWeight="400";',
    ].join("\n"),
    { pagePath: "/" }
)
console.log("home", JSON.stringify(home).slice(0, 2500))
