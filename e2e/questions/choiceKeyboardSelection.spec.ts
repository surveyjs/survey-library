import { frameworks, url, initSurvey, test, expect } from "../helper";
import type { Page } from "@playwright/test";

const title = "choice keyboard selection";

function numberedChoices(count: number): Array<string> {
  const choices = new Array<string>();
  for (let i = 1; i <= count; i++) {
    choices.push("Item " + i);
  }
  return choices;
}

async function questionValue(page: Page, name = "q"): Promise<any> {
  return page.evaluate((questionName) => {
    return (window as any).survey.getQuestionByName(questionName).value;
  }, name);
}

async function pageNo(page: Page): Promise<number> {
  return page.evaluate(() => (window as any).survey.currentPageNo);
}

async function setKeyTimeout(page: Page, ms: number): Promise<void> {
  await page.evaluate((timeout) => {
    (window as any).Survey.settings.keyboardInputTimeout = timeout;
  }, ms);
}

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test("flag off ignores letters and keeps arrows", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [{ type: "radiogroup", name: "q", choices: numberedChoices(4) }]
      });
      const radios = page.locator("input[type=radio]");
      await radios.first().focus();
      await page.keyboard.press("b");
      expect(await questionValue(page)).toBeFalsy();
      await page.keyboard.press("ArrowDown");
      expect(await questionValue(page)).toBe("Item 2");
    });

    test("radiogroup letters select and keep one tab stop", async ({ page }) => {
      await initSurvey(page, framework, {
        showChoiceShortcutKeys: true,
        elements: [{ type: "radiogroup", name: "q", choices: numberedChoices(4) }]
      });
      const radios = page.locator("input[type=radio]");
      await page.keyboard.press("Tab");
      await expect(radios.first()).toBeFocused();
      await page.keyboard.press("c");
      await expect(radios.nth(2)).toBeChecked();
      await expect(radios.nth(2)).toBeFocused();
      expect(await questionValue(page)).toBe("Item 3");
      await page.keyboard.press("ArrowDown");
      await expect(radios.nth(3)).toBeChecked();
      expect(await questionValue(page)).toBe("Item 4");
      await page.keyboard.press("Tab");
      await expect(page.locator("input[type=radio]:focus")).toHaveCount(0);
    });

    test("radiogroup multi-letter codes", async ({ page }) => {
      await initSurvey(page, framework, {
        showChoiceShortcutKeys: true,
        elements: [{ type: "radiogroup", name: "q", choices: numberedChoices(30) }]
      });
      await setKeyTimeout(page, 600);
      const radios = page.locator("input[type=radio]");
      await radios.first().focus();
      await page.keyboard.press("b");
      expect(await questionValue(page)).toBe("Item 2");

      await radios.first().focus();
      await page.keyboard.press("a");
      expect(await questionValue(page)).toBe("Item 2");
      await expect.poll(async () => questionValue(page), { timeout: 2000 }).toBe("Item 1");

      await radios.first().focus();
      await page.keyboard.press("a");
      await page.keyboard.press("a");
      expect(await questionValue(page)).toBe("Item 27");
      await expect(radios.nth(26)).toBeFocused();
    });

    test("checkbox letters toggle and keep native keys", async ({ page }) => {
      await initSurvey(page, framework, {
        showChoiceShortcutKeys: true,
        elements: [{ type: "checkbox", name: "q", choices: numberedChoices(3) }]
      });
      const checks = page.locator("input[type=checkbox]");
      await checks.first().focus();
      await page.keyboard.press("a");
      await expect(checks.first()).toBeChecked();
      expect(await questionValue(page)).toEqual(["Item 1"]);
      await page.keyboard.press("a");
      await expect(checks.first()).not.toBeChecked();
      await page.keyboard.press("Space");
      await expect(checks.first()).toBeChecked();
      await page.keyboard.press("ArrowDown");
      await expect(checks.nth(1)).not.toBeChecked();
      expect(await questionValue(page)).toEqual(["Item 1"]);
      await page.keyboard.press("Tab");
      await expect(checks.nth(1)).toBeFocused();
    });

    test("question flag overrides survey flag", async ({ page }) => {
      await initSurvey(page, framework, {
        showChoiceShortcutKeys: true,
        elements: [{
          type: "radiogroup",
          name: "q",
          showShortcutKeys: false,
          choices: numberedChoices(4)
        }]
      });
      const radios = page.locator("input[type=radio]");
      await radios.first().focus();
      await page.keyboard.press("b");
      expect(await questionValue(page)).toBeFalsy();
      await page.keyboard.press("ArrowDown");
      expect(await questionValue(page)).toBe("Item 2");
    });

    test("other comment ignores letters", async ({ page }) => {
      await initSurvey(page, framework, {
        showChoiceShortcutKeys: true,
        elements: [{
          type: "radiogroup",
          name: "q",
          showOtherItem: true,
          choices: ["Red", "Blue"]
        }]
      });
      const radios = page.locator("input[type=radio]");
      await radios.first().focus();
      await page.keyboard.press("c");
      expect(await questionValue(page)).toBe("other");
      await page.locator("textarea").focus();
      await page.keyboard.type("abc");
      expect(await page.locator("textarea").inputValue()).toBe("abc");
      expect(await questionValue(page)).toBe("other");
    });

    test("display mode ignores letters", async ({ page }) => {
      await initSurvey(page, framework, {
        mode: "display",
        showChoiceShortcutKeys: true,
        elements: [{ type: "radiogroup", name: "q", choices: numberedChoices(4) }]
      });
      const radios = page.locator("input[type=radio]");
      await radios.first().focus();
      await page.keyboard.press("b");
      expect(await questionValue(page)).toBeFalsy();
      await expect(radios.nth(1)).not.toBeChecked();
    });

    test("imagepicker letters select", async ({ page }) => {
      const pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      await initSurvey(page, framework, {
        showChoiceShortcutKeys: true,
        elements: [{
          type: "imagepicker",
          name: "q",
          choices: ["Item 1", "Item 2", "Item 3"].map((value) => ({ value, imageLink: pixel }))
        }]
      });
      const radios = page.locator("input[type=radio]");
      await expect(page.locator(".sd-imagepicker img").first()).toBeVisible();
      await radios.first().focus();
      await page.keyboard.press("b");
      await expect(radios.nth(1)).toBeChecked();
      await expect(radios.nth(1)).toBeFocused();
      expect(await questionValue(page)).toBe("Item 2");
    });

    test("imagepicker multiSelect letters toggle", async ({ page }) => {
      const pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      await initSurvey(page, framework, {
        showChoiceShortcutKeys: true,
        elements: [{
          type: "imagepicker",
          name: "q",
          multiSelect: true,
          choices: ["Item 1", "Item 2"].map((value) => ({ value, imageLink: pixel }))
        }]
      });
      const checks = page.locator("input[type=checkbox]");
      await expect(page.locator(".sd-imagepicker img").first()).toBeVisible();
      await checks.first().focus();
      await page.keyboard.press("a");
      await expect(checks.first()).toBeChecked();
      expect(await questionValue(page)).toEqual(["Item 1"]);
      await page.keyboard.press("b");
      expect(await questionValue(page)).toEqual(["Item 1", "Item 2"]);
      await page.keyboard.press("a");
      await expect(checks.first()).not.toBeChecked();
      expect(await questionValue(page)).toEqual(["Item 2"]);
    });

    test("badges show the letter that selects the choice", async ({ page }) => {
      await initSurvey(page, framework, {
        showChoiceShortcutKeys: true,
        elements: [{ type: "radiogroup", name: "q", choices: numberedChoices(4) }]
      });
      const badges = page.locator(".sd-item__shortcut-key");
      await expect(badges).toHaveText(["A", "B", "C", "D"]);
      const radios = page.locator("input[type=radio]");
      await expect(radios.nth(1)).toHaveAttribute("aria-keyshortcuts", "B");
      await radios.first().focus();
      await page.keyboard.press("c");
      await expect(radios.nth(2)).toBeChecked();
      expect(await questionValue(page)).toBe("Item 3");
    });

    test("badges are hidden on mobile and in readonly", async ({ page }) => {
      await initSurvey(page, framework, {
        showChoiceShortcutKeys: true,
        elements: [{ type: "checkbox", name: "q", choices: numberedChoices(3) }]
      });
      await expect(page.locator(".sd-item__shortcut-key")).toHaveCount(3);
      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("q").isMobile = true;
      });
      await expect(page.locator(".sd-item__shortcut-key")).toHaveCount(0);
      const checks = page.locator("input[type=checkbox]");
      await checks.first().focus();
      await page.keyboard.press("a");
      await expect(checks.first()).not.toBeChecked();
      expect(await questionValue(page)).toEqual([]);

      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("q");
        question.isMobile = false;
        question.readOnly = true;
      });
      await expect(page.locator(".sd-item__shortcut-key")).toHaveCount(0);
      await page.keyboard.press("b");
      await expect(checks.first()).not.toBeChecked();
      expect(await questionValue(page)).toEqual([]);
    });

    test("letter does not auto-advance and Enter does", async ({ page }) => {
      await initSurvey(page, framework, {
        showChoiceShortcutKeys: true,
        autoAdvanceEnabled: true,
        pages: [
          { elements: [{ type: "radiogroup", name: "q", choices: numberedChoices(4) }] },
          { elements: [{ type: "text", name: "q2" }] }
        ]
      });
      const radios = page.locator("input[type=radio]");
      await radios.first().focus();
      await page.keyboard.press("b");
      expect(await questionValue(page)).toBe("Item 2");
      await page.waitForTimeout(500);
      expect(await pageNo(page)).toBe(0);
      await page.keyboard.press("Enter");
      await expect.poll(async () => pageNo(page), { timeout: 3000 }).toBe(1);
    });
  });
});
