from manim import MathTex, Scene, TransformMatchingTex


class TransformMatchingTexDemo(Scene):
    def construct(self):
        start = MathTex(r"e^{i\pi} + 1 = 0")
        end = MathTex(r"e^{i\pi} = -1")
        self.add(start)
        self.play(TransformMatchingTex(start, end), run_time=1.5)
        self.wait(0.5)
