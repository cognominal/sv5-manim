declare module '@rich_harris/svelte-split-pane/src/lib/index.js' {
  import type { Component } from 'svelte';

  export const SplitPane: Component<{
    type: 'columns' | 'rows';
    id?: string;
    pos?: string;
    min?: string;
    max?: string;
    disabled?: boolean;
    a?: unknown;
    b?: unknown;
  }>;
}
