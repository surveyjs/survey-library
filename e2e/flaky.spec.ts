import { frameworks, url, initSurvey, getSurveyResult, test, expect, getButtonByText } from "./helper";

// INTENTIONALLY FLAKY TEST - for verifying CI flaky-test detection / retry handling.
//
// This file exists ONLY to exercise tooling that detects or retries unstable tests.
// It is NOT a real product test and does NOT cover any survey-react-ui behaviour.
// Because the shared Playwright config uses `retries: 4`, an attempt that fails ~50%
// of the time will usually pass on a later retry, so Playwright reports the test as
// "flaky" (yellow) rather than failing the run.
//
// Scoped to the React framework only (the request was for survey-react-ui).

const title = "flaky";

const json = {
  elements: [
    {
      name: "name",
      type: "text",
      title: "Please enter your name:",
    },
  ],
};

frameworks.forEach((framework) => {
  if (framework !== "react") return;

  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("intentionally flaky - random pass/fail (~50%)", async ({ page }) => {
      const coin = Math.random() < 0.5;
      expect(coin, "flaky coin-flip assertion (expected to fail ~50% of attempts)").toBe(true);
    });
  });
});
