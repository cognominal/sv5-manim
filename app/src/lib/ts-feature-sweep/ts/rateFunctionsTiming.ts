import { Circle, RIGHT, Scene } from '$lib/manim';

export function buildRateFunctionsTimingScene(): Scene {
  const scene = new Scene(1);
  const dot = Circle('dot', {
    x: 400,
    y: 240,
    radius: 16,
    stroke: '#F9C74F'
  });
  scene.add(dot);
  scene.play(dot.animate?.shift([3, 0, 0], { runTime: 2 }) ?? []);
  return scene;
}
