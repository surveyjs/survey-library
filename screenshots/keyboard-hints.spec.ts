import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody, test, getButtonByText } from "../e2e/helper";
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
  showKeyboardHints: true,
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
  showKeyboardHints: true,
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

const textInputsJson = {
  showQuestionNumbers: false,
  showKeyboardHints: true,
  autoAdvanceEnabled: true,
  questionsOnPageMode: "questionPerPage",
  elements: [
    {
      type: "text",
      name: "q1",
      title: "Your name",
      defaultValue: "Alex"
    },
    {
      "type": "multipletext",
      "name": "q2",
      "defaultValue": { "text1": "test1", "text2": "test2" },
      "items": [{ "name": "text1" }, { "name": "text2" }]
    },
    {
      type: "comment",
      name: "q3",
      title: "Anything else?",
      description: "Optional details",
      defaultValue: "The form was easy to follow."
    }]
};

const tagboxJson = {
  showQuestionNumbers: false,
  showKeyboardHints: true,
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

async function shot(page: Page, name: string): Promise<void> {
  const question = page.locator(".sd-element-wrapper").first();
  await question.waitFor();
  await page.locator(".sd-question__keyboard-hints").waitFor();
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
      await shot(page, "keyboard-hints-checkbox.png");
    });

    test("radiogroup hints", async ({ page }) => {
      await initSurvey(page, framework, radioJson);
      await shot(page, "keyboard-hints-radio.png");
    });

    test("tagbox hints", async ({ page }) => {
      await initSurvey(page, framework, tagboxJson);
      await shot(page, "keyboard-hints-tagbox.png");
    });

    test("text inputs hints", async ({ page }) => {
      await initSurvey(page, framework, textInputsJson);
      await shot(page, "keyboard-hints-text.png");
      await getButtonByText(page, "Next").click();
      await shot(page, "keyboard-hints-multipletext.png");
      await getButtonByText(page, "Next").click();
      await shot(page, "keyboard-hints-comment.png");
    });

    test("checkbox hints, light panelless", async ({ page }) => {
      await initSurvey(page, framework, checkboxJson);
      await page.evaluate(() => {
        (window as any).survey.applyTheme((window as any).SurveyTheme.DefaultLightPanelless);
      });
      await shot(page, "keyboard-hints-checkbox-panelless.png");
    });
  });
});
