import random

from manim import Dot, Scene


class RegressionGoldenFrames(Scene):
    def construct(self):
        random.seed(42)
        for _ in range(12):
            x = random.uniform(-3.2, 3.2)
            y = random.uniform(-1.8, 1.8)
            self.add(Dot([x, y, 0], radius=0.06, color="#F9C74F"))
        self.wait(0.4)
