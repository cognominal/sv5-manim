import {
  Create,
  Path,
  ReplacementTransform,
  Scene,
  Text
} from '$lib/manim';

export function buildPathToPathMorphScene(): Scene {
  const scene = new Scene(0.9);
  const title = Text('Path to Path Morph', {
    id: 'title',
    fontSize: 40
  }).toEdge!([0, 0.9, 0], 0);

  const zig = Path('zig_path', {
    stroke: '#4CC9F0',
    strokeWidth: 7,
    points: [
      { x: 220, y: 300 },
      { x: 300, y: 190 },
      { x: 380, y: 320 },
      { x: 460, y: 190 },
      { x: 540, y: 300 }
    ],
    closed: false
  });

  const loop = Path('loop_path', {
    stroke: '#F72585',
    strokeWidth: 7,
    points: [
      { x: 230, y: 260 },
      { x: 320, y: 180 },
      { x: 430, y: 180 },
      { x: 530, y: 260 },
      { x: 430, y: 340 },
      { x: 320, y: 340 }
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
