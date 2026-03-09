import { Sphere, ThreeDScene } from '$lib/manim';

export function buildLightingShading3DScene(): ThreeDScene {
  const scene = new ThreeDScene(0.9);
  scene.set_camera_orientation({ phi: 75, theta: 30 });
  const left = Sphere({ radius: 0.7, color: '#236b8e' }).shift!([-1.1, 0, 0]);
  const right = Sphere({ radius: 0.7, color: '#cf5044' }).shift!([1.1, 0, 0]);
  scene.add(left, right);
  scene.begin_ambient_camera_rotation({ rate: 0.25 });
  scene.wait(1.5);
  scene.stop_ambient_camera_rotation();
  return scene;
}
