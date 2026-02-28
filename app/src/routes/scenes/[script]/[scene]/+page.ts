import { error } from '@sveltejs/kit';
import { findScene, findScript } from '$lib/feature-sweep/catalog';

export function load({ params }) {
  const script = findScript(params.script);
  if (!script) {
    throw error(404, `Unknown script: ${params.script}`);
  }

  const scene = findScene(params.script, params.scene);
  if (!scene) {
    throw error(404, `Unknown scene: ${params.script}/${params.scene}`);
  }

  return { script, scene };
}
