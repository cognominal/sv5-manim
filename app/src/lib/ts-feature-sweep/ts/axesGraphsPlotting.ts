import { Axes, Create, Scene } from '$lib/manim';

export function buildAxesGraphsPlottingScene(): Scene {
  const scene = new Scene(1);
  const axes = Axes({
    id: 'axes',
    xRange: [-4, 4, 1],
    yRange: [-2, 6, 1],
    tips: false,
    axisConfig: {
      includeNumbers: true
    }
  });
  const graph = axes.plot?.((x) => 0.3 * x * x, {
    id: 'graph',
    color: '#4CC9F0'
  });
  if (!graph) return scene;
  scene.add(axes, graph);
  scene.play(Create(axes), Create(graph));
  scene.wait(0.5);
  return scene;
}
