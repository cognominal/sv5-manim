from manim import Circle, Create, FadeIn, RIGHT, Scene, Square, Text, VGroup


class MobjectsBasics(Scene):
    def construct(self):
        square = Square(side_length=1.4, color="#4CC9F0")
        circle = Circle(radius=0.7, color="#F72585")
        label = Text("Mobjects Basics", font_size=36)

        row = VGroup(square, circle).arrange(RIGHT, buff=1.2)
        group = VGroup(label, row).arrange(direction=[0, -1, 0], buff=0.8)

        self.play(FadeIn(label))
        self.play(Create(square), Create(circle))
        self.wait(0.8)
