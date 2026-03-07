# TS Sweep Parity Report

## Scope

This report compares the TypeScript sweep scenes under
[`app/src/lib/ts-feature-sweep/ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts)
against the Python originals under
[`py`](/Users/cog/mine/dlx_sv/py).

The statuses below are based on the current local `manim-api.ts`
surface and the current Svelte preview renderer.

## Status Legend

- `Parity`: the TS scene now follows the original Python scene model
  closely enough for the current local adapter and preview.
- `Partial`: the TS scene now uses the matching primitives, but the
  adapter or renderer still lacks behavior required for real parity.
- `Not in parity`: major primitives or rendering behavior are still
  missing.

## In Parity

### 01 `mobjects_basics`

- Python: [`py/01_mobjects_basics.py`](/Users/cog/mine/dlx_sv/py/01_mobjects_basics.py)
- TS: [`mobjectsBasics.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/mobjectsBasics.ts)
- Status: `Parity`
- Notes:
  Uses `Square`, `Circle`, `VGroup.arrange`, `Create`, and `wait` in
  the same basic model as the Python scene.

### 02 `transforms_core`

- Python: [`py/02_transforms_core.py`](/Users/cog/mine/dlx_sv/py/02_transforms_core.py)
- TS: [`transformsCore.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/transformsCore.ts)
- Status: `Parity`
- Notes:
  Uses `Create`, `ReplacementTransform`, and `FadeOut` in the same
  order as the Python scene.

### 05 `paths_and_morphs`

- Python: [`py/05_paths_and_morphs.py`](/Users/cog/mine/dlx_sv/py/05_paths_and_morphs.py)
- TS: [`pathsMorphs.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/pathsMorphs.ts)
- Status: `Parity`
- Notes:
  Now uses `CubicBezier`, `Dot`, `MoveAlongPath`, and
  `dot.animate.become(...)` to mirror the original.

### 07 `text_math_tex`

- Python: [`py/07_text_math_tex.py`](/Users/cog/mine/dlx_sv/py/07_text_math_tex.py)
- TS: [`textMathTex.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/textMathTex.ts)
- Status: `Parity`
- Notes:
  Uses `Text`, `MathTex`, `VGroup.arrange`, `FadeIn(group)`, and
  `wait`.

### 11 `groups_layers_and_zindex`

- Python: [`py/11_groups_layers_and_zindex.py`](/Users/cog/mine/dlx_sv/py/11_groups_layers_and_zindex.py)
- TS: [`groupsLayersZindex.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/groupsLayersZindex.ts)
- Status: `Parity`
- Notes:
  Uses `set_z_index`, group-preserving `Scene.add`, and `wait`.

### 12 `scene_sections_and_voiceover_hooks`

- Python: [`py/12_scene_sections_and_voiceover_hooks.py`](/Users/cog/mine/dlx_sv/py/12_scene_sections_and_voiceover_hooks.py)
- TS: [`sceneSectionsVoiceover.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/sceneSectionsVoiceover.ts)
- Status: `Parity`
- Notes:
  Uses `next_section`, `Text`, `shift`, `add`, and `wait`.
  Section markers exist in the scene model, even though the current UI
  does not yet expose them.

### 13 `open_gl_vs_cairo_parity`

- Python: [`py/13_open_gl_vs_cairo_parity.py`](/Users/cog/mine/dlx_sv/py/13_open_gl_vs_cairo_parity.py)
- TS: [`openGlParity.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/openGlParity.ts)
- TS: [`cairoParity.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/cairoParity.ts)
- Status: `Parity`
- Notes:
  Both TS scenes now match the original add-order-only parity examples.

### 14 `export_profiles`

- Python: [`py/14_export_profiles.py`](/Users/cog/mine/dlx_sv/py/14_export_profiles.py)
- TS: [`exportProfiles.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/exportProfiles.ts)
- Status: `Parity`
- Notes:
  Uses `Text`, `add`, and `wait` like the original.

### 15 `regression_golden_frames`

- Python: [`py/15_regression_golden_frames.py`](/Users/cog/mine/dlx_sv/py/15_regression_golden_frames.py)
- TS: [`regressionGoldenFrames.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/regressionGoldenFrames.ts)
- Status: `Parity`
- Notes:
  Uses deterministic coordinates equivalent to the Python seeded output
  and adds the same style of dot-only frame baseline.

### 16 `path_to_path_morphing`

- Python: [`py/16_path_to_path_morphing.py`](/Users/cog/mine/dlx_sv/py/16_path_to_path_morphing.py)
- TS: [`pathToPathMorph.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/pathToPathMorph.ts)
- Status: `Parity`
- Notes:
  Uses `Text.toEdge`, path opacity control, `Create`, and
  `ReplacementTransform` in the same model as the original.

### 17 `positioning_primitives`

