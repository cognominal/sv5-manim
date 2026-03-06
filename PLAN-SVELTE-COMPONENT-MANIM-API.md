# Svelte Component Manim API Plan

## Goal

Refactor the local `manim-api.ts` and the Svelte rendering layer so that:

- scene data is independent of the rendered component size
- Manim-like coordinates and directions behave consistently
- the rendered stage preserves its aspect ratio when the containing
  component changes dimensions
- layout and animation semantics stay aligned with Manim CE where
  practical

This plan does not implement the refactor. It defines the target model,
migration phases, compatibility strategy, and validation steps.

## Current State

The current API mixes two coordinate spaces:

- logical Manim-like vectors such as `UP`, `DOWN`, `LEFT`, `RIGHT`
- fixed pixel coordinates tied to an `800 x 480` stage

Today these constants in
[`app/src/lib/manim-api.ts`](/Users/cog/mine/dlx_sv/app/src/lib/manim-api.ts)
define the behavior:

- `CENTER_X = 400`
- `CENTER_Y = 240`
- `UNIT_PX = 80`
- `FRAME_X_RADIUS = 5`
- `FRAME_Y_RADIUS = 3`

That means:

- scene objects are mostly stored in pixel coordinates
- direction vectors are interpreted in scene units, then converted to
  pixels with `UNIT_PX`
- origin-based helpers assume a fixed stage center
- renderers operate directly on stored coordinates

This works for a fixed view box but is the wrong abstraction for a
resizable Svelte component.

## Main Problem

When the containing component resizes, the scene model should not need
to change. Only the projection from scene coordinates to screen
coordinates should change.

The current design makes resizing harder because:

- the scene model stores pixel-space positions
- helper methods such as `shift`, `toEdge`, and `toCorner` depend on
  hardcoded stage constants
- renderer and scene model are tightly coupled
- preserving the intended aspect ratio requires implicit assumptions
  rather than a formal projection step

## Target Architecture

Split the system into three layers:

1. Scene-space API
2. Viewport projection
3. Svelte renderer

### 1. Scene-Space API

The API should store all geometry in scene coordinates, not screen
pixels.

Properties of the target scene-space model:

- origin is `(0, 0, 0)`
- positive `x` moves right
- positive `y` moves up
- `UP`, `DOWN`, `LEFT`, `RIGHT`, `UL`, `UR`, `DL`, `DR`, `IN`, `OUT`
  remain pure vectors
- mobject positions, points, path control points, and animation offsets
  are all stored in scene units
- no stage center constants are used in scene logic

### 2. Viewport Projection

Projection becomes a renderer concern.

The renderer should accept:

- frame width
- frame height
- actual viewport width
- actual viewport height

It should compute:

- a uniform scale factor
- horizontal or vertical letterboxing offsets
- final screen coordinates for all projected points

This is the mechanism that preserves aspect ratio when the containing
component changes dimensions.

### 3. Svelte Renderer

The Svelte component should:

- measure its container or receive explicit dimensions
- compute projection from scene space to screen space
- render SVG from projected values only
- never mutate scene-space geometry in response to layout size changes

## Aspect Ratio Requirement

The height/width ratio of the stage must remain fixed even when the
containing component changes dimensions.

That means:

- the stage uses a canonical frame aspect ratio
- the component fits that frame into the available box using a uniform
  scale
- if the parent aspect ratio differs, unused space becomes letterboxing
  or pillarboxing
- the scene should never stretch independently on x and y

### Fit Rule

Use a contain-style fit:

`scale = min(viewportWidth / frameWidth, viewportHeight / frameHeight)`

Then compute the projected stage size:

- `projectedWidth = frameWidth * scale`
- `projectedHeight = frameHeight * scale`

And center it inside the available viewport:

- `offsetX = (viewportWidth - projectedWidth) / 2`
- `offsetY = (viewportHeight - projectedHeight) / 2`

This guarantees:

- fixed aspect ratio
- centered stage
- no distortion
- deterministic edge and corner anchors

## Recommended Canonical Frame

There are two viable options.

### Option A: Preserve Current Local Semantics

Keep the current local frame shape:

- frame width = `10`
- frame height = `6`
- x radius = `5`
- y radius = `3`

Benefits:

- easier migration
- existing scene compositions likely need fewer changes
- `toEdge` and `toCorner` can retain their current feel

Costs:

- less aligned with Manim CE defaults

### Option B: Move Closer to Manim CE

Adopt a Manim-like canonical frame:

- frame height = `8`
- frame width = approximately `14.222`
- x radius = approximately `7.111`
- y radius = `4`

Benefits:

