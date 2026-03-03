<script lang="ts">
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import {
    createTimelineControllerState,
    progress01,
    reduceTimelineState,
    type Mode,
    type TimelineCommand
  } from '$lib/feature-sweep/core/timeline-controller';
  import { FRAME_STEP_MS } from '$lib/feature-sweep/time-wrap/core';
  import type { Scene } from '$lib/feature-sweep/manim-api';
  import TsSceneStage from '$lib/ts-feature-sweep/render/TsSceneStage.svelte';
  import SplitPane from '$lib/vendor/rich-split-pane/SplitPane.svelte';
  import type { Length } from '$lib/vendor/rich-split-pane/types';
  import ReadOnlyCodeMirror from '$lib/components/ReadOnlyCodeMirror.svelte';
  import { pyDurationMsFor } from '$lib/ts-feature-sweep/py-duration-ms';
  import { sceneBuilderFor } from '$lib/ts-feature-sweep/registry';
  import { onDestroy } from 'svelte';

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
      pySourcePath: string;
      tsSourcePath: string;
      pySourceText: string;
      tsSourceText: string;
    };
  }>();

  let timeline = $state(createTimelineControllerState(6000, FRAME_STEP_MS));
  let exportingProfile = $state<null | 'lowres' | 'medres' | 'hires'>(null);
  let exportMessage = $state('');
  let exportError = $state('');
  let mp4Lang = $state<'ts' | 'py'>('ts');
  let mp4Profile = $state<'lowres' | 'medres' | 'hires'>('medres');
  let mp4Checked = $state(false);
  let mp4Status = $state<{
    exists: boolean;
    upToDate: boolean;
    playbackUrl: string;
    sourceMtimeMs: number | null;
    mp4MtimeMs: number | null;
  } | null>(null);
  let mp4ScheduledAt = $state<number | null>(null);
  let mp4GenerationAbort = $state<AbortController | null>(null);
  let lastSourceMtimeMs = $state<number | null>(null);
  let mp4GenToken = 0;
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

  let scene = $state<Scene | null>(null);
  let sceneResolved = $state(false);
  let intrinsicTotalMs = $state(0);
  let targetDurationMs = $state(6000);
  let mainSplitPos = $state<Length>('52%');
  let codeSplitPos = $state<Length>('50%');
  const progress = $derived(progress01(timeline));
  const captureMode = $derived(page.url.searchParams.get('capture') === '1');

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

  const replacementState = $derived.by(() => {
    const active: Array<{ sourceId: string; targetId: string; progress: number }> = [];
    const completedSources = new Set<string>();
    const completedTargets = new Set<string>();
    if (!scene) {
      return { active, completedSources, completedTargets };
    }

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
        if (
          step.kind !== 'replacementTransform' ||
          !step.sourceId ||
          !step.targetId
        ) {
          continue;
        }
        const raw = (intrinsicTimeMs - phaseStart) / step.runTimeMs;
        const stepProgress = Math.max(0, Math.min(1, raw));
        if (stepProgress > 0 && stepProgress < 1) {
          active.push({
            sourceId: step.sourceId,
            targetId: step.targetId,
            progress: stepProgress
          });
        }
        if (stepProgress >= 1) {
          completedSources.add(step.sourceId);
          completedTargets.add(step.targetId);
        }
      }

      phaseStart += phaseDuration;
    }
    return { active, completedSources, completedTargets };
  });

  function dispatch(command: TimelineCommand): void {
    timeline = reduceTimelineState(timeline, command);
  }

  $effect(() => {
    sceneResolved = false;
    const scriptId = data.script.id;
    const sceneId = data.scene.id;
    const builder = sceneBuilderFor(scriptId, sceneId);
    const nextScene = builder ? builder() : null;
    scene = nextScene;
    intrinsicTotalMs = nextScene
      ? Array.from(
          nextScene.timeline.reduce((phases, step) => {
            const prev = phases.get(step.phase) ?? 0;
            phases.set(step.phase, Math.max(prev, step.runTimeMs));
            return phases;
          }, new Map<number, number>()).values()
        ).reduce((sum, phaseMs) => sum + phaseMs, 0)
      : 0;
    const targetMs = pyDurationMsFor(scriptId, sceneId) ?? intrinsicTotalMs;
    targetDurationMs = targetMs;
    const ms = targetMs > 0 ? targetMs : 6000;
    timeline = createTimelineControllerState(ms, FRAME_STEP_MS);
    sceneResolved = true;
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

  $effect(() => {
    if (!browser || captureMode) return;
    document.documentElement.style.setProperty('--ts-left-pane', mainSplitPos);
  });

  onDestroy(() => {
    if (!browser) return;
    document.documentElement.style.removeProperty('--ts-left-pane');
    mp4GenerationAbort?.abort();
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

  async function refreshMp4Status(): Promise<void> {
    const endpoint = `/ts-scenes/${data.script.id}/${data.scene.id}/mp4-status` +
      `?lang=${mp4Lang}&profile=${mp4Profile}`;
    try {
      const response = await fetch(endpoint, { cache: 'no-store' });
      if (!response.ok) throw new Error('status failed');
      const next = await response.json() as {
        exists: boolean;
        upToDate: boolean;
        playbackUrl: string;
        sourceMtimeMs: number | null;
        mp4MtimeMs: number | null;
      };
      mp4Status = next;
      mp4Checked = true;
      if (
        lastSourceMtimeMs &&
        next.sourceMtimeMs &&
        next.sourceMtimeMs > lastSourceMtimeMs
      ) {
        mp4GenerationAbort?.abort();
      }
      lastSourceMtimeMs = next.sourceMtimeMs;
      if (!next.upToDate && next.sourceMtimeMs) {
        mp4ScheduledAt = next.sourceMtimeMs + 60_000;
      } else {
        mp4ScheduledAt = null;
      }
    } catch {
      mp4Status = null;
      mp4Checked = true;
    }
  }

  async function generateMp4(profile: 'lowres' | 'medres' | 'hires'):
    Promise<void> {
    if (exportingProfile) return;
    exportingProfile = profile;
    exportMessage = '';
    exportError = '';
    exportReport = null;
    const token = ++mp4GenToken;
    mp4GenerationAbort?.abort();
    const controller = new AbortController();
    mp4GenerationAbort = controller;

    try {
      const endpoint =
        mp4Lang === 'ts'
          ? `/ts-scenes/${data.script.id}/${data.scene.id}/render-mp4`
          : `/ts-scenes/${data.script.id}/${data.scene.id}/render-py-mp4`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ profile }),
        signal: controller.signal
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `request failed (${response.status})`);
      }

      if (mp4Lang === 'ts') {
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
      } else {
        await response.json().catch(() => ({}));
      }
      if (token === mp4GenToken) {
        exportMessage = `Created ${mp4Lang} ${profile}.`;
        await refreshMp4Status();
      }
    } catch (cause) {
      if (controller.signal.aborted) return;
      const message = cause instanceof Error ? cause.message : 'export failed';
      exportError = `MP4 export failed: ${message}`;
    } finally {
      if (token === mp4GenToken) {
        exportingProfile = null;
      }
    }
  }

  const mp4CountdownSec = $derived(
    mp4ScheduledAt ? Math.max(0, Math.ceil((mp4ScheduledAt - Date.now()) / 1000)) : 0
  );

  $effect(() => {
    data.script.id;
    data.scene.id;
    mp4Lang;
    mp4Profile;
    mp4Checked = false;
    mp4Status = null;
    lastSourceMtimeMs = null;
    void refreshMp4Status();

    const interval = setInterval(() => {
      void refreshMp4Status();
    }, 5000);
    return () => clearInterval(interval);
  });

  $effect(() => {
    if (!mp4ScheduledAt) return;
    const now = Date.now();
    if (now >= mp4ScheduledAt) {
      if (!mp4Status?.upToDate && !exportingProfile) {
        void generateMp4(mp4Profile);
      }
      return;
    }
    const timer = setTimeout(() => {
      if (!mp4Status?.upToDate && !exportingProfile) {
        void generateMp4(mp4Profile);
      }
    }, mp4ScheduledAt - now);
    return () => clearTimeout(timer);
  });

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

  async function copyText(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
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

{#if captureMode}
  <section class="h-full">
    {#if scene}
      <TsSceneStage
        mobjects={scene.mobjects}
        {progressById}
        replacements={replacementState.active}
        completedReplacementSources={replacementState.completedSources}
        completedReplacementTargets={replacementState.completedTargets}
      />
    {:else if !sceneResolved}
      <div class="h-full rounded-xl border border-slate-800 bg-slate-950"></div>
    {:else}
      <div
        class="rounded-xl border border-rose-800 bg-rose-950/40 p-4
        text-rose-200"
      >
        Missing TS scene builder.
      </div>
    {/if}
  </section>
{:else}
  <section class="h-full overflow-hidden">
    <SplitPane
      type="columns"
      bind:pos={mainSplitPos}
      min="420px"
      max="-420px"
      --color="#1f2937"
      --thickness="12px"
    >
      {#snippet a()}
        <div class="h-full">
          <div
            class="h-full overflow-y-auto space-y-4 p-4"
            data-testid="ts-left-scroll"
          >
            <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p class="text-xs uppercase tracking-wide text-cyan-300">
                {data.script.source}
              </p>
              <h1 class="mt-1 text-2xl font-semibold">{data.scene.title}</h1>
              <p class="mt-2 text-slate-300">{data.scene.description}</p>
            </div>

            <div
              class="grid gap-3 rounded-xl border border-slate-800
              bg-slate-900/60 p-4 md:grid-cols-[auto_1fr_auto]"
            >
              <div class="flex min-w-44 items-center gap-2">
                <label class="text-sm text-slate-300" for="mode">Mode</label>
                <select
                  id="mode"
                  class="rounded-md border border-slate-700 bg-slate-950 px-2
                  py-1 text-sm"
                  value={timeline.mode}
                  onchange={(e) =>
                    onModeChange(
                      (e.currentTarget as HTMLSelectElement).value as Mode
                    )}
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
                  class="rounded-md border border-slate-700 bg-slate-950 px-3
                  py-1.5 text-sm"
                  onclick={() => dispatch({ type: 'prev' })}
                >
                  Prev
                </button>
                <button
                  class="rounded-md border border-slate-700 bg-slate-950 px-3
                  py-1.5 text-sm"
                  onclick={() => dispatch({ type: 'playPause' })}
                >
                  {timeline.isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  class="rounded-md border border-slate-700 bg-slate-950 px-3
                  py-1.5 text-sm"
                  onclick={() => dispatch({ type: 'next' })}
                >
                  Next
                </button>
                <button
                  class="rounded-md border border-slate-700 bg-slate-950 px-3
                  py-1.5 text-sm"
                  onclick={() => dispatch({ type: 'reset' })}
                >
                  Reset
                </button>
                <button
                  class="rounded-md border border-emerald-700 bg-emerald-950/60
                  px-3 py-1.5 text-sm disabled:opacity-60"
                  onclick={() => {
                    mp4Profile = 'lowres';
                    void generateMp4('lowres');
                  }}
                  disabled={Boolean(exportingProfile)}
                >
                  {exportingProfile === 'lowres' ? 'lowres...' : 'lowres'}
                </button>
                <button
                  class="rounded-md border border-emerald-700 bg-emerald-950/60
                  px-3 py-1.5 text-sm disabled:opacity-60"
                  onclick={() => {
                    mp4Profile = 'medres';
                    void generateMp4('medres');
                  }}
                  disabled={Boolean(exportingProfile)}
                >
                  {exportingProfile === 'medres' ? 'medres...' : 'medres'}
                </button>
                <button
                  class="rounded-md border border-emerald-700 bg-emerald-950/60
                  px-3 py-1.5 text-sm disabled:opacity-60"
                  onclick={() => {
                    mp4Profile = 'hires';
                    void generateMp4('hires');
                  }}
                  disabled={Boolean(exportingProfile)}
                >
                  {exportingProfile === 'hires' ? 'hires...' : 'hires'}
                </button>
                <div class="ml-auto min-w-44 text-right text-sm text-slate-300">
                  progress: {(progress * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {#if scene}
              <TsSceneStage
                mobjects={scene.mobjects}
                {progressById}
                replacements={replacementState.active}
                completedReplacementSources={replacementState.completedSources}
                completedReplacementTargets={replacementState.completedTargets}
              />
              <aside
                class="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                data-testid="mp4-compare-pane"
              >
              <div class="mb-3 flex items-center gap-2">
                <h2 class="text-sm font-semibold tracking-wide text-cyan-300">
                  MP4 Compare
                </h2>
                <div class="ml-auto flex items-center gap-2 text-xs">
                  <button
                    class="rounded border px-2 py-1"
                    class:border-cyan-600={mp4Lang === 'ts'}
                    class:text-cyan-300={mp4Lang === 'ts'}
                    class:border-slate-700={mp4Lang !== 'ts'}
                    class:text-slate-300={mp4Lang !== 'ts'}
                    onclick={() => {
                      mp4Lang = 'ts';
                      exportReport = null;
                    }}
                  >
                    ts
                  </button>
                  <button
                    class="rounded border px-2 py-1"
                    class:border-cyan-600={mp4Lang === 'py'}
                    class:text-cyan-300={mp4Lang === 'py'}
                    class:border-slate-700={mp4Lang !== 'py'}
                    class:text-slate-300={mp4Lang !== 'py'}
                    onclick={() => {
                      mp4Lang = 'py';
                      exportReport = null;
                    }}
                  >
                    py
                  </button>
                  <select
                    class="rounded-md border border-slate-700 bg-slate-950
                    px-2 py-1 text-xs"
                    bind:value={mp4Profile}
                  >
                    <option value="lowres">lowres</option>
                    <option value="medres">medres</option>
                    <option value="hires">hires</option>
                  </select>
                </div>
              </div>
              {#if !mp4Checked}
                <p class="text-sm text-slate-400">Checking MP4 status...</p>
              {:else if mp4Status?.upToDate}
                <video
                  class="w-full rounded-lg border border-slate-700 bg-black"
                  src={mp4Status.playbackUrl}
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
              {:else}
                <p class="text-sm text-slate-300">
                  {mp4Status?.exists
                    ? `${mp4Lang.toUpperCase()} ${mp4Profile} MP4 is out of date.`
                    : `No ${mp4Lang.toUpperCase()} ${mp4Profile} MP4 generated yet.`}
                </p>
                {#if mp4ScheduledAt}
                  <p class="mt-1 text-xs text-slate-400">
                    Auto generation in {mp4CountdownSec}s after last source
                    change.
                  </p>
                {/if}
              {/if}
              </aside>
            {:else if !sceneResolved}
              <div
                class="h-[460px] rounded-xl border border-slate-800 bg-slate-950"
              ></div>
            {:else}
              <div
                class="rounded-xl border border-rose-800 bg-rose-950/40 p-4
                text-rose-200"
              >
                Missing TS scene builder.
              </div>
            {/if}
          </div>
        </div>
      {/snippet}

      {#snippet b()}
        <aside class="h-full border-l border-slate-800 bg-slate-900/60 p-4">
          <SplitPane
            type="rows"
            bind:pos={codeSplitPos}
            min="220px"
            max="-220px"
            --color="#1f2937"
            --thickness="12px"
          >
            {#snippet a()}
              <div class="flex h-full min-h-0 flex-col">
                <div class="mb-2 flex items-baseline gap-2">
                  <h2 class="text-sm font-semibold tracking-wide text-cyan-300">
                    Python Source
                  </h2>
                  <p class="min-w-0 truncate text-xs text-slate-400">
                    {data.pySourcePath}
                  </p>
                  <button
                    class="shrink-0 rounded border border-slate-700 p-1 text-slate-300
                    hover:text-cyan-300"
                    onclick={() => copyText(data.pySourcePath)}
                    aria-label="Copy Python source path"
                    title="Copy Python source path"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      class="h-3.5 w-3.5"
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
                </div>
                <ReadOnlyCodeMirror
                  value={data.pySourceText}
                  language="python"
                  heightClass="h-full"
                />
              </div>
            {/snippet}

            {#snippet b()}
              <div class="flex h-full min-h-0 flex-col">
                <div class="mb-2 flex items-baseline gap-2">
                  <h2 class="text-sm font-semibold tracking-wide text-cyan-300">
                    TypeScript Source
                  </h2>
                  <p class="min-w-0 truncate text-xs text-slate-400">
                    {data.tsSourcePath}
                  </p>
                  <button
                    class="shrink-0 rounded border border-slate-700 p-1 text-slate-300
                    hover:text-cyan-300"
                    onclick={() => copyText(data.tsSourcePath)}
                    aria-label="Copy TypeScript source path"
                    title="Copy TypeScript source path"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      class="h-3.5 w-3.5"
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
                </div>
                <ReadOnlyCodeMirror
                  value={data.tsSourceText}
                  language="typescript"
                  heightClass="h-full"
                />
              </div>
            {/snippet}
          </SplitPane>
        </aside>
      {/snippet}
    </SplitPane>
  </section>
{/if}
