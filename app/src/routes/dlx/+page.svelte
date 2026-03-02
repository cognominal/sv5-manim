<script lang="ts">
  import {
    activeCellsFromRow,
    activeColumnsFromRow,
    buildRowMap,
    hasOne,
    twoByTwoColumns,
    twoByTwoRows,
    type Cell,
    type Column,
  } from '../../../../src/lib/dlx';
  import { Create, Rect, Scene } from '../../../../src/lib/manim';
  import MatrixTableSvg from '../../../../src/lib/renderers/svg/MatrixTableSvg.svelte';
  import SceneSvg from '../../../../src/lib/renderers/svg/SceneSvg.svelte';

  const boardCells: Cell[] = ['c00', 'c01', 'c10', 'c11'];
  const rowByName = buildRowMap(twoByTwoRows);

  const previewScene = new Scene();
  previewScene.wait(1, {
    label: 'Idle',
    note: 'Preview phase: rows are shown one by one.',
  });

  for (const row of twoByTwoRows) {
    const rowNode = new Rect(`row-${row.name}`, 1, 1);
    previewScene.play(Create(rowNode), {
      meta: {
        label: `Preview ${row.name}`,
        rowName: row.name,
        note: `Active row ${row.name}: ${row.piece} + ${row.cells.join(', ')}`,
      },
    });
  }

  const isTestMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('test') === '1';

  let stepIndex = $state(0);
  let isPlaying = $state(!isTestMode);
  const tickMs = 850;

  const currentStep = $derived(previewScene.timeline[stepIndex]);
  const currentStepLabel = $derived(currentStep?.meta?.label ?? 'Step');
  const currentStepNote = $derived(currentStep?.meta?.note ?? '');
  const activeRowName = $derived(currentStep?.meta?.rowName);

  const activeRow = $derived(
    activeRowName ? rowByName.get(activeRowName) : undefined,
  );

  const activeColumns = $derived.by(() => activeColumnsFromRow(activeRow));
  const activeBoardCells = $derived.by(() => activeCellsFromRow(activeRow));

  function isColumnActive(column: Column): boolean {
    return activeColumns.has(column);
  }

  function nextStep(): void {
    stepIndex = (stepIndex + 1) % previewScene.timeline.length;
  }

  function previousStep(): void {
    stepIndex =
      (stepIndex - 1 + previewScene.timeline.length) %
      previewScene.timeline.length;
  }

  function reset(): void {
    stepIndex = 0;
    isPlaying = false;
  }

  $effect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      nextStep();
    }, tickMs);
    return () => clearInterval(timer);
  });
</script>

<section class="space-y-4">
  <header class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <h1 class="text-2xl font-semibold">DLX 2x2 Matrix Preview</h1>
    <p class="subtitle mt-2 text-slate-300">
      Manim-like table styling and row preview behavior.
    </p>
  </header>

  <div class="layout rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <div class="table-wrap" role="region" aria-label="Exact cover matrix">
      <MatrixTableSvg
        columns={twoByTwoColumns}
        rows={twoByTwoRows}
        {hasOne}
        isColumnActive={isColumnActive}
        isRowActive={(rowName) => activeRowName === rowName}
      />
    </div>

    <aside class="status-panel rounded-lg border border-slate-700 bg-slate-950/70">
      <p class="step" data-testid="step-label">
        <strong>{currentStepLabel}</strong>
      </p>
      <p data-testid="step-note">{currentStepNote}</p>
      <p>Phase: row preview</p>

      <SceneSvg scene={previewScene} currentIndex={stepIndex} />

      <svg class="dlx-board" viewBox="0 0 218 218" role="img" aria-label="2x2 board">
        {#each boardCells as cell, i}
          {@const x = (i % 2) * 109}
          {@const y = Math.floor(i / 2) * 109}
          <rect
            x={x + 5}
            y={y + 5}
            width="99"
            height="99"
            rx="8"
            class:board-active={activeBoardCells.has(cell)}
            data-testid={`board-${cell}`}
          />
          <text x={x + 54.5} y={y + 59} text-anchor="middle">{cell}</text>
        {/each}
      </svg>

      <div class="controls" aria-label="Animation controls">
        <button type="button" class="dlx-button" onclick={previousStep}>Prev</button>
        <button
          type="button"
          class="dlx-button"
          onclick={() => (isPlaying = !isPlaying)}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button type="button" class="dlx-button" onclick={nextStep}>Next</button>
        <button type="button" class="dlx-button" onclick={reset}>Reset</button>
      </div>
    </aside>
  </div>
</section>

<style>
  .subtitle {
    color: var(--dlx-subtext);
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(680px, 1fr) minmax(260px, 340px);
    gap: 1rem;
    align-items: start;
  }

  .table-wrap {
    overflow: auto;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  :global(.dlx-matrix-svg) {
    min-width: 882px;
  }

  .status-panel {
    padding: 0.9rem;
  }

  .status-panel p {
    margin: 0.35rem 0;
  }

  .status-panel .step {
    color: #ffd48f;
  }

  .dlx-board {
    margin-top: 0.6rem;
    width: 100%;
    max-width: 220px;
  }

  .dlx-board rect {
    stroke-width: 2;
  }

  .dlx-board text {
    fill: #fff;
    font-family: var(--dlx-font-ui);
    font-size: 14px;
    pointer-events: none;
  }

  .controls {
    margin-top: 0.85rem;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .dlx-button {
    border-radius: 6px;
    padding: 0.35rem 0.7rem;
  }

  @media (max-width: 980px) {
    .layout {
      grid-template-columns: 1fr;
    }

    :global(.dlx-matrix-svg) {
      min-width: 760px;
    }

    :global(.dlx-matrix-svg .matrix-header),
    :global(.dlx-matrix-svg .matrix-row-label),
    :global(.dlx-matrix-svg .matrix-one) {
      font-size: 1.3rem;
    }
  }
</style>
