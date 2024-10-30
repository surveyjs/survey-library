import { frameworks, url_test, initSurvey, applyTheme } from "../helper";
import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const title = "RequiredIf property";

const themeName = "defaultV2";

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

["react"].forEach((framework) => {
  test.describe("RequiredIf", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url_test}${themeName}/${framework}`);
      await applyTheme(page, themeName);
      await initSurvey(page, framework, json);
      await page.setViewportSize({ width: 1000, height: 1000 });
    });
    test("check requriedIf for standard question", async ({ page }) => {
      const requiredText = page.locator('span:has-text("*")');
      await expect(requiredText).not.toBeVisible();
      await page.getByText("item1").click();
      await expect(requiredText).toBeVisible();
      await page.getByText("item3").click();
      await expect(requiredText).not.toBeVisible();
    });
  });
});

/*
frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url_test}${themeName}/${framework}`
    .beforeEach(async (t) => {
      await applyTheme(themeName);
      await initSurvey(framework, json);
      await t.resizeWindow(1000, 1000);
    });
  test("check requriedIf for standard question", async (t) => {
    const requiredText = Selector("span").withText("*");
    await t.expect(requiredText.exists).notOk();
    await t.click("input[value=item1]");
    await t.expect(requiredText.exists).ok();
    await t.click("input[value=item3]");
    await t.expect(requiredText.exists).notOk();
  });
  test("check requriedIf for matrix column", async (t) => {
    const requiredText = Selector("span").withText("*");
    await t.expect(requiredText.exists).notOk();
    await t.click("input[value=item2]");
    await t.expect(requiredText.exists).ok();
    await t.click("input[value=item3]");
    await t.expect(requiredText.exists).notOk();
  });
});
*/