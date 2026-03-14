# TS Scene Renderer Architecture

## Short Answer

Yes, the same TypeScript scene source can render through either SVG or
WebGPU in this repo.

The scene source is shared. The renderer backend is different.

The split looks like this:

1. A TS scene builder creates a renderer-agnostic scene model.
2. The shared Manim-like runtime evaluates that scene at time `t`.
3. The UI chooses either the SVG stage or the WebGPU stage.
4. That chosen stage draws the evaluated scene state with its own
   backend-specific code.

So the source scene is not duplicated. What changes is the final drawing
layer.

## Where The Shared Scene Comes From

TS sweep scene builders live under
[`app/src/lib/ts-feature-sweep/ts`](./app/src/lib/ts-feature-sweep/ts).

Those files do not directly draw SVG elements or WebGPU meshes. They
build scenes using the local Manim-style API from
[`app/src/lib/manim-api.ts`](./app/src/lib/manim-api.ts).

Scene lookup happens through
[`app/src/lib/ts-feature-sweep/registry.ts`](./app/src/lib/ts-feature-sweep/registry.ts),
which maps a script id and scene id to a builder function.

In the scene page
[`app/src/routes/ts-scenes/[script]/[scene]/+page.svelte`](./app/src/routes/ts-scenes/[script]/[scene]/+page.svelte),
the route resolves the builder with `sceneBuilderFor(...)`, then calls
it to produce a `Scene`.

That `Scene` is the shared source of truth for both renderers.

## The Shared Evaluation Step

The important shared runtime step is
`evaluateSceneAtTime(scene, timeSec)` in
[`app/src/lib/manim-api.ts`](./app/src/lib/manim-api.ts).

That function is renderer-agnostic. It does not know whether the result
will be drawn by SVG or by WebGPU.

It is responsible for:

- restoring the live scene graph from the base scene state
- walking the scene timeline
- applying animation progress at the requested time
- handling replacement transforms and fade-outs
- running updaters and `always_redraw`
- flattening the resulting scene into evaluated mobjects

The result is an evaluated scene state containing:

- `mobjects`
- `progressById`
- `replacements`
- `completedReplacementSources`
- `completedReplacementTargets`
- camera orientation data

Both rendering backends consume that evaluated result.

## Where The Backend Choice Happens

The route page
[`app/src/routes/ts-scenes/[script]/[scene]/+page.svelte`](./app/src/routes/ts-scenes/[script]/[scene]/+page.svelte)
reads `?renderer=gpu`.

- If `?renderer=gpu` is absent, it renders
  [`TsSceneStage.svelte`](./app/src/lib/ts-feature-sweep/render/TsSceneStage.svelte).
- If `?renderer=gpu` is present, it renders
  [`WebGpuSceneStage.svelte`](./app/src/lib/ts-feature-sweep/render/WebGpuSceneStage.svelte).

The same `evaluatedScene.*` props are passed into either stage.

That is the core reason the same source scene can drive both outputs:
the route switches only the stage component, not the scene builder.

## How The SVG Renderer Works

The SVG renderer lives in
[`app/src/lib/ts-feature-sweep/render/TsSceneStage.svelte`](./app/src/lib/ts-feature-sweep/render/TsSceneStage.svelte).

It turns the evaluated mobjects into SVG and DOM output directly.

Examples of what it does:

- converts shapes into SVG paths and other SVG primitives
- applies draw-progress for `Create(...)`
- applies opacity and transforms for fades and transforms
- renders text and math through SVG/DOM-oriented code paths

This is the older and more complete preview path in the repo.

## How The WebGPU Renderer Works

The WebGPU route uses two layers:

- the stage component
  [`app/src/lib/ts-feature-sweep/render/WebGpuSceneStage.svelte`](./app/src/lib/ts-feature-sweep/render/WebGpuSceneStage.svelte)
- the renderer implementation
  [`app/src/lib/webgpu-manim-api.ts`](./app/src/lib/webgpu-manim-api.ts)

`WebGpuSceneStage.svelte` receives the same evaluated mobjects as the
SVG stage. It then calls `buildWebGpuSnapshot(...)` to convert the
evaluated scene into WebGPU-oriented render data.

That snapshot is split into categories such as:

- geometry layers
- textured layers
- overlay mobjects that still stay in SVG/DOM

`WebGPUManimRenderer` then renders the geometry and texture layers
through `three.js` WebGPU primitives.

This is why the WebGPU path is not a different scene source. It is a
different adapter from the same evaluated mobjects into a different
drawing backend.

## Why The Same Scene Can Work In SVG But Fail In WebGPU

Because the scene source is shared, backend differences come from the
renderer implementations, not from separate scene files.

Common failure modes are:

- a mobject kind is fully supported in the SVG stage but not yet in the
  WebGPU snapshot builder
- a primitive exists in both renderers, but its transform, stroke,
  z-order, clipping, or interpolation logic differs
- the WebGPU stage initializes asynchronously and may fail capability or
  readiness checks even though the SVG stage is immediately available
- replacement transforms, text layout, SVG assets, or 3D conversions can
  behave differently between backends

So it is possible for source parity to be good while WebGPU parity is
still poor.

## Why The MP4 Evidence Can Be Confusing

There are multiple artifact paths in this repo.

The existing TS MP4 export route at
[`app/src/routes/ts-scenes/[script]/[scene]/render-mp4/+server.ts`](./app/src/routes/ts-scenes/[script]/[scene]/render-mp4/+server.ts)
is still tied to the SVG stage. It waits for
`svg[aria-label="TS scene stage"]` before capture.

That means committed TS sweep MP4 artifacts under
[`media/ts-mp4/ts-sweep`](./media/ts-mp4/ts-sweep)
are not proof of WebGPU parity.

The WebGPU-specific comparison used a separate script:
[`scripts/report-webgpu-parity.ts`](./scripts/report-webgpu-parity.ts).
That script opens the `?renderer=gpu` route in headed Chrome and waits
for the WebGPU stage to report `data-renderer="gpu"`.

So:

- legacy TS MP4s mostly represent the SVG path
- the WebGPU report measures the actual GPU route

## Current Repo State

As of `2026-03-14`:

- manual GPU preview exists
- the shared scene source and shared evaluator are in place
- WebGPU rendering support exists for part of the scene model
- automated WebGPU MP4 parity is not yet working end to end for the
  checked sweep scenes

The current report in
[`WEBGPU-MP4-PARITY-REPORT.md`](./WEBGPU-MP4-PARITY-REPORT.md)
shows that the automated headed-Chrome GPU run did not produce a
comparable GPU artifact for any of the `21` checked scenes.

So the architecture is shared-source, dual-backend. The remaining gap is
not "do we have separate scene sources?" The remaining gap is "can the
WebGPU backend reliably render and capture the shared scene model?"

## Mental Model

The easiest way to think about this repo is:

- TS scene files describe *what* the scene is
- `evaluateSceneAtTime(...)` computes *what the scene looks like at time
  `t`*
- `TsSceneStage.svelte` decides *how to draw that state with SVG*
- `WebGpuSceneStage.svelte` plus `webgpu-manim-api.ts` decide *how to
  draw that same state with WebGPU*

Shared authoring, shared timeline evaluation, different drawing
backends.
