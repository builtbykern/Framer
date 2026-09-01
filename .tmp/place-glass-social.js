const result = await framer.agent.applyChanges(
    [
        'SET WQLkyLRf1 fill="#c4bfb6";',
        '+ComponentInstanceNode glassCard component="codeFile/c1HYdAH:default" parent="WQLkyLRf1";',
        'SET glassCard width="960px" height="444px" left="120px" top="278px" name="Glass Type";',
    ].join("\n"),
    { pagePath: "/" }
)
console.log(JSON.stringify(result, null, 2).slice(0, 2500))
