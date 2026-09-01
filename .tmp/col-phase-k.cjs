const wrap = await framer.agent.applyChanges(
    `
+FrameNode wkShell01 parent="HUNupzO9a" name="Article" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="24px" padding="48px 40px 80px 40px" position="relative" width="1fr" height="auto";
MOVE O6bH0IUYw parent="wkShell01" index="0";
MOVE iWh5R5Mzq parent="wkShell01";
MOVE GtJY_uolR parent="wkShell01";
MOVE nJ9U1XJB_ parent="wkShell01";
MOVE plPhECUuj parent="wkShell01";
+FrameNode inShell01 parent="uSuSQYtM4" name="Article" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="20px" padding="80px 40px 120px 40px" position="relative" width="1fr" height="auto";
MOVE mvnANu_9T parent="inShell01" index="0";
MOVE HhWbke9rc parent="inShell01";
+FrameNode ctShell01 parent="cEK2oDAzz" name="Article" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="20px" padding="80px 40px 120px 40px" position="relative" width="1fr" height="auto";
MOVE eSQ8i3zcm parent="ctShell01" index="0";
MOVE y2PAJKpgC parent="ctShell01";
+FrameNode erShell01 parent="hh6O1ngaE" name="Article" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="start" gap="16px" padding="80px 40px" position="relative" width="1fr" height="auto";
MOVE jK2GepEuD parent="erShell01" index="0";
MOVE Lw1Xoa3ZM parent="erShell01";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

console.log(JSON.stringify({ wrap }, null, 2))
