import {
  Circle,
  Line,
  RIGHT,
  Scene,
  there_and_back
} from '$lib/manim';

export function buildRateFunctionsTimingScene(): Scene {
  const scene = new Scene(1);
  const baseline = Line([-3, 0, 0], [3, 0, 0], {
    id: 'baseline',
    stroke: '#6C757D'
  });
  const dot = Circle('dot', {
    radius: 22,
    stroke: '#F9C74F',
    strokeWidth: 8
  });
  dot.setFill?.('#F9C74F', 1);
  dot.shift?.([-3, 0, 0]);
  scene.add(baseline, dot);
  scene.play(
    dot.animate?.shift([6, 0, 0], {
      runTime: 2,
      rate_func: there_and_back
    }) ?? []
  );
  return scene;
}
