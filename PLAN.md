# Plan: Build a Shared Manim-Like Svelte/SVG Library + Playwright Test Strategy

## Goal

Create a reusable library in `src/lib` that lets multiple Svelte 5 apps replicate Manim-style animation behavior and visual language, while keeping each app small and focused.

Primary outcomes:

- Reusable animation/runtime primitives
- Reusable SVG render components
- Reusable Manim-like theme CSS
- Deterministic, automated verification with Playwright

## Principles

- Data-driven scenes (state + timeline) instead of ad hoc component logic
- Deterministic animation for testability
- Explicit phases (`preview`, `search`, etc.) like the Manim source
- Shared style tokens with app-level overrides
- Visual parity checks for critical scenes

## Target Architecture

```text
src/
  lib/
    core/
      types.ts
      timeline.ts
      scene.ts
      transitions.ts
      scheduler.ts
    renderers/
      svg/
        SceneRoot.svelte
        RectNode.svelte
        TextNode.svelte
        GroupNode.svelte
        MatrixTable.svelte
        BoardGrid.svelte
    dlx/
      model.ts
      exactCover.ts
      phases.ts
      fixtures/
        twoByTwo.ts
        threeByTwoThreeTiles.ts
    theme/
      tokens.css
      base.css
      manim-dark.css
    index.ts
```

Per-app usage pattern:

- App imports model + renderer components from `src/lib`
- App imports one shared theme CSS file
- App only defines scene-specific data + control wiring

## User-Facing API Spec (Manim-Like)

Goal: let users author scenes with names and flow similar to Python Manim while executing on Svelte/SVG internals.

### Facade module

Add a compatibility entrypoint:

- `src/lib/manim.ts`

This file exports the user-facing API:

- scene objects: `Scene`, `Rect`, `Text`, `VGroup`
- animation commands: `Create`, `FadeIn`, `Transform`
- scene controls: `play(...)`, `wait(...)`
- transform/layout methods: `scale(...)`, `toEdge(...)`, `nextTo(...)`

### Internal mapping

- `Rect`, `Text`, `VGroup` map to shared scene-node model in `src/lib/core/scene.ts`
- `Create`, `FadeIn`, `Transform` map to transition descriptors in `src/lib/core/transitions.ts`
- `play(...)` compiles commands into timeline segments in `src/lib/core/timeline.ts`
- Svelte components in `src/lib/renderers/svg` only render compiled scene state

### API behavior rules

- Chainable object transforms should be supported (`rect.scale(0.8).toEdge('LEFT')`)
- `play(...)` accepts one or many animations with optional runtime options
- Timeline behavior is deterministic in test mode
- Naming should prefer Manim-compatible terms unless there is a strong web-specific reason

### Known compatibility differences

Document and keep explicit:

- coordinate system and units
- text measurement/layout differences between browser and Manim
- exact easing/timing differences when parity is approximate

### Acceptance criteria

- A simple example scene can be written in a Manim-like style without touching renderer internals
- The same scene runs with shared SVG components and shared theme CSS
- Playwright behavior tests validate `play`, `wait`, step progression, and object transform chaining
- Snapshot tests confirm visual stability for representative Manim-like scenes

## Work Phases

## 1) Extract the Shared Theme

Tasks:

- Move current styling into `src/lib/theme/tokens.css`, `base.css`, `manim-dark.css`
- Replace hardcoded colors/fonts with CSS variables
- Keep app stylesheet minimal (layout-only)

Deliverable:

- `2x2table` visually unchanged but theme comes from `src/lib/theme/*`

Acceptance:

- No visual regression in matrix/table baseline

## 2) Extract DLX Data Model

Tasks:

- Create typed columns/rows/steps in `src/lib/dlx/model.ts`
- Implement matrix helpers (`hasOne`, active columns, active cells)
- Move current `2x2` fixtures into `src/lib/dlx/fixtures/twoByTwo.ts`

Deliverable:

- `App.svelte` contains only bindings and controls; model logic is shared

Acceptance:

- Behavior equivalent to current preview sequence

## 3) Build Core Timeline Runtime

Tasks:

- Add deterministic timeline controller (`play`, `pause`, `next`, `prev`, `reset`, `setSpeed`)
- Add test-friendly mode: fixed tick duration + manual clock hooks
- Add phase support (`preview`, `search`)

