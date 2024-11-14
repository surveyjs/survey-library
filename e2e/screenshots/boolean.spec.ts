import { frameworks, url_test, initSurvey } from "../helper";
import { QuestionBoolean, QuestionRadiogroup } from "../questionHelper";
import { test, expect } from "@playwright/test";
import { Survey } from "../surveyHelper";

const themeName = "defaultV2";
const title = "Boolean Screenshot";
frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      const json = {
        questions: [
          {
            type: "boolean",
            name: "boolean_question",
          },
        ]
      };
      await page.goto(`${url_test}${themeName}/${framework}`);
      await initSurvey(page, framework, json);
    });
    test("Check boolean question", async ({ page }) => {
      const question = new QuestionBoolean(page, "boolean_question");
      await question.resetFocusToBody();
      await expect(question.question).toHaveScreenshot("boolean-question-indeterminate.png");
    });
  });
});