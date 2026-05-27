import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, "./package.json"), "utf-8"));

// https://vitest.dev/config/
export default defineConfig({
  define: {
    "process.env.VERSION": JSON.stringify(pkg.version),
    "process.env.RELEASE_DATE": JSON.stringify(new Date().toISOString().slice(0, 10)),
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  test: {
    setupFiles: ["./vitest.setup.ts"],
    environment: "jsdom",
    deps: {
      inline: ["vitest-canvas-mock"],
    },
  },
  resolve: {
    dedupe: ["survey-core"],
    alias: {
      "react/jsx-runtime": resolve(__dirname, "./node_modules/preact/jsx-runtime"),
      "react-dom/test-utils": resolve(__dirname, "./node_modules/preact/test-utils"),
      "react-dom": resolve(__dirname, "./node_modules/preact/compat"),
      "react": resolve(__dirname, "./node_modules/preact/compat"),
      "survey-core/icons/iconsV1": resolve(__dirname, "./node_modules/survey-core/icons/iconsV1"),
      "survey-core/icons/iconsV2": resolve(__dirname, "./node_modules/survey-core/icons/iconsV2"),
    },
  },
});
