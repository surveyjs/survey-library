import { frameworks, url, initSurvey, test } from "../helper";
import { expect, Page, Locator } from "@playwright/test";
import { Survey } from "../surveyHelper";

const title = "slider";

async function slideToValue({ page, value, thumbIndex = 0 }: { page: Page, value: number, thumbIndex?: number }):Promise<void> {
  await page.locator(".sd-slider__thumb-container").nth(thumbIndex).hover({ force: true });
  await page.mouse.down();
  await page.getByText("" + value, { exact: true }).hover();
  await page.mouse.up();
}

async function getInput({ page, thumbIndex = 0 }: { page: Page, thumbIndex?: number }):Promise<Locator> {
  return await page.locator(".sd-slider-container .sd-slider__input").nth(thumbIndex);
}

async function slideRangeToValue({ page, value, rangeIndex = 0 }: { page: Page, value: number, rangeIndex?: number }):Promise<void> {
  await page.locator(".sd-slider__range-track").nth(rangeIndex).hover({ force: true });
  await page.mouse.down();
  await page.getByText("" + value, { exact: true }).hover();
  await page.mouse.up();
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
      await initSurvey(page, framework, json);
      const thumbIndex = 0;
      const input = await getInput({ page, thumbIndex });
      await slideToValue({
        page, value: 60, thumbIndex
      });
      await expect(input).toHaveValue("60");
      await page.getByText("40", { exact: true }).click();
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
      await initSurvey(page, framework, json);
      const thumbIndex1 = 0;
      const thumbIndex2 = 1;
      const input1 = await getInput({ page, thumbIndex: thumbIndex1 });
      const input2 = await getInput({ page, thumbIndex: thumbIndex2 });
      await slideToValue({
        page, value: 20, thumbIndex: thumbIndex1
      });
      await slideToValue({
        page, value: 80, thumbIndex: thumbIndex2
      });
      await expect(input1).toHaveValue("20");
      await expect(input2).toHaveValue("80");
      await new Survey(page).checkData({ q1: [20, 80] });
      await page.getByText("40", { exact: true }).click();
      await new Survey(page).checkData({ q1: [40, 80] });
      await page.getByText("60", { exact: true }).click();
      await page.getByText("100", { exact: true }).click();
      await expect(input1).toHaveValue("60");
      await expect(input2).toHaveValue("100");
      await new Survey(page).checkData({ q1: [60, 100] });
      await slideToValue({
        page, value: 20, thumbIndex: thumbIndex2 // thumbs swap
      });
      await new Survey(page).checkData({ q1: [20, 60] });
      await slideToValue({
        page, value: 0, thumbIndex: thumbIndex1
      });
      await new Survey(page).checkData({ q1: [0, 60] });
    });
    test("Slider: Default Value and AllowClear=true: Range Mode", async ({ page }) => {
      const json = {
        elements: [{
          type: "slider",
          sliderType: "range",
          defaultValue: [30, 70],
          allowClear: true,
          name: "q1"
        }],
      };
      await initSurvey(page, framework, json);
      const input1 = await getInput({ page, thumbIndex: 0 });
      const input2 = await getInput({ page, thumbIndex: 1 });
      await expect(input1).toHaveValue("30");
      await expect(input2).toHaveValue("70");
      await new Survey(page).checkData({ q1: [30, 70] });
      await page.getByText("Clear", { exact: true }).click();
      await expect(input1).toHaveValue("0");
      await expect(input2).toHaveValue("100");
      await new Survey(page).checkData({});
    });
    test("Slider: Drag Range: Range Mode", async ({ page }) => {
      const json = {
        elements: [{
          type: "slider",
          sliderType: "range",
          defaultValue: [40, 60],
          name: "q1"
        }],
      };
      await initSurvey(page, framework, json);
      const input1 = await getInput({ page, thumbIndex: 0 });
      const input2 = await getInput({ page, thumbIndex: 1 });
      await slideRangeToValue({
        page, value: 20
      });
      await expect(input1).toHaveValue("12");
      await expect(input2).toHaveValue("32");
      await new Survey(page).checkData({ q1: [12, 32] });
    });
    test("Slider: AlloSwap=false: Range Mode", async ({ page }) => {
      const json = {
        elements: [{
          type: "slider",
          sliderType: "range",
          allowSwap: false,
          defaultValue: [40, 60],
          name: "q1"
        }],
      };
      await initSurvey(page, framework, json);
      await slideToValue({
        page, value: 20, thumbIndex: 1 // thumbs swap
      });
      await new Survey(page).checkData({ q1: [40, 60] });
    });
    test("Slider: Discrete Value: Range Mode", async ({ page }) => {
      const json = {
        elements: [{
          type: "slider",
          sliderType: "range",
          step: 40,
          defaultValue: [40, 80],
          name: "q1"
        }],
      };
      await initSurvey(page, framework, json);
      await page.getByText("20", { exact: true }).click();
      await new Survey(page).checkData({ q1: [0, 80] });
      await page.getByText("60", { exact: true }).click();
      await new Survey(page).checkData({ q1: [0, 40] });
    });

  });
});