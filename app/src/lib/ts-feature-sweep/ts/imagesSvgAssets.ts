import { Circle, Scene, SVGMobject } from '$lib/manim';

export function buildImagesSvgAssetsScene(): Scene {
  const scene = new Scene(0.9);
  const fallback = Circle('fallback', {
    radius: 80,
    stroke: '#4CC9F0'
  });
  const icon = SVGMobject('/assets/sample.svg', {
    id: 'icon',
    width: 160,
    height: 160,
  });
  scene.add(icon, fallback);
  scene.wait(0.8);
  return scene;
}