- better parity with Manim CE coordinates
- easier to reason about imports or examples modeled after CE

Costs:

- existing local scene layouts may shift significantly
- migration becomes more invasive

### Recommendation

Use Option A first, then optionally migrate to Option B later.

Reason:

- it isolates the architectural refactor from the frame-size parity
  decision
- it lowers breakage risk
- it gives immediate support for resizable rendering with preserved
  aspect ratio

## API Changes

## Phase 1: Introduce Explicit Frame Constants

Replace the current pixel constants with scene-space frame constants.

Add constants such as:

- `FRAME_WIDTH`
- `FRAME_HEIGHT`
- `FRAME_X_RADIUS`
- `FRAME_Y_RADIUS`

Keep vector constants unchanged:

- `ORIGIN`
- `UP`
- `DOWN`
- `LEFT`
- `RIGHT`
- `UL`
- `UR`
- `DL`
- `DR`
- `IN`
- `OUT`

Deprecate renderer-specific constants from scene logic:

- `CENTER_X`
- `CENTER_Y`
- `UNIT_PX`

These should not be used for object placement in the long-term design.

## Phase 2: Define Coordinate Types Clearly

Today `Point` effectively means render-space pixel point.

That needs to be split conceptually into:

- scene point
- screen point

Recommended approach:

- keep the exported `Point` name if you want minimal churn, but redefine
  it as scene-space
- add internal renderer types such as `ScreenPoint`

If clearer naming is acceptable, use:

- `ScenePoint`
- `ScreenPoint`

The key rule is:

- API-facing geometry must be scene-space
- renderer-facing geometry may be screen-space

## Phase 3: Rewrite Conversion Helpers

Replace the current helper behavior with explicit projection utilities.

### Helpers to Remove from Scene Logic

- implicit use of center pixel constants
- implicit conversion through `UNIT_PX`

### Helpers to Add

- `scenePointToScreen(point, viewport)`
- `screenPointToScene(point, viewport)`
- `sceneVectorToScreenDelta(vector, viewport)`
- `frameAnchorFromDirection(direction, buff)`

Responsibilities:

- scene methods use only frame dimensions and scene units
- renderer methods use only projection helpers

## Mobject Semantics Plan

## Position Storage

Store all mobject coordinates in scene units.

Examples:

- current pixel center `(400, 240)` becomes scene `(0, 0)`
- one unit right is `x + 1`
- one unit up is `y + 1`

## Size Storage

Store radii, widths, heights, and offsets in scene units where possible.

Examples:

- `Dot` radius should be stored in scene units
- `Circle` radius should be scene-space
- path points should be scene-space
- text position should be scene-space

Stroke width can remain a renderer-space concern if desired, because
vector-rendered line width often behaves more predictably in screen
space. Decide this explicitly.

### Recommendation on Stroke Width

Use this policy:

- positions and geometry are scene-space
- stroke widths remain screen-space pixels for now

Reason:

- easier visual stability across responsive sizes
- avoids making thin strokes too small or too thick during scaling

This can be revisited later if true scene-scaled strokes are needed.

## Placement Helper Plan

These helpers should be updated to work entirely in scene space.

### `moveTo` / `move_to`

Current behavior:

- moves toward a pixel coordinate or another mobject's pixel center

Target behavior:

- move to a scene-space point or another mobject's scene center

### `shift`

Current behavior:

- interprets vector in scene units, then multiplies by `UNIT_PX`

Target behavior:

- directly adds scene-space delta to stored coordinates

### `toEdge` / `to_edge`

Target behavior:

- anchor to frame bounds in scene space using canonical frame radii
- `buff` is expressed in scene units

### `toCorner` / `to_corner`

Target behavior:

- same as `toEdge`, but resolves both axes

### `nextTo` / `next_to`

Target behavior:

- compute bounds in scene space
- place mobject relative to another mobject using scene-space spacing

### `alignTo` / `align_to`

Target behavior:

- align by scene-space center or axis

### `arrange`

Target behavior:

- compute child bounds in scene space
- lay out groups in scene-space positions

## Group and Flattening Plan

The recent `Scene.add` change preserved groups instead of flattening
them. That is the correct direction and should remain.

Target rules:

- scene graph preserves group structure
- renderers may flatten for drawing
- selection and animation lookup may use flattened views
- public scene storage remains group-aware

Recommended utility split:

- `flattenSceneMobjects(scene.mobjects)` for renderer/query use
- group-preserving scene graph for authoring semantics

## Animation Semantics Plan

Animations should continue to operate in scene space.

### `FadeIn`

The recent change introduced support for:

- `shift`
- `targetPosition`
- `scale`

