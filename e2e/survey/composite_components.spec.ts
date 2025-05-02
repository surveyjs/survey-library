import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "Components";

const json = {
  "elements": [
    {
      type: "comp1",
      name: "q1"
    }
  ]
};

const registerComponent_onValueChanging = async (page) => {
  await page.evaluate(() => {
    window["Survey"].ComponentCollection.Instance.add({
      name: "comp1",
      elementsJSON: [
        {
          type: "text",
          name: "item1"
        },
        {
          type: "text",
          name: "item2",
          startWithNewLine: false
        }
      ],
      onValueChanging(question, name, value) {
        if (name === "item1" && value === "1") {
          return "100";
        }
        return value;
      }
    });
  });
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("check custom markup in list behavior", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await registerComponent_onValueChanging(page);
      await initSurvey(page, framework, json);
      const item1Input = page.locator("input[type='text']").first();

      await item1Input.fill("1");
      await item1Input.press("Tab");
      await expect(item1Input).toHaveValue("100");
      await page.click("input[value=Complete]");

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        q1: { item1: "100" }
      });
    });
  });
});