import { frameworks, url, initSurvey, getSurveyResult, test, expect, getTimeZone } from "../helper";

const title = "Text question in western timezone";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.use({ timezoneId: "America/Los_Angeles" });

    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Test input type (month) in western timezone", async ({ page }) => {
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        elements: [
          {
            "type": "text",
            "name": "monthInput",
            "title": "Month Input",
            "inputType": "month"
          }]
      });

      expect(await getTimeZone(page)).toBe("America/Los_Angeles");
      await expect(page.locator(".sd-text").first()).toBeFocused();
      await page.screenshot({ path: "test-results/timezone/timezone-1-0.png", fullPage: true });
      await page.keyboard.press("m");
      await page.screenshot({ path: "test-results/timezone/timezone-1-1-m.png", fullPage: true });
      await page.keyboard.press("a");
      await page.screenshot({ path: "test-results/timezone/timezone-1-2-a.png", fullPage: true });
      await page.keyboard.press("r");
      await page.screenshot({ path: "test-results/timezone/timezone-1-3-a.png", fullPage: true });
      await page.keyboard.press("c");
      await page.screenshot({ path: "test-results/timezone/timezone-1-4-c.png", fullPage: true });
      await page.keyboard.press("h");
      await page.screenshot({ path: "test-results/timezone/timezone-1-5-h.png", fullPage: true });
      await page.keyboard.press("Tab");
      await page.screenshot({ path: "test-results/timezone/timezone-2-0-tab.png", fullPage: true });
      await page.keyboard.press("2");
      await page.screenshot({ path: "test-results/timezone/timezone-2-1-2.png", fullPage: true });
      await page.keyboard.press("0");
      await page.screenshot({ path: "test-results/timezone/timezone-2-2-0.png", fullPage: true });
      await page.keyboard.press("2");
      await page.screenshot({ path: "test-results/timezone/timezone-2-3-2.png", fullPage: true });
      await page.keyboard.press("4");
      await page.screenshot({ path: "test-results/timezone/timezone-2-4-4.png", fullPage: true });
      await page.keyboard.press("Tab");
      await page.screenshot({ path: "test-results/timezone/timezone-3-0-tab.png", fullPage: true });
      await page.keyboard.press("Tab");
      await page.screenshot({ path: "test-results/timezone/timezone-4.png", fullPage: true });
      expect(await page.locator("input").nth(0).inputValue()).toBe("2024-03");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        monthInput: "2024-03"
      });
    });

    test("Test mask in western timezone", async ({ page }) => {
      if (framework === "vue") return;
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        elements: [
          {
            name: "name",
            type: "text",
            maskType: "datetime",
            maskSettings: {
              pattern: "HH:MM"
            }
          }, {
            "type": "text",
            "name": "yearInput",
            "title": "Year Input (Input Mask)",
            "maskType": "datetime",
            "maskSettings": {
              "pattern": "yyyy"
            },
            "placeholder": "YYYY"
          }]
      });

      expect(await getTimeZone(page)).toBe("America/Los_Angeles");
      await expect(page.locator(".sd-text").first()).toBeFocused();
      await page.keyboard.type("1234");
      await page.keyboard.press("Tab");
      await page.keyboard.type("2022");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      expect(await page.locator("input").nth(0).inputValue()).toBe("12:34");
      expect(await page.locator("input").nth(1).inputValue()).toBe("2022");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        name: "12:34",
        yearInput: "2022"
      });
    });

  });
});