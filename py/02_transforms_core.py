from manim import Circle, Create, FadeOut, ReplacementTransform, Scene, Square


class TransformsCore(Scene):
    def construct(self):
        square = Square(color="#4CC9F0")
        circle = Circle(color="#F72585")
        self.play(Create(square))
        self.play(ReplacementTransform(square, circle))
        self.play(FadeOut(circle))
