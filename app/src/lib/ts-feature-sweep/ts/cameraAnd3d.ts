import { ThreeDAxes, ThreeDScene } from '$lib/manim';

export function buildCameraAnd3DScene(): ThreeDScene {
  const scene = new ThreeDScene();
  const axes = ThreeDAxes();
  scene.set_camera_orientation({ phi: 65, theta: 45 });
  scene.add(axes);
  scene.begin_ambient_camera_rotation({ rate: 0.2 });
  scene.wait(1.8);
  scene.stop_ambient_camera_rotation();
  return scene;
}
