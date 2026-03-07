import {
  ValueTracker,
  always_redraw,
  Dot,
  Line,
  Scene
} from '$lib/manim';

export function buildUpdatersAlwaysRedrawScene(): Scene {
  const scene = new Scene(1);
  const tracker = new ValueTracker(-3);
  const moving = Dot('moving', {
    color: '#F72585'
  });
  moving.add_updater?.((mobject) => {
    mobject.set_x?.(tracker.get_value());
  });
  const baseline = Line([-3, 0, 0], [3, 0, 0], {
    id: 'baseline',
    color: '#999',
    strokeWidth: 6
  });
  const tether = always_redraw(() =>
    Line([0, 0, 0], moving.get_center?.() ?? [0, 0, 0], {
      id: 'tether',
      color: '#4CC9F0',
      strokeWidth: 6
    })
  );

  scene.add(baseline, tether, moving);
  scene.play(tracker.animate.set_value(3, { runTime: 2 }));
  return scene;
}
