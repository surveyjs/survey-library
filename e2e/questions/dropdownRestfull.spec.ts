import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, getSurveyResult, checkSurveyWithEmptyQuestion, getVisibleListItemByText, getData } from "../helper";

const title = "dropdownRestful";

const changeValue = async (page) => {
  await page.evaluate(() => {
    var q = window["survey"].getQuestionByName("country");
    q.choicesByUrl.valueName = "alpha2_code";
    q.choicesByUrl.titleName = "name";
    q.choicesByUrl.run();
  });
};

const jsonRenderAsSelect = {
  elements: [
    {
      type: "dropdown",
      renderAs: "select",
      name: "country",
      title: "Select the country...",
      isRequired: true,
      choicesByUrl: {
        //url: "http://services.groupkt.com/country/get/all",
        url: "http://127.0.0.1:8080/test-resources/countriesMock.json",
        path: "RestResponse;result",
        valueName: "name",
      },
    },
  ],
};

const json = {
  elements: [
    {
      type: "dropdown",
      name: "country",
      title: "Select the country...",
      isRequired: true,
      choicesByUrl: {
        //url: "http://services.groupkt.com/country/get/all",
        url: "http://127.0.0.1:8080/test-resources/countriesMock.json",
        path: "RestResponse;result",
        valueName: "name",
      },
    },
  ],
};

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("renderAs select: choose empty", async ({ page }) => {
      await initSurvey(page, framework, jsonRenderAsSelect);
      await checkSurveyWithEmptyQuestion(page);
    });

    test("renderAs select: choose value", async ({ page }) => {
      await initSurvey(page, framework, jsonRenderAsSelect);

      await page.waitForTimeout(1000);
      await page.selectOption("select", "Cuba");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.country).toEqual("Cuba");
    });

    test("renderAs select: change \"value\" in the returned json", async ({ page }) => {
      await initSurvey(page, framework, jsonRenderAsSelect);

      await page.waitForTimeout(1000);
      await expect(page.locator("select option[value=\"Cuba\"]")).toHaveCount(1);
      await expect(page.locator("select option[value=\"CU\"]")).toHaveCount(0);
      await changeValue(page);

      await expect(page.locator("select option[value=\"Cuba\"]")).toHaveCount(0);
      await expect(page.locator("select option[value=\"CU\"]")).toHaveCount(1);
      await page.selectOption("select", "Cuba");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.country).toEqual("CU");
    });

    test("choose empty", async ({ page }) => {
      await initSurvey(page, framework, json);
      await checkSurveyWithEmptyQuestion(page);
    });

    test("choose value", async ({ page }) => {
      await initSurvey(page, framework, json);

      const questionDropdownSelect = page.locator(".sd-dropdown");
      await page.waitForTimeout(1000);
      await questionDropdownSelect.click();
      await getVisibleListItemByText(page, "Cuba").click();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.country).toEqual("Cuba");
    });

    test("change \"value\" in the returned json", async ({ page }) => {
      await initSurvey(page, framework, json);

      const questionDropdownSelect = page.locator(".sd-dropdown");
      await page.waitForTimeout(1000);
      await questionDropdownSelect.click();
      await getVisibleListItemByText(page, "Cuba").click();

      let surveyData = await getData(page);
      expect(surveyData.country).toEqual("Cuba");

      await changeValue(page);
      await questionDropdownSelect.click();
      await getVisibleListItemByText(page, "Cuba").click();

      surveyData = await getData(page);
      expect(surveyData.country).toEqual("CU");

      await page.locator("input[value=Complete]").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.country).toEqual("CU");
    });

    test("Carry forward for choicesByUrl", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [
          {
            type: "tagbox",
            name: "q1",
            choicesByUrl: {
              //url: "http://services.groupkt.com/country/get/all",
              url: "http://127.0.0.1:8080/test-resources/countriesMock.json",
              path: "RestResponse;result",
              valueName: "name",
            },
          },
          {
            type: "dropdown",
            name: "q2",
            choicesFromQuestion: "q1",
            choicesFromQuestionMode: "selected"
          }
        ],
      });

      const questionDropdownSelect = page.locator(".sd-dropdown").first();
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });

      await page.evaluate((newData) => {
        window["survey"].data = newData;
        window["survey"].render();
      }, { q1: ["United States", "Romania"], q2: "Romania" });
      await page.waitForTimeout(1000);
      await questionDropdownSelect.click();
      await expect(getVisibleListItemByText(page, "Romania")).toBeVisible();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.q2).toEqual("Romania");
    });
  });
});

