const r = await framer.agent.applyChanges(
    [
        '+FrameNode atmRoot parent="LpZFimpa4" position="0";',
        'SET atmRoot name="Atmosphere" position="absolute" top="0px" left="0px" right="0px" bottom="0px" width="1fr" height="1fr" overflow="clip" pointerEvents="none" zIndex="0";',
        '+ShaderNode atmShader parent="atmRoot" position="0" shader="liquid-gradient";',
        'SET atmShader name="Liquid" position="absolute" top="0px" left="0px" width="100%" height="100%" $control__colors.0="#060606" $control__colors.1="#0A1628" $control__colors.2="#0E2A3D" $control__colors.3="#6FD3FF" $control__colors.4="#1A2840" $control__seed="420" $control__speed="0.12" $control__ditherMode="2" $control__dither="0.08" $control__saturation="0.7" $control__exposure="0.9" $control__scale="0.5";',
        '+FrameNode atmVeil parent="atmRoot" position="1";',
        'SET atmVeil name="Veil" position="absolute" top="0px" left="0px" width="100%" height="100%" fill="rgba(6,6,6,0.72)" pointerEvents="none";',
        '+FrameNode atmBloomTR parent="atmRoot" position="2";',
        'SET atmBloomTR name="Bloom TR" position="absolute" top="-20%" right="-10%" width="70%" height="70%" radius="1000px" fill="radial-gradient(circle at 70% 30%, rgba(111,211,255,0.28) 0%, rgba(111,211,255,0) 70%)" pointerEvents="none";',
        '+FrameNode atmBloomBL parent="atmRoot" position="3";',
        'SET atmBloomBL name="Bloom BL" position="absolute" bottom="-25%" left="-15%" width="75%" height="75%" radius="1000px" fill="radial-gradient(circle at 30% 70%, rgba(111,211,255,0.18) 0%, rgba(111,211,255,0) 68%)" pointerEvents="none";',
        '+FrameNode atmVignette parent="atmRoot" position="4";',
        'SET atmVignette name="Vignette" position="absolute" top="0px" left="0px" width="100%" height="100%" fill="radial-gradient(circle at 50% 45%, rgba(6,6,6,0) 35%, rgba(6,6,6,0.75) 100%)" pointerEvents="none";',
        '+ShaderNode atmGrain parent="atmRoot" position="5" shader="pixels";',
        'SET atmGrain name="Grain" position="absolute" top="0px" left="0px" width="100%" height="100%" opacity="0.12" pointerEvents="none";',
    ].join("\n"),
    { pagePath: "/thumbnail" }
)
console.log("atmos", JSON.stringify(r).slice(0, 2000))
