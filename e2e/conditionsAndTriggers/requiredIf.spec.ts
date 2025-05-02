import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "RequiredIf property";

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

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      await page.setViewportSize({ width: 1000, height: 1000 });
    });

    test("check requiredIf for standard question", async ({ page }) => {
      const requiredText = page.locator("span").filter({ hasText: "*" });
      const item1 = page.locator("label").filter({ hasText: "item1" }).locator("span").first();
      const item3 = page.locator("label").filter({ hasText: "item3" }).locator("span").first();
      await expect(requiredText).not.toBeVisible();

      await item1.click();
      await expect(requiredText).toBeVisible();

      await item3.click();
      await expect(requiredText).not.toBeVisible();
    });

    test("check requiredIf for matrix column", async ({ page }) => {
      const requiredText = page.locator("span").filter({ hasText: "*" });
      const item2 = page.locator("label").filter({ hasText: "item2" }).locator("span").first();
      const item3 = page.locator("label").filter({ hasText: "item3" }).locator("span").first();
      await expect(requiredText).not.toBeVisible();

      await item2.click();
      await expect(requiredText).toBeVisible();

      await item3.click();
      await expect(requiredText).not.toBeVisible();
    });
  });
});