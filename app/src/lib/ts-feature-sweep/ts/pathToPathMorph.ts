import {
  Create,
  Path,
  ReplacementTransform,
  Scene,
  Text
} from '$lib/manim';

export function buildPathToPathMorphScene(): Scene {
  const scene = new Scene();
  const title = Text('Path to Path Morph', {
    id: 'title',
    fontSize: 40
  }).toEdge!([0, 0.9, 0], 0);

  const zig = Path('zig_path', {
    stroke: '#4CC9F0',
    strokeWidth: 7,
    points: [
      [-3.0, 0.6, 0.0],
      [-2.0, -0.8, 0.0],
      [-1.0, 0.9, 0.0],
      [0.0, -0.8, 0.0],
      [1.0, 0.6, 0.0]
    ],
    closed: false
  });

  const loop = Path('loop_path', {
    stroke: '#F72585',
    strokeWidth: 7,
    points: [
      [-2.8, 0.1, 0.0],
      [-1.7, -0.9, 0.0],
      [-0.3, -0.9, 0.0],
      [0.9, 0.1, 0.0],
      [-0.3, 1.1, 0.0],
      [-1.7, 1.1, 0.0],
      [-2.8, 0.1, 0.0]
    ],
    closed: true
  });

  loop.set_opacity?.(0);
  scene.add(title, zig, loop);
  scene.play(Create(zig));
  scene.play(ReplacementTransform(zig, loop, { runTime: 1.3 }));
  scene.wait(0.8);
  return scene;
}
