import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { manimSourceIdPlugin } from './vite-plugins/manimSourceIdPlugin';
import { pySourcesPlugin } from './vite-plugins/pySourcesPlugin';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          if (id.includes('/@codemirror/')) {
            return 'codemirror';
          }
          if (id.includes('mathjax-full') || id.includes('/katex/')) {
            return 'math';
          }
          return undefined;
        }
      }
    }
  },
  plugins: [
    pySourcesPlugin(),
    manimSourceIdPlugin(),
    tailwindcss(),
    sveltekit()
  ],
});
