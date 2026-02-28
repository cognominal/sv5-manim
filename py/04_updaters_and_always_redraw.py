from manim import Dot, Line, Scene, ValueTracker, always_redraw


class UpdatersAndAlwaysRedraw(Scene):
    def construct(self):
        tracker = ValueTracker(-3)
        moving = Dot(color="#F72585").add_updater(lambda m: m.set_x(tracker.get_value()))
        baseline = Line([-3, 0, 0], [3, 0, 0], color="#999")
        tether = always_redraw(lambda: Line([0, 0, 0], moving.get_center(), color="#4CC9F0"))

        self.add(baseline, tether, moving)
        self.play(tracker.animate.set_value(3), run_time=2)
