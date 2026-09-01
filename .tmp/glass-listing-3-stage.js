const r = await framer.agent.applyChanges(
    [
        '+FrameNode stageRoot parent="LpZFimpa4" index="1";',
        'SET stageRoot name="Stage" position="relative" layout="stack" stackDirection="vertical" stackDistribution="center" stackAlignment="center" gap="28px" width="auto" height="auto" zIndex="1";',
        '+RichTextNode eyeBrow parent="stageRoot" index="0" text="FRAMER MARKETPLACE" tag="p";',
        'SET eyeBrow name="Eyebrow" width="auto" height="auto" fontSize="11px" letterSpacing="0.22em" textColor="rgba(111, 211, 255, 0.7)" font="Inter" fontWeight="500";',
        '+ComponentInstanceNode glassCard parent="stageRoot" index="1" component="codeFile/c1HYdAH:default";',
        'SET glassCard name="Glass Type" width="960px" height="444px";',
        '+RichTextNode caption parent="stageRoot" index="2" text="The glass follows. Type does not." tag="p";',
        'SET caption name="Caption" width="auto" height="auto" fontSize="15px" letterSpacing="0.02em" textColor="rgba(244, 241, 234, 0.42)" font="Inter" fontWeight="400";',
    ].join("\n"),
    { pagePath: "/thumbnail" }
)
console.log("stage", JSON.stringify(r).slice(0, 2000))
