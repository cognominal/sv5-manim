import { Scene, Text } from '$lib/manim';

export function buildExportProfilesScene(): Scene {
  const scene = new Scene(0.7);
  scene.add(Text('Export profile sample', { id: 'profile', fontSize: 34 }));
  scene.wait(0.7);
  return scene;
}
