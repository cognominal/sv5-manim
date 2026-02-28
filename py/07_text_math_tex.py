from manim import FadeIn, MathTex, Scene, Text, VGroup


class TextMathTex(Scene):
    def construct(self):
        title = Text("Text and MathTex", font_size=36)
        formula = MathTex(r"e^{i\pi} + 1 = 0")
        group = VGroup(title, formula).arrange(direction=[0, -1, 0], buff=0.7)
        self.play(FadeIn(group))
        self.wait(0.7)
