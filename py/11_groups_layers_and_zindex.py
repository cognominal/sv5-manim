from manim import Circle, Scene, Square


class GroupsLayersAndZindex(Scene):
    def construct(self):
        back = Square(side_length=2.6, color="#4CC9F0")
        front = Circle(radius=1.3, color="#F72585")
        back.set_z_index(0)
        front.set_z_index(2)
        self.add(back, front)
        self.wait(0.8)
