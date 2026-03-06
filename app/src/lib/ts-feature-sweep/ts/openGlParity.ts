import { Circle, Scene, Square } from '$lib/manim';

export function buildOpenGLParityScene(): Scene {
  const scene = new Scene(0.7);
  scene.add(
    Square('square_gpu', { x: 320, y: 248, size: 126, stroke: '#4CC9F0' }),
    Circle('circle_gl', { x: 460, y: 248, radius: 76, stroke: '#F72585' })
  );
  scene.wait(0.5);
  return scene;
}
