const page = await framer.agent.applyChanges(
    [
        '+WebPageNode thumbPage name="Thumbnail" path="/thumbnail";',
        '+FrameNode thumbDesk parent="thumbPage" name="Desktop" width="1600px" height="1200px" fill="#060606" overflow="clip" layout="stack" stackDirection="vertical" stackDistribution="center" stackAlignment="center" padding="64px" gap="0px";',
    ].join("\n"),
    { pagePath: "/" }
)
console.log("page", JSON.stringify(page).slice(0, 1500))
