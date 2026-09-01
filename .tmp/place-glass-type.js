const result = await framer.agent.applyChanges(
    [
        'SET WQLkyLRf1 fill="#c4bfb6" layout="stack" stackDirection="vertical" stackDistribution="center" stackAlignment="center" gap="0px" padding="40px";',
        '+ComponentInstanceNode glassCard component="codeFile/JSNhsqh:default" parent="WQLkyLRf1";',
        'SET glassCard width="960px" height="444px" name="Glass Type";',
    ].join("\n"),
    { pagePath: "/" }
)
console.log(JSON.stringify(result, null, 2).slice(0, 4000))
