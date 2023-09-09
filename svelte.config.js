// @ts-check

import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// /** @type { import("@sveltejs/kit").UserConfig } */
export default {
  preprocess: [vitePreprocess()]
};