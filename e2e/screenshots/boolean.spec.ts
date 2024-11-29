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
      await page.setViewportSize({ width: 1920, height: 1080 });
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
    test("Check boolean question - interchange buttons", async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 800 });
      await initSurvey(page, framework, {
        questions: [
          {
            type: "boolean",
            name: "boolean_question",
            swapOrder: true
          }
        ]
      });
      const question = new QuestionBoolean(page, "boolean_question");
      await question.resetFocusToBody();
      await question.toHaveScreenshot("boolean-question-exch-indeterminate.png");

      await question.hover(".sd-boolean__thumb-ghost");
      await question.toHaveScreenshot("boolean-question-exch-indeterminate-hovered.png");
      question.clickThumb(true);
      await question.toHaveScreenshot("boolean-question-exch-clicked.png");

      await question.hover(question.question.locator(".sd-boolean__thumb-ghost").nth(0));
      await question.toHaveScreenshot("boolean-question-exch-clicked-hovered.png");

      await question.setPropertyValue("readOnly", true);
      await question.toHaveScreenshot("boolean-question-exch-clicked-disabled.png");

      await question.setPropertyValue("value", undefined);
      await question.toHaveScreenshot("boolean-question-exch-disabled.png");
    });
    test("Check radio boolean question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        width: "900px",
        questions: [
          {
            type: "boolean",
            name: "boolean_question",
            maxWidth: "768px",
            minWidth: "768px",
            width: "768px",
            renderAs: "radio"
          },
        ]
      });
      const question = new QuestionBoolean(page, "boolean_question");
      question.screenShortOptions = { maxDiffPixels: 50 };
      await question.resetFocusToBody();
      await question.toHaveScreenshot("boolean-radio-question.png");

      await question.clickItemByText("No");
      await question.toHaveScreenshot("boolean-radio-question-clicked.png");

      await page.locator("body").click({ position: { x: 1, y: 1 } });
      await question.toHaveScreenshot("boolean-radio-question-unfocused.png");
    });
    test("Check boolean question word-wrap", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        focusFirstQuestionAutomatic: true,
        questions: [
          {
            type: "boolean",
            name: "boolean_question",
            "labelTrue": "On-site",
            "labelFalse": "Remote",
            defaultValue: true
          }
        ]
      });
      const question = new QuestionBoolean(page, "boolean_question");
      await question.resetFocusToBody();
      await question.toHaveScreenshot("boolean-question-word-wrap.png");
    });
    test("Check boolean thumb position", async ({ page }) => {
      await page.setViewportSize({ width: 1400, height: 800 });
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                type: "boolean",
                name: "boolean1",
                swapOrder: false,
                labelTrue: "True Label",
                defaultValue: true
              },
              {
                type: "boolean",
                name: "boolean2",
                swapOrder: true,
                labelTrue: "True Label",
                defaultValue: false
              },
            ]
          }
        ]
      });
      const question1 = new QuestionBoolean(page, "boolean1");
      const question2 = new QuestionBoolean(page, "boolean2");
      await question1.toHaveScreenshot("boolean-switch-thumb-right.png");
      await question2.toHaveScreenshot("boolean-switch-thumb-right-swapped.png");
    });
    test("Check boolean swapOrder thumb position", async ({ page }) => {
      await page.setViewportSize({ width: 1400, height: 800 });
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "boolean",
            name: "boolean1",
            swapOrder: true,
          },
        ]
      });
      const question = new QuestionBoolean(page, "boolean1");
      await question.toHaveScreenshot("boolean-switch-thumb-swapped-indeterminate.png");
      question.clickItemByText("No");
      await question.toHaveScreenshot("boolean-switch-thumb-swapped-no.png");
      question.clickItemByText("Yes");
      await question.toHaveScreenshot("boolean-switch-thumb-swapped-yes.png");
    });
  });
});