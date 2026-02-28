from manim import BLUE_E, RED_E, Sphere, ThreeDScene


class LightingAndShading3D(ThreeDScene):
    def construct(self):
        self.set_camera_orientation(phi=75, theta=30)
        left = Sphere(radius=0.7, color=BLUE_E).shift([-1.1, 0, 0])
        right = Sphere(radius=0.7, color=RED_E).shift([1.1, 0, 0])
        self.add(left, right)
        self.begin_ambient_camera_rotation(rate=0.25)
        self.wait(1.5)
        self.stop_ambient_camera_rotation()
