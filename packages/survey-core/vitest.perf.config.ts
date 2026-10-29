import { defineConfig } from "vitest/config";
import * as path from "path";
import { resolveCoreDir, checkBuildFresh, checkBuildExists, coreBuildHint } from "../../perf/harness/node/build.ts";

// The perf code's own unit tests (perf:test). Timed scenarios never run under Vitest (D05).
const root = path.resolve(__dirname, "../..");
const core = resolveCoreDir();
const main = path.join(core.dir, "fesm", "survey-core.mjs");
const linter = path.join(core.dir, "fesm", "linter", "index.mjs");
const german = path.join(core.dir, "fesm", "i18n", "german.mjs");
if (!process.env.PERF_CORE_DIR) {
  checkBuildFresh([path.join(__dirname, "src"), path.join(__dirname, "entries")], [main, linter, german], coreBuildHint);
} else {
  checkBuildExists([main]);
}

export default defineConfig({
  root: root,
  test: {
    name: "perf-test",
    include: ["perf/**/*.test.ts"],
    exclude: ["perf/results/**", "**/node_modules/**"],
    environment: "node",
    globals: false,
    testTimeout: 120000,
    hookTimeout: 120000,
  },
  resolve: {
    // Exact matches, the linter first: a string key "survey-core" would also match "survey-core/linter" as a prefix.
    alias: [
      { find: /^survey-core\/linter$/, replacement: linter },
      { find: /^survey-core$/, replacement: main },
    ],
  },
});
