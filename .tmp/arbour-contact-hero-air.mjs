/**
 * Contact Hero: more top air, coherent with section L scale + fixed Nav.
 * Shell: L top (128/96/64), keep bottom S-ish, gutters 48/40/16
 * Hero Copy: zero top (air lives on shell) to avoid double stack; keep side/bottom.
 */
const NL = String.fromCharCode(10)

const lines = [
    // Shell
    `SET jmmPpci8t padding="128px 48px 64px 48px";`,
    `SET qjv2S9WpajmmPpci8t padding="96px 40px 48px 40px";`,
    `SET jEM0wBo2vjmmPpci8t padding="64px 16px 40px 16px";`,
    // Hero Copy — drop top pad (shell now owns clearance); keep horizontal + bottom
    `SET AATw4pip9 padding="0px 48px 32px 48px";`,
    `SET qjv2S9WpaAATw4pip9 padding="0px 40px 24px 40px";`,
    `SET jEM0wBo2vAATw4pip9 padding="0px 16px 40px 16px";`,
]

const result = await framer.agent.applyChanges(lines.join(NL), {})
return { lines, result }
