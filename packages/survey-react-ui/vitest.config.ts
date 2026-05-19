import { defineConfig } from "vitest/config";

// https://vitest.dev/config/
export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
    environment: "jsdom",
    deps: {
      inline: ["vitest-canvas-mock"],
    },
  },
  resolve: {
    dedupe: ["survey-core"],
  },
});
