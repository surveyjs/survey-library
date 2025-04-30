import { frameworks, url, initSurvey } from "../helper";
import { test, expect } from "@playwright/test";

const title = "slider";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });
    test("Slider: Choose Value: Single Mode", async ({ page }) => {
      const json = {
        elements: [{
          type: "slider",
          sliderType: "single",
          name: "q1"
        }],
      };
      await initSurvey(page, framework, json);

      // await page.$eval("#sjs-slider-input-0", (e:HTMLInputElement, value) => {
      //   e.value = "60";
      //   e.dispatchEvent(new Event("input", { "bubbles": true }));
      //   e.dispatchEvent(new Event("change", { "bubbles": true }));
      // }, 0.5);
      await page.locator("#sjs-slider-input-0").fill("60");
      await expect(page.locator("#sjs-slider-input-0")).toHaveValue("60");
      await page.getByText("40").click();
      await expect(page.locator("#sjs-slider-input-0")).toHaveValue("40");
    });
  });
});