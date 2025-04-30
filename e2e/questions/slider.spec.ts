import { frameworks, url, initSurvey } from "../helper";
import { test, expect, Page, Locator } from "@playwright/test";
import { Survey } from "../surveyHelper";

const title = "slider";

async function slideToValue({ page, value, thumbIndex = 0 }: { page: Page, value: number, thumbIndex: number }):Promise<void> {
  await page.locator(".sd-slider__thumb-container").nth(thumbIndex).hover({ force: true });
  await page.mouse.down();
  await page.getByText("" + value).hover();
  await page.mouse.up();
}

async function getInput({ page, thumbIndex = 0 }: { page: Page, thumbIndex: number }):Promise<Locator> {
  return await page.locator(".sd-slider-container .sd-slider__input").nth(thumbIndex);
}

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
      const thumbIndex = 0;
      const input = await getInput({ page, thumbIndex });
      await initSurvey(page, framework, json);
      await slideToValue({
        page, value: 60, thumbIndex
      });
      await expect(input).toHaveValue("60");
      await page.getByText("40").click();
      await expect(input).toHaveValue("40");

      await new Survey(page).checkData({ q1: [40] });
    });
    test("Slider: Choose Value: Range Mode", async ({ page }) => {
      const json = {
        elements: [{
          type: "slider",
          sliderType: "range",
          name: "q1"
        }],
      };
      const thumbIndex1 = 0;
      const thumbIndex2 = 1;
      const input1 = await getInput({ page, thumbIndex: thumbIndex1 });
      const input2 = await getInput({ page, thumbIndex: thumbIndex2 });
      await initSurvey(page, framework, json);
      await slideToValue({
        page, value: 20, thumbIndex: thumbIndex1
      });
      await slideToValue({
        page, value: 80, thumbIndex: thumbIndex2
      });
      await expect(input1).toHaveValue("20");
      await expect(input2).toHaveValue("80");
      await new Survey(page).checkData({ q1: [20, 80] });
      await page.getByText("40").click();
      await new Survey(page).checkData({ q1: [40, 80] });
      await page.getByText("60").click();
      await page.getByText("100").click();
      await expect(input1).toHaveValue("60");
      await expect(input2).toHaveValue("100");
      await new Survey(page).checkData({ q1: [60, 100] });
    });

  });
});