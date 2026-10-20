import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody, test } from "../e2e/helper";
import type { Page } from "@playwright/test";

const title = "Keyboard hints";

const features = [
  "Fast support answers",
  "Reliable updates",
  "Reasonable pricing",
  "Good-looking modern UI",
  "Platform-agnostic solutions"
];

const checkboxJson = {
  showQuestionNumbers: false,
  keyboardHintsEnabled: true,
  autoAdvanceEnabled: true,
  choiceShortcutsEnabled: true,
  elements: [{
    type: "checkbox",
    name: "q",
    title: "Which features are the most valuable?",
    description: "We won't judge you",
    defaultValue: ["Fast support answers", "Reliable updates", "Good-looking modern UI"],
    choices: features
  }]
};

const radioJson = {
  showQuestionNumbers: false,
  keyboardHintsEnabled: true,
  autoAdvanceEnabled: true,
  choiceShortcutsEnabled: true,
  elements: [{
    type: "radiogroup",
    name: "q",
    title: "What should we improve?",
    description: "Pick the most important feature",
    defaultValue: "Fast support answers",
    choices: ["Fast support answers", "Reliable updates", "Reasonable pricing"]
  }]
};

const tagboxJson = {
  showQuestionNumbers: false,
  keyboardHintsEnabled: true,
  autoAdvanceEnabled: true,
  elements: [{
    type: "tagbox",
    name: "q",
    title: "What should we improve?",
    description: "We won't judge you",
    defaultValue: ["Layout", "Conditional Logic", "Validation"],
    choices: ["Layout", "Conditional Logic", "Validation"]
  }]
};

const matrixRows = Array.from({ length: 5 }, (_, index) => ({ value: "row" + (index + 1), text: "Row" + (index + 1) + " title" }));
const matrixJson = {
  showQuestionNumbers: false,
  keyboardHintsEnabled: true,
  autoAdvanceEnabled: true,
  elements: [{
    type: "panel",
    name: "product",
    title: "Tell us more about your product",
    description: "Weird matrix situation",
    elements: [{
      type: "matrixdropdown",
      name: "q",
      titleLocation: "hidden",
      cellType: "text",
      columns: [
        { name: "c1", title: "Column title" },
        { name: "c2", title: "Column title" },
        { name: "c3", title: "Column title" }
      ],
      rows: matrixRows
    }]
  }]
};

async function shot(page: Page, name: string, hints: boolean): Promise<void> {
  const question = page.locator(".sd-element-wrapper").first();
  await question.waitFor();
  if (hints) {
    await page.locator(".sd-question__keyboard-hints").waitFor();
  }
  await resetFocusToBody(page);
  await compareScreenshot(page, question, name);
}

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1000, height: 900 });
    });

    test("checkbox hints", async ({ page }) => {
      await initSurvey(page, framework, checkboxJson);
      await shot(page, "keyboard-hints-checkbox.png", true);
    });

    test("radiogroup hints", async ({ page }) => {
      await initSurvey(page, framework, radioJson);
      await shot(page, "keyboard-hints-radio.png", true);
    });

    test("tagbox hints", async ({ page }) => {
      await initSurvey(page, framework, tagboxJson);
      await shot(page, "keyboard-hints-tagbox.png", true);
    });

    test("checkbox hints, light panelless", async ({ page }) => {
      await initSurvey(page, framework, checkboxJson);
      await page.evaluate(() => {
        (window as any).survey.applyTheme((window as any).SurveyTheme.DefaultLightPanelless);
      });
      await shot(page, "keyboard-hints-checkbox-panelless.png", true);
    });
  });
});
