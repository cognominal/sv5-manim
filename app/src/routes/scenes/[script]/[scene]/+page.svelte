<script lang="ts">
  import { sceneComponentFor } from '$lib/feature-sweep/registry';

  const { data } = $props<{
    data: {
      script: {
        id: string;
        title: string;
        file: string;
      };
      scene: {
        id: string;
        title: string;
        description: string;
      };
    };
  }>();

  const SceneComponent = $derived(
    sceneComponentFor(data.script.id, data.scene.id)
  );
</script>

<section class="space-y-4">
  <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <p class="text-xs uppercase tracking-wide text-cyan-300">{data.script.file}</p>
    <h1 class="mt-1 text-2xl font-semibold">{data.scene.title}</h1>
    <p class="mt-2 text-slate-300">{data.scene.description}</p>
  </div>

  {#if SceneComponent}
    <SceneComponent />
  {:else}
    <div class="rounded-xl border border-amber-700/60 bg-amber-950/40 p-4 text-amber-100">
      Not implemented yet in Svelte: {data.script.id}/{data.scene.id}
    </div>
  {/if}
</section>
