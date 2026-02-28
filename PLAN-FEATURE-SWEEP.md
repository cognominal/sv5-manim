# Plan: Feature Sweep (Manim Python -> SvelteKit Ports)

## Scope

Create a Python script suite in `py/` and a SvelteKit app in `app/`.
The app must expose routes per script and per scene, with a menu dropdown.

Implementation scope for this step:

- Create all Python script files in `py/`.
- Create SvelteKit app in `app/`.
- Implement only the `mobjects_basics` scene port in the app.
- Keep route and data model ready for scripts that define many scenes.

## Python Suite Layout

Folder: `py/`

Files:

- `01_mobjects_basics.py`
- `02_transforms_core.py`
- `03_rate_functions_and_timing.py`
- `04_updaters_and_always_redraw.py`
- `05_paths_and_morphs.py`
- `06_axes_graphs_and_plotting.py`
- `07_text_math_tex.py`
- `08_camera_and_3d.py`
- `09_lighting_and_shading_3d.py`
- `10_images_svg_and_assets.py`
- `11_groups_layers_and_zindex.py`
- `12_scene_sections_and_voiceover_hooks.py`
- `13_open_gl_vs_cairo_parity.py`
- `14_export_profiles.py`
- `15_regression_golden_frames.py`

Each file contains one or more `Scene` classes with simple runnable examples.
At least one file should include multiple scene classes to verify routing.

## App Layout

Folder: `app/` (SvelteKit, Svelte 5, TypeScript)

Core files:

- `src/lib/feature-sweep/catalog.ts`
- `src/lib/feature-sweep/registry.ts`
- `src/routes/+layout.svelte`
- `src/routes/+page.svelte`
- `src/routes/scenes/[script]/[scene]/+page.svelte`

## Catalog + Multi-Scene Model

Define typed catalog entries:

- `ScriptEntry`: `id`, `title`, `file`, `scenes[]`
- `SceneEntry`: `id`, `title`, `description`

Route contract:

- Script page identity: `[script]`
- Scene page identity: `[script]/[scene]`
- A script may define many scenes in `catalog.ts`.

## Rendering Contract

`registry.ts` maps `(scriptId, sceneId)` to a Svelte component.
For now map only:

- `mobjects_basics` / `basics_layout`

All other entries can route to a placeholder renderer.

## Default API Behavior Note

For the default Manim-like API in this project:

- Calling `scene.play(Create(mobject))` should not make the mobject appear
  instantly by default.
- The default behavior is progressive drawing/appearance (comprehensible
  construction), matching Manim intent.
- Unless explicitly overridden, all `Create` calls in a scene use the same
  default duration.
- Scene implementations may override per-call duration when needed, but must
  preserve this progressive default.

## Navigation UX

Top menu bar includes one dropdown:

- label: "Scenes"
- grouped by script title
- each option links to `/scenes/[script]/[scene]`

MVP behavior:

- On load, show a home page with short instructions.
- Selecting dropdown option navigates to the corresponding scene route.

## First Implemented Port

Script: `01_mobjects_basics.py`
Scene: `basics_layout`

Port target in Svelte:

- SVG stage with a square, circle, and text.
- Grouped arrangement that mirrors Manim-style positioning intent.
- Simple intro animation in CSS/Svelte transitions.

## Styling Constraints

- Use Tailwind classes for new app UI components.
- Keep visual style clean and readable.
- Keep files under ~300 lines where practical.

## Validation

In `app/` run:

- `bun run check`
- `bun run build`

Manual checks:

- Dropdown lists all script/scene entries.
- Route `/scenes/mobjects_basics/basics_layout` renders SVG port.
- Unknown `(script, scene)` shows a not-implemented placeholder.

## Intermediary Files Policy

- Generated/intermediary files must be gitignored at repo level.
- This includes at least: `node_modules`, `.svelte-kit`, build outputs,
  Playwright outputs, and coverage artifacts.
- Commits should contain source and intentional snapshots only, never runtime
  caches or tool working directories.

## Next Steps After This Slice

1. Port `02_transforms_core.py` scenes.
2. Add deterministic playback controls shared across scene ports.
3. Add Playwright route smoke tests for catalog navigation.
