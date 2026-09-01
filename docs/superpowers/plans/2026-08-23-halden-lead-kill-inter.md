# Halden Lead + Kill Inter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Lead text style (Syne 27) and map Work Inter copy to Body, without changing Work series titles.

**Architecture:** One new Framer text style. Bind existing canvas nodes via `applyChanges`. Masters only (404 `TvxbdlTzw`; Nav `AkMxCySBQ`, `sWU5I6bKH`, `Hc2be91vS`; Work Inter `Ty40f0R2F`, `qrIQI0oZQ`, `bN50dgn5u`, `wbokoK9Xt`). Replicas inherit.

**Tech Stack:** Framer Agent `createTextStyle` + `applyChanges`, Node assert via agent exec.

## Global Constraints

- No publish.
- No Syne on Work series titles this pass.
- No new families.

---

## Task 1: Lead style + bindings + Inter → Body

**Files:**
- Create: `.tmp/halden-lead-inter-type-test.cjs`

- [ ] Write failing assertions (Lead missing; Inter still on Work; Syne 27 unbound)
- [ ] Run RED
- [ ] Create Lead; SET bindings
- [ ] Run GREEN; do not publish
