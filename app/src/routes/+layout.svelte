<script lang="ts">
  import '../app.css';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { scripts } from '$lib/feature-sweep/catalog';
  import { tsScripts } from '$lib/ts-feature-sweep/catalog';

  const { children } = $props<{ children: () => unknown }>();

  const options = scripts.flatMap((script) =>
    script.scenes.map((scene) => ({
      label: `${script.title} / ${scene.title}`,
      value: `/scenes/${script.id}/${scene.id}`
    }))
  );
  const tsOptions = tsScripts.flatMap((script) =>
    script.scenes.map((scene) => ({
      label: `${script.title} / ${scene.title}`,
      value: `/ts-scenes/${script.id}/${scene.id}`
    }))
  );

  const current = $derived(page.url.pathname);
  const captureMode = $derived(page.url.searchParams.get('capture') === '1');
  const isDlxRoute = $derived(current === '/dlx');
  const isTsSweepRoute = $derived(
    current === '/ts-sweep' || current.startsWith('/ts-scenes/')
  );
  const isRegularSweepRoute = $derived(
    current === '/' ||
      current.startsWith('/scenes/') ||
      current.startsWith('/time-wrap')
  );

  async function onChange(event: Event): Promise<void> {
    const target = event.currentTarget as HTMLSelectElement;
    const next = target.value;
    if (!next || next === current) return;
    await goto(next);
  }

  async function onTsChange(event: Event): Promise<void> {
    const target = event.currentTarget as HTMLSelectElement;
    const next = target.value;
    if (!next || next === current) return;
    await goto(next);
  }

  function scenePairPath(pathname: string): string | null {
    if (pathname.startsWith('/scenes/')) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length >= 3) {
        return `/ts-scenes/${parts[1]}/${parts[2]}`;
      }
    }
    if (pathname.startsWith('/ts-scenes/')) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length >= 3) {
        return `/scenes/${parts[1]}/${parts[2]}`;
      }
    }
    if (pathname === '/' || pathname.startsWith('/time-wrap')) {
      return '/ts-sweep';
    }
    if (pathname === '/ts-sweep') {
      return '/';
    }
    return null;
  }

  const toggleTarget = $derived(scenePairPath(current));

  async function onToggleSweep(): Promise<void> {
    if (!toggleTarget || toggleTarget === current) return;
    await goto(toggleTarget);
  }
</script>

<div class="min-h-screen bg-slate-950 text-slate-100">
  {#if !captureMode}
    <header class="border-b border-slate-800 bg-slate-900/95">
      <div class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <a href="/" class="text-sm font-semibold tracking-wide text-cyan-300">
          Feature Sweep
        </a>
        <a
          href="/dlx"
          class="text-sm font-medium text-slate-300 hover:text-cyan-300"
        >
          DLX
        </a>
        <a
          href="/ts-sweep"
          class="text-sm font-medium hover:text-cyan-300"
          class:text-cyan-300={isTsSweepRoute}
          class:text-slate-300={!isTsSweepRoute}
        >
          ts sweep
        </a>
        {#if !isDlxRoute}
          {#if isTsSweepRoute}
            <label class="ml-auto flex items-center gap-2 text-sm">
              <button
                class="text-slate-300 underline-offset-2 hover:text-cyan-300
                hover:underline"
                onclick={onToggleSweep}
                aria-label="Toggle to regular scenes"
              >
                TS scenes
              </button>
              <select
                class="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm"
                onchange={onTsChange}
                value={tsOptions.some((opt) => opt.value === current)
                  ? current
                  : ''}
              >
                <option value="">Select TS scene...</option>
                {#each tsOptions as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
            </label>
          {:else if isRegularSweepRoute}
            <label class="ml-auto flex items-center gap-2 text-sm">
              <button
                class="text-slate-300 underline-offset-2 hover:text-cyan-300
                hover:underline"
                onclick={onToggleSweep}
                aria-label="Toggle to TS scenes"
              >
                Scenes
              </button>
              <select
                class="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm"
                onchange={onChange}
                value={options.some((opt) => opt.value === current)
                  ? current
                  : ''}
              >
                <option value="">Select scene...</option>
                {#each options as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
            </label>
          {/if}
        {/if}
      </div>
    </header>
  {/if}

  <main class={captureMode ? 'h-screen overflow-hidden' : 'mx-auto max-w-6xl px-4 py-6'}>
    {@render children()}
  </main>
</div>
