import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

const title = "Boolean Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check boolean question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [{ type: "boolean", name: "boolean_question", },]
      });
      const questionRoot = page.locator(".sd-question--boolean");
      await page.waitForTimeout(1000);
      await resetFocusToBody(page);
      await compareScreenshot(page, questionRoot, "boolean-question-indeterminate.png");

      await page.locator(".sd-boolean__thumb-ghost").first().hover();
      await compareScreenshot(page, questionRoot, "boolean-question-indeterminate-hovered.png");

      await page.locator(".sv-string-viewer").filter({ hasText: "No" }).click();
      await compareScreenshot(page, questionRoot, "boolean-question-clicked.png");

      await page.locator("span").filter({ hasText: "Yes" }).first().hover();
      await compareScreenshot(page, questionRoot, "boolean-question-clicked-hovered.png");

      await page.evaluate(() => {
        window["survey"].getQuestionByName("boolean_question").readOnly = true;
      });
      await compareScreenshot(page, questionRoot, "boolean-question-clicked-disabled.png");

      await page.evaluate(() => {
        window["survey"].getQuestionByName("boolean_question").value = null;
      });
      await compareScreenshot(page, questionRoot, "boolean-question-disabled.png");
    });

    test("Check boolean question - interchange buttons", async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 800 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [{ type: "boolean", name: "boolean_question", swapOrder: true },] });
      const questionRoot = page.locator(".sd-question--boolean");
      await page.waitForTimeout(1000);
      await resetFocusToBody(page);
      await compareScreenshot(page, questionRoot, "boolean-question-exch-indeterminate.png");

      await page.locator(".sd-boolean__thumb-ghost").first().hover();
      await compareScreenshot(page, questionRoot, "boolean-question-exch-indeterminate-hovered.png");

      await page.locator(".sv-string-viewer").filter({ hasText: "No" }).click();
      await compareScreenshot(page, questionRoot, "boolean-question-exch-clicked.png");

      await page.locator("span").filter({ hasText: "Yes" }).first().hover();
      await compareScreenshot(page, questionRoot, "boolean-question-exch-clicked-hovered.png");

      await page.evaluate(() => {
        window["survey"].getQuestionByName("boolean_question").readOnly = true;
      });
      await compareScreenshot(page, questionRoot, "boolean-question-exch-clicked-disabled.png");

      await page.evaluate(() => {
        window["survey"].getQuestionByName("boolean_question").value = null;
      });
      await compareScreenshot(page, questionRoot, "boolean-question-exch-disabled.png");
    });

    test("Check radio boolean question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        width: "900px",
        elements: [
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
      const questionRoot = page.locator(".sd-question--boolean");
      await page.waitForTimeout(1000);
      await compareScreenshot(page, questionRoot, "boolean-radio-question.png");

      await page.locator(".sv-string-viewer").filter({ hasText: "No" }).click();
      await expect(page.locator("input[type=radio]").first()).toBeChecked();
      await compareScreenshot(page, questionRoot, "boolean-radio-question-clicked.png");

      await page.click("body", { position: { x: 0, y: 400 } });
      await expect(page.locator("input[type=radio]").first()).not.toBeFocused();
      await compareScreenshot(page, questionRoot, "boolean-radio-question-unfocused.png");
    });

    test("Check boolean question word-wrap", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "boolean",
            name: "boolean_question",
            "labelTrue": "On-site",
            "labelFalse": "Remote",
            defaultValue: true
          },
        ]
      });
      const questionRoot = page.locator(".sd-question--boolean");
      await page.waitForTimeout(1000);
      await compareScreenshot(page, questionRoot, "boolean-question-word-wrap.png");
    });

    test("Check boolean thumb position", async ({ page }) => {
      await page.setViewportSize({ width: 1400, height: 800 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
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
      const questionRoot = page.locator(".sd-question--boolean");
      await page.waitForTimeout(1000);
      await compareScreenshot(page, questionRoot, "boolean-switch-thumb-right.png");
      await compareScreenshot(page, questionRoot.nth(1), "boolean-switch-thumb-right-swapped.png");
    });

    test("Check boolean swapOrder thumb position", async ({ page }) => {
      await page.setViewportSize({ width: 1400, height: 800 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "elements": [
          {
            type: "boolean",
            name: "boolean1",
            swapOrder: true,
          },
        ]
      });
      const questionRoot = page.locator(".sd-question--boolean");
      await page.waitForTimeout(1000);
      await compareScreenshot(page, questionRoot, "boolean-switch-thumb-swapped-indeterminate.png");
      await page.locator(".sv-string-viewer").filter({ hasText: "No" }).click();
      await compareScreenshot(page, questionRoot, "boolean-switch-thumb-swapped-no.png");
      await page.locator(".sv-string-viewer").filter({ hasText: "Yes" }).click();
      await compareScreenshot(page, questionRoot, "boolean-switch-thumb-swapped-yes.png");
    });

    test("Check boolean rtl", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        document.body.setAttribute("dir", "rtl");
      });

      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "elements": [
          {
            "type": "boolean",
            "name": "slider",
            "title": "Are you 21 or older?",
            "description": "Display mode = Default (Slider)",
            "valueTrue": "Yes",
            "valueFalse": "No",
            "defaultValue": "No"
          }
        ]
      });

      const questionRoot = page.locator(".sd-question--boolean");
      await compareScreenshot(page, questionRoot, "boolean-question-rtl.png");

      await page.evaluate(() => {
        document.body.setAttribute("dir", "ltr");
      });
    });

    test("Check boolean as checkbox: requred asterisk", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "elements": [
          {
            "type": "boolean",
            "name": "q1",
            "useTitleAsLabel": true,
            "isRequired": true,
            "renderAs": "checkbox"
          }
        ]
      });

      const questionRoot = page.locator(".sd-question--boolean");
      await compareScreenshot(page, questionRoot, "boolean-question-checkbox-asterisk.png");
    });

    test("Check boolean as checkbox: useTitleAsLabel ", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "elements": [
          {
            "type": "boolean",
            "name": "q1",
            "useTitleAsLabel": true,
            "renderAs": "checkbox",
            "description": "description"
          }
        ]
      });

      const questionRoot = page.locator(".sd-question--boolean");
      await compareScreenshot(page, questionRoot, "boolean-question-checkbox-useTitleAsLabel.png");
    });
  });
});