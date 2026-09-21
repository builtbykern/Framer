const info = await framer.getProjectInfo()
const applied = await framer.agent.applyChanges(
    [
        'SET augiA20Il metadata.title="Thinking Orbs" metadata.description="Idle orbs. Then still.";',
        'SET WQLkyLRf1 name="Desktop" fill="#E8E2D6" width="1440px" height="900px" layout="stack" stackDirection="vertical" stackDistribution="center" stackAlignment="center" overflow="clip";',
        '+ComponentInstanceNode ToOrbsI1 parent="WQLkyLRf1" component="codeFile/h5TRvQ9:default" name="Thinking Orbs" position="absolute" top="0px" left="0px" width="100%" height="100%";',
        '+FrameNode ToMeta01 parent="WQLkyLRf1" name="Meta" layout="stack" stackDirection="vertical" stackAlignment="start" gap="10px" position="absolute" left="48px" bottom="40px" width="auto" height="auto" zIndex="2";',
        '+RichTextNode ToEye01 parent="ToMeta01" name="Eyebrow" text="THINKING ORBS" fontName="Geist" fontWeight="500" fontSize="12px" letterSpacing="0.16em" lineHeight="1.2em" textColor="rgb(110, 104, 94)" width="auto" height="auto";',
        '+RichTextNode ToCap01 parent="ToMeta01" name="Caption" text="Idle, then still." fontName="Geist" fontWeight="500" fontSize="15px" letterSpacing="-0.01em" lineHeight="1.3em" textColor="rgb(62, 56, 48)" width="auto" height="auto";',
    ].join(" "),
    { pagePath: "/" }
)
console.log(JSON.stringify({ project: info.name, applied }, null, 2))
