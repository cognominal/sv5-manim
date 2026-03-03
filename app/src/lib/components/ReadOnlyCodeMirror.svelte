<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { EditorState } from '@codemirror/state';
  import { EditorView } from '@codemirror/view';
  import { python } from '@codemirror/lang-python';
  import { javascript } from '@codemirror/lang-javascript';
  import { oneDark } from '@codemirror/theme-one-dark';

  type Language = 'python' | 'typescript';

  const {
    value,
    language,
    heightClass = 'h-72'
  }: { value: string; language: Language; heightClass?: string } = $props();

  let host: HTMLDivElement | null = null;
  let view: EditorView | null = null;

  function extensionFor(lang: Language) {
    return lang === 'python' ? python() : javascript({ typescript: true });
  }

  function buildEditor(): void {
    if (!host) return;
    view?.destroy();
    const state = EditorState.create({
      doc: value,
      extensions: [
        oneDark,
        extensionFor(language),
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        EditorView.lineWrapping
      ]
    });
    view = new EditorView({ state, parent: host });
  }

  onMount(() => {
    buildEditor();
  });

  $effect(() => {
    value;
    language;
    buildEditor();
  });

  onDestroy(() => {
    view?.destroy();
  });
</script>

<div class={`${heightClass} overflow-hidden rounded-lg border border-slate-700`}>
  <div bind:this={host} class="h-full overflow-hidden"></div>
</div>

<style>
  :global(.cm-editor) {
    height: 100%;
  }

  :global(.cm-scroller) {
    overflow: auto;
  }
</style>
