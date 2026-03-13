from manim import LEFT, RIGHT, Circle, Line, Scene, there_and_back


class RateFunctionsAndTiming(Scene):
    def construct(self):
        baseline = Line(LEFT * 3, RIGHT * 3, color="#6C757D")
        dot = Circle(
            radius=0.28,
            color="#F9C74F",
            fill_color="#F9C74F",
            fill_opacity=1.0,
        ).shift(LEFT * 3)

        self.add(baseline, dot)
        self.play(
            dot.animate.shift(RIGHT * 6),
            run_time=2.0,
            rate_func=there_and_back,
        )
