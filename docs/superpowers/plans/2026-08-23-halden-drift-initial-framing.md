# Halden Drift Initial Framing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shift Drift’s first view downward by `min(frameHeight * 0.1, 96px)` so the lower third has more image presence without changing tile size, spacing, or interaction.

**Architecture:** Apply a pure viewport framing offset after toroidal wrap (in `tileScreenXY` and the canvas `freezeScatterCss` path) so relative slot geometry and periodic tile dimensions stay unchanged. Push the local `Drift_Plane.tsx` source into Framer via the existing apply script pattern.

**Tech Stack:** Framer code component (`Drift_Plane.tsx`), Node assert regression tests, `@framer/agent` apply.

## Global Constraints

- No publish.
- Preserve scale, spacing, depth, drag, idle drift, adaptive tile.
- No new property control.
- Offset formula fixed: `min(viewH * 0.1, 96)`.

---

## Task 1: Failing framing regression test

**Files:**
- Create: `.tmp/halden-drift-initial-framing-test.cjs`

- [ ] Write test asserting `initialFramingY` formula and that live + freeze paths apply the offset after wrap
- [ ] Run test and confirm RED
- [ ] Implement minimal helpers + `tileScreenXY` / `freezeScatterCss` changes
- [ ] Run test GREEN; re-run adaptive + responsive layout tests
- [ ] Apply `Drift_Plane.tsx` to Halden Framer project (no publish)
