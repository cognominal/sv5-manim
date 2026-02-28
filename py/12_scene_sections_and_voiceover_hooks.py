from manim import Scene, Text


class SceneSectionsAndVoiceoverHooks(Scene):
    def construct(self):
        self.next_section("intro")
        self.add(Text("Section: intro", font_size=36))
        self.wait(0.6)
        self.next_section("detail")
        self.add(Text("Section: detail", font_size=24).shift([0, -1.1, 0]))
        self.wait(0.6)