Target long-term behavior:

- these options remain scene-space values
- renderer interpolates projected positions after converting current
  scene-space geometry

Examples:

- `shift=UP` means one scene unit upward regardless of component size
- `targetPosition` means a scene-space point or another mobject center
- `scale` remains dimensionless

### `MoveAlongPath`

Path points must be stored in scene space.

At render time:

- project path points to screen space
- compute visible position from projected path if necessary

Better long-term rule:

- interpolation happens in scene space first
- final point is then projected to screen space

This is more consistent and easier to test.

### `ReplacementTransform`

Morph endpoints should be sampled from scene-space geometry and then
projected.

This keeps transforms stable across responsive layout changes.

## Renderer Refactor Plan

## Stage Contract

The stage component, currently
[`app/src/lib/ts-feature-sweep/render/TsSceneStage.svelte`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/render/TsSceneStage.svelte),
should own projection.

It should accept:

- mobjects in scene space
- progress state
- optional animation-derived position overrides in scene space
- optional scale overrides
- viewport size or container measurements
- frame dimensions

## Responsive Size Strategy

Preferred strategy:

- measure the containing element with `ResizeObserver`
- set the SVG outer element to fill the available box
- compute projected stage rectangle with contain-fit logic

Possible implementation shape:

- outer wrapper fills parent
- inner `<svg>` uses actual measured viewport dimensions
- rendered content sits inside a centered `<g>` with translation and
  scale

For example:

- outer viewport = parent size
- inner projected frame = canonical frame fit into viewport
- `<g transform="translate(offsetX offsetY) scale(scale)">`

Then scene-space primitives render directly inside that transformed
group.

This is cleaner than converting every point individually.

## Preferred Rendering Model

Use one of these two rendering strategies.

### Strategy A: Per-Point Projection

Every x/y/radius/path point is projected manually before rendering.

Pros:

- explicit
- easy to debug one element at a time

Cons:

- repetitive
- easy to miss a conversion

### Strategy B: Group Transform Projection

Render scene geometry in canonical frame units and apply a single
transform group for viewport fit.

Pros:

- simpler renderer
- fewer conversion mistakes
- closer to how scene graphs are typically rendered

Cons:

- some screen-space features such as stroke widths or text layout may
  need special handling

### Recommendation

Use Strategy B where possible, with selective per-element adjustments
for:

- screen-space stroke widths
- `foreignObject` text sizing
- SVG image-based math rendering if it assumes pixel dimensions

## Text and Math Plan

Text rendering is a likely pain point because current measurement logic
is approximate and assumes fixed visual sizes.

Plan:

- store text anchor positions in scene space
- keep font size as a renderer-space value initially
- project only the text position, not the font size

Reason:

- responsive container resizing should preserve stage geometry
- text readability is often better if font size policy is explicit
- full scene-scaled text can be introduced later if desired

For `MathTex` and `KMathTex`:

- keep token/group positions in scene space
- continue current SVG or HTML rendering path
- project placement at render time
- avoid mixing text measurement with stage center constants

## Bounds and Layout Plan

Functions like `mobjectBounds` must move to scene-space assumptions.

Target rule:

- bounds returned by scene helpers are in scene units

This affects:

- `nextTo`
- `arrange`
- alignment logic
- transform sampling

For text objects, approximate width/height can still be estimated using
font size heuristics, but the resulting bounds should be converted into
scene units, not pixels.

## Backward Compatibility Plan

The safest migration is staged.

## Stage 1: Introduce New Projection Layer Without Breaking Callers

- keep existing public constructors
- add frame constants
- add projection helpers
- convert renderer to use projection
- optionally continue accepting old pixelish defaults internally during
  transition

## Stage 2: Move Constructors to Scene-Space Defaults

Update constructors such as:

- `Square`
- `Circle`
- `Dot`
- `TitleText`
- `MathTex`
- `KMathTex`
- `Path`
- `Line`
- `CubicBezier`
- `VGroup`

So default positions are centered at scene `(0, 0)` rather than pixel
center constants.

## Stage 3: Rewrite All Placement Helpers

Ensure helper methods no longer depend on pixel constants.

## Stage 4: Remove Legacy Constants

After all scene logic is scene-space:

- remove `CENTER_X`
- remove `CENTER_Y`
- remove `UNIT_PX`

## Suggested File-Level Work Plan

## 1. `app/src/lib/manim-api.ts`

Planned changes:

- introduce canonical frame constants
- redefine coordinate helpers around scene space
- move placement helpers to scene-space math
- update primitive constructors to default to scene-space center
- ensure animation metadata stores scene-space offsets
- keep `flattenSceneMobjects` as a renderer/query utility

