const polish = await framer.agent.applyChanges(
    `
SET Ktwi4KHu8Q6fE1RPzM gap="24px" padding="28px 16px 48px 24px";
SET yhVuy25KbQ6fE1RPzM gap="16px" padding="20px 12px 40px 16px";
SET IToHPhi5uke5hknFag padding="20px 24px 16px 24px";
SET asNiE4LlSke5hknFag padding="16px 16px 12px 16px";
SET HUNupzO9a gap="24px" padding="48px 40px 80px 40px";
SET Au0TUkArb padding="36px 24px 64px 24px" gap="20px";
SET Au0TUkArbnJ9U1XJB_ height="400px";
SET Au0TUkArbplPhECUuj height="280px";
SET zuBLQ4Tqr padding="24px 16px 64px 16px" gap="16px";
SET zuBLQ4TqrGtJY_uolR width="1fr";
SET zuBLQ4TqriWh5R5Mzq width="1fr";
SET zuBLQ4TqrnJ9U1XJB_ height="200px" width="1fr";
SET zuBLQ4TqrplPhECUuj height="140px" width="1fr";
SET nD9lSl2zo padding="56px 24px 80px 24px";
SET a1ACmQjfl padding="40px 16px 64px 16px";
SET a1ACmQjflHhWbke9rc width="1fr";
SET qQuiq1fWw padding="56px 24px 80px 24px";
SET jngco5TMl padding="40px 16px 64px 16px";
SET jngco5TMly2PAJKpgC width="1fr";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

const home = await framer.agent.serializeNodes(
    {
        ids: ["WQLkyLRf1", "Ktwi4KHu8", "yhVuy25Kb"],
        depth: 2,
        attributeFilter: ["name", "width", "collectionList", "$rect"],
    },
    { pagePath: "/" }
)

console.log(JSON.stringify({ polish, home }, null, 2).slice(0, 12000))
