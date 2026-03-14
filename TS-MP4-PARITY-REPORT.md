# TS MP4 Parity Report

## Scope

This report compares committed `medres.mp4` artifacts under
[`media/py-mp4`](/Users/cog/mine/dlx_sv/media/py-mp4) and
[`media/ts-mp4/ts-sweep`](/Users/cog/mine/dlx_sv/media/ts-mp4/ts-sweep).

It is artifact-level, not source-level. It answers a different question
from [`TS-SWEEP-PARITY.md`](/Users/cog/mine/dlx_sv/TS-SWEEP-PARITY.md):

- `TS-SWEEP-PARITY.md`: whether the TS scene source and local runtime
  model match the Python source model.
- This report: whether the currently committed Python and TS `medres.mp4`
  outputs actually look and run the same.

Date of comparison: `2026-03-14`

## Method

- Compared only scenes with a Python `medres.mp4` artifact.
- Marked scenes with no TS `medres.mp4` counterpart as `Missing artifact`.
- For paired scenes:
  - Measured container duration with `ffprobe`.
  - Compared the overlapping portion only, trimming both videos to the
    shorter duration.
  - Normalized both videos to `12 fps` and `640x360` with aspect-ratio
    preserving scale and pad.
  - Computed SSIM with `ffmpeg`.

The status labels below are an inference from two signals:

- Visual overlap quality: SSIM over the shared time window.
- Timing parity: absolute and relative duration drift.

## Summary

- Sweep scenes checked: `21`
- Paired Python/TS `medres.mp4` artifacts: `16`
- Missing TS `medres.mp4` artifacts: `5`

Breakdown:

- `Strong parity`: `7`
- `Good parity`: `2`
- `Partial parity`: `1`
- `Visual match, timing drift`: `1`
- `Low parity`: `5`
- `Missing artifact`: `5`

## Strong Parity

| Scene | SSIM | Py sec | TS sec | Delta sec |
| --- | ---: | ---: | ---: | ---: |
| `images_svg_and_assets/assets_demo` | 0.9735 | 0.80 | 0.80 | 0.00 |
| `path_to_path_morphing/path_to_path` | 0.9736 | 3.10 | 3.07 | 0.03 |
| `positioning_primitives/positioning_primitives` | 0.9818 | 3.90 | 3.90 | 0.00 |
| `rate_functions_and_timing/timing_demo` | 0.9924 | 2.00 | 2.00 | 0.00 |
| `text_math_tex/text_math` | 0.9765 | 1.70 | 1.70 | 0.00 |
| `transform_matching_tex/euler_rearrange` | 0.9951 | 2.00 | 1.97 | 0.03 |
| `transforms_core/core_transform` | 0.9819 | 3.00 | 2.97 | 0.03 |

## Good Parity

| Scene | SSIM | Py sec | TS sec | Delta sec |
| --- | ---: | ---: | ---: | ---: |
| `camera_and_3d/camera_3d` | 0.9505 | 1.80 | 1.80 | 0.00 |
| `paths_and_morphs/path_morph` | 0.9564 | 4.50 | 4.47 | 0.03 |

## Partial Parity

| Scene | SSIM | Py sec | TS sec | Delta sec | Note |
| --- | ---: | ---: | ---: | ---: | --- |
| `doubly_linked_list_deletion/dll_delete` | 0.8949 | 6.80 | 7.47 | 0.67 | Shared motion is reasonably close, but not clean enough for high-confidence parity. |

## Visual Match, Timing Drift

| Scene | SSIM | Py sec | TS sec | Delta sec | Note |
| --- | ---: | ---: | ---: | ---: | --- |
| `regression_golden_frames/golden_seed` | 0.9624 | 0.40 | 7.03 | 6.63 | The overlapping frames look close, but the TS artifact runs far longer than Python. |

## Low Parity

| Scene | SSIM | Py sec | TS sec | Delta sec | Primary issue |
| --- | ---: | ---: | ---: | ---: | --- |
| `axes_graphs_and_plotting/axes_plot` | 0.8911 | 1.50 | 7.13 | 5.63 | Large timing drift dominates artifact parity. |
| `geometry_and_text_primitives/geometry_text_primitives` | 0.8214 | 2.80 | 7.07 | 4.27 | Both timing drift and visible frame differences. |
| `lighting_and_shading_3d/lighting_3d` | 0.7008 | 1.50 | 8.57 | 7.07 | Major visual divergence plus much longer TS runtime. |
| `mobjects_basics/basics_layout` | 0.9245 | 2.80 | 7.13 | 4.33 | Overlap is decent, but TS timing drift is too large for artifact parity. |
| `updaters_and_always_redraw/updater_demo` | 0.7298 | 2.00 | 10.63 | 8.63 | Major visual divergence plus very large TS timing drift. |

## Missing TS Artifacts

These scenes have a Python `medres.mp4` artifact but no committed TS
`medres.mp4` counterpart, so artifact-level parity cannot be scored yet.

- `export_profiles/profile_sample`
- `groups_layers_and_zindex/layering_demo`
- `open_gl_vs_cairo_parity/cairo_parity`
- `open_gl_vs_cairo_parity/opengl_parity`
- `scene_sections_and_voiceover_hooks/sections_demo`

## Notes

- `dlxn/dlx_3x2_three_tiles` was excluded from the summary because it is
  not part of the numbered TS sweep scene set and has no
  `media/ts-mp4/ts-sweep/...` counterpart.
- Several scenes already marked as source-level parity in
  [`TS-SWEEP-PARITY.md`](/Users/cog/mine/dlx_sv/TS-SWEEP-PARITY.md) still
  show low artifact parity here because the committed TS video has extra
  hold time or older capture output.
- The fastest way to improve this report is to refresh the missing or
  stale TS `medres.mp4` artifacts after the current runtime changes.
