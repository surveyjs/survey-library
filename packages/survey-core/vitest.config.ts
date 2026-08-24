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
      "tests/legacy-theme-vars.ts",
      "tests/linter/lint-test-helpers.ts",
      "node_modules/**",
      "build/**",
    ],
    setupFiles: ["./tests/vitest.setup.ts"],
  },
  resolve: {
    alias: {
      // The longer path first: the aliases are prefix matches applied in order.
      "survey-core/tester": path.resolve(__dirname, "./entries/tester.ts"),
      "survey-core": path.resolve(__dirname, "./entries/index.ts"),
    },
  },
});
