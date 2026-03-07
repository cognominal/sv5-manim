from manim import Axes, Create, Scene


class AxesGraphsAndPlotting(Scene):
    def construct(self):
        axes = Axes(
            x_range=[-4, 4, 1],
            y_range=[-2, 6, 1],
            tips=False,
            axis_config={"include_numbers": True},
        )
        graph = axes.plot(lambda x: 0.3 * x * x, color="#4CC9F0")
        self.play(Create(axes), Create(graph))
        self.wait(0.5)
