import { frameworks, url, initSurvey, getSurveyData, test, expect } from "../helper";
import type { Page } from "@playwright/test";

const title = "autoAdvanceEnabled Enter";

const pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function createJson(element: any) {
  return {
    autoFocusFirstQuestion: true,
    autoAdvanceEnabled: true,
    pages: [
      { elements: [{ title: "First page", ...element }] },
      { elements: [{ type: "text", name: "q2", title: "Second page" }] },
    ],
  };
}

async function init(page: Page, framework: string, element: any) {
  await initSurvey(page, framework, createJson(element));
  await page.evaluate(() => {
    (window as any).Survey.settings.autoAdvanceDelay = 0;
  });
}

async function pageNo(page: Page): Promise<number> {
  return page.evaluate(() => (window as any).survey.currentPageNo);
}

function questionTitle(page: Page, text: string) {
  return page.locator(".sv-string-viewer").getByText(text, { exact: true });
}

async function expectFirstPage(page: Page) {
  expect(await pageNo(page), "Stay on the first page").toBe(0);
  await expect(questionTitle(page, "First page")).toBeVisible();
  await expect(questionTitle(page, "Second page")).toHaveCount(0);
}

async function expectSecondPage(page: Page) {
  await expect(questionTitle(page, "Second page")).toBeVisible();
  expect(await pageNo(page), "Enter opens the second page").toBe(1);
}

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Checkbox click does not auto-advance", async ({ page }) => {
      await init(page, framework, { type: "checkbox", name: "q1", choices: ["a", "b", "c"] });
      await page.locator(".sd-item__control-label").getByText("a", { exact: true }).click();
      await expect(page.getByRole("checkbox", { name: "a" })).toBeChecked();
      await expectFirstPage(page);
      expect(await getSurveyData(page)).toEqual({ q1: ["a"] });
    });

    test("Checkbox Enter confirms the answer", async ({ page }) => {
      await init(page, framework, { type: "checkbox", name: "q1", choices: ["a", "b", "c"] });
      const checkbox = page.locator("input[type=checkbox]").first();
      await expect(checkbox).toBeFocused();
      await page.keyboard.press("Enter");
      await expectFirstPage(page);
      expect(await getSurveyData(page)).toEqual({});
      await page.keyboard.press("Space");
      await expect(checkbox).toBeChecked();
      await expectFirstPage(page);
      await page.keyboard.press("Enter");
      await expectSecondPage(page);
      expect(await getSurveyData(page)).toEqual({ q1: ["a"] });
    });

    test("Tagbox Enter confirms the answer", async ({ page }) => {
      await init(page, framework, { type: "tagbox", name: "q1", choices: ["a", "b", "c"] });
      await expect(page.locator(".sd-tagbox__filter-string-input").first()).toBeFocused();
      await page.keyboard.press("Enter");
      await expectFirstPage(page);
      expect(await getSurveyData(page)).toEqual({});
      await page.keyboard.press("ArrowDown");
      await expect(page.locator(".sv-popup__container").filter({ visible: true })).toBeVisible();
      await page.keyboard.press("Space");
      await expect(page.locator(".sd-tagbox-item")).toHaveCount(1);
      await page.keyboard.press("Escape");
      await expect(page.locator(".sv-popup__container").filter({ visible: true })).toHaveCount(0);
      await expectFirstPage(page);
      await page.keyboard.press("Enter");
      await expectSecondPage(page);
      expect(await getSurveyData(page)).toEqual({ q1: ["a"] });
    });

    test("Imagepicker Enter confirms the answer", async ({ page }) => {
      await init(page, framework, {
        type: "imagepicker",
        name: "q1",
        multiSelect: true,
        choices: [
          { value: "a", text: "A", imageLink: pixel },
          { value: "b", text: "B", imageLink: pixel },
        ],
      });
      const imageChoice = page.locator("input[type=checkbox]").first();
      await expect(imageChoice).toBeFocused();
      await page.keyboard.press("Enter");
      await expectFirstPage(page);
      expect(await getSurveyData(page)).toEqual({});
      await page.keyboard.press("Space");
      await expect(imageChoice).toBeChecked();
      await expectFirstPage(page);
      await page.keyboard.press("Enter");
      await expectSecondPage(page);
      expect(await getSurveyData(page)).toEqual({ q1: ["a"] });
    });

    test("Single-select imagepicker keyboard selection waits for Enter", async ({ page }) => {
      await init(page, framework, {
        type: "imagepicker",
        name: "q1",
        choices: [
          { value: "a", text: "A", imageLink: pixel },
          { value: "b", text: "B", imageLink: pixel },
        ],
      });
      const imageChoice = page.locator("input[type=radio]").first();
      await expect(imageChoice).toBeFocused();
      await page.keyboard.press("Enter");
      await expectFirstPage(page);
      expect(await getSurveyData(page)).toEqual({});
      await page.keyboard.press("Space");
      await expect(imageChoice).toBeChecked();
      await expectFirstPage(page);
      await page.keyboard.press("Enter");
      await expectSecondPage(page);
      expect(await getSurveyData(page)).toEqual({ q1: "a" });
    });

    test("Single-select imagepicker click auto-advances", async ({ page }) => {
      await init(page, framework, {
        type: "imagepicker",
        name: "q1",
        choices: [
          { value: "a", text: "A", imageLink: pixel },
          { value: "b", text: "B", imageLink: pixel },
        ],
      });
      await page.locator("label").filter({ has: page.locator("input[type=radio]") }).nth(1).click();
      await expectSecondPage(page);
      expect(await getSurveyData(page)).toEqual({ q1: "b" });
    });

    test("Comment Enter confirms the answer", async ({ page }) => {
      await init(page, framework, { type: "comment", name: "q1" });
      const comment = page.locator("textarea").first();
      await expect(comment).toBeFocused();
      await page.keyboard.press("Enter");
      await expectFirstPage(page);
      expect(await getSurveyData(page)).toEqual({});
      await page.keyboard.press("Backspace");
      await page.keyboard.type("line1");
      await page.keyboard.press("Shift+Enter");
      await page.keyboard.type("line2");
      await expectFirstPage(page);
      await page.keyboard.press("Enter");
      await expectSecondPage(page);
      expect(await getSurveyData(page)).toEqual({ q1: "line1\nline2" });
    });

    test("Comment Enter inserts a line break when another question is empty", async ({ page }) => {
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        autoAdvanceEnabled: true,
        pages: [
          { elements: [
            { type: "comment", name: "q1", title: "First page" },
            { type: "text", name: "q2", title: "Also first page" },
          ] },
          { elements: [{ type: "text", name: "q3", title: "Second page" }] },
        ],
      });
      await page.evaluate(() => {
        (window as any).Survey.settings.autoAdvanceDelay = 0;
      });
      const comment = page.locator("textarea").first();
      await expect(comment).toBeFocused();
      await page.keyboard.type("line1");
      await page.keyboard.press("Enter");
      await page.keyboard.type("line2");
      await expectFirstPage(page);
      await expect(comment).toHaveValue("line1\nline2");
    });

    test("Boolean checkbox Enter confirms the answer", async ({ page }) => {
      await init(page, framework, { type: "boolean", name: "q1", displayMode: "checkbox" });
      const checkbox = page.locator("input[type=checkbox]").first();
      await expect(checkbox).toBeFocused();
      await page.keyboard.press("Enter");
      await expectFirstPage(page);
      expect(await getSurveyData(page)).toEqual({});
      await page.keyboard.press("Space");
      await expect(checkbox).toBeChecked();
      await expectFirstPage(page);
      await page.keyboard.press("Enter");
      await expectSecondPage(page);
      expect(await getSurveyData(page)).toEqual({ q1: true });
    });

    test("Ranking Enter confirms the answer", async ({ page }) => {
      await init(page, framework, { type: "ranking", name: "q1", choices: ["a", "b", "c"] });
      await expect(page.locator(".sv-ranking-item").first()).toBeFocused();
      await page.keyboard.press("Enter");
      await expectFirstPage(page);
      expect(await getSurveyData(page)).toEqual({});
      await page.keyboard.press("ArrowDown");
      await expectFirstPage(page);
      await page.keyboard.press("Enter");
      await expectSecondPage(page);
      expect(await getSurveyData(page)).toEqual({ q1: ["b", "a", "c"] });
    });
  });
});
