await framer.agent.readProject(
    [
        { type: "font-search", name: "Syne" },
        { type: "font-search", name: "IBM Plex Mono" },
        { type: "font-search", name: "Inter" },
    ],
    { pagePath: "/" }
)

const tokens = `
+ColorStyleTokenNode tPaper001 name="paper";
SET tPaper001 light="rgb(246, 243, 238)";
+ColorStyleTokenNode tInk00001 name="ink";
SET tInk00001 light="rgb(17, 17, 17)";
+ColorStyleTokenNode tMuted001 name="muted";
SET tMuted001 light="rgb(120, 116, 110)";
+TextStylePresetNode styDispla name="Display" tag="h1";
SET styDispla fontName="Syne" fontWeight="800" fontSize="22px" letterSpacing="0.14em" lineHeight="1.1em" textTransform="uppercase" textColor="rgb(17, 17, 17)";
+TextStylePresetNode styTitle1 name="Title" tag="h2";
SET styTitle1 fontName="Syne" fontWeight="700" fontSize="22px" letterSpacing="-0.03em" lineHeight="1.15em" textColor="rgb(17, 17, 17)";
+TextStylePresetNode styLabel1 name="Label";
SET styLabel1 fontName="IBM Plex Mono" fontWeight="400" fontSize="10px" letterSpacing="0.08em" lineHeight="1.3em" textTransform="uppercase" textColor="rgb(120, 116, 110)";
+TextStylePresetNode styBody01 name="Body";
SET styBody01 fontName="Inter" fontWeight="400" fontSize="13px" letterSpacing="0em" lineHeight="1.4em" textColor="rgb(17, 17, 17)";
+CollectionNode cWork0001 name="Work";
+Variable vTitle001 name="Title" type="string" scope="cWork0001" required="true";
+DateVariable vDate0001 name="Date" scope="cWork0001" displayTime="false" required="true";
+Variable vDek00001 name="Description" type="string" scope="cWork0001" required="true";
+Variable vCover001 name="Cover" type="image" scope="cWork0001" required="true";
+Variable vStill001 name="Still" type="image" scope="cWork0001" required="true";
+Variable vFeat0001 name="Featured" type="boolean" scope="cWork0001" initialValue="true";
+OptionVariable vMod00001 name="Module" scope="cWork0001" cases='["Square","Landscape","Portrait","Cluster"]' initialValue="Square";
+GalleryVariable vGal00001 name="Gallery" scope="cWork0001" maxCount="8";
SET WQLkyLRf1 name="Desktop" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="0px" width="1440px" height="auto" overflow="clip" padding="0px";
`.replace(/\n+/g, " ")

const r = await framer.agent.applyChanges(tokens, { pagePath: "/" })
const col = await framer.agent.serializeNodes({ ids: ["cWork0001"], depth: 0 })
const styles = await framer.agent.getNodesOfTypes({
    types: ["ColorStyleTokenNode", "TextStylePresetNode"],
})
console.log(
    JSON.stringify(
        {
            r,
            workId: col[0]?.id,
            vars: col[0]?.variables?.map((v) => ({
                id: v.id,
                key: v.key,
                name: v.name,
                type: v.type,
            })),
            styles: styles.map((s) => ({ id: s.id, name: s.name, type: s.type })),
        },
        null,
        2
    )
)
