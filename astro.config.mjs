// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const yamlEsmEntry = fileURLToPath(new URL('./node_modules/yaml/browser/index.js', import.meta.url));
const picomatchEsmShim = fileURLToPath(new URL('./src/shims/picomatch.ts', import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL ?? process.env.URL ?? 'https://naanii021.github.io',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        yaml: yamlEsmEntry,
        picomatch: picomatchEsmShim,
      },
    },
  },
});
