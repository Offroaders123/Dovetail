import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        app: "./index.html",
        "service-worker": "./src/service-worker.ts"
      },
      output: {
        entryFileNames(chunkInfo): string {
          switch (chunkInfo.name){
            case "service-worker": return "[name].js";
            default: return "asserts/js/[name]-[hash].js";
          }
        },
      }
    }
  },
  server: {
    port: 5500,
    strictPort: true
  },
  preview: {
    port: 5500,
    strictPort: true
  }
});