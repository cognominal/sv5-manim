import adapter from '@sveltejs/adapter-vercel';
import type { Config } from '@sveltejs/kit';

const config: Config = {
  vitePlugin: {
    inspector: {
      toggleKeyCombo: 'alt-x',
    },
  },
  kit: {
    adapter: adapter({
      runtime: 'nodejs22.x',
    }),
  },
};

export default config;
