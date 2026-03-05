from manim import (
    DL,
    DOWN,
    DR,
    IN,
    LEFT,
    ORIGIN,
    OUT,
    RIGHT,
    UL,
    UP,
    UR,
    Circle,
    Create,
    Scene,
    Square,
    Text,
)


class PositioningPrimitives(Scene):
    def construct(self):
        title = Text("Positioning Primitives", font_size=40).to_edge(UP)

        origin = Square(side_length=0.9, color="#22d3ee").move_to(ORIGIN)
        right = Square(side_length=0.7, color="#84cc16").next_to(
            origin, RIGHT, buff=0.6
        )
        left = Square(side_length=0.7, color="#f59e0b").next_to(
            origin, LEFT, buff=0.6
        )
        down = Square(side_length=0.7, color="#f97316").next_to(
            origin, DOWN, buff=0.6
        )

        corners = Circle(radius=0.45, color="#e879f9").to_corner(UR)
        corners.align_to(origin, LEFT)

        ul_dot = Circle(radius=0.12, color="#38bdf8").to_corner(UL)
        dr_dot = Circle(radius=0.12, color="#fb7185").to_corner(DR)
        dl_dot = Circle(radius=0.12, color="#4ade80").to_corner(DL)

        depth = Circle(radius=0.18, color="#c084fc").move_to(origin)
        depth.shift(OUT)
        depth.shift(IN)

        self.play(Create(title))
        self.play(
            Create(origin),
            Create(right),
            Create(left),
            Create(down),
            Create(corners),
        )
        self.play(Create(ul_dot), Create(dr_dot), Create(dl_dot), Create(depth))
        self.wait(0.9)
