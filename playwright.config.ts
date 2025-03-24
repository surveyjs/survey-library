import { defineConfig } from "@playwright/test";
import { resolve } from "path";
export default defineConfig({
  webServer: {
    command: "",
    url: "http://localhost:8080"
  },
  projects: [
    {
      name: "a11y",
      testDir: resolve(__dirname, "./accessibilityTests")
    },
    {
      name: "vrt",
      testDir: resolve(__dirname, "./visualRegressionTests")
    },
    {
      name: "e2e",
      testDir: resolve(__dirname, "./functionalTests")
    }
  ]
});