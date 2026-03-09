import adapterNode from '@sveltejs/adapter-node';
import adapterVercel from '@sveltejs/adapter-vercel';
import type { Config } from '@sveltejs/kit';

function buildAdapter() {
  if (process.env.TAURI === '1' || process.env.TAURI_SERVER === '1') {
    return adapterNode({
      out: 'build',
      precompress: false
    });
  }

  return adapterVercel({
    runtime: 'nodejs22.x',
  });
}

const config: Config = {
  vitePlugin: {
    inspector: {
      toggleKeyCombo: 'alt-x',
    },
  },
  kit: {
    adapter: buildAdapter(),
  },
};

export default config;