## 2. `app/src/lib/ts-feature-sweep/render/TsSceneStage.svelte`

Planned changes:

- measure container dimensions
- compute contain-fit scale and offsets
- preserve aspect ratio always
- render scene-space objects through a stable projection layer
- keep animation override positions in scene space

## 3. Route-Level Callers

Files such as:

- [`app/src/routes/ts-scenes/[script]/[scene]/+page.svelte`](/Users/cog/mine/dlx_sv/app/src/routes/ts-scenes/[script]/[scene]/+page.svelte)
- [`app/src/routes/dlxn/+page.svelte`](/Users/cog/mine/dlx_sv/app/src/routes/dlxn/+page.svelte)

Planned changes:

- stop assuming flattened storage in `scene.mobjects`
- use flattened render views only where needed
- treat animation-derived positions as scene-space values

## Decision Points

These choices should be made before implementation starts.

### Decision 1: Canonical Frame

Choose one:

- keep current local `10 x 6`
- move to Manim-like `~14.222 x 8`

Recommended now:

- keep `10 x 6`

### Decision 2: Text Scaling Policy

Choose one:

- text size scales with stage projection
- text size stays screen-stable and only position projects

Recommended now:

- keep text size screen-stable initially

### Decision 3: Stroke Width Policy

Choose one:

- strokes scale with stage
- strokes remain screen-stable

Recommended now:

- keep strokes screen-stable initially

### Decision 4: Migration Compatibility

Choose one:

- big-bang rewrite
- staged compatibility migration

Recommended now:

- staged migration

## Risks

## Risk 1: Existing Scene Layout Shift

If stored coordinates switch from pixels to scene units, existing scenes
may render in unexpected locations.

Mitigation:

- introduce migration helpers
- migrate one scene set at a time
- compare before/after renders visually

## Risk 2: Text and Math Bounds Drift

Approximate text bounds may not match previous layout behavior.

Mitigation:

- keep text layout simple initially
- test `MathTex`, `KMathTex`, and text-heavy scenes explicitly

## Risk 3: Animation Override Mismatch

If animation override positions are mixed between spaces, motion can be
wrong.

Mitigation:

- define one rule: all animation metadata is scene-space
- enforce that rule in helper code

## Risk 4: Partial Conversion Bugs

The biggest practical risk is having half the code think in pixels and
half think in scene units.

Mitigation:

- label helper functions by space
- remove ambiguous conversions
- keep projection centralized

## Validation Plan

After implementation, validate the refactor with the following checks.

## Functional Checks

- objects stay centered when expected at scene origin
- `UP`, `DOWN`, `LEFT`, `RIGHT` behave identically across component sizes
- `toEdge` and `toCorner` land on the expected frame boundaries
- `nextTo` spacing remains stable across resize
- grouped objects render consistently after `Scene.add`

## Responsive Checks

- stage aspect ratio stays fixed while parent width changes
- stage aspect ratio stays fixed while parent height changes
- no x-only or y-only stretching occurs
- letterboxing/pillarboxing appears correctly when aspect ratios differ
- animations follow the same path regardless of viewport size

## Regression Checks

- `Create`, `FadeIn`, `FadeOut`, `ReplacementTransform`, and
  `MoveAlongPath` still preview correctly
- `MathTex` token grouping still works
- `TransformMatchingTex` still behaves as expected
- existing TS scene pages still build and render

## Required Commands After Implementation

When implementation begins, validation should include:

- `bun run check`

If scene files change in ways that affect generated outputs, update the
corresponding `.mp4` artifacts per project rules.

## Recommended Implementation Order

1. Introduce canonical frame constants and projection helpers.
2. Convert the renderer to contain-fit projection with fixed aspect
   ratio.
3. Keep the scene model stable temporarily through adapter helpers.
4. Convert placement helpers to scene-space math.
5. Convert primitive constructors to scene-space defaults.
6. Migrate animation metadata and derived positions fully to scene
   space.
7. Remove legacy pixel constants.
8. Run validation and visual comparisons.

## Final Recommendation

The strongest long-term design is:

- scene model in scene units
- renderer projection based on measured viewport
- fixed canonical frame aspect ratio
- contain-fit scaling with letterboxing/pillarboxing
- no stage stretching when the parent component changes size

The most pragmatic near-term path is:

- preserve the current `10 x 6` frame
- centralize projection in `TsSceneStage.svelte`
- migrate helpers and constructors gradually
- keep public behavior stable while removing pixel-space assumptions

That gives responsive Svelte rendering without corrupting Manim-like
authoring semantics.
