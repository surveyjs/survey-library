import { frameworks, url_test, initSurvey } from "../helper";
import { QuestionBoolean, QuestionRadiogroup } from "../questionHelper";
import { test, expect } from "@playwright/test";
import { Survey } from "../surveyHelper";

const themeName = "defaultV2";
const title = "Boolean Screenshot";
frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url_test}${themeName}/${framework}`);
    });
    test("Check boolean question", async ({ page }) => {
      await initSurvey(page, framework, {
        questions: [
          {
            type: "boolean",
            name: "boolean_question",
          },
        ]
      });
      const question = new QuestionBoolean(page, "boolean_question");
      await question.resetFocusToBody();
      await question.toHaveScreenshot("boolean-question-indeterminate.png");

      await question.hover(".sd-boolean__thumb-ghost");
      await question.toHaveScreenshot("boolean-question-indeterminate-hovered.png");

      question.clickThumb(false);
      await question.toHaveScreenshot("boolean-question-clicked.png");

      await question.hover(question.question.locator(".sd-boolean__thumb-ghost").nth(1));
      await question.toHaveScreenshot("boolean-question-clicked-hovered.png");

      await question.setPropertyValue("readOnly", true);
      await question.toHaveScreenshot("boolean-question-clicked-disabled.png");

      await question.setPropertyValue("value", undefined);
      await question.toHaveScreenshot("boolean-question-disabled.png");
    });
  });
});