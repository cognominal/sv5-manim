# Plan: TS-Based Feature Sweep (Parity)

## Goal

Add a TypeScript-authored scene sweep alongside the existing Svelte scene
ports, with the same user-facing controls and export flow as regular sweep
routes.

## Scope

- Keep a top-bar button labeled `ts sweep`.
- Keep a pane route at `/ts-sweep`.
- Keep TS scene routes at `/ts-scenes/[script]/[scene]`.
- Add top-bar TS scene dropdown navigation (`TS scenes`).
- Match regular sweep controls on TS scene routes:
  - mode selector (`normal`, `time-wrap`)
  - timeline slider
  - prev / play-pause / next / reset
  - progress label
- Match regular sweep export UX on TS scene routes:
  - profile buttons (`lowres`, `medres`, `hires`)
  - report card with thumbnail, stats, copy path, open folder
  - click-outside report dismiss
- Keep current `/scenes/...` routes intact.

## Data Model

Create a dedicated TS sweep catalog:

- `app/src/lib/ts-feature-sweep/catalog.ts`
- Typed entries:
  - `TsScriptEntry`: `id`, `title`, `source`, `scenes[]`
  - `TsSceneEntry`: `id`, `title`, `description`

Initial TS catalog includes:

- all regular sweep scripts and scenes:
  - `01` through `15`
  - including both parity scenes in `13_open_gl_vs_cairo_parity`

## Scene Source Contract

Each TS scene module exports a builder function that returns a `Scene` from:

- `app/src/lib/feature-sweep/manim-api.ts`

Example shape:

- `buildMobjectsBasicsScene(): Scene`

## Route Rendering Contract

Use a TS scene registry:

- `app/src/lib/ts-feature-sweep/registry.ts`

Map `(scriptId, sceneId)` to a scene-builder function. The TS scene route
resolves the builder and renders via a generic SVG renderer, not per-scene
`.svelte` ports.

Parity rule:

- every entry present in regular sweep catalog must also exist in TS catalog
- every TS catalog entry must resolve to a registered TS builder

## Timeline + Playback Contract

TS routes use the same timeline controller as regular sweep:

- `createTimelineControllerState`
- `reduceTimelineState`
- `progress01`
- `FRAME_STEP_MS`

TS shape/text reveal is progressive during each `Create` interval.

## Export Contract

Add TS-scene-local endpoints:

- `app/src/routes/ts-scenes/[script]/[scene]/render-mp4/+server.ts`
- `app/src/routes/ts-scenes/[script]/[scene]/open-folder/+server.ts`

Capture target for MP4 export:

- `/ts-scenes/[script]/[scene]?capture=1`

Output folder:

- `media/ts-mp4/ts-sweep/<script>/<scene>/<profile>.mp4`

## UI/UX

- `/ts-sweep` shows available TS routes and short guidance.
- `/ts-scenes/[script]/[scene]` mirrors regular sweep control/export surface.
- top bar shows only one dropdown at a time:
  - regular routes: `Scenes`
  - TS routes: `TS scenes`

## Validation

From repo root, run:

- `bun run check`
- `bun run test:e2e`

No warnings allowed.

Required e2e coverage includes:

- top-nav `ts sweep` access
- `/ts-sweep -> /ts-scenes/...` navigation
- time-wrap activation via slider seek
- reset returns mode to `normal`
- progressive reveal in mid-step scrub states

## Non-Goals

- No `.py -> .ts` transpiler in this slice.
- No replacement of current feature-sweep Svelte scene ports.
