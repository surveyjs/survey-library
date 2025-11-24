import { frameworks, url, initSurvey, getSurveyResult, visibleInViewport, test, expect } from "../helper";

const title = "paneldynamic";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("checkbox vs valuePropertyName and rendering panels, Bug#10633", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        elements: [
          {
            type: "checkbox",
            name: "q1",
            choices: ["apple", "banana", "orange"],
            valueName: "data1",
            valuePropertyName: "fruit"
          },
          {
            type: "paneldynamic",
            name: "panel",
            valueName: "data1",
            templateTitle: "{panel.fruit}",
            templateElements: [
              { type: "text", name: "panel_q1" },
            ],
            allowRemovePanel: false,
            allowAddPanel: false
          }
        ]
      };
      await initSurvey(page, framework, json);
      await expect(page.locator("input[type=text]")).toHaveCount(0);
      await page.locator(".sd-item__control-label").getByText("apple").click();
      await expect(page.locator("input[type=text]")).toHaveCount(1);
      await page.locator(".sd-item__control-label").getByText("orange").click();
      await expect(page.locator("input[type=text]")).toHaveCount(2);
      await page.keyboard.press("Tab");
      await page.keyboard.type("I eat apple");
      await page.keyboard.press("Tab");
      await page.keyboard.type("I eat orange");

      await page.click("input[value=Complete]");
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        "data1": [
          {
            "fruit": "apple",
            "panel_q1": "I eat apple"
          },
          {
            "fruit": "orange",
            "panel_q1": "I eat orange"
          }
        ]
      });
    });
  });
});