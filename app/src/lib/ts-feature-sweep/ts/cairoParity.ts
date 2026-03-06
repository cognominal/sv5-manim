import { Circle, Scene, Square } from '$lib/manim';

export function buildCairoParityScene(): Scene {
  const scene = new Scene(0.7);
  scene.add(
    Circle('circle_cairo', { x: 340, y: 248, radius: 76, stroke: '#F72585' }),
    Square('square_cpu', { x: 500, y: 248, size: 126, stroke: '#4CC9F0' })
  );
  scene.wait(0.5);
  return scene;
}
