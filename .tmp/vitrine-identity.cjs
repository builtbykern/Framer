const plaster = "rgb(238, 236, 231)"
const soot = "rgb(32, 31, 29)"
const mute = "rgb(118, 114, 108)"
const brass = "rgb(138, 112, 64)"

const styles = await framer.agent.applyChanges(
    `
SET 14d41f00-d3b3-4455-b994-8566aa84333e name="field" light="${plaster}";
SET 724c8003-5371-4e26-9bfa-187223cdcf10 name="ink" light="${soot}";
SET 41c8b9ae-e604-40b6-9d37-a14c3803c179 name="mute" light="${mute}";
SET 2c57476b-49eb-4f39-af60-d016daa88256 name="rule" light="${brass}";
SET dPXgkd9PP fontWeight="500" fontSize="26px" letterSpacing="-0.02em" lineHeight="1.08em" textTransform="none" textColor="${soot}";
SET nzsp03Fh5 fontWeight="500" fontSize="18px" letterSpacing="-0.015em" lineHeight="1.18em" textTransform="none" textColor="${soot}";
SET BEFvspdZd fontWeight="500" fontSize="11px" letterSpacing="0.08em" lineHeight="1.3em" textTransform="uppercase" textColor="${mute}";
SET t5y0e5eot fontWeight="400" fontSize="15px" letterSpacing="0em" lineHeight="1.5em" textColor="${soot}";
SET rootNode metadata.title="Vitrine" metadata.description="A workshop catalogue. Pieces in the order they left the bench.";
SET MmqIQ0wEw link.textColor="${soot}" link.hover.textColor="${brass}" link.current.textColor="${brass}";
SET QhfNwiny9 text="Vitrine";
SET ViBjWFaCI text="House" link.href="/info";
SET aqpa10Il4 text="Desk" link.href="/contact";
SET KVgGkkS4z text="Index" link.href="/";
SET odgkshwbV text="House";
SET oSHXrizqB text="Vitrine is a bench catalogue. Pieces sit in a row: date, name, note, object, still. The buyer edits the CMS. There is no cart.";
SET FnQbHIoGD text="Desk";
SET DZIMTQiKB text="For commissions and studio visits, write the desk." link.href="mailto:desk@vitrine.studio";
SET BU8_2gg2U text="Not on the bench";
SET axW_NfbLI text="That piece is not in the catalogue. Return to the index." link.href="/";
SET yAd2lMDSW overflow="auto" hideScrollbars="true" name="Piece List";
SET t62LHpSTayAd2lMDSW overflow="auto" hideScrollbars="true";
SET u75vHQkARyAd2lMDSW overflow="auto" hideScrollbars="true";
SET O2btPltNw name="Piece Item";
SET OdvHkNWXz name="Piece Card";
SET aIET_2yab name="Piece Card";
SET i5CphXhmV text="No pieces on the bench.";
SET eGJAoz6x_ fill="${mute}";
`.replace(/\n+/g, " "),
    { pagePath: "/" }
)

console.log(JSON.stringify(styles, null, 2))
