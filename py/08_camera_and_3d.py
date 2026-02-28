from manim import ThreeDAxes, ThreeDScene


class CameraAnd3D(ThreeDScene):
    def construct(self):
        axes = ThreeDAxes()
        self.set_camera_orientation(phi=65, theta=45)
        self.add(axes)
        self.begin_ambient_camera_rotation(rate=0.2)
        self.wait(1.8)
        self.stop_ambient_camera_rotation()
