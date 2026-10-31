/* eslint-env node */
// The Playwright config of the browser perf suites (03). It does not import the root playwright.config.ts: one
// worker, no retries, no webServer (the pages are served by context.route from the target's builds).
// CommonJS on purpose: the package configs are loaded as CommonJS, and a .ts file under perf/ ("type": "module") that
// they import would be compiled to CommonJS and then run by Node as an ES module. The spec, the global setup and the
// reporter are ES modules that Playwright loads by path.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

const browserDir = __dirname;
const resultsDir = path.join(browserDir, "..", "results");

function perfConfig(suite) {
  // The spec, the global setup and the reporter read the suite from here, in every Playwright process.
  process.env.PERF_SUITE = suite;
  return {
    testDir: browserDir,
    testMatch: "**/*.perf.spec.ts",
    workers: 1,
    retries: 0,
    fullyParallel: false,
    // A scenario takes under a minute at normal speed; a hung one fails alone and the suite stays inside 8 min.
    timeout: 3 * 60000,
    outputDir: path.join(resultsDir, "playwright"),
    globalSetup: path.join(browserDir, "global-setup.ts"),
    reporter: [["line"], [path.join(browserDir, "perf-reporter.ts")]],
    use: { browserName: "chromium", headless: true, viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 }
  };
}

module.exports = { perfConfig };
