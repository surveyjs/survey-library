import { frameworks, url, initSurvey, getSurveyResult, setRowItemFlowDirection, visibleInViewportForShadowDom, test, expect, getButtonByText } from "../helper";

const title = "autoFocusFirstQuestion";

const json = {
  autoFocusFirstQuestion: true,
  pages: [
    { elements: [{ type: "text", name: "q1" }] },
    { elements: [{ type: "text", name: "q2" }] }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.evaluate(() => {
        const el = document.createElement("input");
        el.type = "text";
        document.body.appendChild(el);
        el.focus();
      });
    });

    test("Check first focused question, focus question", async ({ page }) => {
      await initSurvey(page, framework, json);
      await page.waitForTimeout(500);
      await page.keyboard.type("val1");
      await getButtonByText(page, "Next").click();
      await page.keyboard.type("val2");
      await getButtonByText(page, "Complete").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ q1: "val1", q2: "val2" });
    });

    test("Check first focused question, avoid focusing question in code", async ({ page }) => {
      await initSurvey(page, framework, json, false, { autoFocusFirstQuestion: false });
      await page.keyboard.type("val1");
      await getButtonByText(page, "Next").click();
      await page.keyboard.type("val2");
      await getButtonByText(page, "Complete").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({});
    });

    test("Check first focused question, avoid focusing question in json", async ({ page }) => {
      json["autoFocusFirstQuestion"] = false;
      await initSurvey(page, framework, json);
      json["autoFocusFirstQuestion"] = true;
      await page.keyboard.type("val1");
      await getButtonByText(page, "Next").click();
      await page.keyboard.type("val2");
      await getButtonByText(page, "Complete").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({});
    });

    test("Focus and scroll into view question", async ({ page }) => {
      await setRowItemFlowDirection(page);

      const focusQuestion = async (name: string, doScroll: boolean) => {
        await page.evaluate(([name, doScroll]) => {
          const q = window["survey"].getQuestionByName(name);
          q.focus(false, doScroll);
        }, [name, doScroll]);
      };

      await initSurvey(page, framework, {
        elements: [
          { type: "text", name: "q1" },
          { type: "radiogroup", name: "q2", choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
          { type: "radiogroup", name: "q3", choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
          { type: "panel", name: "panel1",
            elements: [
              { type: "text", name: "panel1_q1" },
              { type: "radiogroup", name: "panel1_q2", choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
              { type: "radiogroup", name: "panel1_q3", choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
            ]
          }
        ]
      });

      const q1Sel = page.locator("input[type=text]").nth(0);
      const panel1_q1Sel = page.locator("input[type=text]").nth(1);

      await focusQuestion("panel1_q1", false);
      await page.waitForTimeout(1000);

      let elementVisisbleInViewPort = await visibleInViewportForShadowDom(page, "input[type=text]", 1);
      await expect(elementVisisbleInViewPort).toBeTruthy();
      await page.keyboard.type("a");

      await focusQuestion("q1", false);
      await page.waitForTimeout(1000);
      elementVisisbleInViewPort = await visibleInViewportForShadowDom(page, "input[type=text]", 0);
      await expect(elementVisisbleInViewPort).toBeTruthy();
      await page.keyboard.type("b");

      await focusQuestion("panel1_q1", true);
      elementVisisbleInViewPort = await visibleInViewportForShadowDom(page, "input[type=text]", 1);
      await expect(elementVisisbleInViewPort).toBeTruthy();

      elementVisisbleInViewPort = await visibleInViewportForShadowDom(page, "input[type=text]", 0);
      await expect(elementVisisbleInViewPort).toBeFalsy();

      await getButtonByText(page, "Complete").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ q1: "b", panel1_q1: "a" });
    });
  });
});