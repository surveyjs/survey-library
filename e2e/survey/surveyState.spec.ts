import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "Restore survey state";

frameworks.forEach((framework) => {

  test.describe(`${framework} ${title}`, () => {
    test("restore lastActive state and focus", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        pages: [
          {
            elements: [
              { type: "text", name: "q1" },
              { type: "text", name: "q2" }
            ],
          },
          {
            elements: [
              { type: "text", name: "q3" },
              { type: "text", name: "q4" }
            ],
          },
        ],
      };

      await initSurvey(page, framework, json);
      await page.evaluate(() => {
        window["survey"].setState({
          lastActive: "q4"
        });
      });
      await page.waitForTimeout(100);
      await page.keyboard.type("abc");
      await page.click("input[value=\"Complete\"]");

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        q4: "abc",
      });
    });
  });

  test.describe(`${framework} ${title}`, () => {
    test("restore dynamic panel index and state", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        pages: [
          {
            elements: [
              { type: "text", name: "q1" },
              { type: "text", name: "q2" }
            ],
          },
          {
            elements: [
              {
                type: "panel",
                name: "panel1",
                title: "panel dynamic inside",
                state: "collapsed",
                elements: [
                  { type: "text", name: "q3" },
                  { type: "text", name: "q4" }
                ]
              },
              {
                type: "paneldynamic",
                name: "q5",
                templateElements: [
                  { type: "text", name: "q6" },
                  { type: "text", name: "q7" }
                ],
                panelCount: 3,
                displayMode: "tab"
              },
              { type: "text", name: "q8", },
            ],
          },
        ],
      };

      await initSurvey(page, framework, json);
      await page.evaluate(() => {
        window["survey"].setState({
          panels: {
            panel1: { state: "expanded" },
          },
          questions: {
            q5: { currentIndex: 1 }
          },
          lastActive: "q5"
        });
      });
      await page.waitForTimeout(100);
      const q3 = page.locator("div[data-name=q3] input");
      await expect(q3).toBeVisible();
      await page.keyboard.type("abc");
      await page.click("input[value=\"Complete\"]");

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        q5: [{}, { "q6": "abc" }, {}],
      });
    });
  });
});