const info = await framer.getProjectInfo()
if (info.name !== "Fair Platform") throw new Error(info.name)

const commands = [
    'SET KVgGkkS4z textStylePreset="Body";',
    'SET ViBjWFaCI textStylePreset="Body";',
    'SET aqpa10Il4 textStylePreset="Body";',
    'SET KVgGkkS4z link.textColor="rgb(120, 120, 120)" link.hover.textColor="rgb(10, 10, 10)" link.current.textColor="rgb(10, 10, 10)";',
    'SET yZes1fNVs padding="28px 32px 22px 32px";',
    'SET orXs4NZw2 gap="16px";',
    'SET Nx5jccWgMyZes1fNVs padding="22px 22px 18px 22px";',
    'SET tKUMOkWpPyZes1fNVs padding="18px 16px 14px 16px";',
    'SET tVu2ncruf width="1440px";',
    'SET J1kd1wjJe width="1440px";',
    'SET pWw0UM2JG width="1440px";',
    'SET oSHXrizqB textStylePreset="Body" fontSize="14px";',
    'SET DZIMTQiKB textStylePreset="Body" fontSize="14px";',
    'SET axW_NfbLI link.href="/";',
]

const results = []
for (const cmd of commands) {
    const r = await framer.agent.applyChanges(cmd, { pagePath: "/" })
    results.push({
        cmd,
        message: r.message,
        errors: r.linter?.errors || r.errors,
        keys: Object.keys(r),
        raw: r,
    })
}

console.log(JSON.stringify(results, null, 2))
