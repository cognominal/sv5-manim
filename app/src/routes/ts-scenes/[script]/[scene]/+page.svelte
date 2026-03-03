<script lang="ts">
  import { page } from '$app/state';
  import {
    createTimelineControllerState,
    progress01,
    reduceTimelineState,
    type Mode,
    type TimelineCommand
  } from '$lib/feature-sweep/core/timeline-controller';
  import { FRAME_STEP_MS } from '$lib/feature-sweep/time-wrap/core';
  import TsSceneStage from '$lib/ts-feature-sweep/render/TsSceneStage.svelte';
  import { pyDurationMsFor } from '$lib/ts-feature-sweep/py-duration-ms';
  import { sceneBuilderFor } from '$lib/ts-feature-sweep/registry';

  const { data } = $props<{
    data: {
      script: {
        id: string;
        title: string;
        source: string;
      };
      scene: {
        id: string;
        title: string;
        description: string;
      };
    };
  }>();

  let timeline = $state(createTimelineControllerState(6000, FRAME_STEP_MS));
  let exportingProfile = $state<null | 'lowres' | 'medres' | 'hires'>(null);
  let exportMessage = $state('');
  let exportError = $state('');
  let pyMp4Available = $state(false);
  let pyMp4Checked = $state(false);
  let pyProfile = $state<'lowres' | 'medres' | 'hires'>('medres');
  let exportReport = $state<{
    path: string;
    folderPath: string;
    report: {
      durationSec: number;
      width: number;
      height: number;
      fps: number;
      bitrateKbps: number;
      sizeBytes: number;
    };
    thumbnail: string;
  } | null>(null);

  const builder = $derived(sceneBuilderFor(data.script.id, data.scene.id));
  const scene = $derived(builder?.());
  const progress = $derived(progress01(timeline));
  const captureMode = $derived(page.url.searchParams.get('capture') === '1');
  const pyMp4Url = $derived(
    `/py-mp4/${data.script.id}/${data.scene.id}?profile=${pyProfile}`
  );

  const intrinsicTotalMs = $derived(
    scene
      ? Array.from(
          scene.timeline.reduce((phases, step) => {
            const prev = phases.get(step.phase) ?? 0;
            phases.set(step.phase, Math.max(prev, step.runTimeMs));
            return phases;
          }, new Map<number, number>()).values()
        ).reduce((sum, phaseMs) => sum + phaseMs, 0)
      : 0
  );
  const targetDurationMs = $derived(
    pyDurationMsFor(data.script.id, data.scene.id) ?? intrinsicTotalMs
  );
  const intrinsicTimeMs = $derived(
    timeline.durationMs > 0 && intrinsicTotalMs > 0
      ? (timeline.currentTimeMs / timeline.durationMs) * intrinsicTotalMs
      : timeline.currentTimeMs
  );

  const progressById = $derived.by(() => {
    if (!scene) return new Map<string, number>();
    const byId = new Map<string, number>();
    const stepsByPhase = scene.timeline.reduce((phases, step) => {
      const group = phases.get(step.phase) ?? [];
      group.push(step);
      phases.set(step.phase, group);
      return phases;
    }, new Map<number, typeof scene.timeline>());
    let phaseStart = 0;

    for (const phase of [...stepsByPhase.keys()].sort((a, b) => a - b)) {
      const steps = stepsByPhase.get(phase) ?? [];
      const phaseDuration = steps.reduce(
        (maxMs, step) => Math.max(maxMs, step.runTimeMs),
        0
      );

      for (const step of steps) {
        if (step.kind !== 'create' || !step.targetId) continue;
        const raw = (intrinsicTimeMs - phaseStart) / step.runTimeMs;
        const stepProgress = Math.max(0, Math.min(1, raw));
        const previous = byId.get(step.targetId) ?? 0;
        byId.set(step.targetId, Math.max(previous, stepProgress));
      }

      phaseStart += phaseDuration;
    }

    return byId;
  });

  function dispatch(command: TimelineCommand): void {
    timeline = reduceTimelineState(timeline, command);
  }

  $effect(() => {
    data.script.id;
    data.scene.id;
    const ms = targetDurationMs > 0 ? targetDurationMs : 6000;
    timeline = createTimelineControllerState(ms, FRAME_STEP_MS);
  });

  $effect(() => {
    data.script.id;
    data.scene.id;
    pyProfile;
    pyMp4Checked = false;
    pyMp4Available = false;

    const controller = new AbortController();
    fetch(pyMp4Url, {
      method: 'HEAD',
      signal: controller.signal
    })
      .then((response) => {
        pyMp4Available = response.ok;
      })
      .catch(() => {
        pyMp4Available = false;
      })
      .finally(() => {
        pyMp4Checked = true;
      });

    return () => controller.abort();
  });

  $effect(() => {
    if (timeline.mode !== 'normal' || !timeline.isPlaying) return;

    let raf = 0;
    const tick = (now: number) => {
      dispatch({ type: 'tick', nowMs: now });
      if (timeline.mode === 'normal' && timeline.isPlaying) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });

  function onModeChange(next: Mode): void {
    dispatch({ type: 'setMode', mode: next });
  }

  function onScrub(event: Event): void {
    const target = event.currentTarget as HTMLInputElement;
    dispatch({ type: 'seek', timeMs: Number(target.value) });
  }

  function bytesToMb(bytes: number): string {
    return (bytes / (1024 * 1024)).toFixed(2);
  }

  async function exportMp4(profile: 'lowres' | 'medres' | 'hires'):
    Promise<void> {
    if (exportingProfile) return;
    exportingProfile = profile;
    exportMessage = '';
    exportError = '';
    exportReport = null;

    try {
      const endpoint =
        `/ts-scenes/${data.script.id}/${data.scene.id}/render-mp4`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ profile })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `request failed (${response.status})`);
      }

      const result = await response.json() as {
        path: string;
        folderPath: string;
        report: {
          durationSec: number;
          width: number;
          height: number;
          fps: number;
          bitrateKbps: number;
          sizeBytes: number;
        };
        thumbnail: string;
      };
      exportReport = result;
      exportMessage = `Created ${profile}.`;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'export failed';
      exportError = `MP4 export failed: ${message}`;
    } finally {
      exportingProfile = null;
    }
  }

  async function openExportFolder(): Promise<void> {
    if (!exportReport) return;
    const endpoint = `/ts-scenes/${data.script.id}/${data.scene.id}/open-folder`;
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ folderPath: exportReport.folderPath })
    });
  }

  async function copyExportPath(): Promise<void> {
    if (!exportReport) return;
    await navigator.clipboard.writeText(exportReport.path);
  }

  function dismissExportReport(): void {
    exportReport = null;
  }

  function onGlobalPointerDown(event: PointerEvent): void {
    if (!exportReport) return;
    const target = event.target;
    if (!(target instanceof Element)) {
      exportReport = null;
      return;
    }
    if (!target.closest('[data-export-report]')) {
      exportReport = null;
    }
  }
