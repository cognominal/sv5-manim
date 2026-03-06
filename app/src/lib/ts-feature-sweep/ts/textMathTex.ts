import {
  DOWN,
  FadeIn,
  MathTex,
  Scene,
  Text,
  VGroup
} from '$lib/manim';

export function buildTextMathTexScene(): Scene {
  const scene = new Scene(0.9);
  const title = Text('Text and MathTex', {
    id: 'title',
    fontSize: 36
  });
  const formula = MathTex('formula', String.raw`e^{i\pi}+1=0`, {
    fontSize: 42,
    color: '#dbeafe',
  });
  const group = VGroup('text-math-group', title, formula);
  group.arrange!(DOWN, 0.7);

  scene.add(group);
  scene.play(FadeIn(group));
  scene.wait(0.7);
  return scene;
}
