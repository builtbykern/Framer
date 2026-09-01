const result = await framer.agent.applyChanges(
    [
        "DEL v3TEndmfH;",
        'SET WQLkyLRf1 fill="#060606" layout="stack" stackDirection="vertical" stackDistribution="center" stackAlignment="center" gap="28px" padding="72px 48px" height="1000px" minHeight="1000px";',
        '+RichTextNode kicker parent="WQLkyLRf1" name="Kicker" width="auto" height="auto";',
        '+TextBlock kickerP tag="p" parent="kicker";',
        '+TextRun kickerRun parent="kickerP" text="GLASS TYPE" fontSize="11px" letterSpacing="2.4px" fontWeight="500" textColor="rgba(255,255,255,0.4)";',
        '+ComponentInstanceNode glassCard component="codeFile/c1HYdAH:default" parent="WQLkyLRf1";',
        'SET glassCard width="960px" height="444px" name="Glass Type";',
    ].join("\n"),
    { pagePath: "/" }
)
console.log(JSON.stringify(result, null, 2).slice(0, 3000))
