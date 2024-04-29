import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import copy from "rollup-plugin-copy";
import generatePackageJson from "rollup-plugin-generate-package-json";
const json = require("./publish/package.json");
const packageJson = require("./package.json");
json.version = packageJson.version;
json.peerDependencies["survey-core"] = json.version;

const libraryName = "survey-vue3-ui";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    build: {
      sourcemap: mode == "development",
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

        plugins: [
          copy({
            targets: [
              { src: "./README.md", dest: "../../build/survey-vue3-ui" },
            ],
          }),
          generatePackageJson({
            inputFolder: "publish",
            outputFolder: "../../build/survey-vue3-ui",
            baseContents: json,
          }),
        ],
        output: { globals: { vue: "Vue", "survey-core": "Survey" } },
      },
    },
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
