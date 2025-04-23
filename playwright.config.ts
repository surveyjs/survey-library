import { defineConfig } from "@playwright/test";
import { resolve } from "path";
export default defineConfig({
  retries: process.env.CI ? 3 : 0,
  webServer: {
    command: "",
    url: "http://localhost:8080"
  },
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  reporter: [["junit", { outputFile: "test-results/e2e-junit-results.xml" }], ["html", { open: "never" }]],
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