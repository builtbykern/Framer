const controls = await framer.agent.readComponentControls({
    componentIds: ["OdvHkNWXz", "IhgjBMpmC"],
})

const field = "var(--token-14d41f00-d3b3-4455-b994-8566aa84333e)"

const polish = await framer.agent.applyChanges(
    `
SET yAd2lMDSW stackDirection="horizontal" stackWrap="nowrap" stackAlignment="start";
SET t62LHpSTayAd2lMDSW stackDirection="vertical" stackWrap="nowrap" stackAlignment="start" width="1fr";
SET u75vHQkARyAd2lMDSW stackDirection="vertical" stackWrap="nowrap" stackAlignment="start" width="1fr";
SET O2btPltNw name="Edition Item";
SET t62LHpSTaO2btPltNw width="1fr";
SET u75vHQkARO2btPltNw width="1fr";
SET t62LHpSTaaIET_2yab width="1fr";
SET u75vHQkARaIET_2yab width="1fr";
SET OdvHkNWXz name="Edition Card";
SET aIET_2yab name="Edition Card";
SET i5CphXhmV text="No editions on the shelf.";
SET S4aeyJLQaebjghUxzc height="auto";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

console.log(JSON.stringify({ controls, polish }, null, 2))
