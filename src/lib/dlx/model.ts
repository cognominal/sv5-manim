export type Cell = 'c00' | 'c01' | 'c10' | 'c11';

export type Piece = 'A' | 'B';

export type Column = Piece | Cell;

export type RowDef = {
  name: string;
  piece: Piece;
  cells: [Cell, Cell];
};

export type PreviewStep = {
  label: string;
  rowName?: string;
  note: string;
};

export function hasOne(row: RowDef, column: Column): boolean {
  return row.piece === column || row.cells.includes(column as Cell);
}

export function buildRowMap(rows: RowDef[]): Map<string, RowDef> {
  return new Map(rows.map((row) => [row.name, row]));
}

export function activeColumnsFromRow(row?: RowDef): Set<Column> {
  const columns = new Set<Column>();
  if (!row) return columns;
  columns.add(row.piece);
  columns.add(row.cells[0]);
  columns.add(row.cells[1]);
  return columns;
}

export function activeCellsFromRow(row?: RowDef): Set<Cell> {
  const cells = new Set<Cell>();
  if (!row) return cells;
  cells.add(row.cells[0]);
  cells.add(row.cells[1]);
  return cells;
}
