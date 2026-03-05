import {
  Create,
  Dot,
  Line,
  MoveAlongPath,
  Scene
} from '$lib/manim';

export function buildUpdatersAlwaysRedrawScene(): Scene {
  const scene = new Scene(1);
  const baseline = Line([-3, 0, 0], [3, 0, 0], {
    id: 'baseline',
    color: '#999',
    strokeWidth: 6
  });
  const moving = Dot('moving', {
    x: 160,
    y: 240,
    color: '#F72585'
  });
  const tether = Line([0, 0, 0], [-3, 0, 0], {
    id: 'tether',
    color: '#4CC9F0',
    strokeWidth: 6
  });
  const track = Line([-3, 0, 0], [3, 0, 0], {
    id: 'track',
    color: '#00000000',
    strokeWidth: 1
  });
  const tetherEnd = Line([0, 0, 0], [3, 0, 0], {
    id: 'tether_end',
    color: '#4CC9F0',
    strokeWidth: 6
  });

  scene.add(baseline, tether, moving, track, tetherEnd);
  scene.play(Create(baseline), Create(tether), Create(moving));
  scene.play(
    MoveAlongPath(moving, track, { runTime: 2 }),
    tether.animate?.become(tetherEnd, { runTime: 2 }) ?? Create(tetherEnd)
  );
  return scene;
}
