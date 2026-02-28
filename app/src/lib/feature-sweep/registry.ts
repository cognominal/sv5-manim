import type { Component } from 'svelte';
import MobjectsBasicsScene from './scenes/MobjectsBasicsScene.svelte';

type SceneComponent = Component;

const registry = new Map<string, SceneComponent>([
  ['mobjects_basics:basics_layout', MobjectsBasicsScene]
]);

export function sceneComponentFor(
  scriptId: string,
  sceneId: string
): SceneComponent | undefined {
  return registry.get(`${scriptId}:${sceneId}`);
}
