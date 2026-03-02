import type { Column, PreviewStep, RowDef } from '../model';

export const twoByTwoColumns: Column[] = ['A', 'B', 'c00', 'c01', 'c10', 'c11'];

export const twoByTwoRows: RowDef[] = [
  { name: 'A_h_r0', piece: 'A', cells: ['c00', 'c01'] },
  { name: 'A_h_r1', piece: 'A', cells: ['c10', 'c11'] },
  { name: 'A_v_c0', piece: 'A', cells: ['c00', 'c10'] },
  { name: 'A_v_c1', piece: 'A', cells: ['c01', 'c11'] },
  { name: 'B_h_r0', piece: 'B', cells: ['c00', 'c01'] },
  { name: 'B_h_r1', piece: 'B', cells: ['c10', 'c11'] },
  { name: 'B_v_c0', piece: 'B', cells: ['c00', 'c10'] },
  { name: 'B_v_c1', piece: 'B', cells: ['c01', 'c11'] },
];

export const twoByTwoPreviewSteps: PreviewStep[] = [
  { label: 'Idle', note: 'Preview phase: rows are shown one by one.' },
  ...twoByTwoRows.map((row) => ({
    label: `Preview ${row.name}`,
    rowName: row.name,
    note: `Active row ${row.name}: ${row.piece} + ${row.cells.join(', ')}`,
  })),
];
