import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody, test } from "../e2e/helper";

const title = "Choice shortcut keys";
const pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const checkboxJson = {
  showQuestionNumbers: false,
  showChoiceShortcutKeys: true,
  elements: [{
    type: "checkbox",
    name: "q",
    title: "Which features are the most valuable?",
    description: "We won't judge you",
    choices: ["Fast support answers", "Reliable updates", "Reasonable pricing"]
  }]
};

const disabledJson = {
  showQuestionNumbers: false,
  showChoiceShortcutKeys: true,
  elements: [{
    type: "checkbox",
    name: "q",
    title: "Which features are the most valuable?",
    description: "The middle choice is disabled",
    choices: [
      "Fast support answers",
      { value: "Reliable updates", enableIf: "false" },
      "Reasonable pricing"
    ]
  }]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 800, height: 700 });
    });

    test("checkbox badges", async ({ page }) => {
      await initSurvey(page, framework, checkboxJson);
      const question = page.locator(".sd-question");
      await question.waitFor();
      await resetFocusToBody(page);
      await compareScreenshot(page, question, "choice-shortcut-checkbox.png");
    });

    test("radiogroup badges", async ({ page }) => {
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        showChoiceShortcutKeys: true,
        elements: [{
          type: "radiogroup",
          name: "q",
          title: "What should we improve?",
          description: "Pick the most important feature",
          choices: ["Fast support answers", "Reliable updates", "Reasonable pricing"]
        }]
      });
      const question = page.locator(".sd-question");
      await question.waitFor();
      await resetFocusToBody(page);
      await compareScreenshot(page, question, "choice-shortcut-radio.png");
    });

    test("imagepicker badges", async ({ page }) => {
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        showChoiceShortcutKeys: true,
        elements: [{
          type: "imagepicker",
          name: "q",
          title: "Pick a picture",
          choices: ["One", "Two"].map((value) => ({ value, imageLink: pixel }))
        }]
      });
      const question = page.locator(".sd-question");
      await question.waitFor();
      await resetFocusToBody(page);
      await compareScreenshot(page, question, "choice-shortcut-imagepicker.png");
    });

    test("disabled badge stays in place", async ({ page }) => {
      await initSurvey(page, framework, disabledJson);
      const question = page.locator(".sd-question");
      await page.locator(".sd-item__shortcut-key--disabled").waitFor();
      await resetFocusToBody(page);
      await compareScreenshot(page, question, "choice-shortcut-disabled.png");
    });

    test("columns and inline layout", async ({ page }) => {
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        showChoiceShortcutKeys: true,
        elements: [{
          type: "radiogroup",
          name: "q",
          title: "Columns",
          colCount: 2,
          choices: ["A item", "B item", "C item", "D item"]
        }]
      });
      const question = page.locator(".sd-question");
      await question.waitFor();
      await resetFocusToBody(page);
      await compareScreenshot(page, question, "choice-shortcut-columns.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("q").colCount = 0;
      });
      await compareScreenshot(page, question, "choice-shortcut-inline.png");
    });

    test("rtl badges", async ({ page }) => {
      await initSurvey(page, framework, checkboxJson);
      await page.evaluate(() => {
        document.body.setAttribute("dir", "rtl");
      });
      const question = page.locator(".sd-question");
      await question.waitFor();
      await resetFocusToBody(page);
      await compareScreenshot(page, question, "choice-shortcut-rtl.png");
    });

    test("two letter codes", async ({ page }) => {
      const choices: Array<string> = [];
      for (let i = 1; i <= 27; i++) choices.push("Item " + i);
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        showChoiceShortcutKeys: true,
        elements: [{ type: "checkbox", name: "q", title: "Many choices", colCount: 3, choices: choices }]
      });
      const question = page.locator(".sd-question");
      await question.waitFor();
      await resetFocusToBody(page);
      await compareScreenshot(page, question, "choice-shortcut-wide.png");
    });
  });
});
