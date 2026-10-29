import { defineConfig } from "@playwright/test";
import { resolve } from "path";
export default defineConfig({
  retries: 4,
  fullyParallel: true,
  expect: {
    toHaveScreenshot: { threshold: 0.02 }
  },
  webServer: {
    command: "",
    url: "http://localhost:8080"
  },
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  reporter: [
    ["line"],
    ["junit", { outputFile: "test-results/e2e-junit-results.xml" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["html", { open: "never", printSteps: false }]
  ],
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
      use: {
        contextOptions: {
          permissions: ["clipboard-read", "clipboard-write"],
        },
      },
    }
  ]
});
