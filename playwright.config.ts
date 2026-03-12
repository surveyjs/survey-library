import { defineConfig } from "@playwright/test";
import { resolve } from "path";
export default defineConfig({
  retries: 2,
  fullyParallel: true,
  webServer: {
    command: "",
    url: "http://localhost:8080"
  },
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  reporter: [["line"], ["junit", { outputFile: "test-results/e2e-junit-results.xml" }], ["html", { open: "never", printSteps: false }]],
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
      testDir: resolve(__dirname, "./e2e")
    }
  ]
});
