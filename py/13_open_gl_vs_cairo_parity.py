from manim import Circle, Scene, Square


class OpenGLParity(Scene):
    def construct(self):
        self.add(Square(color="#4CC9F0"), Circle(color="#F72585"))
        self.wait(0.5)


class CairoParity(Scene):
    def construct(self):
        self.add(Circle(color="#F72585"), Square(color="#4CC9F0"))
        self.wait(0.5)
