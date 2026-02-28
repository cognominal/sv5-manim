<script lang="ts">
  type Cell = 'c00' | 'c01' | 'c10' | 'c11';
  type Piece = 'A' | 'B';
  type Column = Piece | Cell;

  type RowDef = {
    name: string;
    piece: Piece;
    cells: [Cell, Cell];
  };

  type PreviewStep = {
    label: string;
    rowName?: string;
    note: string;
  };

  const columns: Column[] = ['A', 'B', 'c00', 'c01', 'c10', 'c11'];

  const rows: RowDef[] = [
    { name: 'A_h_r0', piece: 'A', cells: ['c00', 'c01'] },
    { name: 'A_h_r1', piece: 'A', cells: ['c10', 'c11'] },
    { name: 'A_v_c0', piece: 'A', cells: ['c00', 'c10'] },
    { name: 'A_v_c1', piece: 'A', cells: ['c01', 'c11'] },
    { name: 'B_h_r0', piece: 'B', cells: ['c00', 'c01'] },
    { name: 'B_h_r1', piece: 'B', cells: ['c10', 'c11'] },
    { name: 'B_v_c0', piece: 'B', cells: ['c00', 'c10'] },
    { name: 'B_v_c1', piece: 'B', cells: ['c01', 'c11'] },
  ];

  const steps: PreviewStep[] = [
    { label: 'Idle', note: 'Preview phase: rows are shown one by one.' },
    ...rows.map((row) => ({
      label: `Preview ${row.name}`,
      rowName: row.name,
      note: `Active row ${row.name}: ${row.piece} + ${row.cells.join(', ')}`,
    })),
  ];

  const rowByName = new Map(rows.map((row) => [row.name, row]));

  let stepIndex = $state(0);
  let isPlaying = $state(true);
  const tickMs = 850;

  const currentStep = $derived(steps[stepIndex]);
  const activeRow = $derived(currentStep.rowName ? rowByName.get(currentStep.rowName) : undefined);

  const activeColumns = $derived.by(() => {
    const cols = new Set<Column>();
    if (activeRow) {
      cols.add(activeRow.piece);
      cols.add(activeRow.cells[0]);
      cols.add(activeRow.cells[1]);
    }
    return cols;
  });

  const activeBoardCells = $derived.by(() => {
    const cells = new Set<Cell>();
    if (activeRow) {
      cells.add(activeRow.cells[0]);
      cells.add(activeRow.cells[1]);
    }
    return cells;
  });

  function hasOne(row: RowDef, column: Column): boolean {
    return row.piece === column || row.cells.includes(column as Cell);
  }

  function isColumnActive(column: Column): boolean {
    return activeColumns.has(column);
  }

  function nextStep(): void {
    stepIndex = (stepIndex + 1) % steps.length;
  }

  function previousStep(): void {
    stepIndex = (stepIndex - 1 + steps.length) % steps.length;
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

<main>
  <h1>DLX 2x2 Matrix Preview</h1>
  <p class="subtitle">Manim-like table styling and row preview behavior (first port slice)</p>

  <section class="layout">
    <div class="table-wrap" role="region" aria-label="Exact cover matrix">
      <table class="dlx-table">
        <thead>
          <tr>
            <th class="row-col">row</th>
            {#each columns as column}
              <th class:active-col={isColumnActive(column)}>{column}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each rows as row}
            <tr class:active-row={currentStep.rowName === row.name}>
              <td class="row-name">{row.name}</td>
              {#each columns as column}
                <td class:active-col={isColumnActive(column)}>
                  {#if hasOne(row, column)}1{/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <aside class="status-panel">
      <p class="step"><strong>{currentStep.label}</strong></p>
      <p>{currentStep.note}</p>
      <p>Phase: row preview</p>

      <svg viewBox="0 0 218 218" role="img" aria-label="2x2 board">
        {#each ['c00', 'c01', 'c10', 'c11'] as cell, i}
          {@const x = (i % 2) * 109}
          {@const y = Math.floor(i / 2) * 109}
          <rect
            x={x + 5}
            y={y + 5}
            width="99"
            height="99"
            rx="8"
            class:board-active={activeBoardCells.has(cell as Cell)}
          />
          <text x={x + 54.5} y={y + 59} text-anchor="middle">{cell}</text>
        {/each}
      </svg>

      <div class="controls" aria-label="Animation controls">
        <button type="button" onclick={previousStep}>Prev</button>
        <button type="button" onclick={() => (isPlaying = !isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button type="button" onclick={nextStep}>Next</button>
        <button type="button" onclick={reset}>Reset</button>
      </div>
    </aside>
  </section>
</main>