Deliverable:

- Reusable timeline state machine in `src/lib/core/timeline.ts`

Acceptance:

- `2x2table` runs through steps with no component-specific interval logic

## 4) Build Reusable SVG + Matrix Components

Tasks:

- Add `MatrixTable.svelte` for headers/rows/active highlights
- Add `BoardGrid.svelte` for cell highlighting
- Add primitive scene components (`RectNode`, `TextNode`, `GroupNode`) incrementally

Deliverable:

- `2x2table` composed from shared components

Acceptance:

- App-specific Svelte file is mostly data wiring and layout

## 5) Add Search Phase (Manim Behavior Parity)

Tasks:

- Add minimal Algorithm X stepping states (`choose column`, `choose row`, `cover`, `uncover`)
- Mirror status text and focus transitions from Manim scenes
- Keep generated steps deterministic

Deliverable:

- Two-phase animation (`preview` then `search`) in `2x2table`

Acceptance:

- Phase transitions and highlights match intended Manim semantics

## 6) Scale to 3x2 Three Tiles Fixture

Tasks:

- Add fixture from `dlx_3x2_three_tiles.py` into shared `fixtures/threeByTwoThreeTiles.ts`
- Reuse the same table/board/timeline components
- Add app-level scene for 3x2

Deliverable:

- Working Svelte/SVG counterpart for the original Manim scenario

Acceptance:

- Matrix columns/rows and step evolution are consistent with source definitions

## Playwright Test Plan

## A) Setup

Add Playwright and scripts:

- `bun add -d @playwright/test playwright`
- Add scripts:
  - `test:e2e`: run all Playwright tests
  - `test:e2e:ui`: Playwright UI mode

Create:

- `playwright.config.ts`
- `tests/e2e/`

Use deterministic test mode:

- Query param `?test=1` or env flag to disable auto-play randomness
- Expose stable test IDs for cells/rows/columns/controls

## B) Behavior Tests (Deterministic)

Test cases:

1. `loads-idle-state.spec.ts`
- Assert title and table render
- Assert no active row at idle

2. `preview-steps.spec.ts`
- Click `Next` repeatedly
- Assert active row sequence equals fixture order
- Assert board highlighted cells match the active row

3. `controls.spec.ts`
- Verify `Play/Pause`, `Prev`, `Next`, `Reset`
- Assert `Reset` returns to idle and pauses

4. `phase-transition.spec.ts` (after search is added)
- Assert transition from preview to search
- Assert status text and active focus semantics

## C) Visual Regression Tests

Use snapshot tests on stable states:

- Idle
- A representative preview row
- A representative search step

Rules:

- Freeze animation before screenshot
- Fixed viewport (desktop + mobile)
- Mask or disable non-deterministic UI

Suggested files:

- `tests/e2e/visual-idle.spec.ts`
- `tests/e2e/visual-preview.spec.ts`
- `tests/e2e/visual-search.spec.ts`

## D) Accessibility Smoke Tests

Add lightweight checks:

- Buttons reachable by keyboard
- ARIA labels for matrix region and board SVG
- Visible focus states on controls

## E) CI Expectations

Pipeline should run:

1. `bun run check`
2. `bun run build`
3. `bun run test:e2e`

Artifacts on failure:

- Playwright trace
- screenshots
- videos (optional)

## Migration Strategy (Low Risk)

For each extraction phase:

1. Introduce shared module/component
2. Swap one app usage path to shared implementation
3. Keep old code temporarily behind a branch/commit boundary
4. Run Playwright behavior + visual tests
5. Remove old code when parity is confirmed

This limits breakage and keeps each step reviewable.

## Definition of Done (Replica Track)

- Shared `src/lib` provides model, timeline, renderer, and theme
- `2x2table` consumes only shared primitives for core behavior
- 3x2/three-tile scene implemented with shared primitives
- Playwright tests cover state correctness and visual snapshots
- No warnings in `bun run check`; e2e suite green

## Immediate Next Actions

1. Extract CSS theme files into `src/lib/theme/*` and switch `2x2table` to import them.
2. Add `src/lib/dlx/fixtures/twoByTwo.ts` and migrate table logic out of `App.svelte`.
3. Add Playwright config + first deterministic behavior spec (`preview-steps.spec.ts`).
