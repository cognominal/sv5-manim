import { Scene, Text } from '$lib/manim';

export function buildSceneSectionsVoiceoverScene(): Scene {
  const scene = new Scene(0.9);
  scene.next_section('intro');
  scene.add(Text('Section: intro', { id: 'intro', fontSize: 36 }));
  scene.wait(0.6);
  scene.next_section('detail');
  scene.add(
    Text('Section: detail', {
      id: 'detail',
      fontSize: 24
    }).shift!([0, -1.1, 0])
  );
  scene.wait(0.6);
  return scene;
}
