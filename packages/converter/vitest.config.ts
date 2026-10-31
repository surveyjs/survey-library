import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Node environment: these are pure JSON->JSON transforms plus a survey-core
    // "does it construct with no errors" oracle. No DOM needed.
    environment: "node",
    globals: false,
    include: [
      "src/**/*.spec.ts",
      "corpus/**/*.spec.ts"
    ],
    exclude: [
      "node_modules/**",
      "dist/**"
    ]
  }
});
