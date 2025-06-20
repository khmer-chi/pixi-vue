import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("pixi-"),
        },
      },
    }),
    dts({
      rollupTypes: true,
    }),
    AutoImport({
      imports: [
        "vue",
        {
          //使用程式掃描
          "types/index": ["PixiText"],
        },
      ],
      dts: "./auto-imports.d.ts",
      vueTemplate: true,
      viteOptimizeDeps: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/entry.tsx"),
      name: "PixiVue",
      fileName: "pixi-vue",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue"],
    },
  },
  resolve: {
    alias: {
      "#": resolve(__dirname, "src"),
    },
  },
};
