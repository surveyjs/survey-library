import { defineConfig } from "vitest/config";
import * as path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: false,
    include: ["tests/**/*.ts"],
    exclude: [
      "tests/vitest.setup.ts",
      "tests/typings/**",
      "tests/test-helpers.ts",
      "tests/test-baseline.ts",
      "tests/dynamic-data/rebind-conformance.ts",
      "tests/oldTheme.ts",
      "tests/legacy-theme-vars.ts",
      "tests/linter/lint-test-helpers.ts",
      "tests/collaboration/collab-test-helpers.ts",
      "tests/dynamic-data/page-window-helpers.ts",
      "tests/dynamic-data/paging-write-costs-helpers.ts",
      "tests/dynamic-data/remote-source-integration-helpers.ts",
      "tests/linter/lint-fixtures.ts",
      "tests/expressions/oracle/**",
      "node_modules/**",
      "build/**",
    ],
    setupFiles: ["./tests/vitest.setup.ts"],
    // Startup is most of the run: a new jsdom and a reload of all of src for each file.
    // Without isolation a leak can fail an unrelated file; test:isolated tells them apart.
    isolate: false,
  },
  resolve: {
    alias: {
      // The longer path first: the aliases are prefix matches applied in order.
      "survey-core/interview": path.resolve(__dirname, "./entries/interview.ts"),
      "survey-core/collaboration": path.resolve(__dirname, "./entries/collaboration.ts"),
      "survey-core/tester": path.resolve(__dirname, "./entries/tester.ts"),
      "survey-core": path.resolve(__dirname, "./entries/index.ts"),
    },
  },
});