- Python: [`py/17_positioning_primitives.py`](/Users/cog/mine/dlx_sv/py/17_positioning_primitives.py)
- TS: [`positioningPrimitives.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/positioningPrimitives.ts)
- Status: `Parity`
- Notes:
  Already matched the original scene model closely and continues to do
  so with the current adapter.

### 18 `transform_matching_tex`

- Python: [`py/18_transform_matching_tex.py`](/Users/cog/mine/dlx_sv/py/18_transform_matching_tex.py)
- TS: [`transformMatchingTex.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/transformMatchingTex.ts)
- Status: `Parity`
- Notes:
  Now adds only the start expression before playing
  `TransformMatchingTex`, matching the original scene structure.

### 04 `updaters_and_always_redraw`

- Python: [`py/04_updaters_and_always_redraw.py`](/Users/cog/mine/dlx_sv/py/04_updaters_and_always_redraw.py)
- TS: [`updatersAlwaysRedraw.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/updatersAlwaysRedraw.ts)
- Status: `Parity`
- Notes:
  The TS scene now uses `ValueTracker`, `add_updater(...)`, and
  `always_redraw(...)` in the same model as the Python original, and the
  preview runtime reevaluates tracker-driven updaters and redraw
  factories during playback.

## Partial

### 03 `rate_functions_and_timing`

- Python: [`py/03_rate_functions_and_timing.py`](/Users/cog/mine/dlx_sv/py/03_rate_functions_and_timing.py)
- TS: [`rateFunctionsTiming.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/rateFunctionsTiming.ts)
- Status: `Partial`
- Missing:
  `rate_func` semantics are not yet modeled in the preview pipeline.
  The scene now uses `dot.animate.shift(...)`, but motion timing is
  still linear in the renderer.

### 06 `axes_graphs_and_plotting`

- Python: [`py/06_axes_graphs_and_plotting.py`](/Users/cog/mine/dlx_sv/py/06_axes_graphs_and_plotting.py)
- TS: [`axesGraphsPlotting.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/axesGraphsPlotting.ts)
- Status: `Partial`
- Missing:
  The new `Axes` primitive currently covers the two main axes and a
  `plot(...)` helper, but it does not yet model real Manim CE ticks,
  labels, scaling, or axis styling.

### 10 `images_svg_and_assets`

- Python: [`py/10_images_svg_and_assets.py`](/Users/cog/mine/dlx_sv/py/10_images_svg_and_assets.py)
- TS: [`imagesSvgAssets.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/imagesSvgAssets.ts)
- Status: `Partial`
- Missing:
  `SVGMobject` is now represented in the TS adapter, but the repository
  still does not contain the original `assets/sample.svg`. That means
  the true success-path asset load cannot be matched yet. The TS scene
  can only represent the structure, not the original file-backed
  fallback behavior.

## Not In Parity

### 08 `camera_and_3d`

- Python: [`py/08_camera_and_3d.py`](/Users/cog/mine/dlx_sv/py/08_camera_and_3d.py)
- TS: [`cameraAnd3d.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/cameraAnd3d.ts)
- Status: `Not in parity`
- Missing:
  `ThreeDScene`, `ThreeDAxes`, camera orientation, ambient camera
  rotation, and any real 3D renderer integration.

### 09 `lighting_and_shading_3d`

- Python: [`py/09_lighting_and_shading_3d.py`](/Users/cog/mine/dlx_sv/py/09_lighting_and_shading_3d.py)
- TS: [`lightingShading3d.ts`](/Users/cog/mine/dlx_sv/app/src/lib/ts-feature-sweep/ts/lightingShading3d.ts)
- Status: `Not in parity`
- Missing:
  `Sphere`, 3D material/shading support, camera orientation, and ambient
  rotation.

## Adapter Surface Added In This Pass

The current pass added or broadened the following local adapter pieces
in [`manim-api.ts`](/Users/cog/mine/dlx_sv/app/src/lib/manim-api.ts):

- Scene object-management methods:
  `remove`, `clear`, `replace`, `bring_to_front`, `bring_to_back`,
  foreground mobject helpers, `next_section`, `wait_until`, `pause`,
  `construct`, `render`
- Core mobject mutators:
  `scale`, `rotate`, `stretch`, `flip`, `copy`, `set_color`,
  `set_fill`, `set_stroke`, `set_opacity`, `set_z_index`,
  `match_*`, `surround`, `generate_target`, `save_state`, `restore`,
  submobject add/remove, updater registration helpers
- Broader `.animate` support for key mutator methods
- Supporting primitives:
  `Text`, `Axes`, `SVGMobject`, `ValueTracker`, `always_redraw`
- Preview-time evaluation:
  `evaluateSceneAtTime(...)` now reapplies base scene state, interpolates
  tracker/value animations, runs mobject updaters, and refreshes
  `always_redraw(...)` factories for the current frame

## Remaining High-Value Gaps

If the next goal is to move more of the partial/non-parity scenes into
full parity, the highest-value missing pieces are:

1. Rate-function support in timeline interpolation.
2. Proper `Axes` features beyond a two-line skeleton.
3. Real asset-backed SVG loading inputs.
4. 3D scene, camera, and renderer integration.
