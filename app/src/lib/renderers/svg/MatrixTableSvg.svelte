<script lang="ts">
  import type { Column, RowDef } from '../../dlx/model';

  type Props = {
    columns: Column[];
    rows: RowDef[];
    isColumnActive: (column: Column) => boolean;
    isRowActive: (rowName: string) => boolean;
    hasOne: (row: RowDef, column: Column) => boolean;
    testId?: string;
  };

  const {
    columns,
    rows,
    isColumnActive,
    isRowActive,
    hasOne,
    testId = 'matrix-table',
  }: Props = $props();

  const firstColWidth = 270;
  const colWidth = 102;
  const rowHeight = 58;

  const width = $derived(firstColWidth + columns.length * colWidth);
  const height = $derived(rowHeight * (rows.length + 1));
</script>

<svg
  class="dlx-matrix-svg"
  viewBox={`0 0 ${width} ${height}`}
  role="img"
  aria-label="Exact cover matrix"
  data-testid={testId}
>
  <rect x="0" y="0" width={width} height={height} class="matrix-bg" />

  {#if columns.length > 0}
    <rect
      x={firstColWidth}
      y="0"
      width={colWidth * columns.length}
      height={height}
      class="matrix-active-band"
    />
  {/if}

  {#each columns as column, i}
    {@const x = firstColWidth + i * colWidth}
    {#if isColumnActive(column)}
      <rect
        x={x}
        y="0"
        width={colWidth}
        height={height}
        class="matrix-active-col"
        data-testid={`header-${column}`}
      />
    {:else}
      <rect
        x={x}
        y="0"
        width={colWidth}
        height={height}
        class="matrix-col"
        data-testid={`header-${column}`}
      />
    {/if}
  {/each}

  {#each rows as row, r}
    {@const y = rowHeight * (r + 1)}
    <rect
      x="0"
      y={y}
      width={width}
      height={rowHeight}
      class:matrix-active-row={isRowActive(row.name)}
      class="matrix-row"
      data-testid={`row-${row.name}`}
    />
  {/each}

  {#each columns as column, i}
    <text
      x={firstColWidth + i * colWidth + colWidth / 2}
      y={rowHeight / 2 + 12}
      text-anchor="middle"
      class="matrix-header"
    >
      {column}
    </text>
  {/each}

  <text x={firstColWidth / 2} y={rowHeight / 2 + 12} text-anchor="middle" class="matrix-header">
    row
  </text>

  {#each rows as row, r}
    {@const y = rowHeight * (r + 1)}
    <text x={firstColWidth / 2} y={y + rowHeight / 2 + 12} text-anchor="middle" class="matrix-row-label">
      {row.name}
    </text>
    {#each columns as column, c}
      {#if hasOne(row, column)}
        <text
          x={firstColWidth + c * colWidth + colWidth / 2}
          y={y + rowHeight / 2 + 12}
          text-anchor="middle"
          class="matrix-one"
        >
          1
        </text>
      {/if}
    {/each}
  {/each}

  <g class="matrix-grid">
    {#each Array(rows.length + 2) as _, i}
      <line x1="0" y1={i * rowHeight} x2={width} y2={i * rowHeight} />
    {/each}
    <line x1={firstColWidth} y1="0" x2={firstColWidth} y2={height} />
    {#each columns as _, i}
      <line
        x1={firstColWidth + (i + 1) * colWidth}
        y1="0"
        x2={firstColWidth + (i + 1) * colWidth}
        y2={height}
      />
    {/each}
  </g>
</svg>
