import { frameworks, url_test, initSurvey, applyTheme } from "../helper";
import { QuestionRadiogroup } from "../questionHelper";
import { test, expect } from "@playwright/test";

const title = "RequiredIf property";

const themeName = "defaultV2";

frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      const json = {
        elements: [
          { type: "radiogroup", name: "a", choices: ["item1", "item2", "item3"] },
          { type: "text", name: "b", requiredIf: "{a} = 'item1'" },
          {
            type: "matrixdynamic", name: "c", rowCount: 2,
            columns: [
              { cellType: "text", name: "col1", requiredIf: "{a} = 'item2'" }
            ]
          },
        ]
      };
      await page.goto(`${url_test}${themeName}/${framework}`);
      await applyTheme(page, themeName);
      await initSurvey(page, framework, json);
      await page.setViewportSize({ width: 1000, height: 1000 });
    });
    test("check requriedIf for standard question", async ({ page }) => {
      const requiredText = page.locator('span:has-text("*")');
      const a = new QuestionRadiogroup(page, "a");
      await expect(requiredText).not.toBeVisible();
      await a.clickByValue("item1");
      await expect(requiredText.isVisible).toBeTruthy();
      await a.clickByValue("item3");
      await expect(requiredText).not.toBeVisible();
    });
    test("check requriedIf for matrix column", async ({ page }) => {
      const requiredText = page.locator('span:has-text("*")');
      const a = new QuestionRadiogroup(page, "a");
      await expect(requiredText).not.toBeVisible();
      await a.clickByValue("item2");
      await expect(requiredText.isVisible).toBeTruthy();
      await a.clickByValue("item3");
      await expect(requiredText).not.toBeVisible();
    });
  });
  /*
  Test functions
  test.describe(title + "2 - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      const json = {
        elements: [
          { type: "radiogroup", name: "a", choices: ["item1", "item2", "item3"] },
          { type: "radiogroup", name: "b", choices: ["item1", "item2", "item3"] },
          { type: "checkbox", name: "c", choices: ["item1", "item2", "item3"] }
        ]
      };
      await page.goto(`${url_test}${themeName}/${framework}`);
      await applyTheme(page, themeName);
      await initSurvey(page, framework, json);
      await page.setViewportSize({ width: 1000, height: 1000 });
    });
    test("Two radiogroups & checkbox", async ({ page }) => {
      const a = new QuestionSingleSelect(page, "a");
      const b = new QuestionSingleSelect(page, "b");
      const c = new QuestionMultipleSelect(page, "c");
      await a.clickByValue("item1");
      await b.clickByValue("item2");
      await c.clicksByValue(["item1", "item3"]);

      await checkSurveyData(page, { a: "item1", b: "item2", c: ["item1", "item3"] });
    });
  });
*/
});
