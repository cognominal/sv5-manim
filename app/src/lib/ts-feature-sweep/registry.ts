import type { Scene } from '$lib/feature-sweep/manim-api';
import {
  buildAxesGraphsPlottingScene,
  buildCairoParityScene,
  buildCameraAnd3DScene,
  buildExportProfilesScene,
  buildGroupsLayersZIndexScene,
  buildImagesSvgAssetsScene,
  buildLightingShading3DScene,
  buildMobjectsBasicsScene,
  buildOpenGLParityScene,
  buildPathsMorphsScene,
  buildRateFunctionsTimingScene,
  buildRegressionGoldenFramesScene,
  buildSceneSectionsVoiceoverScene,
  buildTextMathTexScene,
  buildTransformsCoreScene,
  buildUpdatersAlwaysRedrawScene
} from './scenes/allScenes';

export type TsSceneBuilder = () => Scene;

const registry = new Map<string, TsSceneBuilder>([
  ['mobjects_basics:basics_layout', buildMobjectsBasicsScene],
  ['transforms_core:core_transform', buildTransformsCoreScene],
  ['rate_functions_and_timing:timing_demo', buildRateFunctionsTimingScene],
  ['updaters_and_always_redraw:updater_demo', buildUpdatersAlwaysRedrawScene],
  ['paths_and_morphs:path_morph', buildPathsMorphsScene],
  ['axes_graphs_and_plotting:axes_plot', buildAxesGraphsPlottingScene],
  ['text_math_tex:text_math', buildTextMathTexScene],
  ['camera_and_3d:camera_3d', buildCameraAnd3DScene],
  ['lighting_and_shading_3d:lighting_3d', buildLightingShading3DScene],
  ['images_svg_and_assets:assets_demo', buildImagesSvgAssetsScene],
  ['groups_layers_and_zindex:layering_demo', buildGroupsLayersZIndexScene],
  ['scene_sections_and_voiceover_hooks:sections_demo', buildSceneSectionsVoiceoverScene],
  ['open_gl_vs_cairo_parity:opengl_parity', buildOpenGLParityScene],
  ['open_gl_vs_cairo_parity:cairo_parity', buildCairoParityScene],
  ['export_profiles:profile_sample', buildExportProfilesScene],
  ['regression_golden_frames:golden_seed', buildRegressionGoldenFramesScene]
]);

export function sceneBuilderFor(
  scriptId: string,
  sceneId: string
): TsSceneBuilder | undefined {
  return registry.get(`${scriptId}:${sceneId}`);
}
