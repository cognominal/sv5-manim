import {
  Circle,
  Create,
  FadeOut,
  ReplacementTransform,
  Scene,
  Square,
} from '$lib/manim';

export function buildTransformsCoreScene(): Scene {
  const scene = new Scene(0.9);
  const from = Square('square_from', { x: 280, y: 256, size: 110, stroke: '#38bdf8' });
  const to = Circle('circle_to', { x: 520, y: 256, radius: 56, stroke: '#f59e0b' });
  scene.add(from, to);
  scene.play(Create(from));
  scene.play(ReplacementTransform(from, to, { runTime: 1.1 }));
  scene.play(FadeOut(to));
  return scene;
}
