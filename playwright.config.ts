import { defineConfig, type ReporterDescription } from "@playwright/test";
import { availableParallelism, totalmem } from "os";
import { resolve } from "path";

// Azure Pipelines sets TF_BUILD=True on every agent but does not promise CI; other CI systems set CI.
const isCI = !!process.env.TF_BUILD || !!process.env.CI;

const reporters: ReporterDescription[] = [
  ["line"],
  ["junit", { outputFile: "test-results/e2e-junit-results.xml" }],
  ["json", { outputFile: "test-results/results.json" }]
];
// CI publishes test-results/ only, so the HTML report is written for local runs alone.
if (!isCI) {
  reporters.push(["html", { open: "never", printSteps: false }]);
}

export default defineConfig({
  // CI needs at least one retry: the flaky-test pipeline picks the tests that results.json marks "flaky".
  // Two also cover a test that flakes twice. Locally a failure shows at once.
  retries: isCI ? 2 : 0,
  // Stops a broken build early. Only tests that still fail after their last retry count, flaky ones do not.
  maxFailures: isCI ? 20 : 0,
  // CI keeps Playwright's default (half the logical CPUs) until the agent size is known.
  ...(isCI ? {} : { workers: "75%" }),
  // The machine the run used, written to config.metadata in results.json.
  metadata: {
    cpus: availableParallelism(),
    totalMemGB: Math.round(totalmem() / 1024 ** 3 * 10) / 10
  },
  fullyParallel: true,
  expect: {
    toHaveScreenshot: { threshold: 0.02 }
  },
  webServer: {
    command: "",
    url: "http://localhost:8080"
  },
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  reporter: reporters,
  use: {
    launchOptions: {
      // Disable LCD (subpixel) text antialiasing so text always renders with grayscale
      // antialiasing. Chromium switches between the two modes depending on compositing
      // state (e.g. a freshly opened popup renders grayscale until its composited layer is
      // released ~1-2s later), which made screenshot tests flaky. All baselines are captured
      // with this flag; removing it invalidates them.
      args: ["--disable-lcd-text", "--disable-partial-raster"],
    }
  },
  projects: [
    {
      name: "a11y",
      testDir: resolve(__dirname, "./accessibilityTests")
    },
    {
      name: "vrt",
      testDir: resolve(__dirname, "./screenshots")
    },
    {
      name: "e2e",
      testDir: resolve(__dirname, "./e2e"),
      // About 2.4 times the slowest passing e2e test measured on one worker (8.4 s), so a hung test stops
      // early. vrt and a11y keep the 30 s default: a VRT test takes several screenshots, each with its own
      // 10 s timeout.
      timeout: 20000,
      use: {
        contextOptions: {
          permissions: ["clipboard-read", "clipboard-write"],
        },
      },
    }
  ]
});
