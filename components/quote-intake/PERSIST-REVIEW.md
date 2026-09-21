# Quote Intake — persist-across-reload review

Read-only. No Marketplace open, no publish, no new metrics.

Live demo checked: https://consistent-growth-588490.framer.app (SSR default `$3,870 – $4,730` at 01 Intent; instance name `Kern QuoteIntake`).

## Where the source is

| Location | Status |
| --- | --- |
| `components/` on `main` | **Missing.** Only `components/filling-point/` is listed. |
| `state/QuoteIntake.tsx` | Recovered studio dump, not on `main`. Commit `cd2ae29` on `origin/cursor/cloud-agent-1788270029555-y5d35`. Export `Kern_QuoteIntake` **v3.24.0** (~1032 lines). |
| `state/QuoteIntake.tsx.bak` | Older expanded copy (~5335 lines), same state model. |
| `state/QuoteIntake.raw.txt` | Typecheck dump, not a persist path. |
| `Workshop/QuoteIntake.tsx` | Named as SoT in `design-plans/README-quoteintake-2026-07-20.md`; **not in this repo**. |

Live SSR copy, default range, and chrome match `DEFAULT_PROPS` in `state/QuoteIntake.tsx` (pages 5 × $500 + cms 2 × $300 + components 3 × $400 = $4,300 × 0.9–1.1).

## How state is held today

**React `useState` only.** No persist-across-reload path.

| Mechanism | Present? |
| --- | --- |
| `useState` (`step`, `form`, `submitted`, submit/error flags) | Yes |
| `localStorage` / `sessionStorage` / cookies | No |
| URL / query / hash | No |
| CMS | No (formula + copy are Framer property controls) |
| Webhook `fetch` POST | Submit only; does not restore |

Init: `step = 1`, `form = buildInitialForm(quantityFields, intentSeed)`. Refresh remounts defaults. Same-tab refresh and a new tab both reset because nothing is written outside the React tree. The published page’s only `localStorage` touch is Framer’s editor-bar flag, not wizard answers.

**Persist today: no.**

## Recommended fix (do not ship in this PR)

Keep it opt-in. Default **`PersistAnswers = false`**. Contact/email can land in `form`; Marketplace buyers should not store visitor PII unless they turn it on. The live demo can enable the prop if refresh-restore is wanted there.

Smallest Framer-safe patch against `Kern_QuoteIntake`:

1. Props: `persistAnswers: boolean` (default false) + `storageKey: string` (default `""` → `"default"`). Key: `kern-quote-intake:${storageKey}`. Do **not** use `useId()` (unstable across Framer SSR/hydrate).
2. Skip read/write on canvas, static renderer, and thumbnail.
3. `try/catch` around `localStorage` (private mode / iframe).
4. Persist `{ v: 1, step, form, submitted }`. Strip `email` / `note` unless a later prop explicitly allows PII.
5. Hydrate once on mount when `persistAnswers` is true; write on `step`/`form`/`submitted` changes.
6. **Clear** the key on successful submit (webhook `ok` **or** local summary) and on **Start over**. Leave the key on webhook failure so the brief is not lost.

No URL sync, no cookies, no CMS. Do not restore `state/QuoteIntake.tsx` onto `main` in the same change as persist (file is already over the old 1000-line budget).

### Patch sketch (not applied)

```ts
const STORAGE_PREFIX = "kern-quote-intake:"
const PII_KEYS = ["email", "note"] as const

function storageKeyFor(raw: string | undefined) {
    const id = (raw ?? "").trim() || "default"
    return STORAGE_PREFIX + id
}

function readPersisted(key: string): { step: number; form: FormData; submitted: boolean } | null {
    if (typeof window === "undefined") return null
    try {
        const raw = window.localStorage.getItem(key)
        if (!raw) return null
        const parsed = JSON.parse(raw) as { v?: number; step?: number; form?: FormData; submitted?: boolean }
        if (parsed?.v !== 1 || typeof parsed.step !== "number" || !parsed.form) return null
        const form = { ...parsed.form }
        for (const k of PII_KEYS) delete form[k]
        return { step: Math.min(4, Math.max(1, parsed.step)), form, submitted: Boolean(parsed.submitted) }
    } catch {
        return null
    }
}

function writePersisted(key: string, step: number, form: FormData, submitted: boolean) {
    if (typeof window === "undefined") return
    try {
        const safe = { ...form }
        for (const k of PII_KEYS) delete safe[k]
        window.localStorage.setItem(key, JSON.stringify({ v: 1, step, form: safe, submitted }))
    } catch {
        /* quota / denied */
    }
}

function clearPersisted(key: string) {
    if (typeof window === "undefined") return
    try {
        window.localStorage.removeItem(key)
    } catch {
        /* denied */
    }
}

addPropertyControls(Kern_QuoteIntake, {
    persistAnswers: {
        type: ControlType.Boolean,
        title: "Persist answers",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off",
        description: "Restore step and non-contact answers after refresh. Off by default.",
    },
    storageKey: {
        type: ControlType.String,
        title: "Storage key",
        defaultValue: "",
        placeholder: "instance-id",
        description: "localStorage suffix. Unique per instance if the page has more than one wizard.",
        hidden: (p) => !p.persistAnswers,
    },
})
```

Wire: hydrate into the existing `useState` initializers (or a mount `useEffect` that no-ops when `!persistAnswers || isOnCanvas || isStatic`); persist in an effect; call `clearPersisted` from the current `done()` submit path and `returnToStart`.
