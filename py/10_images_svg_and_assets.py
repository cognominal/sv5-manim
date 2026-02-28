from manim import Circle, SVGMobject, Scene


class ImagesSvgAndAssets(Scene):
    def construct(self):
        fallback = Circle(radius=1.0, color="#4CC9F0")
        try:
            icon = SVGMobject("assets/sample.svg")
            icon.scale(1.3)
            self.add(icon)
        except OSError:
            self.add(fallback)
        self.wait(0.8)
