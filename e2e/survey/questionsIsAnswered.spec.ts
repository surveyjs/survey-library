import { test, expect } from "@playwright/test";
import { expectHaveClasses, frameworks, initSurvey, url } from "../helper";

const title = "questions isAnswered title style";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("Check is Answered title css class", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        elements: [
          { type: "radiogroup", name: "q1", choices: ["item 1", "item 2"], showClearButton: true },
          { type: "radiogroup", name: "q2", choices: ["item 3", "item 4"], defaultValue: "item 3" },
          { type: "checkbox", name: "q3", choices: ["item 5", "item 6"] },
          { type: "checkbox", name: "q4", choices: ["item 7", "item 8"], defaultValue: ["item 7"] },
        ],
      };
      await initSurvey(page, framework, json);
      const q1 = page.locator(".sd-question__title").nth(0);
      const q2 = page.locator(".sd-question__title").nth(1);
      const q3 = page.locator(".sd-question__title").nth(2);
      const q4 = page.locator(".sd-question__title").nth(3);
      const cssClass = "sd-question__title--answer";

      await expect(await expectHaveClasses(q1, cssClass)).toBeFalsy();
      await page.getByText("item 1").click();
      await expect(await expectHaveClasses(q1, cssClass)).toBeTruthy();
      await page.getByRole("button", { name: "Clear" }).click();
      await expect(await expectHaveClasses(q1, cssClass)).toBeFalsy();

      await expect(await expectHaveClasses(q2, cssClass)).toBeTruthy();
      await page.getByText("item 3").click();
      await expect(await expectHaveClasses(q2, cssClass)).toBeTruthy();

      await expect(await expectHaveClasses(q3, cssClass)).toBeFalsy();
      await page.getByText("item 5").click();
      await expect(await expectHaveClasses(q3, cssClass)).toBeTruthy();
      await page.getByText("item 5").click();
      await expect(await expectHaveClasses(q3, cssClass)).toBeFalsy();

      await expect(await expectHaveClasses(q4, cssClass)).toBeTruthy();
      await page.getByText("item 8").click();
      await expect(await expectHaveClasses(q4, cssClass)).toBeTruthy();
      await page.getByText("item 7").click();
      await page.getByText("item 8").click();
      await expect(await expectHaveClasses(q4, cssClass)).toBeFalsy();
    });
  });
});