</script>

<svelte:window onpointerdown={onGlobalPointerDown} />

<section class={captureMode ? 'h-full' : 'space-y-4'}>
  {#if !captureMode}
    <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p class="text-xs uppercase tracking-wide text-cyan-300">
        {data.script.source}
      </p>
      <h1 class="mt-1 text-2xl font-semibold">{data.scene.title}</h1>
      <p class="mt-2 text-slate-300">{data.scene.description}</p>
    </div>
  {/if}

  {#if !captureMode}
    <div
      class="grid gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4
      md:grid-cols-[auto_1fr_auto]"
    >
      <div class="flex min-w-44 items-center gap-2">
        <label class="text-sm text-slate-300" for="mode">Mode</label>
        <select
          id="mode"
          class="rounded-md border border-slate-700 bg-slate-950 px-2 py-1
          text-sm"
          value={timeline.mode}
          onchange={(e) =>
            onModeChange((e.currentTarget as HTMLSelectElement).value as Mode)}
        >
          <option value="normal">normal</option>
          <option value="time-wrap">time-wrap</option>
        </select>
      </div>

      <input
        class="w-full"
        type="range"
        min="0"
        max={timeline.durationMs}
        step="1"
        value={timeline.currentTimeMs}
        oninput={onScrub}
        aria-label="Time slider"
      />

      <div class="w-32 text-right text-sm tabular-nums text-cyan-300">
        {Math.round(timeline.currentTimeMs)} ms
      </div>

      <div class="flex flex-wrap gap-2 md:col-span-3">
        <button
          class="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5
          text-sm"
          onclick={() => dispatch({ type: 'prev' })}
        >
          Prev
        </button>
        <button
          class="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5
          text-sm"
          onclick={() => dispatch({ type: 'playPause' })}
        >
          {timeline.isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          class="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5
          text-sm"
          onclick={() => dispatch({ type: 'next' })}
        >
          Next
        </button>
        <button
          class="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5
          text-sm"
          onclick={() => dispatch({ type: 'reset' })}
        >
          Reset
        </button>
        <button
          class="rounded-md border border-emerald-700 bg-emerald-950/60 px-3
          py-1.5 text-sm disabled:opacity-60"
          onclick={() => exportMp4('lowres')}
          disabled={Boolean(exportingProfile)}
        >
          {exportingProfile === 'lowres' ? 'lowres...' : 'lowres'}
        </button>
        <button
          class="rounded-md border border-emerald-700 bg-emerald-950/60 px-3
          py-1.5 text-sm disabled:opacity-60"
          onclick={() => exportMp4('medres')}
          disabled={Boolean(exportingProfile)}
        >
          {exportingProfile === 'medres' ? 'medres...' : 'medres'}
        </button>
        <button
          class="rounded-md border border-emerald-700 bg-emerald-950/60 px-3
          py-1.5 text-sm disabled:opacity-60"
          onclick={() => exportMp4('hires')}
          disabled={Boolean(exportingProfile)}
        >
          {exportingProfile === 'hires' ? 'hires...' : 'hires'}
        </button>
        <div class="ml-auto min-w-44 text-right text-sm text-slate-300">
          progress: {(progress * 100).toFixed(1)}%
        </div>
      </div>
      {#if exportMessage}
        <div class="md:col-span-3 text-sm text-emerald-300">{exportMessage}</div>
      {/if}
      {#if exportError}
        <div class="md:col-span-3 text-sm text-rose-300">{exportError}</div>
      {/if}
      {#if exportReport}
        <div
          data-export-report
          class="md:col-span-3 rounded-lg border border-slate-700 bg-slate-950
          /70 p-3 text-sm text-slate-200"
        >
          <div class="flex items-start gap-3">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-cyan-300">MP4 report</span>
                <button
                  class="ml-auto rounded border border-slate-600 px-2 py-1
                  text-xs"
                  onclick={dismissExportReport}
                  aria-label="Dismiss MP4 report"
                >
                  x
                </button>
              </div>
              <div class="mt-2 flex items-center gap-2">
                <p class="min-w-0 flex-1 break-all text-xs text-slate-300">
                  {exportReport.path}
                </p>
                <button
                  class="rounded border border-slate-600 p-1.5 text-xs"
                  onclick={copyExportPath}
                  aria-label="Copy file path"
                  title="Copy file path"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="h-4 w-4"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                    <path
                      d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2
                      2v1"
                    ></path>
                  </svg>
                </button>
                <button
                  class="rounded border border-slate-600 px-2 py-1 text-xs"
                  onclick={openExportFolder}
                >
                  Open folder
                </button>
              </div>
              <div class="mt-2 grid gap-1 text-xs sm:grid-cols-2">
                <div>
                  duration: {exportReport.report.durationSec.toFixed(2)}s
                </div>
                <div>size: {bytesToMb(exportReport.report.sizeBytes)} MB</div>
                <div>
                  resolution: {exportReport.report.width}x
                  {exportReport.report.height}
                </div>
                <div>fps: {exportReport.report.fps.toFixed(2)}</div>
                <div>
                  bitrate: {exportReport.report.bitrateKbps.toFixed(0)} kbps
                </div>
              </div>
            </div>
            <img
              class="w-48 shrink-0 rounded border border-slate-700"
              src={exportReport.thumbnail}
              alt="Exported scene thumbnail"
            />
          </div>
        </div>
      {/if}
    </div>
  {/if}

  {#if scene}
    <div class={captureMode ? 'h-full' : 'grid gap-4 lg:grid-cols-2'}>
      <TsSceneStage mobjects={scene.mobjects} {progressById} />
      {#if !captureMode}
        <aside class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div class="mb-3 flex items-center gap-2">
            <h2 class="text-sm font-semibold tracking-wide text-cyan-300">
              Python (.py) MP4
            </h2>
            <select
              class="ml-auto rounded-md border border-slate-700 bg-slate-950
              px-2 py-1 text-xs"
              bind:value={pyProfile}
            >
              <option value="lowres">lowres</option>
              <option value="medres">medres</option>
              <option value="hires">hires</option>
            </select>
          </div>
          {#if pyMp4Available}
            <video
              class="w-full rounded-lg border border-slate-700 bg-black"
              src={pyMp4Url}
              controls
              preload="metadata"
            >
              <track
                kind="captions"
                srclang="en"
                label="No captions"
                src="/captions/empty.vtt"
              />
            </video>
          {:else if pyMp4Checked}
            <p class="text-sm text-slate-300">
              No Python MP4 found for this scene in
              `media/py-mp4/{data.script.id}/{data.scene.id}`.
            </p>
          {:else}
            <p class="text-sm text-slate-400">Checking Python MP4...</p>
          {/if}
        </aside>
      {/if}
    </div>
  {:else}
    <div class="rounded-xl border border-rose-800 bg-rose-950/40 p-4 text-rose-200">
      Missing TS scene builder.
    </div>
  {/if}
</section>
