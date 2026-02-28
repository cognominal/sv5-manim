from manim import RIGHT, Circle, Scene, there_and_back


class RateFunctionsAndTiming(Scene):
    def construct(self):
        dot = Circle(radius=0.2, color="#F9C74F")
        self.add(dot)
        self.play(dot.animate.shift(RIGHT * 3), run_time=2.0, rate_func=there_and_back)
