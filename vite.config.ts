import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { isPixiVueElement } from "./src/isPixiVueElement";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: isPixiVueElement,
        },
      },
    }),
    dts({
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/entry.ts"),
      name: "PixiVue",
      fileName: "pixi-vue",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue", "pixi.js", "@pixi/layout"],
    },
    sourcemap: true, // 生成 source map
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "#": resolve(__dirname, "src"),
    },
  },
};
