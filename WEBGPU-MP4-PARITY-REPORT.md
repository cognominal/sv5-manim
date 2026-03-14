# WebGPU MP4 Parity Report

## Scope

This report compares committed Python `medres.mp4` artifacts against
fresh TS captures recorded from the `?renderer=gpu` scene route in
headed Google Chrome.

Date of comparison: `2026-03-14`

## Method

- Python source of truth: committed `media/py-mp4/**/medres.mp4`.
- TS source of truth: fresh route capture from
  `/ts-scenes/<script>/<scene>?renderer=gpu&capture=1&autoplay=0`.
- Browser for TS capture: headed Google Chrome via Playwright.
- Each TS capture was trimmed to the Python scene duration target.
- Similarity metric: SSIM on a normalized `12 fps`, `640x360`
  overlap window.

## Summary

- Scenes checked: `21`
- `Render failed`: `21`

## Results

| Scene | Status | SSIM | Py sec | GPU TS sec | Delta sec | Note |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `axes_graphs_and_plotting/axes_plot` | Render failed | n/a | 1.50 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `camera_and_3d/camera_3d` | Render failed | n/a | 1.80 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `doubly_linked_list_deletion/dll_delete` | Render failed | n/a | 6.80 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `export_profiles/profile_sample` | Render failed | n/a | 0.70 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `geometry_and_text_primitives/geometry_text_primitives` | Render failed | n/a | 2.80 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `groups_layers_and_zindex/layering_demo` | Render failed | n/a | 0.80 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `images_svg_and_assets/assets_demo` | Render failed | n/a | 0.80 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `lighting_and_shading_3d/lighting_3d` | Render failed | n/a | 1.50 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `mobjects_basics/basics_layout` | Render failed | n/a | 2.80 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `open_gl_vs_cairo_parity/cairo_parity` | Render failed | n/a | 0.50 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `open_gl_vs_cairo_parity/opengl_parity` | Render failed | n/a | 0.50 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `path_to_path_morphing/path_to_path` | Render failed | n/a | 3.10 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `paths_and_morphs/path_morph` | Render failed | n/a | 4.50 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `positioning_primitives/positioning_primitives` | Render failed | n/a | 3.90 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `rate_functions_and_timing/timing_demo` | Render failed | n/a | 2.00 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `regression_golden_frames/golden_seed` | Render failed | n/a | 0.40 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `scene_sections_and_voiceover_hooks/sections_demo` | Render failed | n/a | 1.20 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `text_math_tex/text_math` | Render failed | n/a | 1.70 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `transform_matching_tex/euler_rearrange` | Render failed | n/a | 2.00 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `transforms_core/core_transform` | Render failed | n/a | 3.00 | n/a | n/a | No GPU TS artifact was produced for comparison. |
| `updaters_and_always_redraw/updater_demo` | Render failed | n/a | 2.00 | n/a | n/a | No GPU TS artifact was produced for comparison. |

## Notes

- This report is specifically for the WebGPU route, not the legacy
  SVG-backed TS sweep artifacts.
- Headless Playwright falls back to SVG in this repo, so headed
  Chrome was required for a real WebGPU comparison.