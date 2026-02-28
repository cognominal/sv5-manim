from manim import Circle, Create, CubicBezier, Dot, MoveAlongPath, Scene


class PathsAndMorphs(Scene):
    def construct(self):
        path = CubicBezier([-3, -1, 0], [-1, 2, 0], [1, -2, 0], [3, 1, 0])
        dot = Dot(color="#F72585")
        self.play(Create(path))
        self.play(MoveAlongPath(dot, path), run_time=2.5)
        self.play(dot.animate.become(Circle(radius=0.3, color="#4CC9F0")))
