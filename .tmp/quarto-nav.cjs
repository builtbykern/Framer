await framer.agent.readProject(
    [{ type: "implementation-guide-from-index", name: "Navigations" }],
    { pagePath: "/" }
)

const field = "var(--token-14d41f00-d3b3-4455-b994-8566aa84333e)"
const mute = "var(--token-41c8b9ae-e604-40b6-9d37-a14c3803c179)"

const nav = await framer.agent.applyChanges(
    `
+ComponentNode cmpNav001 name="Nav";
+FrameNode navDesk01 parent="cmpNav001" name="Desktop" fill="${field}" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="0px" width="1fr" height="auto";
+FrameNode navRow001 parent="navDesk01" name="Row" layout="stack" stackDirection="horizontal" stackDistribution="space-between" stackAlignment="center" width="1fr" height="auto" padding="22px 36px 16px 36px";
+RichTextNode navMark01 parent="navRow001" name="Wordmark" text="Quarto" textStylePreset="Display" link.href="/" linkStylePreset="Nav Link" width="auto" height="auto";
+FrameNode navLinks1 parent="navRow001" name="Links" layout="stack" stackDirection="horizontal" stackDistribution="end" stackAlignment="center" gap="28px" width="auto" height="auto";
+RichTextNode navIdx001 parent="navLinks1" name="Index" text="Index" textStylePreset="Label" link.href="/" linkStylePreset="Nav Link" width="auto" height="auto";
+RichTextNode navImp001 parent="navLinks1" name="Imprint" text="Imprint" textStylePreset="Label" link.href="/info" linkStylePreset="Nav Link" width="auto" height="auto";
+RichTextNode navDeskL1 parent="navLinks1" name="Desk" text="Desk" textStylePreset="Label" link.href="/contact" linkStylePreset="Nav Link" width="auto" height="auto";
+FrameNode navRule01 parent="navDesk01" name="Rule" fill="${mute}" layout="null" width="1fr" height="1px";
CREATE_VARIANT navTab001 from="navDesk01";
SET navTab001 name="Tablet";
SET navTab001navRow001 padding="18px 24px 14px 24px";
CREATE_VARIANT navPhn001 from="navDesk01";
SET navPhn001 name="Phone";
SET navPhn001navRow001 padding="16px 16px 12px 16px";
SET navPhn001navLinks1 gap="18px";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

await framer.agent.readComponentControls({
    componentIds: [nav.renamedIds?.cmpNav001 || "cmpNav001"],
})

const navId = nav.renamedIds?.cmpNav001 || "cmpNav001"

const pages = await framer.agent.applyChanges(
    `
SET augiA20Il layoutTemplate="null";
SET FZFYEKdG1 layoutTemplate="null";
SET eT5aUzOXW layoutTemplate="null";
SET pTPGQ4L6O layoutTemplate="null";
SET GPILtKFJP layoutTemplate="null";
SET WQLkyLRf1 fill="${field}" layout="stack" stackDirection="vertical" stackDistribution="start" stackAlignment="center" gap="0px" overflow="clip" width="1440px" height="auto";
SET t62LHpSTa fill="${field}";
SET u75vHQkAR fill="${field}";
+ComponentInstanceNode navHome01 parent="WQLkyLRf1" index="0" component="${navId}" name="Nav" position="relative" width="1fr" height="auto";
+ComponentInstanceNode navWork01 parent="dKIZmzj_1" index="0" component="${navId}" name="Nav" position="relative" width="1fr" height="auto";
+ComponentInstanceNode navInfo01 parent="tVu2ncruf" index="0" component="${navId}" name="Nav" position="relative" width="1fr" height="auto";
+ComponentInstanceNode navCont01 parent="J1kd1wjJe" index="0" component="${navId}" name="Nav" position="relative" width="1fr" height="auto";
+ComponentInstanceNode nav404001 parent="pWw0UM2JG" index="0" component="${navId}" name="Nav" position="relative" width="1fr" height="auto";
SET dKIZmzj_1 fill="${field}" overflow="clip";
SET tVu2ncruf fill="${field}" overflow="clip";
SET J1kd1wjJe fill="${field}" overflow="clip";
SET pWw0UM2JG fill="${field}" overflow="clip";
SET odgkshwbV text="Imprint";
SET oSHXrizqB text="Quarto binds short runs: poetry, atlases, daybooks. The catalog is the shelf. Modules follow the trim: square, landscape, portrait, cluster.";
SET FnQbHIoGD text="Desk";
SET DZIMTQiKB text="For orders and rights, write to the desk. Proofs go out on Fridays.";
SET BU8_2gg2U text="Not bound";
SET axW_NfbLI text="That edition is not on the shelf. Return to the catalog." link.href="/";
SET omF0gODuR fill="${field}";
SET BZgqwOKfT fill="${field}";
SET GLlag6b9R fill="${field}";
SET S4aeyJLQa fill="${field}";
SET yAd2lMDSW padding="32px 28px 72px 36px";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

console.log(JSON.stringify({ nav, pages }, null, 2))
