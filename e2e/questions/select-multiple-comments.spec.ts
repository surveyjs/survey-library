import { frameworks, url, initSurvey, getSurveyResult, getData, test, expect } from "../helper";

const title = "multiple comments support in select questions";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 800, height: 600 });
    });
    test("multiple comment support in dropdown", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            "type": "dropdown",
            "name": "q1",
            "choices": [{ "value": "a", "showCommentArea": true }, "b", { "value": "c", "showCommentArea": true }],
            "searchEnabled": false,
            "showOtherItem": true
          }
        ]
      });
      const commentArea = page.locator(".sd-question__comment-area");
      expect(await commentArea.count()).toEqual(0);
      const questionDropdownSelect = page.locator(".sd-dropdown");
      const itemsSelector = page.locator(".sd-list__item");
      await questionDropdownSelect.first().click();
      await itemsSelector.nth(0).click();
      expect(await commentArea.count()).toEqual(1);
      await page.waitForTimeout(500);
      await page.keyboard.type("Comment for a");
      await page.keyboard.press("Tab");
      expect(await getData(page)).toEqual({ "q1": { "value": "a", "comment": "Comment for a" } });
      await questionDropdownSelect.first().click();
      await itemsSelector.nth(1).click();
      expect(await commentArea.count()).toEqual(0);
      expect(await getData(page)).toEqual({ "q1": "b" });
      await questionDropdownSelect.first().click();
      await itemsSelector.nth(2).click();
      expect(await commentArea.count()).toEqual(1);
      await page.waitForTimeout(500);
      await page.keyboard.type("Comment for c");
      await page.keyboard.press("Tab");
      expect(await getData(page)).toEqual({ "q1": { "value": "c", "comment": "Comment for c" } });
      await questionDropdownSelect.first().click();
      await itemsSelector.nth(3).click();
      expect(await commentArea.count()).toEqual(1);
      expect(await getData(page)).toEqual({ "q1": "other" });
      await page.waitForTimeout(500);
      await page.keyboard.type("Comment for d");
      await page.keyboard.press("Tab");
      expect(await getData(page)).toEqual({ "q1": "other", "q1-Comment": "Comment for d" });
      await questionDropdownSelect.first().click();
      await itemsSelector.nth(2).click();
      expect(await commentArea.count()).toEqual(1);
      await page.waitForTimeout(500);
      await page.keyboard.type("Comment for c");
      await page.keyboard.press("Tab");

      const finalResult = { "q1": { "value": "c", "comment": "Comment for c" } };
      expect(await getData(page)).toEqual(finalResult);
      await page.locator("button[title=Complete]").click();
      expect(await getSurveyResult(page)).toEqual(finalResult);
    });
    test("multiple comment support in radiogroup", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            "type": "radiogroup",
            "name": "q1",
            "choices": [{ "value": "a", "showCommentArea": true }, "b", { "value": "c", "showCommentArea": true }],
            "showOtherItem": true
          }
        ]
      });
      const commentArea = page.locator(".sd-question__comment-area");
      expect(await commentArea.count()).toEqual(0);
      const checks = page.locator(".sd-radio__control");
      await checks.nth(0).click({ force: true });
      expect(await commentArea.count()).toEqual(1);
      await page.waitForTimeout(500);
      await page.keyboard.type("Comment for a");
      await page.keyboard.press("Tab");
      expect(await getData(page)).toEqual({ "q1": { "value": "a", "comment": "Comment for a" } });
      await checks.nth(1).click({ force: true });
      expect(await commentArea.count()).toEqual(0);
      expect(await getData(page)).toEqual({ "q1": "b" });
      await checks.nth(2).click({ force: true });
      expect(await commentArea.count()).toEqual(1);
      await page.waitForTimeout(500);
      await page.keyboard.type("Comment for c");
      await page.keyboard.press("Tab");
      expect(await getData(page)).toEqual({ "q1": { "value": "c", "comment": "Comment for c" } });
      await checks.nth(3).click({ force: true });
      expect(await commentArea.count()).toEqual(1);
      expect(await getData(page)).toEqual({ "q1": "other" });
      await page.waitForTimeout(500);
      await page.keyboard.type("Comment for d");
      await page.keyboard.press("Tab");

      const finalResult = { "q1": "other", "q1-Comment": "Comment for d" };
      expect(await getData(page)).toEqual(finalResult);
      await page.locator("button[title=Complete]").click();
      expect(await getSurveyResult(page)).toEqual(finalResult);
    });
    test("multiple comment support in checkbox", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            "type": "checkbox",
            "name": "q1",
            "choices": [{ "value": "a", "showCommentArea": true }, "b", { "value": "c", "showCommentArea": true }],
            "showOtherItem": true
          }
        ]
      });
      const commentArea = page.locator(".sd-question__comment-area");
      expect(await commentArea.count()).toEqual(0);
      const checks = page.locator(".sd-checkbox__control");
      await checks.nth(0).click({ force: true });
      expect(await commentArea.count()).toEqual(1);
      await page.waitForTimeout(500);
      await page.keyboard.type("Comment for a");
      await page.keyboard.press("Tab");
      expect(await getData(page)).toEqual({ "q1": [{ value: "a", "comment": "Comment for a" }] });
      await checks.nth(1).click({ force: true });
      expect(await commentArea.count()).toEqual(1);
      expect(await getData(page)).toEqual({ q1: [{ value: "a", "comment": "Comment for a" }, { value: "b" }] });
      await checks.nth(2).click({ force: true });
      expect(await commentArea.count()).toEqual(2);
      await page.waitForTimeout(500);
      await page.keyboard.type("Comment for c");
      await page.keyboard.press("Tab");
      expect(await getData(page)).toEqual({ "q1": [{ value: "a", "comment": "Comment for a", }, { value: "b" },
        { value: "c", "comment": "Comment for c" }] });
      await checks.nth(3).click({ force: true });
      expect(await commentArea.count()).toEqual(3);
      expect(await getData(page)).toEqual({ "q1": [{ value: "a", "comment": "Comment for a", }, { value: "b" },
        { value: "c", "comment": "Comment for c" }, { value: "other" }] });
      await page.waitForTimeout(500);
      await page.keyboard.type("Comment for d");
      await page.keyboard.press("Tab");

      const finalResult = { "q1": [{ value: "a", "comment": "Comment for a", }, { value: "b" },
        { value: "c", "comment": "Comment for c" }, { value: "Comment for d" }] };
      expect(await getData(page)).toEqual(finalResult);

      await page.locator("button[title=Complete]").click();
      expect(await getSurveyResult(page)).toEqual(finalResult);
    });
  });
});