import {
  Circle,
  Scene,
  Square,
  VGroup
} from '$lib/manim';

export function buildGroupsLayersZIndexScene(): Scene {
  const scene = new Scene(0.8);
  const back = Square('square_back', {
    x: 400,
    y: 262,
    size: 212,
    stroke: '#4CC9F0'
  });
  const front = Circle('circle_front', {
    x: 400,
    y: 262,
    radius: 106,
    stroke: '#F72585'
  });
  const pair = VGroup('pair', back, front);
  back.set_z_index?.(0);
  front.set_z_index?.(2);
  scene.add(pair);
  scene.wait(0.8);
  return scene;
}
