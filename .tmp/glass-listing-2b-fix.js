const r = await framer.agent.applyChanges(
    [
        'SET vFt7jxgNq name="Atmosphere" position="absolute" top="0px" left="0px" right="0px" bottom="0px" overflow="clip" pointerEvents="none" zIndex="0";',
        'SET x7Brh3AOX name="Liquid" position="absolute" top="0px" left="0px" right="0px" bottom="0px";',
        'SET Qo6v2tx3a name="Veil" position="absolute" top="0px" left="0px" right="0px" bottom="0px" fill="rgba(6,6,6,0.72)" pointerEvents="none";',
        'SET jF6gKuSkI name="Bloom TR" position="absolute" top="-240px" right="-160px" width="1120px" height="840px" radius="1000px" fill="radial-gradient(circle at 70% 30%, rgba(111,211,255,0.28) 0%, rgba(111,211,255,0) 70%)" pointerEvents="none";',
        'SET zRBHsiXt5 name="Bloom BL" position="absolute" bottom="-300px" left="-240px" width="1200px" height="900px" radius="1000px" fill="radial-gradient(circle at 30% 70%, rgba(111,211,255,0.18) 0%, rgba(111,211,255,0) 68%)" pointerEvents="none";',
        'SET D9WKR3cuc name="Vignette" position="absolute" top="0px" left="0px" right="0px" bottom="0px" fill="radial-gradient(circle at 50% 45%, rgba(6,6,6,0) 35%, rgba(6,6,6,0.75) 100%)" pointerEvents="none";',
        'SET BNf3pbYg_ name="Grain" position="absolute" top="0px" left="0px" right="0px" bottom="0px" opacity="0.12" pointerEvents="none";',
    ].join("\n"),
    { pagePath: "/thumbnail" }
)
console.log("fix", JSON.stringify(r).slice(0, 2000))
