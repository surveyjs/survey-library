import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    setupFiles: ["./vitest.setup.ts"],
    environment: "jsdom",
    deps: {
      inline: ["vitest-canvas-mock"],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "survey-core": fileURLToPath(
        new URL("../../build/survey-core", import.meta.url)
      ),
    },
  },
});
