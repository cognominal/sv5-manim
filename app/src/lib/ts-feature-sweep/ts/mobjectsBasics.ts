import {
  Circle,
  Create,
  LEFT,
  RIGHT,
  Scene,
  Square,
  VGroup
} from '$lib/manim';

export function buildMobjectsBasicsScene(): Scene {
  const scene = new Scene(1);
  const square = Square('square', {
    size: 112,
    stroke: '#4CC9F0'
  });
  square.shift!(LEFT);
  const circle = Circle('circle', {
    radius: 56,
    stroke: '#F72585'
  });
  const row = VGroup('row', square, circle).arrange!(RIGHT, 1.2);

  row.moveTo!([0, 0, 0]);
  scene.add(row);
  scene.play(Create(square), Create(circle));
  scene.wait(0.8);
  return scene;
}
