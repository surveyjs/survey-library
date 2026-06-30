import { defineConfig } from "vitest/config";
import * as path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: false,
    include: ["tests/**/*.ts"],
    exclude: [
      "tests/vitest.setup.ts",
      "tests/test-helpers.ts",
      "tests/oldTheme.ts",
      "node_modules/**",
      "build/**",
    ],
    setupFiles: ["./tests/vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "survey-core": path.resolve(__dirname, "./entries/index.ts"),
    },
  },
});
