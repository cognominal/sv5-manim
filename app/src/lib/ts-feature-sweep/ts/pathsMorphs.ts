import {
  Circle,
  Create,
  CubicBezier,
  Dot,
  MoveAlongPath,
  Scene
} from '$lib/manim';

export function buildPathsMorphsScene(): Scene {
  const scene = new Scene(1);
  const path = CubicBezier(
    [-3, -1, 0],
    [-1, 2, 0],
    [1, -2, 0],
    [3, 1, 0],
    { strokeWidth: 6 }
  );
  const dot = Dot('moving_dot', { color: '#F72585' });
  const final = Circle('final_circle', { radius: 24, stroke: '#4CC9F0' });
  final.moveTo!(dot);
  scene.add(path);
  scene.play(Create(path));
  scene.play(MoveAlongPath(dot, path, { runTime: 2.5 }));
  scene.play(dot.animate?.become(final, { runTime: 0.8 }) ?? Create(final));
  return scene;
}
