import { defineConfig } from "vitest/config";
import * as fs from "fs";
import * as path from "path";
import fg from "fast-glob";

// During the QUnit -> Vitest migration, both runners coexist. Only files that have
// been converted (i.e., they import from "vitest") should be picked up by Vitest.
// Un-converted files still rely on the global `QUnit` provided by Karma.
const allTestFiles = fg.sync("tests/**/*.ts", {
  cwd: __dirname,
  ignore: ["tests/entries/**", "tests/bundle/**", "node_modules/**", "build/**"],
});
const vitestFiles = allTestFiles.filter((f) => {
  const content = fs.readFileSync(path.resolve(__dirname, f), "utf8");
  return /from\s+["']vitest["']/.test(content);
});

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: false,
    include: vitestFiles,
    exclude: [
      "tests/entries/**",
      "tests/bundle/**",
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
