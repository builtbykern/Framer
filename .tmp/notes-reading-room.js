const pagePath = "/notes";

const cardBindings = [
  `$control__layout="compact"`,
  `$control__image="var(--variable-UuvdpyCxL)"`,
  `$control__category="var(--variable-Ht2pNTkTm)"`,
  `$control__title="var(--variable-nheUxuW0y)"`,
  `$control__date="var(--variable-rZBsxUFGd)"`,
  `$control__excerpt="var(--variable-lIhfcSEN0)"`,
  `$control__index="var(--variable-gVQCAVyS2)"`,
  `$control__slug="var(--variable-Jd2WAsZn3)"`,
  `$control__newTab="false"`,
  `$control__title1="rgb(28, 27, 22)"`,
  `$control__meta="rgba(28, 27, 22, 0.55)"`,
  `$control__kicker="rgb(84, 98, 45)"`,
  `cursor="pointer"`,
  `width="1fr"`,
  `height="auto"`,
].join(" ");

const dsl = `
SET UHp6ZaX9O visible="false";
SET tkmiXlLFw padding="0px 0px 0px 0px";
+FrameNode notesReadingRoom parent="dLwPEOvi7" position="3";
SET notesReadingRoom name="Notes Reading Room" layout="stack" stackDirection="vertical" stackAlignment="start" stackDistribution="start" gap="48px" padding="96px 0px 120px 0px" margin="64px 0px 0px 0px" width="1fr" height="auto" fill="rgb(231, 223, 206)" borderTop="1px" borderColor="rgba(28, 27, 22, 0.12)";
+FrameNode readingRoomHeader parent="notesReadingRoom" position="0";
SET readingRoomHeader layout="stack" stackDirection="vertical" stackAlignment="start" gap="16px" width="1fr" maxWidth="720px" height="auto";
+RichTextNode readingKicker parent="readingRoomHeader" position="0";
SET readingKicker text="( READING ROOM )" textStylePreset="Arbour/Meta" textColor="rgb(84, 98, 45)" tag="p" width="1fr" height="auto";
+RichTextNode readingTitle parent="readingRoomHeader" position="1";
SET readingTitle text="Every entry, in order." textStylePreset="null" fontName="Fraunces" fontStyle="normal" fontWeight="340" fontVariationAxes.wght="340" fontSize="48px" letterSpacing="-0.03em" lineHeight="1.08em" textColor="rgb(28, 27, 22)" textWrapBalance="true" tag="h2" width="1fr" height="auto";
+RichTextNode readingDeck parent="readingRoomHeader" position="2";
SET readingDeck text="A compact index of field notes, neighbourhood walks, and buying reflections from across the journal." textStylePreset="null" fontName="Fraunces" fontStyle="italic" fontWeight="300" fontVariationAxes.wght="300" fontSize="18px" letterSpacing="-0.02em" lineHeight="1.5em" textColor="rgba(28, 27, 22, 0.65)" maxWidth="600px" width="1fr" height="auto" tag="p";
+FrameNode themesRow parent="notesReadingRoom" position="1";
SET themesRow layout="stack" stackDirection="horizontal" stackDistribution="start" stackAlignment="center" stackWrapEnabled="true" gap="32px" padding="0px 0px 24px 0px" width="1fr" height="auto" borderBottom="1px" borderColor="rgba(28, 27, 22, 0.12)";
+RichTextNode themeField parent="themesRow" position="0";
SET themeField text="FIELD NOTES — 02" fontName="Space Mono" fontStyle="normal" fontWeight="400" fontSize="11px" letterSpacing="0.12em" lineHeight="1.4em" textTransform="uppercase" textColor="rgb(84, 98, 45)" tag="p" width="auto" height="auto";
+RichTextNode themeHood parent="themesRow" position="1";
SET themeHood text="NEIGHBOURHOODS — 03" fontName="Space Mono" fontStyle="normal" fontWeight="400" fontSize="11px" letterSpacing="0.12em" lineHeight="1.4em" textTransform="uppercase" textColor="rgb(84, 98, 45)" tag="p" width="auto" height="auto";
+RichTextNode themeBuying parent="themesRow" position="2";
SET themeBuying text="BUYING — 02" fontName="Space Mono" fontStyle="normal" fontWeight="400" fontSize="11px" letterSpacing="0.12em" lineHeight="1.4em" textTransform="uppercase" textColor="rgb(84, 98, 45)" tag="p" width="auto" height="auto";
+FrameNode compactIndexList parent="notesReadingRoom" position="2";
SET compactIndexList layout="stack" stackDirection="vertical" stackAlignment="start" gap="0px" width="1fr" height="auto";
+ComponentInstanceNode compactIndexCard parent="compactIndexList" position="0" component="codeFile/emg8ovC:default";
SET compactIndexCard name="Compact Index Card" ${cardBindings};
SET compactIndexList collectionList.collection="Journal" collectionList.repeatedDescendantId="compactIndexCard" collectionList.limit="7" collectionList.sorting.0.variable="rZBsxUFGd" collectionList.sorting.0.direction="desc";
`.trim().replace(/\n/g, " ");

const result = await framer.agent.applyChanges(dsl, { pagePath });
console.log(JSON.stringify(result, null, 2));

const roomId = result.renamedIds?.notesReadingRoom ?? "notesReadingRoom";
const tabletId = "LptqEiXVp";
const phoneId = "INUKgvAna";

const responsive = `
SET ${roomId} padding="80px 0px 96px 0px" margin="48px 0px 0px 0px" gap="40px";
SET ${tabletId}${roomId} padding="72px 0px 88px 0px" margin="48px 0px 0px 0px" gap="36px";
SET ${phoneId}${roomId} padding="64px 0px 80px 0px" margin="40px 0px 0px 0px" gap="32px";
SET ${phoneId}readingTitle fontSize="36px" lineHeight="1.1em";
SET ${phoneId}readingDeck fontSize="16px" maxWidth="100%" width="1fr";
SET ${phoneId}themesRow layout="stack" stackDirection="vertical" stackAlignment="start" gap="12px" padding="0px 0px 20px 0px";
`.trim().replace(/\n/g, " ");

await framer.agent.applyChanges(responsive, { pagePath });

const shot = await framer.agent.readProject(
  [{ type: "screenshot", id: "s8RpZIiJ8" }],
  { pagePath }
);
console.log("SHOT", shot.results[0].image_url);
