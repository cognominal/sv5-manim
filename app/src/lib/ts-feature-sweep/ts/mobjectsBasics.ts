import {
  Circle,
  Create,
  DOWN,
  LEFT,
  RIGHT,
  Scene,
  Square,
  Text,
  VGroup
} from '$lib/manim';

export function buildMobjectsBasicsScene(): Scene {
  const scene = new Scene(1);
  const title = Text('Mobjects Basics', {
    id: 'title',
    fontSize: 34,
    fill: '#e2e8f0'
  });
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

  title.moveTo!([0, 1.75, 0]);
  row.moveTo!([0, 0, 0]);
  row.nextTo?.(title, DOWN, 1.1);
  scene.add(title, row);
  scene.play(Create(title), Create(square), Create(circle));
  scene.wait(0.8);
  return scene;
}
