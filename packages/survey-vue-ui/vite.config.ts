import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const libraryName = "survey-vue-ui";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({ style: { filename: libraryName + ".css" } })],

  build: {
    // Output compiled files to /dist.
    outDir: "../../build/survey-vue3-ui",
    lib: {
      // Set the entry point (file that contains our components exported).
      entry: resolve(__dirname, "src/index.ts"),
      // Name of the library.
      name: "SurveyVue",
      // We are building for CJS and ESM, use a function to rename automatically files.
      // Example: my-component-library.esm.js
      fileName: (format) => `${libraryName}.${format}.js`,
    },
    rollupOptions: {
      // Vue is provided by the parent project, don't compile Vue source-code inside our library.
      external: ["vue", "survey-core"],
      output: { globals: { vue: "Vue", "survey-core": "Survey" } },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
